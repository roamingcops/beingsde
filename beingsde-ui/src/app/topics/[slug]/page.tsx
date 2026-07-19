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
  const [topic, setTopic] = useState<any>(() => MOCK_TOPICS.find((t) => t.slug === slug) || MOCK_TOPICS[1]);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const isLocked = false;
  
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setIsPremiumUser(role === "PREMIUM_USER" || role === "ADMIN");
  }, []);

  useEffect(() => {
    const fetchLiveTopic = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await fetch(`${API_BASE}/topics/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setTopic(data);
          }
        }
      } catch (e) {
        console.error("Failed to load live topic data, using static fallback", e);
      }
    };
    fetchLiveTopic();
  }, [slug]);

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
                Try Free HLD Topics
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
                {topic.prerequisites?.map((prereq: string) => (
                  <li key={prereq} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {renderTopicSpecificSidebar(topic.slug, topic.category, topic.tags || [])}
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

// Sidebar dispatcher to render topic-specific workbenches
function renderTopicSpecificSidebar(slug: string, category: string, tags: string[]) {
  const lowercaseSlug = slug.toLowerCase();
  const lowercaseCategory = category.toLowerCase();
  
  if (lowercaseSlug.includes("consistent-hashing") || lowercaseSlug.includes("sharding")) {
    return <HashingWorkbench />;
  }
  
  if (lowercaseSlug.includes("caching") || lowercaseSlug.includes("redis") || lowercaseSlug.includes("cache")) {
    return <CachingSimulator />;
  }
  
  if (lowercaseSlug.includes("rate-limiter") || lowercaseSlug.includes("api-gateway") || lowercaseSlug.includes("ticketmaster")) {
    return <RateLimiterSimulator />;
  }
  
  if (lowercaseSlug.includes("kafka")) {
    return <KafkaPartitionSimulator />;
  }
  
  if (
    lowercaseCategory.includes("database") ||
    lowercaseCategory.includes("storage") ||
    lowercaseSlug.includes("modeling") ||
    lowercaseSlug.includes("cassandra") ||
    lowercaseSlug.includes("dynamodb") ||
    lowercaseSlug.includes("postgresql")
  ) {
    return <StorageCalculator />;
  }

  // Fallback to related topics and cheat sheet
  return (
    <div className="flex flex-col gap-6">
      <RelatedTopicsPanel currentSlug={slug} currentCategory={category} currentTags={tags} />
      <CheatSheetWidget />
    </div>
  );
}

// 1. Consistent Hashing / Rollout Workbench
function HashingWorkbench() {
  const [workbenchUserId, setWorkbenchUserId] = useState("user_8472");
  const [rolloutPercentage, setRolloutPercentage] = useState(50);
  const [hashAlgorithm, setHashAlgorithm] = useState("fnv1a");

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
  );
}

// 2. Cache-Aside Simulator
function CachingSimulator() {
  const [cache, setCache] = useState<{ [key: string]: string }>({
    "user_101": "{\"name\":\"Alice\",\"tier\":\"premium\"}",
    "settings_global": "{\"theme\":\"dark\",\"maintenance\":false}"
  });
  const [readKey, setReadKey] = useState("user_101");
  const [writeKey, setWriteKey] = useState("user_102");
  const [writeValue, setWriteValue] = useState("{\"name\":\"Bob\",\"tier\":\"free\"}");
  const [logs, setLogs] = useState<{ text: string; type: "hit" | "miss" | "write" }[]>([]);

  const handleRead = () => {
    if (!readKey.trim()) return;
    const hit = cache[readKey] !== undefined;
    if (hit) {
      setLogs((prev) => [
        { text: `Read '${readKey}' - CACHE HIT (Latency: <1ms)`, type: "hit" },
        ...prev.slice(0, 4)
      ]);
    } else {
      const dbValue = readKey === "user_102" ? "{\"name\":\"Bob\",\"tier\":\"free\"}" : "{\"id\":\"" + readKey + "\",\"status\":\"active\"}";
      setCache((prev) => ({ ...prev, [readKey]: dbValue }));
      setLogs((prev) => [
        { text: `Read '${readKey}' - CACHE MISS (Fetched from DB: ~80ms, written to Cache)`, type: "miss" },
        ...prev.slice(0, 4)
      ]);
    }
  };

  const handleWrite = () => {
    if (!writeKey.trim()) return;
    setCache((prev) => {
      const next = { ...prev };
      delete next[writeKey];
      return next;
    });
    setLogs((prev) => [
      { text: `Write '${writeKey}' to DB (Invalidated cache entry to ensure consistency)`, type: "write" },
      ...prev.slice(0, 4)
    ]);
  };

  const clearCache = () => {
    setCache({});
    setLogs([]);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Caching Simulator</h3>
        <p className="text-2xs text-zinc-500 leading-relaxed">
          Simulate Cache-Aside logic. See how cache misses trigger database reads (slow) and populate cache, while writes invalidate entries.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-3xs font-mono uppercase text-zinc-400">Read Cache Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={readKey}
              onChange={(e) => setReadKey(e.target.value)}
              className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
              placeholder="e.g. user_101"
            />
            <button
              onClick={handleRead}
              className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-2xs font-semibold rounded hover:opacity-90 transition-opacity uppercase font-mono"
            >
              Read
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-3xs font-mono uppercase text-zinc-400">Write DB Key & Value</label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={writeKey}
              onChange={(e) => setWriteKey(e.target.value)}
              className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
              placeholder="Key: e.g. user_102"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={writeValue}
                onChange={(e) => setWriteValue(e.target.value)}
                className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                placeholder="JSON Value"
              />
              <button
                onClick={handleWrite}
                className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-2xs font-semibold rounded hover:opacity-90 transition-opacity uppercase font-mono"
              >
                Write
              </button>
            </div>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded flex flex-col gap-2">
          <div className="flex items-center justify-between text-3xs font-mono border-b border-zinc-200 dark:border-zinc-800 pb-1">
            <span className="text-zinc-400 font-bold">Active Cache Store:</span>
            <button onClick={clearCache} className="text-zinc-400 hover:text-rose-500 text-3xs underline">Flush All</button>
          </div>
          {Object.keys(cache).length === 0 ? (
            <span className="text-3xs font-mono text-zinc-400 italic">Cache is empty</span>
          ) : (
            <div className="max-h-[80px] overflow-y-auto space-y-1 font-mono text-3xs">
              {Object.entries(cache).map(([k, v]) => (
                <div key={k} className="flex justify-between items-start text-zinc-700 dark:text-zinc-300 gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-0.5 last:border-0">
                  <span className="font-semibold shrink-0 text-sky-500">{k}:</span>
                  <span className="truncate max-w-[120px]">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-3xs font-mono uppercase text-zinc-400">Simulation Logs</span>
          <div className="h-[90px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-2 rounded space-y-1">
            {logs.length === 0 ? (
              <p className="text-3xs font-mono text-zinc-600 italic">No events logged yet...</p>
            ) : (
              logs.map((log, idx) => (
                <p key={idx} className={`text-3xs font-mono leading-tight ${
                  log.type === "hit" ? "text-emerald-400" :
                  log.type === "miss" ? "text-amber-400" : "text-sky-400"
                }`}>
                  &gt; {log.text}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Token Bucket Rate Limiter Simulator
function RateLimiterSimulator() {
  const [tokens, setTokens] = useState(8);
  const maxTokens = 10;
  const [refillInterval, setRefillInterval] = useState(1500);
  const [requests, setRequests] = useState<{ id: number; allowed: boolean; timestamp: string }[]>([]);
  const [reqCounter, setReqCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => Math.min(maxTokens, prev + 1));
    }, refillInterval);
    return () => clearInterval(timer);
  }, [refillInterval]);

  const handleRequest = () => {
    const timestamp = new Date().toLocaleTimeString();
    const id = reqCounter;
    setReqCounter((prev) => prev + 1);

    if (tokens >= 1) {
      setTokens((prev) => prev - 1);
      setRequests((prev) => [
        { id, allowed: true, timestamp },
        ...prev.slice(0, 4)
      ]);
    } else {
      setRequests((prev) => [
        { id, allowed: false, timestamp },
        ...prev.slice(0, 4)
      ]);
    }
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Rate Limiter Simulator</h3>
        <p className="text-2xs text-zinc-500 leading-relaxed">
          Simulate a Token Bucket algorithm. Requests consume 1 token. Tokens refill at a steady interval. When empty, further requests are blocked (HTTP 429).
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-3xs font-mono uppercase text-zinc-400">
            <span>Bucket Capacity ({tokens}/{maxTokens} tokens)</span>
            <span className="text-emerald-500 font-bold">Refilling</span>
          </div>
          <div className="h-6 w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded p-0.5 flex gap-1 items-center">
            {Array.from({ length: maxTokens }).map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                  idx < tokens 
                    ? "bg-emerald-500 dark:bg-emerald-600 shadow-sm" 
                    : "bg-zinc-200 dark:bg-zinc-800 opacity-20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-3xs font-mono uppercase text-zinc-400">Token Refill Speed</label>
          <select
            value={refillInterval}
            onChange={(e) => setRefillInterval(Number(e.target.value))}
            className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value={800}>Fast Refill (1 token / 800ms)</option>
            <option value={1500}>Normal Refill (1 token / 1.5s)</option>
            <option value={3000}>Slow Refill (1 token / 3s)</option>
          </select>
        </div>

        <button
          onClick={handleRequest}
          className="w-full mt-2 text-center text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-2.5 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 font-mono"
        >
          Send Client Request
        </button>

        <div className="flex flex-col gap-1 mt-2">
          <span className="text-3xs font-mono uppercase text-zinc-400">Request Logs</span>
          <div className="h-[90px] overflow-y-auto border border-zinc-200 dark:border-zinc-800 bg-zinc-950 p-2 rounded space-y-1">
            {requests.length === 0 ? (
              <p className="text-3xs font-mono text-zinc-600 italic">Click the button to send traffic...</p>
            ) : (
              requests.map((r) => (
                <div key={r.id} className="flex justify-between items-center text-3xs font-mono leading-tight">
                  <span className="text-zinc-500">[{r.timestamp}] Req #{r.id}</span>
                  <span className={`font-bold ${r.allowed ? "text-emerald-400" : "text-rose-400"}`}>
                    {r.allowed ? "200 OK" : "429 TOO MANY REQ"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Kafka Partition Broker Simulator
function KafkaPartitionSimulator() {
  const [partitions, setPartitions] = useState<{ [id: number]: { key: string; payload: string; offset: number }[] }>({
    0: [],
    1: [],
    2: []
  });
  const [messageKey, setMessageKey] = useState("user_8472");
  const [messagePayload, setMessagePayload] = useState("LOGIN_EVENT");
  const [routingAlgorithm, setRoutingAlgorithm] = useState<"hash" | "rr">("hash");
  const [rrCounter, setRrCounter] = useState(0);

  const produceMessage = () => {
    let targetPartition = 0;
    if (routingAlgorithm === "hash") {
      let hash = 0;
      for (let i = 0; i < messageKey.length; i++) {
        hash += messageKey.charCodeAt(i);
      }
      targetPartition = hash % 3;
    } else {
      targetPartition = rrCounter % 3;
      setRrCounter((prev) => prev + 1);
    }

    setPartitions((prev) => {
      const pList = prev[targetPartition] || [];
      const newOffset = pList.length > 0 ? pList[pList.length - 1].offset + 1 : 0;
      return {
        ...prev,
        [targetPartition]: [...pList, { key: messageKey, payload: messagePayload, offset: newOffset }]
      };
    });
  };

  const clearPartitions = () => {
    setPartitions({ 0: [], 1: [], 2: [] });
    setRrCounter(0);
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Kafka Partition Broker</h3>
        <p className="text-2xs text-zinc-500 leading-relaxed">
          Simulate how a Kafka producer hashes message keys (e.g. `user_id`) to assign events to partitions, maintaining ordering per partition.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <div className="flex flex-col gap-1">
          <label className="text-3xs font-mono uppercase text-zinc-400">Partition Routing Algorithm</label>
          <select
            value={routingAlgorithm}
            onChange={(e) => setRoutingAlgorithm(e.target.value as "hash" | "rr")}
            className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
          >
            <option value="hash">Key Hashing (hash(key) % 3)</option>
            <option value="rr">Round-Robin Rotation</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-3xs font-mono uppercase text-zinc-400">Message Key (e.g. User ID)</label>
            <input
              type="text"
              value={messageKey}
              onChange={(e) => setMessageKey(e.target.value)}
              className="px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
              placeholder="e.g. user_8472"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-3xs font-mono uppercase text-zinc-400">Message Payload</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={messagePayload}
                onChange={(e) => setMessagePayload(e.target.value)}
                className="flex-1 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs rounded font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none"
                placeholder="e.g. LOGIN_EVENT"
              />
              <button
                onClick={produceMessage}
                className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-2xs font-semibold rounded hover:opacity-90 transition-opacity uppercase font-mono"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-3xs font-mono uppercase text-zinc-400">
            <span>Broker Partitions</span>
            <button onClick={clearPartitions} className="text-zinc-400 hover:text-rose-500 text-3xs underline normal-case">Reset Topics</button>
          </div>
          <div className="grid grid-cols-3 gap-1 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-950 p-2 min-h-[100px] max-h-[160px] overflow-y-auto">
            {[0, 1, 2].map((pid) => (
              <div key={pid} className="flex flex-col gap-1 border-r border-zinc-800 last:border-0 pr-1 last:pr-0">
                <span className="text-[9px] font-mono text-zinc-400 font-bold border-b border-zinc-800 pb-0.5 text-center">Part {pid}</span>
                <div className="flex flex-col-reverse gap-1 overflow-y-auto">
                  {partitions[pid]?.length === 0 ? (
                    <span className="text-[8px] font-mono text-zinc-600 text-center italic">empty</span>
                  ) : (
                    partitions[pid]?.map((msg, index) => (
                      <div key={index} className="bg-zinc-900 border border-zinc-800 p-1 rounded-sm text-[8px] font-mono text-sky-400 truncate">
                        <span className="text-zinc-500 font-bold">Offset {msg.offset}:</span> {msg.key}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Database Storage & Capacity Calculator
function StorageCalculator() {
  const [dau, setDau] = useState(10);
  const [readRatio, setReadRatio] = useState(90);
  const [payloadSize, setPayloadSize] = useState(500);

  const writeRatio = 100 - readRatio;
  const dauRaw = dau * 1000000;
  
  const writesPerDay = dauRaw * 5 * (writeRatio / 100);
  const readsPerDay = dauRaw * 5 * (readRatio / 100);
  
  const writeQps = Math.round(writesPerDay / 86400);
  const readQps = Math.round(readsPerDay / 86400);
  const totalQps = writeQps + readQps;

  const writeBandwidthMB = (writeQps * payloadSize) / (1024 * 1024);
  const readBandwidthMB = (readQps * payloadSize * 2) / (1024 * 1024);

  const dbStorageYearGB = Math.round((writesPerDay * payloadSize * 365) / 1000000000);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Capacity Calculator</h3>
        <p className="text-2xs text-zinc-500 leading-relaxed">
          Estimate QPS, bandwidth, and database sizing in real time based on active users and payload characteristics.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-3xs font-mono uppercase text-zinc-400">
            <span>Daily Active Users (DAU)</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{dau}M</span>
          </div>
          <input
            type="range"
            min="1"
            max="200"
            value={dau}
            onChange={(e) => setDau(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-3xs font-mono uppercase text-zinc-400">
            <span>Read Ratio vs Write Ratio</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{readRatio}% / {writeRatio}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="99"
            value={readRatio}
            onChange={(e) => setReadRatio(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-3xs font-mono uppercase text-zinc-400">
            <span>Payload Size (Bytes)</span>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{payloadSize} B</span>
          </div>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={payloadSize}
            onChange={(e) => setPayloadSize(Number(e.target.value))}
            className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded flex flex-col gap-2 font-mono text-3xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Average Read QPS:</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{readQps.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Average Write QPS:</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{writeQps.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
            <span className="text-zinc-400 font-bold">Total Request QPS:</span>
            <span className="text-sky-500 font-bold">{totalQps.toLocaleString()} req/s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Write Bandwidth:</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{writeBandwidthMB.toFixed(2)} MB/s</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Read Bandwidth:</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-semibold">{readBandwidthMB.toFixed(2)} MB/s</span>
          </div>
          <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-1.5 text-2xs">
            <span className="text-zinc-400 font-bold">Storage / Year:</span>
            <span className="text-emerald-500 font-bold">{dbStorageYearGB} GB/yr</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. Related Topics Sidebar Panel
function RelatedTopicsPanel({ currentSlug, currentCategory, currentTags }: { currentSlug: string; currentCategory: string; currentTags: string[] }) {
  const related = MOCK_TOPICS.filter((t) => {
    if (t.slug === currentSlug) return false;
    const sameCategory = t.category === currentCategory;
    const sharedTags = t.tags?.some((tag) => currentTags?.includes(tag));
    return sameCategory || sharedTags;
  }).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-4">
      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Related Topics</h3>
        <p className="text-2xs text-zinc-500 leading-relaxed">
          Expand your knowledge by learning about adjacent concepts in system design.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
        {related.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="flex flex-col gap-1.5 p-2 rounded-sm border border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center text-3xs font-mono font-semibold uppercase text-zinc-400">
              <span>{topic.category}</span>
              <span className={`text-[9px] px-1.5 py-0.5 border rounded-sm ${
                topic.difficulty === "EASY" ? "border-emerald-200 text-emerald-600 bg-emerald-50/20 dark:border-emerald-950 text-emerald-500" :
                topic.difficulty === "MEDIUM" ? "border-amber-200 text-amber-600 bg-amber-50/20 dark:border-amber-950 text-amber-500" :
                "border-rose-200 text-rose-600 bg-rose-50/20 dark:border-rose-950 text-rose-500"
              }`}>
                {topic.difficulty}
              </span>
            </div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{topic.title}</h4>
            <p className="text-3xs text-zinc-400 line-clamp-2 leading-relaxed">{topic.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 7. General System Design Cheat Sheet Widget
function CheatSheetWidget() {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md flex flex-col gap-3">
      <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
        <FileText className="w-5 h-5 text-sky-500 shrink-0" />
        <div>
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Cheat Sheet Utility</h4>
          <p className="text-3xs text-zinc-400 mt-0.5 leading-normal">View and print a concise system design reference card.</p>
        </div>
      </div>
      <a
        href="/cheat-sheet"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center text-3xs font-semibold uppercase tracking-wider border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 px-3 py-2 rounded bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors font-mono"
      >
        View Reference Sheet →
      </a>
    </div>
  );
}

