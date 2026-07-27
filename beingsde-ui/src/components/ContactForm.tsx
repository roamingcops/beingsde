"use client";

import React, { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 rounded-sm text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">Thank You!</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Your message has been received. Our team will review your inquiry and respond within 24–48 hours at your provided email address.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-2xs font-semibold font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 underline hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono font-semibold uppercase text-zinc-600 dark:text-zinc-400">Your Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Alex Rivera"
            className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 rounded-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono font-semibold uppercase text-zinc-600 dark:text-zinc-400">Email Address *</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 rounded-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-semibold uppercase text-zinc-600 dark:text-zinc-400">Subject *</label>
        <select className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 rounded-sm">
          <option value="general">General Inquiry</option>
          <option value="billing">Subscription & Billing</option>
          <option value="content">Content Correction / Feedback</option>
          <option value="press">Press & Media</option>
          <option value="privacy">Privacy & Account Rights</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-semibold uppercase text-zinc-600 dark:text-zinc-400">Message *</label>
        <textarea
          rows={5}
          required
          placeholder="How can we help you?"
          className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 rounded-sm resize-y"
        />
      </div>

      <button
        type="submit"
        className="text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 rounded-sm cursor-pointer"
      >
        <Send className="w-4 h-4" /> Send Message
      </button>
    </form>
  );
}
