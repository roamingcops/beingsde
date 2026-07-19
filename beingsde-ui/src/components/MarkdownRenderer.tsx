import React from "react";
import { Info, AlertTriangle, CheckCircle2, Flame } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLanguage = "";
  
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

  const renderInline = (text: string) => {
    // If the line contains HTML tags (like <table, <tr, <td, <p, <strong, etc), render it via dangerouslySetInnerHTML
    if (/<[a-z/][\s\S]*?>/i.test(text)) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }

    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-bold text-zinc-950 dark:text-zinc-50">{part.slice(2, -2)}</strong>;
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
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle Code Blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const codeText = codeBlockLines.join("\n");
        elements.push(
          <div key={`code-${i}`} className="my-6 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-3xs font-mono text-zinc-400 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
              <span>{codeLanguage || "code"}</span>
            </div>
            <pre className="bg-zinc-950 p-4 overflow-x-auto text-xs font-mono text-zinc-300">
              <code>{codeText}</code>
            </pre>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
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
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-2 mt-8 mb-4">
          {renderInline(line.substring(2))}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList(i);
      elements.push(
        <h2 key={`h2-${i}`} className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6 mb-3">
          {renderInline(line.substring(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList(i);
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-4 mb-2">
          {renderInline(line.substring(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("#### ")) {
      flushList(i);
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-3 mb-1.5">
          {renderInline(line.substring(5))}
        </h4>
      );
      continue;
    }

    // Handle Bullet Lists
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      inList = true;
      const cleanLine = line.trim().substring(2);
      listItems.push(
        <li key={`li-${i}-${listItems.length}`} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {renderInline(cleanLine)}
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

    // Handle Github Blockquote Alerts
    // > [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT], > [!CAUTION]
    if (line.trim().startsWith(">")) {
      flushList(i);
      const cleanLine = line.trim().substring(1).trim();
      let alertType = "";
      let alertContent = cleanLine;

      if (cleanLine.startsWith("[!NOTE]")) {
        alertType = "NOTE";
        alertContent = cleanLine.substring(7).trim();
      } else if (cleanLine.startsWith("[!WARNING]")) {
        alertType = "WARNING";
        alertContent = cleanLine.substring(10).trim();
      } else if (cleanLine.startsWith("[!TIP]")) {
        alertType = "TIP";
        alertContent = cleanLine.substring(6).trim();
      } else if (cleanLine.startsWith("[!IMPORTANT]")) {
        alertType = "IMPORTANT";
        alertContent = cleanLine.substring(12).trim();
      } else if (cleanLine.startsWith("[!CAUTION]")) {
        alertType = "CAUTION";
        alertContent = cleanLine.substring(10).trim();
      }

      if (alertType) {
        let titleColor = "text-blue-500 dark:text-blue-400";
        let borderClass = "border-blue-500";
        let bgClass = "bg-blue-50/50 dark:bg-blue-950/20";
        let Icon = Info;

        if (alertType === "WARNING" || alertType === "CAUTION") {
          titleColor = "text-amber-500 dark:text-amber-400";
          borderClass = "border-amber-500";
          bgClass = "bg-amber-50/50 dark:bg-amber-950/20";
          Icon = AlertTriangle;
        } else if (alertType === "IMPORTANT") {
          titleColor = "text-rose-500 dark:text-rose-400";
          borderClass = "border-rose-500";
          bgClass = "bg-rose-50/50 dark:bg-rose-950/20";
          Icon = Flame;
        } else if (alertType === "TIP") {
          titleColor = "text-emerald-500 dark:text-emerald-400";
          borderClass = "border-emerald-500";
          bgClass = "bg-emerald-50/50 dark:bg-emerald-950/20";
          Icon = CheckCircle2;
        }

        elements.push(
          <div key={`alert-${i}`} className={`flex gap-3 border-l-4 ${borderClass} ${bgClass} p-4 rounded my-4`}>
            <Icon className={`w-5 h-5 shrink-0 ${titleColor}`} />
            <div className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <span className={`font-black uppercase tracking-wider text-2xs block mb-1 ${titleColor}`}>{alertType}</span>
              {renderInline(alertContent)}
            </div>
          </div>
        );
      } else {
        // Standard blockquote
        elements.push(
          <blockquote key={`blockquote-${i}`} className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1 my-4 text-sm italic text-zinc-500 dark:text-zinc-400">
            {renderInline(cleanLine)}
          </blockquote>
        );
      }
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
        {renderInline(line)}
      </p>
    );
  }

  flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
}
