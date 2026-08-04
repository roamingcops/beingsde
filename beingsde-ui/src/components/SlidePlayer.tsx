"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Volume2, Video, Sparkles, Layers, Cpu, CheckCircle2, AlertTriangle, 
  HelpCircle, Monitor, RefreshCw
} from "lucide-react";
import { getSlidesForTopic, Slide } from "@/lib/slideGenerator";

interface SlidePlayerProps {
  topic: {
    slug: string;
    title: string;
    category?: string;
    contentMarkdown?: string;
  };
}

export default function SlidePlayer({ topic }: SlidePlayerProps) {
  const slides = getSlidesForTopic(topic);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showScript, setShowScript] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide: Slide = slides[currentSlideIndex] || slides[0];

  const SLIDE_DURATION_MS = 30000; // 30 seconds per slide at 1x speed

  // Auto-play timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const stepTime = 100;
      const totalSteps = (SLIDE_DURATION_MS / playbackSpeed) / stepTime;
      
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentSlideIndex < slides.length - 1) {
              setCurrentSlideIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (100 / totalSteps);
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlideIndex, slides.length, playbackSpeed]);

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((idx) => idx - 1);
      setProgress(0);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((idx) => idx + 1);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    if (progress >= 100 && currentSlideIndex === slides.length - 1) {
      setCurrentSlideIndex(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full flex flex-col bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-800/90 shadow-2xl overflow-hidden font-sans ${
        isFullscreen ? "fixed inset-0 z-50 h-screen justify-between p-6 rounded-none border-none" : "min-h-[520px]"
      }`}
    >
      
      {/* TOP DECK HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 font-mono text-xs font-bold uppercase tracking-wider shrink-0">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>HLD Presentation</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-200 truncate flex-1 min-w-0">
            {topic.title}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          {/* Slide Counter */}
          <div className="font-mono text-xs text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded border border-zinc-700/60">
            Slide <span className="text-amber-400 font-bold">{currentSlideIndex + 1}</span> / {slides.length}
          </div>

          {/* Script Drawer Toggle */}
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all border ${
              showScript 
                ? "bg-zinc-800 text-zinc-100 border-zinc-700" 
                : "bg-transparent text-zinc-400 border-zinc-800 hover:text-zinc-200"
            }`}
            title="Toggle Voiceover Script"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{showScript ? "Hide Script" : "Show Script"}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            title="Fullscreen presentation mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN SLIDE STAGE CANVAS (Spacious Stacked Layout) */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 gap-5 bg-gradient-to-b from-zinc-950 via-zinc-900/30 to-zinc-950 overflow-y-auto no-scrollbar">
        
        {/* Slide Header & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/70 pb-3.5">
          <div>
            <div className="flex items-center gap-2 text-2xs font-mono text-zinc-400 uppercase tracking-widest mb-1">
              <span>Scene {currentSlide.slideNumber}</span>
              <span>•</span>
              <span className="text-amber-400">{currentSlide.timestamp}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
              {currentSlide.title}
            </h1>
            {currentSlide.subtitle && (
              <p className="text-xs text-zinc-400 mt-0.5">{currentSlide.subtitle}</p>
            )}
          </div>

          {/* Veo Visual Prompt Badge */}
          {currentSlide.veoPrompt && (
            <div className="sm:max-w-xs bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-lg flex items-start gap-2 shadow-inner shrink-0">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-3xs font-mono text-purple-400 uppercase font-semibold">Gemini Veo Prompt</span>
                <p className="text-3xs text-zinc-400 line-clamp-2 italic">"{currentSlide.veoPrompt}"</p>
              </div>
            </div>
          )}
        </div>

        {/* FULL-WIDTH SYSTEM ARCHITECTURE DIAGRAM CANVAS */}
        <div className="w-full flex flex-col bg-[#08080c] border border-zinc-800 rounded-lg overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-2 font-semibold">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              {currentSlide.diagramTitle || "Architecture Diagram Topology"}
            </span>
            <span className="text-3xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold uppercase">
              Schematic View
            </span>
          </div>
          
          <div className="p-4 sm:p-5 flex items-start justify-start bg-[#060609] overflow-x-auto no-scrollbar w-full min-h-[140px]">
            <pre className="font-mono text-2xs sm:text-xs text-amber-300/95 leading-relaxed whitespace-pre text-left font-semibold tracking-wide">
              {currentSlide.diagramCode || `[ ${topic.title} Core Architecture ]`}
            </pre>
          </div>
        </div>

        {/* KEY TECHNICAL POINTS & GOLDEN RULE (Spacious Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Key Takeaways (2 Cols on Desktop) */}
          <div className="md:col-span-2 flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-4 gap-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                Key Technical Takeaways
              </h3>
            </div>

            <ul className="grid grid-cols-1 gap-2">
              {currentSlide.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Golden Rule Callout (1 Col) */}
          {currentSlide.keyTakeaway && (
            <div className="md:col-span-1 flex flex-col justify-between bg-amber-950/20 border border-amber-800/50 p-4 rounded-lg text-xs text-amber-300/90 gap-2">
              <div className="flex items-center gap-2 font-mono text-amber-400 font-bold uppercase text-2xs border-b border-amber-800/40 pb-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Golden Rule</span>
              </div>
              <p className="text-2xs text-amber-200/90 leading-relaxed italic">
                "{currentSlide.keyTakeaway}"
              </p>
            </div>
          )}

        </div>

        {/* Voiceover Script Drawer */}
        {showScript && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 flex flex-col gap-2 shadow-md">
            <div className="flex items-center gap-2 text-2xs font-mono uppercase font-bold text-amber-400">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Presenter Narration Script</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-950/60 p-3 rounded border border-zinc-800/60">
              "{currentSlide.narrationScript}"
            </p>
          </div>
        )}

      </div>

      {/* VIDEO PLAYER CONTROLS & PROGRESS BAR */}
      <div className="flex flex-col bg-zinc-900/95 border-t border-zinc-800 relative z-30">
        
        {/* Animated Progress Bar */}
        <div 
          className="w-full bg-zinc-800/80 h-1.5 cursor-pointer relative z-20 group overflow-hidden" 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = (clickX / rect.width) * 100;
            setProgress(percentage);
          }}
        >
          <div 
            className="bg-amber-400 h-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(251,191,36,0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Layout */}
        <div className="flex items-center justify-between px-5 py-3 gap-3">
          
          {/* Left: Prev / Play / Next */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 transition-colors"
              title="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition-all transform hover:scale-105 shadow-md"
              title={isPlaying ? "Pause Lecture" : "Play Lecture"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />}
            </button>

            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-200 transition-colors"
              title="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Slide Thumbnails */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-lg py-1 px-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  setProgress(0);
                }}
                className={`px-3 py-1 rounded-md text-3xs font-mono transition-all whitespace-nowrap border shrink-0 ${
                  idx === currentSlideIndex 
                    ? "bg-amber-400 text-zinc-950 border-amber-400 font-bold shadow-sm" 
                    : "bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {s.slideNumber}. {s.title.split(":")[0]}
              </button>
            ))}
          </div>

          {/* Right: Playback Speed Control */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-3xs font-mono text-zinc-400 uppercase hidden sm:inline">Speed</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-2xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>
          </div>

        </div>

      </div>

    </div>
  );
}
