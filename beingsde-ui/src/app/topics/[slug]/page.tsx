"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Lock, CheckCircle, Video, FileText, Download } from "lucide-react";

import MOCK_TOPICS from "@/data/topics.json";

export default function TopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [activeTab, setActiveTab] = useState<"notes" | "video" | "pdf">("notes");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  
  // Interactive Workbench States
  const [workbenchUserId, setWorkbenchUserId] = useState("user_8472");
  const [rolloutPercentage, setRolloutPercentage] = useState(50);
  const [hashAlgorithm, setHashAlgorithm] = useState("fnv1a");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setIsPremiumUser(role === "PREMIUM_USER" || role === "ADMIN");
  }, []);

  // Retrieve topic info matching slug
  const topic = MOCK_TOPICS.find((t) => t.slug === slug) || MOCK_TOPICS[1];
  const isLocked = topic.isPremium && !isPremiumUser;

  // Hashing calculation logic for the workbench
  let calculatedHash = 0;
  if (hashAlgorithm === "fnv1a") {
    let hash = 2166136261;
    for (let i = 0; i < workbenchUserId.length; i++) {
      hash ^= workbenchUserId.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    calculatedHash = Math.abs(hash);
  } else if (hashAlgorithm === "djb2") {
    let hash = 5381;
    for (let i = 0; i < workbenchUserId.length; i++) {
      hash = (hash * 33) ^ workbenchUserId.charCodeAt(i);
    }
    calculatedHash = Math.abs(hash);
  } else {
    let sum = 0;
    for (let i = 0; i < workbenchUserId.length; i++) {
      sum += workbenchUserId.charCodeAt(i);
    }
    calculatedHash = sum;
  }

  const calculatedBucket = calculatedHash % 100;
  const isRolloutActive = calculatedBucket < rolloutPercentage;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      
      {/* Back Button & Metadata Header */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link 
          href="/topics" 
          className="inline-flex items-center gap-1 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to explorer
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 text-2xs font-semibold font-mono text-zinc-400 uppercase">
              <span>{topic.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {topic.estimatedTimeMinutes} Min</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{topic.title}</h1>
          </div>

          <div>
            <span className={`text-2xs font-bold font-mono px-3 py-1 uppercase rounded-sm border ${
              topic.difficulty === "EASY" ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20" :
              topic.difficulty === "MEDIUM" ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20" :
              "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20"
            }`}>
              {topic.difficulty}
            </span>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE SECTION */}
      {isLocked ? (
        
        /* LOCKED PREMIUM OVERLAY */
        <section className="relative w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-10 rounded-md shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
          
          {/* Blur Background filter effect */}
          <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-[2px] pointer-events-none" />

          {/* Premium Locker box */}
          <div className="relative z-10 max-w-md flex flex-col items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-full text-amber-600 dark:text-amber-500">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Premium Architecture Locked</h2>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This system design module includes complex database sharding strategies, trade-off notes, video lectures, and architectural blueprints available exclusively to Premium subscribers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
              <Link 
                href="/subscriptions"
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
              >
                Upgrade to Premium
              </Link>
              <Link 
                href="/topics"
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-600 hover:text-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-3 hover:border-zinc-400 transition-colors"
              >
                Try Free Topics
              </Link>
            </div>
          </div>
          
          {/* Decorative Scribble Ring Loop */}
          <div className="absolute -bottom-10 -right-10 opacity-30 pointer-events-none">
            <svg width="150" height="150" viewBox="0 0 100 100" className="fill-none stroke-amber-500">
              <path className="animate-scribble" strokeWidth="1" d="M10,50 C10,20 40,10 50,10 C80,10 90,40 90,50 C90,80 60,90 50,90 C20,90 10,60 10,50" />
            </svg>
          </div>
        </section>

      ) : (

        /* OPEN WORKSPACE (FREE TOPIC) */
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Learning Notes & Tabs */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Workspace tabs selector */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "notes" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Notes
              </button>
              <button 
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "video" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Lecture
              </button>
              <button 
                onClick={() => setActiveTab("pdf")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "pdf" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Download className="w-3.5 h-3.5" /> PDF blueprint
              </button>
            </div>

            {/* Tab Rendering Content */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md shadow-sm min-h-[300px]">
              
              {activeTab === "notes" && (
                <div className="flex flex-col gap-6">
                  {/* Explanation Diagram Block */}
                  {topic.imageUrl && (
                    <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">System Architecture Diagram</span>
                        <span className="text-3xs font-mono px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">Interactive Zoom</span>
                      </div>
                      <div className="relative w-full aspect-[4/3] max-h-[480px] overflow-hidden rounded bg-black flex items-center justify-center group cursor-pointer border border-zinc-200 dark:border-zinc-800">
                        <Image
                          src={topic.imageUrl}
                          alt={`${topic.title} architecture diagram`}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-w-768px) 100vw, 800px"
                        />
                      </div>
                    </div>
                  )}

                  <div className="prose dark:prose-invert max-w-none">
                    <MarkdownRenderer content={topic.contentMarkdown} />
                  </div>
                </div>
              )}

              {activeTab === "video" && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-8">
                  <div className="w-full aspect-video border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 rounded flex flex-col items-center justify-center gap-2">
                    <Video className="w-12 h-12 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-400">{topic.title} video lecture placeholder</span>
                  </div>
                  <p className="text-2xs text-zinc-400 text-center">Video streams directly via CloudFront CDN cache edge.</p>
                </div>
              )}

              {activeTab === "pdf" && (
                <div className="w-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <FileText className="w-12 h-12 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-sm">Download System Blueprints</h3>
                    <p className="text-xs text-zinc-400 mt-1">Get high-resolution hand-sketched blueprints of this topology.</p>
                  </div>
                  <button 
                    type="button"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2.5 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" /> Download PDF Blueprint
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Prerequisites & Related Topics */}
          <div className="flex flex-col gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Prerequisites</h3>
              <ul className="flex flex-col gap-3">
                {topic.prerequisites?.map((prereq) => (
                  <li key={prereq} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Evaluation Workbench</h3>
                <p className="text-2xs text-zinc-500 leading-relaxed">
                  Test consistent hashing and rollout allocation in real time. Simulate how request routing decides if a client sees a new feature or replica.
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div className="flex flex-col gap-1">
                  <label className="text-3xs font-mono uppercase text-zinc-400">Client / User ID</label>
                  <input
                    type="text"
                    value={workbenchUserId}
                    onChange={(e) => setWorkbenchUserId(e.target.value)}
                    className="px-2 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
                    placeholder="e.g. user_8472"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-3xs font-mono uppercase text-zinc-400">
                    <span>Rollout Target</span>
                    <span>{rolloutPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rolloutPercentage}
                    onChange={(e) => setRolloutPercentage(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-3xs font-mono uppercase text-zinc-400">Hashing Function</label>
                  <select
                    value={hashAlgorithm}
                    onChange={(e) => setHashAlgorithm(e.target.value)}
                    className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 text-ellipsis overflow-hidden"
                  >
                    <option value="fnv1a">FNV-1a (Recommended)</option>
                    <option value="djb2">DJB2 (XOR-shift)</option>
                    <option value="simple">Sum-Of-Chars</option>
                  </select>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded flex flex-col gap-2">
                  <div className="flex items-center justify-between text-3xs font-mono">
                    <span className="text-zinc-400">Hash Result:</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold text-ellipsis overflow-hidden max-w-[120px]">{calculatedHash}</span>
                  </div>
                  <div className="flex items-center justify-between text-3xs font-mono">
                    <span className="text-zinc-400">Bucket (Hash % 100):</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{calculatedBucket}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-2 text-3xs font-mono">
                    <span className="text-zinc-400">Rollout Status:</span>
                    <span className={`inline-flex items-center gap-1 font-bold ${
                      isRolloutActive ? "text-emerald-500" : "text-rose-500"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isRolloutActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {isRolloutActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      )}

    </div>
  );
}

// Custom Premium Markdown Renderer for system design content
function MarkdownRenderer({ content }: { content: string }) {
  // Preprocess: Replace the raw quiz text blocks with structured custom blocks
  const quizRegex = /Test Your Knowledge\s*[\s\S]*?Question 1 of 15([\s\S]*?)(?:Quick Reference[\s\S]*?(?:\bView\b|$)|\bCheck Answer\b|$)/gi;
  let parsedContent = content.replace(quizRegex, (match, quizText) => {
    return `\n:::interactive-quiz\n${quizText.trim()}\n:::\n`;
  });

  const lines = parsedContent.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = "";
  
  let inList = false;
  let listItems: React.ReactNode[] = [];

  let inInteractiveQuiz = false;
  let interactiveQuizLines: string[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 my-4 space-y-1.5 text-zinc-600 dark:text-zinc-400">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle interactive quiz block
    if (line.trim().startsWith(":::interactive-quiz") || (inInteractiveQuiz && line.trim() === ":::")) {
      if (inInteractiveQuiz) {
        const quizText = interactiveQuizLines.join("\n");
        elements.push(
          <InteractiveQuizCard key={`interactive-quiz-${i}`} rawText={quizText} />
        );
        interactiveQuizLines = [];
        inInteractiveQuiz = false;
      } else {
        inInteractiveQuiz = true;
        flushList(i);
      }
      continue;
    }

    if (inInteractiveQuiz) {
      interactiveQuizLines.push(line);
      continue;
    }

    // Handle Code Blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        const codeText = codeBlockLines.join("\n");
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-3xs font-mono text-zinc-400 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
              <span>{codeLanguage || "code"}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(codeText)}
                className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="bg-zinc-950 p-4 overflow-x-auto text-xs font-mono text-zinc-300">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Start of code block
        inCodeBlock = true;
        codeLanguage = line.trim().substring(3).trim();
        flushList(i);
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Handle Headings
    if (line.startsWith("# ")) {
      flushList(i);
      const text = line.substring(2);
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-2 mt-8 mb-4">
          {renderInlineMarkdown(text)}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList(i);
      const text = line.substring(3);
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6 mb-3">
          {renderInlineMarkdown(text)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList(i);
      const text = line.substring(4);
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4 mb-2">
          {renderInlineMarkdown(text)}
        </h3>
      );
      continue;
    }

    // Handle Bullet Lists
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      inList = true;
      const cleanLine = line.trim().substring(2);
      listItems.push(
        <li key={`li-${i}-${listItems.length}`} className="text-sm leading-relaxed">
          {renderInlineMarkdown(cleanLine)}
        </li>
      );
      continue;
    }

    // If it was a list and this line is not a list item, flush it
    if (inList && line.trim() === "") {
      flushList(i);
      continue;
    }

    // Handle horizontal rule (---)
    if (line.trim() === "---") {
      flushList(i);
      elements.push(
        <hr key={`hr-${i}`} className="border-t border-zinc-200 dark:border-zinc-800 my-6" />
      );
      continue;
    }

    // Handle empty line (adds spacing)
    if (line.trim() === "") {
      flushList(i);
      continue;
    }

    // Normal paragraph line
    flushList(i);
    elements.push(
      <p key={`p-${i}`} className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  // Final flush
  flushList(lines.length);

  return <div className="space-y-2">{elements}</div>;
}

// Function to handle bold (**text**), code (`text`), and link ([text](url)) inline formatting
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-zinc-900 dark:text-zinc-50">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs">{part.slice(1, -1)}</code>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      return (
        <a 
          key={idx} 
          href={linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 underline transition-colors"
        >
          {linkText}
        </a>
      );
    }
    return part;
  });
}

function getCorrectAnswerIndex(question: string): number {
  const q = question.toLowerCase();
  if (q.includes("database type should you default")) return 3; // Relational (SQL)
  if (q.includes("api protocol should you default")) return 1; // REST
  if (q.includes("in-memory cache like redis is typically")) return 0; // True
  if (q.includes("cap theorem states you can achieve at most two")) return 0; // True
  if (q.includes("primary function of an api gateway")) return 1; // Routing
  if (q.includes("dynamodb is a 'fully-managed' service")) return 1; // AWS handles
  if (q.includes("append-only storage improves write")) return 0; // True
  if (q.includes("web servers and browsers impose payload size")) return 0; // True
  if (q.includes("fan-out on write means aggregating data")) return 1; // False
  if (q.includes("atomic operations prevent race conditions")) return 0; // True
  if (q.includes("containers share the host kernel")) return 0; // True
  if (q.includes("websockets maintain persistent")) return 0; // True
  if (q.includes("client-side rate limiting alone is sufficient")) return 1; // False
  if (q.includes("inverted indexes enable efficient")) return 0; // True
  if (q.includes("min-heap of size k lets you find")) return 0; // True
  return 0;
}

function getQuizExplanation(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("database type should you default")) {
    return "Relational databases (SQL) like PostgreSQL are the default choice in system design interviews because they support schemas, transactions, referential integrity, and handle most standard use cases without operational complexity.";
  }
  if (q.includes("api protocol should you default")) {
    return "REST is the industry standard default for most system design interviews. Default to REST APIs unless you need real-time bi-directional streaming (WebSockets) or high-performance service-to-service calls (gRPC).";
  }
  if (q.includes("in-memory cache like redis is typically")) {
    return "True. In-memory data lookups avoid random disk access and complex query plans, executing operations in sub-milliseconds (10-100x faster than databases).";
  }
  if (q.includes("cap theorem states you can achieve at most two")) {
    return "True. Under a network partition (P), distributed systems must trade off strong consistency (C) for availability (A). You cannot guarantee both simultaneously.";
  }
  if (q.includes("primary function of an api gateway")) {
    return "The primary function of an API Gateway is routing client requests to appropriate downstream backend microservices, alongside cross-cutting concerns like rate limiting, SSL termination, and authentication.";
  }
  if (q.includes("dynamodb is a 'fully-managed' service")) {
    return "Fully-managed means cloud providers (AWS) handle physical provisioning, storage scaling, hardware failures, backups, and configurations, leaving you to focus on table structures and indices.";
  }
  if (q.includes("append-only storage improves write")) {
    return "True. Sequential writes are significantly faster than random writes because they avoid seek delays on physical media and update memory buffers directly (LSM Trees).";
  }
  if (q.includes("web servers and browsers impose payload size")) {
    return "True. Standard HTTP servers restrict post payload sizes (e.g., 100MB limit). Chunked multipart uploads are required to stream large files reliably.";
  }
  if (q.includes("fan-out on write means aggregating data")) {
    return "False. Fan-out on write pre-computes feeds on write-time. Aggregating data at read-time is called Fan-out on read.";
  }
  if (q.includes("atomic operations prevent race conditions")) {
    return "True. Atomic operations execute as a single indivisible unit, preventing concurrent updates from overwriting each other's transactions.";
  }
  if (q.includes("containers share the host kernel")) {
    return "True. Containers use namespace isolation and cgroups to share the host OS kernel, making them lightweight compared to Hypervisor-based virtual machines.";
  }
  if (q.includes("websockets maintain persistent")) {
    return "True. WebSockets upgrade standard HTTP connections to bi-directional, full-duplex TCP socket streams, enabling real-time client-server communication.";
  }
  if (q.includes("client-side rate limiting alone is sufficient")) {
    return "False. Client-side checks can be easily bypassed by malicious API requests or bots. Server-side rate limiting is mandatory to protect server infrastructure.";
  }
  if (q.includes("inverted indexes enable efficient")) {
    return "True. Inverted indexes map keyword tokens to document IDs, enabling logarithmic lookups without traversing files sequentially.";
  }
  if (q.includes("min-heap of size k lets you find")) {
    return "True. A min-heap maintains the smallest of the top-K elements at the root. Evicting root elements smaller than new values ensures the heap contains the largest elements in O(N log K) time.";
  }
  return "Default verification completed successfully. Refer to the specific technology blog references for more context.";
}

function InteractiveQuizCard({ rawText }: { rawText: string }) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [isOrderCorrect, setIsOrderCorrect] = useState(false);

  // Check if it's a multiple choice/true-false question
  const hasChoices = rawText.includes("1") && rawText.includes("2");

  if (hasChoices) {
    // Parse question and choices
    const option1Index = rawText.indexOf("1");
    const question = rawText.substring(0, option1Index).trim();
    const remaining = rawText.substring(option1Index);

    // Extract options by finding indices of digits
    const options: string[] = [];
    const idx1 = remaining.indexOf("1");
    const idx2 = remaining.indexOf("2");
    const idx3 = remaining.indexOf("3");
    const idx4 = remaining.indexOf("4");

    if (idx1 !== -1 && idx2 !== -1) {
      if (idx3 !== -1 && idx4 !== -1) {
        options.push(remaining.substring(idx1 + 1, idx2).trim());
        options.push(remaining.substring(idx2 + 1, idx3).trim());
        options.push(remaining.substring(idx3 + 1, idx4).trim());
        options.push(remaining.substring(idx4 + 1).trim());
      } else {
        options.push(remaining.substring(idx1 + 1, idx2).trim());
        options.push(remaining.substring(idx2 + 1).trim());
      }
    }

    const correctIndex = getCorrectAnswerIndex(question);
    const explanation = getQuizExplanation(question);

    const handleOptionClick = (idx: number) => {
      if (selectedOption === null) {
        setSelectedOption(idx);
        setShowExplanation(true);
      }
    };

    return (
      <div className="my-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <span className="text-2xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Concept Check</span>
          <span className="text-3xs font-mono px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">Interactive</span>
        </div>

        <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 leading-relaxed">
          {question}
        </h4>

        <div className="flex flex-col gap-2">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCurrentCorrect = idx === correctIndex;
            
            let optionStyle = "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300";
            if (selectedOption !== null) {
              if (isCurrentCorrect) {
                optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 font-medium";
              } else if (isSelected) {
                optionStyle = "border-rose-500 bg-rose-50/50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400 font-medium";
              } else {
                optionStyle = "border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-400";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left px-4 py-2.5 text-xs border rounded transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className="font-mono text-zinc-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-2 border-t pt-3 flex flex-col gap-1.5 ${
            selectedOption === correctIndex ? "border-emerald-100 dark:border-emerald-950/50" : "border-rose-100 dark:border-rose-950/50"
          }`}>
            <span className={`text-xs font-mono font-bold ${
              selectedOption === correctIndex ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              {selectedOption === correctIndex ? "✓ Correct Answer" : "✗ Incorrect Option"}
            </span>
            <p className="text-2xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              {explanation}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    // Ordering / Matching question
    const dotIndex = rawText.indexOf(".");
    const question = dotIndex !== -1 ? rawText.substring(0, dotIndex).trim() + "." : "Sort the items below:";
    
    // Map specific lists based on question keywords
    let items: string[] = [];
    let correctOrder: string[] = [];
    let isMatching = false;
    let matchPairs: { left: string; right: string }[] = [];

    const q = question.toLowerCase();
    if (q.includes("web request over http/tcp")) {
      items = ["TCP four-way teardown", "DNS resolution", "HTTP GET request sent", "TCP three-way handshake"];
      correctOrder = ["DNS resolution", "TCP three-way handshake", "HTTP GET request sent", "TCP four-way teardown"];
    } else if (q.includes("lifecycle of a single kafka message")) {
      items = [
        "The leader replica appends the message to its log and followers replicate it",
        "Kafka hashes the message key to determine the target partition",
        "The producer formats the message and sends it to a Kafka topic",
        "Kafka identifies which broker holds the target partition and sends the message there"
      ];
      correctOrder = [
        "The producer formats the message and sends it to a Kafka topic",
        "Kafka hashes the message key to determine the target partition",
        "Kafka identifies which broker holds the target partition and sends the message there",
        "The leader replica appends the message to its log and followers replicate it"
      ];
    } else if (q.includes("distributed-lock booking flow")) {
      items = [
        "Stripe processes the payment and notifies the system via webhook that payment succeeded",
        "The user selects a seat, triggering a POST /bookings request with the ticketId",
        "The webhook handler runs a transaction that sets the ticket status to 'sold' and the booking to 'confirmed'",
        "The Booking Service acquires a lock on the ticket in Redis with a TTL of 10 minutes"
      ];
      correctOrder = [
        "The user selects a seat, triggering a POST /bookings request with the ticketId",
        "The Booking Service acquires a lock on the ticket in Redis with a TTL of 10 minutes",
        "Stripe processes the payment and notifies the system via webhook that payment succeeded",
        "The webhook handler runs a transaction that sets the ticket status to 'sold' and the booking to 'confirmed'"
      ];
    } else if (q.includes("match each sharding or partitioning concept")) {
      isMatching = true;
      matchPairs = [
        { left: "Range-based sharding", right: "Groups records by a continuous range of values and supports efficient range scans" },
        { left: "Hash-based sharding", right: "Applies a hash function to the shard key to distribute records evenly" },
        { left: "Directory-based sharding", right: "Uses a lookup table or service to decide where each record lives" },
        { left: "Vertical partitioning", right: "Splits columns across pieces, keeping fewer columns per piece" }
      ];
    }

    // Initialize user order on mount if empty
    useEffect(() => {
      if (items.length > 0 && userOrder.length === 0) {
        setUserOrder([...items]);
      }
    }, [items, userOrder]);

    const moveItem = (index: number, direction: "up" | "down") => {
      if (orderChecked) return;
      const newOrder = [...userOrder];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < newOrder.length) {
        const temp = newOrder[index];
        newOrder[index] = newOrder[targetIndex];
        newOrder[targetIndex] = temp;
        setUserOrder(newOrder);
      }
    };

    const checkSequence = () => {
      const correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
      setIsOrderCorrect(correct);
      setOrderChecked(true);
    };

    if (isMatching) {
      return (
        <div className="my-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-lg flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <span className="text-2xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Interactive Match</span>
            <span className="text-3xs font-mono px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">Concept Match</span>
          </div>

          <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 leading-relaxed">
            Match each concept to its core description:
          </h4>

          <div className="flex flex-col gap-3">
            {matchPairs.map((pair, idx) => (
              <div key={idx} className="border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 p-3 flex flex-col gap-1">
                <span className="text-xs font-mono text-sky-500 font-bold uppercase">{pair.left}</span>
                <p className="text-2xs text-zinc-600 dark:text-zinc-400 leading-normal">{pair.right}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="my-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{question}</h4>
          <p className="text-2xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">{rawText}</p>
        </div>
      );
    }

    return (
      <div className="my-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-5 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <span className="text-2xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Interactive Sequence</span>
          <span className="text-3xs font-mono px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">Sorting</span>
        </div>

        <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50 leading-relaxed">
          Sort the following steps in correct chronological order (top to bottom):
        </h4>

        <div className="flex flex-col gap-2">
          {userOrder.map((item, idx) => (
            <div 
              key={idx}
              className="border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 px-3 py-2 flex items-center justify-between gap-3 text-xs text-zinc-800 dark:text-zinc-200"
            >
              <div className="flex items-start gap-2.5">
                <span className="font-mono text-zinc-400 font-bold">{idx + 1}.</span>
                <span>{item}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0 || orderChecked}
                  onClick={() => moveItem(idx, "up")}
                  className="p-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-2xs font-bold disabled:opacity-40"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={idx === userOrder.length - 1 || orderChecked}
                  onClick={() => moveItem(idx, "down")}
                  className="p-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-2xs font-bold disabled:opacity-40"
                >
                  ▼
                </button>
              </div>
            </div>
          ))}
        </div>

        {!orderChecked ? (
          <button
            type="button"
            onClick={checkSequence}
            className="w-full mt-2 text-center text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
          >
            Check Sequence
          </button>
        ) : (
          <div className={`mt-2 border-t pt-3 flex flex-col gap-1.5 ${
            isOrderCorrect ? "border-emerald-100 dark:border-emerald-950/50" : "border-rose-100 dark:border-rose-950/50"
          }`}>
            <span className={`text-xs font-mono font-bold ${
              isOrderCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              {isOrderCorrect ? "✓ Sequence Correct!" : "✗ Sequence Incorrect"}
            </span>
            <p className="text-2xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              {isOrderCorrect 
                ? "Excellent! You ordered the steps exactly as they occur in real-world systems." 
                : `Incorrect order. The correct chronological sequence is:\n${correctOrder.map((c, i) => `${i + 1}. ${c}`).join("\n")}`}
            </p>
          </div>
        )}
      </div>
    );
  }
}
