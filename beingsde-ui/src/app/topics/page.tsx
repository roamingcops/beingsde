"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, Clock, Lock, Star } from "lucide-react";

// Mock Fallback Topics list matching MongoDB database schema topics
const MOCK_TOPICS = [
  {
    id: "60c72b2f9b1d8a234a9e1e21",
    title: "Design a Distributed Caching System (Redis)",
    slug: "design-distributed-caching-redis",
    description: "Learn how to architect a fault-tolerant, horizontally scalable caching cluster.",
    difficulty: "HARD",
    category: "High-Level Design",
    estimatedTimeMinutes: 45,
    tags: ["Redis", "Caching", "Distributed Systems"],
    isPremium: true,
  },
  {
    id: "60c72b2f9b1d8a234a9e1e28",
    title: "Consistent Hashing Basic",
    slug: "consistent-hashing-basic",
    description: "Deconstruct routing rings, virtual nodes, and distribution keys.",
    difficulty: "EASY",
    category: "Distributed Systems",
    estimatedTimeMinutes: 20,
    tags: ["Scaling", "Hashing", "Consistency"],
    isPremium: false,
  },
  {
    id: "60c72b2f9b1d8a234a9e1e35",
    title: "Design a URL Shortener (TinyURL)",
    slug: "design-url-shortener",
    description: "Build a high-throughput shortener analyzing base58 encodings and database sharding.",
    difficulty: "MEDIUM",
    category: "High-Level Design",
    estimatedTimeMinutes: 30,
    tags: ["Database", "Scaling", "Microservices"],
    isPremium: false,
  },
  {
    id: "60c72b2f9b1d8a234a9e1e40",
    title: "Event-Driven Scaling with Apache Kafka",
    slug: "kafka-event-driven-scaling",
    description: "Deep-dive into partition offsets, producer acknowledgments, and consumer groups.",
    difficulty: "HARD",
    category: "Messaging Systems",
    estimatedTimeMinutes: 50,
    tags: ["Kafka", "Event Driven", "Microservices"],
    isPremium: true,
  }
];

export default function TopicsExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [topics, setTopics] = useState(MOCK_TOPICS);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers: Record<string, string> = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const res = await fetch("http://localhost:8081/api/v1/topics", { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.content && data.content.length > 0) {
            // Merge with local mock metadata to retain premium flag configuration details
            const merged = data.content.map((t: any) => {
              const mockMatch = MOCK_TOPICS.find(m => m.slug === t.slug);
              return {
                ...t,
                isPremium: mockMatch ? mockMatch.isPremium : true
              };
            });
            setTopics(merged);
          }
        }
      } catch (e) {
        // Fallback silently to mock details if server is down
      }
    };
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDifficulty = 
      selectedDifficulty === "ALL" || topic.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="flex flex-col gap-10 py-6 max-w-5xl mx-auto">
      
      {/* HEADER & FILTERS */}
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight">System Design Explorer</h1>
          <p className="text-sm text-zinc-500 mt-1">Select from our vetted collection of high-level and low-level challenges.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by topic title or technology (e.g. Redis, Kafka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest hidden sm:inline"><Filter className="w-3.5 h-3.5 inline mr-1" /> Filters:</span>
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-2xs font-semibold px-3 py-1.5 border uppercase tracking-wider transition-all duration-300 ${
                  selectedDifficulty === diff 
                    ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100" 
                    : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS LIST */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredTopics.map((topic) => (
          <div 
            key={topic.id}
            className="group relative border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
          >
            {/* Gated visual badge */}
            {topic.isPremium && (
              <div className="absolute top-4 right-4 flex items-center gap-1 text-2xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider font-mono">
                <Lock className="w-3 h-3" /> Premium
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-2xs font-semibold tracking-wider font-mono text-zinc-400 uppercase">
                <span>{topic.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {topic.estimatedTimeMinutes} Min</span>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                {topic.title}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {topic.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {topic.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-3xs font-mono px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between">
                <span className={`text-3xs font-bold font-mono px-2 py-0.5 uppercase rounded-sm border ${
                  topic.difficulty === "EASY" ? "border-emerald-200 bg-emerald-50/50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20" :
                  topic.difficulty === "MEDIUM" ? "border-amber-200 bg-amber-50/50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20" :
                  "border-rose-200 bg-rose-50/50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20"
                }`}>
                  {topic.difficulty}
                </span>

                <Link 
                  href={`/topics/${topic.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                >
                  Explore Module <ArrowRightHighlight />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredTopics.length === 0 && (
          <div className="col-span-2 text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
            <BookOpen className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
            <p className="text-sm font-medium text-zinc-500">No topics found matching your query.</p>
          </div>
        )}
      </section>

    </div>
  );
}

// Small arrow highlight component
function ArrowRightHighlight() {
  return (
    <span className="inline-block transition-transform group-hover:translate-x-1 duration-300">
      &rarr;
    </span>
  );
}
