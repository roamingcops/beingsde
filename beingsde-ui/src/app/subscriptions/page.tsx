"use client";

import { Check, Star, Users, ArrowRight } from "lucide-react";

export default function SubscriptionsPage() {

  const handleCheckout = (planId: string) => {
    alert(`Initiating Razorpay payment workflow for plan: ${planId}. Order payload triggers billing controllers.`);
  };

  return (
    <div className="flex flex-col items-center gap-12 py-8 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <section className="text-center max-w-xl flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Structured Pricing Plans</h1>
        <p className="text-sm text-zinc-500">
          Get unlimited access to high-resolution system design breakdowns, low-level diagrams, and 1-on-1 mock interviews.
        </p>
      </section>

      {/* PLAN COMPARISON CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl items-stretch">
        
        {/* FREE PLAN */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-widest">Standard Access</span>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Free Plan</h2>
              <p className="text-xs text-zinc-500">Kickstart your systems learning journey.</p>
            </div>
            <div className="text-3xl font-black mt-2">
              $0 <span className="text-xs font-normal text-zinc-400 font-mono">/ Free forever</span>
            </div>
            
            {/* Features */}
            <ul className="flex flex-col gap-3 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Access to Basic HLD Topics (e.g. Consistent Hashing)
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Read Online Lesson notes
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Limited Video Previews
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("FREE")}
            className="w-full text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-900 dark:text-zinc-100 px-4 py-3 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
          >
            Current Plan
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="relative border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#18181b] p-8 rounded-md flex flex-col justify-between gap-8 shadow-md">
          
          {/* Circular Scribble Ring overlay around premium star */}
          <div className="absolute -top-3 -right-3 p-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-full border border-zinc-900 dark:border-zinc-100">
            <Star className="w-4 h-4 fill-current" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Recommended</span>
              <span className="text-3xs font-bold font-mono uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded-sm">
                Pass MAANG
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">Premium Pass</h2>
              <p className="text-xs text-zinc-500">Unlimited preparation for Staff+ roles.</p>
            </div>
            <div className="text-3xl font-black mt-2">
              ₹2,999 <span className="text-xs font-normal text-zinc-400 font-mono">/ Month (Razorpay)</span>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-3 mt-4 border-t border-zinc-150 dark:border-zinc-800 pt-4">
              <li className="flex items-center gap-2 text-xs text-zinc-900 dark:text-zinc-100 font-semibold">
                <Check className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0" />
                Unrestricted Access to All HLD & LLD Topics
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Unlock PDF Architectural blueprints & downloads
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Access all HD Video lectures on CDN edge
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Includes 1 Mock Interview credit per month
              </li>
              <li className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                <Check className="w-4 h-4 text-zinc-400 shrink-0" />
                Premium Slack community channel access
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleCheckout("PREMIUM_1M")}
            className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-3 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
          >
            Upgrade to Premium
          </button>
        </div>
      </section>

      {/* ADDITIONAL BENEFITS & FAQS */}
      <section className="w-full max-w-3xl flex flex-col gap-6 mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 text-center mb-2">Platform Commitments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3">
            <Users className="w-5 h-5 text-zinc-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Mock Interviews</h4>
              <p className="text-3xs text-zinc-500 leading-relaxed mt-1">
                Conduct mock trials with Staff/Principal systems architects from target companies and get immediate, comprehensive scorecards.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Check className="w-5 h-5 text-zinc-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold">Cancel Anytime Policy</h4>
              <p className="text-3xs text-zinc-500 leading-relaxed mt-1">
                No contracts. Pause or cancel your subscription directly from your settings panel instantly with zero exit fees.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
