"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info, RefreshCw } from "lucide-react";
import { CodingDesignTopic } from "@/data/coding-design";

interface ScribbleDiagramProps {
  scribble: CodingDesignTopic["scribble"];
  categoryColor?: string;
  isInteractive?: boolean;
}

export default function ScribbleDiagram({
  scribble,
  categoryColor = "emerald",
  isInteractive = true,
}: ScribbleDiagramProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Status color mappings
  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "success":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          border: "border-emerald-300 dark:border-emerald-800",
          text: "text-emerald-900 dark:text-emerald-200",
          badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
          ring: "ring-emerald-500/20",
          indicator: "bg-emerald-500",
        };
      case "danger":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/40",
          border: "border-rose-300 dark:border-rose-800",
          text: "text-rose-900 dark:text-rose-200",
          badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
          ring: "ring-rose-500/20",
          indicator: "bg-rose-500",
        };
      case "warn":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-amber-300 dark:border-amber-800",
          text: "text-amber-900 dark:text-amber-200",
          badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
          ring: "ring-amber-500/20",
          indicator: "bg-amber-500",
        };
      case "accent":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/40",
          border: "border-purple-300 dark:border-purple-800",
          text: "text-purple-900 dark:text-purple-200",
          badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
          ring: "ring-purple-500/20",
          indicator: "bg-purple-500",
        };
      default:
        return {
          bg: "bg-white dark:bg-[#18181b]",
          border: "border-zinc-300 dark:border-zinc-700",
          text: "text-zinc-900 dark:text-zinc-100",
          badge: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
          ring: "ring-zinc-400/20",
          indicator: "bg-zinc-400",
        };
    }
  };

  return (
    <div className="relative w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-[#fafafa]/90 dark:bg-[#101012] p-4 sm:p-6 overflow-hidden shadow-sm">
      {/* Hand-drawn SVG doodle accents */}
      <svg
        className="absolute top-2 right-2 w-28 h-28 pointer-events-none opacity-25 dark:opacity-15 stroke-zinc-700 dark:stroke-zinc-300 fill-none"
        viewBox="0 0 100 100"
      >
        <path
          className="animate-scribble"
          strokeWidth="1.2"
          strokeLinecap="round"
          d="M10,20 C30,5 70,5 90,20 C95,50 85,80 60,90 C30,95 10,75 15,45 C18,25 35,18 55,20"
        />
        <path
          strokeWidth="1"
          strokeDasharray="2,3"
          d="M35,35 L65,65 M65,35 L35,65"
        />
      </svg>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            {scribble.badge}
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
            SCRIBBLE BLUEPRINT
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 italic">
          {scribble.caption}
        </span>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="relative flex flex-col gap-3 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {scribble.nodes.map((node, index) => {
            const styles = getStatusStyles(node.status);
            const isHovered = activeNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseEnter={() => isInteractive && setActiveNodeId(node.id)}
                onMouseLeave={() => isInteractive && setActiveNodeId(null)}
                className={`relative flex flex-col justify-between p-3.5 rounded-md border-2 transition-all duration-200 ${
                  styles.bg
                } ${styles.border} ${
                  isHovered
                    ? "scale-[1.02] shadow-md ring-2 " + styles.ring
                    : "shadow-xs hover:border-zinc-400 dark:hover:border-zinc-500"
                }`}
                style={{
                  borderStyle: node.status === "warn" ? "dashed" : "solid",
                }}
              >
                {/* Node order pill */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${styles.indicator}`} />
                    <span className="text-[10px] font-mono font-bold text-zinc-400">
                      #{index + 1}
                    </span>
                  </div>
                  {node.annotation && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full ${styles.badge}`}
                    >
                      {node.annotation}
                    </span>
                  )}
                </div>

                {/* Node Label */}
                <div>
                  <h4 className={`text-xs sm:text-sm font-bold tracking-tight font-mono ${styles.text}`}>
                    {node.label}
                  </h4>
                  {node.detail && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-mono leading-relaxed">
                      {node.detail}
                    </p>
                  )}
                </div>

                {/* Subtle sketch underline on hover */}
                {isHovered && (
                  <svg
                    className="w-full h-1.5 mt-2 overflow-visible stroke-zinc-900 dark:stroke-zinc-100 fill-none"
                    viewBox="0 0 100 6"
                  >
                    <path
                      d="M0,3 C30,6 70,0 100,4"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Flow Connectors */}
        {scribble.connections && scribble.connections.length > 0 && (
          <div className="mt-4 pt-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block mb-2">
              Execution Sequence &amp; Transitions
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {scribble.connections.map((conn, idx) => {
                const fromNode = scribble.nodes.find((n) => n.id === conn.from);
                const toNode = scribble.nodes.find((n) => n.id === conn.to);

                return (
                  <div
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
                      conn.highlight
                        ? "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                        : conn.dashed
                        ? "bg-zinc-100/70 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 border-dashed border-zinc-300 dark:border-zinc-700"
                        : "bg-white dark:bg-[#18181b] text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    <span className="font-semibold">{fromNode?.label || conn.from}</span>
                    <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="font-semibold">{toNode?.label || conn.to}</span>
                    {conn.label && (
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium pl-1 border-l border-zinc-300 dark:border-zinc-700">
                        [{conn.label}]
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
