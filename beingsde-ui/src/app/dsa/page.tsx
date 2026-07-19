"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  GitBranch,
  Cpu,
  BookOpen,
  CheckCircle2,
  Zap,
  AlertTriangle,
} from "lucide-react";
import defaultDsaQuestions from "@/data/dsa.json";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Tab = "ds" | "algo";
type Difficulty = "Medium";

interface DSAQuestion {
  id?: string;
  questionId: number;
  title: string;
  tag: string;
  difficulty: Difficulty;
  summary: string;
  keyPoints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  tabGroup: string; // "ds" or "algo"
}

export default function DsaPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ds");
  const [searchQuery, setSearchQuery] = useState("");
  const [dsFilter, setDsFilter] = useState("all");
  const [algoFilter, setAlgoFilter] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const [questionsList, setQuestionsList] = useState<DSAQuestion[]>(defaultDsaQuestions as any[]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await fetch(`${API_BASE}/dsa`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const activeQuestions = data.filter((q: any) => !q.isArchived);
            if (activeQuestions.length > 0) {
              setQuestionsList(activeQuestions);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch live DSA questions, using static fallback", e);
      }
    };
    fetchQuestions();
  }, []);

  const dsQuestions = questionsList.filter(q => q.tabGroup === "ds");
  const algoQuestions = questionsList.filter(q => q.tabGroup === "algo");
  const questions = activeTab === "ds" ? dsQuestions : algoQuestions;

  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const matchesDs = matchesDsFilter(q, dsFilter);
    const matchesAlgo = matchesAlgoFilter(q, algoFilter);

    return matchesDs && matchesAlgo;
  });

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setExpandedIndex(null);
    setSearchQuery("");
    setDsFilter("all");
    setAlgoFilter("all");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">DSA Practice</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50 mb-2">
          Top DSA Interview Questions
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Data Structures and Algorithms questions curated for FAANG and top-tier engineering interviews.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">{dsQuestions.length}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Data Structure Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">{algoQuestions.length}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Algorithm Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">Medium</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Difficulty</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
        <button
          onClick={() => handleTabChange("ds")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "ds"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Layers className="w-4 h-4" />
          Data Structures
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            {dsQuestions.length}
          </span>
        </button>
        <button
          onClick={() => handleTabChange("algo")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "algo"
              ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
              : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Algorithms
          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-sm">
            {algoQuestions.length}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by title, tag, or pattern..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setExpandedIndex(null);
          }}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm transition-colors"
        />
      </div>

      {/* Filter Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* DS Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
            Filter by Data Structure
          </label>
          <div className="relative">
            <select
              value={dsFilter}
              onChange={(e) => {
                setDsFilter(e.target.value);
                setExpandedIndex(null);
              }}
              className="w-full pl-3 pr-10 py-2.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm appearance-none cursor-pointer"
            >
              <option value="all">All Data Structures</option>
              <option value="array">Arrays & Matrices</option>
              <option value="list">Linked Lists</option>
              <option value="stack-queue">Stacks & Queues</option>
              <option value="tree">Trees & Tries</option>
              <option value="heap">Heaps (Priority Queues)</option>
              <option value="graph">Graphs & Union-Find</option>
              <option value="hash">HashMaps & HashSets</option>
              <option value="string">Strings & Substrings</option>
              <option value="bit">Bit Manipulation</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Algo Filter */}
        <div className="relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
            Filter by Algorithm
          </label>
          <div className="relative">
            <select
              value={algoFilter}
              onChange={(e) => {
                setAlgoFilter(e.target.value);
                setExpandedIndex(null);
              }}
              className="w-full pl-3 pr-10 py-2.5 text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm appearance-none cursor-pointer"
            >
              <option value="all">All Algorithms</option>
              <option value="binary-search">Binary Search</option>
              <option value="sorting">Sorting Algorithms</option>
              <option value="dp">Dynamic Programming & Kadane's</option>
              <option value="greedy">Greedy Algorithms</option>
              <option value="two-pointers">Two Pointers & Sliding Window</option>
              <option value="backtracking">Backtracking, DFS & BFS</option>
              <option value="divide-conquer">Divide & Conquer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Section subtitle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {activeTab === "ds" ? (
            <Layers className="w-4 h-4 text-zinc-400" />
          ) : (
            <Cpu className="w-4 h-4 text-zinc-400" />
          )}
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            {activeTab === "ds" ? "Data Structures" : "Algorithms"}
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Notice banner */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3 mb-6">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          All questions are medium-difficulty. Click any question to expand the approach, key points, and time/space complexities.
        </p>
      </div>

      {/* Question List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No questions match your search or active filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDsFilter("all");
              setAlgoFilter("all");
            }}
            className="mt-2 text-xs underline text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((q, idx) => (
            <QuestionCard
              key={`${activeTab}-${q.questionId}`}
              q={q}
              index={idx}
              expanded={expandedIndex === idx}
              onToggle={() => toggleExpand(idx)}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <p className="text-xs text-zinc-400 font-mono">
            Patterns covered: Arrays · Linked Lists · Trees · Graphs · DP · Greedy · Backtracking · Two Pointers
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tag color mapping
// ─────────────────────────────────────────────
const tagColors: Record<string, string> = {
  "Array": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / Matrix": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / HashMap": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Array / HashSet": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Linked List": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Stack": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Queue / Deque": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Tree": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Trie": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Trie / Backtracking": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Heap": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Heap / Greedy": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Graph / DFS": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Graph / BFS": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Graph / Topological Sort": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "HashMap": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Heap": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Sliding Window": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "HashMap / Doubly Linked List": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "String": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "String / Sliding Window": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Bit Manipulation": "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "Binary Search": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Binary Search on Answer": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Sorting": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "Dynamic Programming": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Dynamic Programming / Greedy": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Greedy": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Greedy / Heap": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Two Pointers": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Sliding Window": "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  "Backtracking": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Backtracking / DP": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Backtracking / Recursion": "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300",
  "Graph / Shortest Path": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Union-Find": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Divide & Conquer": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Divide & Conquer / Math": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function getTagColor(tag: string): string {
  return tagColors[tag] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

// ─────────────────────────────────────────────
// Question Card Component
// ─────────────────────────────────────────────
function QuestionCard({
  q,
  index,
  expanded,
  onToggle,
}: {
  q: DSAQuestion;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-sm transition-all duration-200 ${
        expanded
          ? "border-zinc-400 dark:border-zinc-600 shadow-md"
          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
      } bg-white dark:bg-[#18181b]`}
    >
      {/* Header Row */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-3 group"
        aria-expanded={expanded}
      >
        {/* Index badge */}
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${getTagColor(
                q.tag
              )}`}
            >
              {q.tag}
            </span>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-mono">
              {q.difficulty}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 ml-1">
              {q.pattern}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug pr-4">
            {q.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 group-hover:line-clamp-none transition-all">
            {q.summary}
          </p>
        </div>

        <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
          {/* Key Points */}
          <div>
            <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Key Points
            </p>
            <ul className="space-y-1.5">
              {q.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Approach */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm p-3">
            <p className="text-[10px] font-black font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
              Approach
            </p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{q.approach}</p>
          </div>

          {/* Complexity */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-sm p-2.5">
              <p className="text-[9px] font-black font-mono uppercase tracking-wider text-blue-400 mb-0.5">
                Time
              </p>
              <p className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                {q.timeComplexity}
              </p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-sm p-2.5">
              <p className="text-[9px] font-black font-mono uppercase tracking-wider text-violet-400 mb-0.5">
                Space
              </p>
              <p className="text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
                {q.spaceComplexity}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to check if a question matches a Data Structure filter
function matchesDsFilter(q: DSAQuestion, filter: string): boolean {
  if (filter === "all") return true;
  const tagLower = q.tag.toLowerCase();
  const patternLower = q.pattern.toLowerCase();
  const titleLower = q.title.toLowerCase();
  const searchSpace = `${tagLower} ${patternLower} ${titleLower}`;

  switch (filter) {
    case "array":
      return searchSpace.includes("array") || searchSpace.includes("matrix");
    case "list":
      return searchSpace.includes("linked list") || searchSpace.includes("list");
    case "stack-queue":
      return searchSpace.includes("stack") || searchSpace.includes("queue") || searchSpace.includes("deque");
    case "tree":
      return searchSpace.includes("tree") || searchSpace.includes("trie");
    case "heap":
      return searchSpace.includes("heap");
    case "graph":
      return searchSpace.includes("graph") || searchSpace.includes("union-find") || searchSpace.includes("island") || searchSpace.includes("topological");
    case "hash":
      return searchSpace.includes("hashmap") || searchSpace.includes("hashset") || searchSpace.includes("hash");
    case "string":
      return searchSpace.includes("string") || searchSpace.includes("substring") || searchSpace.includes("anagram");
    case "bit":
      return searchSpace.includes("bit") || searchSpace.includes("binary") || searchSpace.includes("hamming");
    default:
      return false;
  }
}

// Helper to check if a question matches an Algorithm filter
function matchesAlgoFilter(q: DSAQuestion, filter: string): boolean {
  if (filter === "all") return true;
  const tagLower = q.tag.toLowerCase();
  const patternLower = q.pattern.toLowerCase();
  const titleLower = q.title.toLowerCase();
  const approachLower = q.approach.toLowerCase();
  const searchSpace = `${tagLower} ${patternLower} ${titleLower} ${approachLower}`;

  switch (filter) {
    case "binary-search":
      return searchSpace.includes("binary search");
    case "sorting":
      return searchSpace.includes("sorting") || searchSpace.includes("sort");
    case "dp":
      return searchSpace.includes("dynamic programming") || searchSpace.includes("dp") || searchSpace.includes("kadane");
    case "greedy":
      return searchSpace.includes("greedy");
    case "two-pointers":
      return searchSpace.includes("two pointer") || searchSpace.includes("two-pointer") || searchSpace.includes("sliding window") || searchSpace.includes("deque");
    case "backtracking":
      return searchSpace.includes("backtracking") || searchSpace.includes("recursion") || searchSpace.includes("dfs") || searchSpace.includes("bfs") || searchSpace.includes("topological");
    case "divide-conquer":
      return searchSpace.includes("divide") || searchSpace.includes("conquer") || searchSpace.includes("merge sort") || searchSpace.includes("quickselect");
    default:
      return false;
  }
}
