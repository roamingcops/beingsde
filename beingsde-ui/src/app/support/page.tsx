import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, BookOpen, CreditCard, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Support | beingsde",
  description: "Get help with your beingsde account, subscription, or learning questions.",
};

const topics = [
  {
    icon: BookOpen,
    title: "Content & Learning",
    description: "Questions about system design topics, difficulty levels, or content accuracy.",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Upgrade, downgrade, refund requests, or payment failures.",
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    description: "Trouble signing in, changing email, or securing your account.",
  },
  {
    icon: MessageSquare,
    title: "General Enquiries",
    description: "Partnerships, press, feature requests, or anything else.",
  },
];

const faqs = [
  {
    q: "How do I reset my password?",
    a: (
      <>
        Go to the{" "}
        <Link href="/forgot" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Forgot Password page
        </Link>
        , enter your registered email address, and we&apos;ll send you a reset link valid for 1 hour.
      </>
    ),
  },
  {
    q: "Can I try the platform before subscribing?",
    a: "Yes — the Free tier gives you access to a curated set of foundational topics with no time limit. Premium content (advanced HLD, LLD deep-dives, and mock interviews) requires a paid subscription.",
  },
  {
    q: "How do I get a refund?",
    a: (
      <>
        We offer a full refund within <strong>7 days</strong> of your initial subscription purchase.
        Please reach out via our contact channels with your registered email and order ID.
        Renewal charges are non-refundable per our{" "}
        <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Terms of Service
        </Link>.
      </>
    ),
  },
  {
    q: "How long does it take to get a response?",
    a: "We aim to respond to all support queries within 24 hours on business days (Mon–Fri, IST). Billing queries are typically resolved within 48 hours.",
  },
  {
    q: "I found an error in the content. How do I report it?",
    a: "We really appreciate that! Please reach out via our contact channels with the topic name and a description of the issue. Verified corrections receive a shoutout in our changelog.",
  },
  {
    q: "Is beingsde available as a mobile app?",
    a: "Not yet — but the web platform is fully responsive and works great on mobile browsers. A native app is on our roadmap.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col gap-12">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest font-mono text-zinc-400">Help Center</span>
        <h1 className="text-4xl font-black tracking-tight">Support</h1>
        <p className="text-sm text-zinc-500 max-w-xl">
          We&apos;re here to help. Browse the FAQs below or check back soon for our contact channels.
        </p>
      </div>

      {/* Contact cards — no emails yet */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Contact Us</h2>
          <span className="text-xs font-mono text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded-sm">
            Coming soon
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.title}
                className="flex flex-col gap-3 p-5 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-white dark:bg-[#18181b] opacity-60"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-sm">
                    <Icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <span className="text-sm font-semibold">{topic.title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {topic.description}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-zinc-400 italic">
          Dedicated support channels will be available soon. In the meantime, see the FAQs below.
        </p>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-bold tracking-tight">Frequently Asked Questions</h2>
        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-2 py-5 first:pt-0">
              <p className="text-sm font-semibold">{faq.q}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer nav */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex gap-6 text-xs text-zinc-400">
        <Link href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Terms of Service</Link>
      </div>
    </div>
  );
}
