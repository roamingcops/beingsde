import React from "react";
import { Info, AlertTriangle, CheckCircle2, Flame, Lightbulb } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let i = 0;

  const renderInline = (text: string): React.ReactNode => {
    // If the text contains literal raw HTML tags that shouldn't be parsed as markdown links/bold, handle dangerouslySetInnerHTML fallback safely
    if (/<[a-z/][\s\S]*?>/i.test(text) && !text.includes("<") && !text.includes(">")) {
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
    }

    // Replace math notation like $N$ or $O(\log N)$ or $2^{32}-1$ with code/inline styling
    const cleanText = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "")
                          .replace(/<ul[^>]*>/gi, "").replace(/<\/ul>/gi, "")
                          .replace(/<li[^>]*>/gi, "").replace(/<\/li>/gi, "")
                          .replace(/<div[^>]*>/gi, "").replace(/<\/div>/gi, "")
                          .replace(/<AlertTriangle[^>]*\/>/gi, "")
                          .replace(/<Info[^>]*\/>/gi, "");

    const parts = cleanText.split(/(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-bold text-zinc-950 dark:text-zinc-50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
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

  while (i < lines.length) {
    const line = lines[i];

    // 1. Code Blocks (```lang ... ```)
    if (line.trim().startsWith("```")) {
      const codeLanguage = line.trim().substring(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith("```")) {
        i++; // skip closing ```
      }

      elements.push(
        <div key={`code-${i}`} className="my-5 rounded-md overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-1.5 text-3xs font-mono text-zinc-500 dark:text-zinc-400 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
            <span>{codeLanguage || "code"}</span>
          </div>
          <pre className="bg-zinc-950 p-4 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 2. Blockquotes & Callout Alerts (> [!NOTE], > [!WARNING], > [!TIP], > [!IMPORTANT], > [!CAUTION])
    if (line.trim().startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        // Strip leading '>' and one space if present
        let trimmed = lines[i].trim().substring(1);
        if (trimmed.startsWith(" ")) trimmed = trimmed.substring(1);
        quoteLines.push(trimmed);
        i++;
      }

      const firstLine = quoteLines[0] || "";
      let alertType: string | null = null;
      let alertTitle = "";

      const alertMatch = firstLine.match(/^\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION|INFO)\](.*)$/i);
      if (alertMatch) {
        alertType = alertMatch[1].toUpperCase();
        alertTitle = alertMatch[2].trim();
      }

      if (alertType) {
        // Remove the header line from body lines
        const bodyLines = quoteLines.slice(1);

        let borderClass = "border-blue-500 dark:border-blue-400";
        let bgClass = "bg-blue-50/70 dark:bg-blue-950/30";
        let textTitleColor = "text-blue-700 dark:text-blue-300";
        let Icon = Info;

        if (alertType === "WARNING" || alertType === "CAUTION") {
          borderClass = "border-amber-500 dark:border-amber-400";
          bgClass = "bg-amber-50/70 dark:bg-amber-950/30";
          textTitleColor = "text-amber-700 dark:text-amber-300";
          Icon = AlertTriangle;
        } else if (alertType === "IMPORTANT") {
          borderClass = "border-rose-500 dark:border-rose-400";
          bgClass = "bg-rose-50/70 dark:bg-rose-950/30";
          textTitleColor = "text-rose-700 dark:text-rose-300";
          Icon = Flame;
        } else if (alertType === "TIP") {
          borderClass = "border-emerald-500 dark:border-emerald-400";
          bgClass = "bg-emerald-50/70 dark:bg-emerald-950/30";
          textTitleColor = "text-emerald-700 dark:text-emerald-300";
          Icon = Lightbulb;
        }

        elements.push(
          <div
            key={`alert-${i}`}
            className={`my-5 border-l-4 ${borderClass} ${bgClass} p-4 rounded-r-md shadow-xs flex flex-col gap-2 transition-all`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 shrink-0 ${textTitleColor}`} />
              <span className={`font-mono font-black text-2xs uppercase tracking-wider ${textTitleColor}`}>
                {alertType} {alertTitle ? `— ${alertTitle}` : ""}
              </span>
            </div>
            <div className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1.5 pl-6">
              {bodyLines.map((bLine, idx) => {
                if (!bLine.trim()) return null;
                if (bLine.trim().startsWith("* ") || bLine.trim().startsWith("- ")) {
                  return (
                    <li key={idx} className="list-disc ml-4">
                      {renderInline(bLine.trim().substring(2))}
                    </li>
                  );
                }
                return <p key={idx}>{renderInline(bLine)}</p>;
              })}
            </div>
          </div>
        );
      } else {
        // Standard Blockquote
        elements.push(
          <blockquote
            key={`blockquote-${i}`}
            className="my-4 border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1 text-xs italic text-zinc-600 dark:text-zinc-400 space-y-1"
          >
            {quoteLines.map((qLine, idx) => (
              <p key={idx}>{renderInline(qLine)}</p>
            ))}
          </blockquote>
        );
      }
      continue;
    }

    // 3. Markdown Tables (| Col 1 | Col 2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim());

        const headers = parseRow(tableLines[0]);
        // line 1 is separator | --- | --- |
        const rows = tableLines.slice(2).map(parseRow);

        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-bold">
                  {headers.map((h, idx) => (
                    <th key={idx} className="p-3 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 uppercase text-3xs tracking-wider">
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-600 dark:text-zinc-300">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 border-r last:border-r-0 border-zinc-200 dark:border-zinc-800 leading-relaxed">
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 4. Headings (#, ##, ###, ####)
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-2 mt-6 mb-3">
          {renderInline(trimmedLine.substring(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (trimmedLine.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-5 mb-2.5">
          {renderInline(trimmedLine.substring(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (trimmedLine.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm sm:text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
          {renderInline(trimmedLine.substring(4))}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmedLine.startsWith("#### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs sm:text-sm font-bold tracking-tight text-zinc-850 dark:text-zinc-200 mt-3 mb-1.5">
          {renderInline(trimmedLine.substring(5))}
        </h4>
      );
      i++;
      continue;
    }

    // 5. Bullet Lists (* or - or numbered)
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ") || /^\d+\.\s/.test(line.trim())) {
      const listItems: React.ReactNode[] = [];
      const isNumbered = /^\d+\.\s/.test(line.trim());

      while (i < lines.length) {
        const curLine = lines[i].trim();
        if (curLine.startsWith("* ") || curLine.startsWith("- ") || /^\d+\.\s/.test(curLine)) {
          let contentStr = curLine.replace(/^(\*|-|\d+\.)\s*/, "");

          // If bullet marker is on its own line, fold next line into item content
          if (contentStr.trim() === "" && i + 1 < lines.length) {
            const nextLine = lines[i + 1].trim();
            if (
              nextLine &&
              !nextLine.startsWith("#") &&
              !nextLine.startsWith("```") &&
              !nextLine.startsWith(">") &&
              !nextLine.startsWith("---") &&
              !nextLine.startsWith("|")
            ) {
              i++;
              contentStr = lines[i].trim();
            }
          }

          listItems.push(
            <li key={`li-${i}`} className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              {renderInline(contentStr)}
            </li>
          );
          i++;
        } else if (curLine === "") {
          // Allow loose list items separated by empty lines
          if (
            i + 1 < lines.length &&
            (lines[i + 1].trim().startsWith("* ") ||
              lines[i + 1].trim().startsWith("- ") ||
              /^\d+\.\s/.test(lines[i + 1].trim()))
          ) {
            i++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      if (isNumbered) {
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal pl-5 my-3 space-y-2">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${i}`} className="list-disc pl-5 my-3 space-y-2">
            {listItems}
          </ul>
        );
      }
      continue;
    }

    // 6. Horizontal Rule (---)
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="border-t border-zinc-200 dark:border-zinc-800 my-5" />);
      i++;
      continue;
    }

    // 7. Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // 8. Normal Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}
