import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Clock, BookOpen, CreditCard, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Support | beingsde.com",
  description: "Get help with your beingsde account, subscription, or learning questions.",
};

const topics = [
  {
    icon: BookOpen,
    title: "Content & Learning",
    description: "Questions about system design topics, difficulty levels, or content accuracy.",
    email: "content@beingsde.com",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Upgrade, downgrade, refund requests, or payment failures.",
    email: "billing@beingsde.com",
  },
  {
    icon: ShieldCheck,
    title: "Account & Security",
    description: "Trouble signing in, changing email, or securing your account.",
    email: "support@beingsde.com",
  },
  {
    icon: MessageSquare,
    title: "General Enquiries",
    description: "Partnerships, press, feature requests, or anything else.",
    email: "hello@beingsde.com",
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
        We offer a full refund within <strong>7 days</strong> of your initial subscription purchase. Email{" "}
        <a href="mailto:billing@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          billing@beingsde.com
        </a>{" "}
        with your registered email and order ID. Renewal charges are non-refundable per our{" "}
        <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Terms of Service
        </Link>.
      </>
    ),
  },
  {
    q: "How long does it take to get a response?",
    a: "We aim to respond to all support emails within 24 hours on business days (Mon–Fri, IST). Billing queries are typically resolved within 48 hours.",
  },
  {
    q: "I found an error in the content. How do I report it?",
    a: (
      <>
        We really appreciate that! Email{" "}
        <a href="mailto:content@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          content@beingsde.com
        </a>{" "}
        with the topic name and a description of the issue. Verified corrections receive a shoutout in our changelog.
      </>
    ),
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
          We&apos;re here to help. Browse the FAQs below or reach out to the right team directly.
        </p>
      </div>

      {/* Contact cards */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold tracking-tight">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <a
                key={topic.email}
                href={`mailto:${topic.email}`}
                className="group flex flex-col gap-3 p-5 border border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 rounded-sm transition-colors">
                    <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <span className="text-sm font-semibold">{topic.title}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {topic.description}
                </p>
                <span className="text-xs font-mono text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 underline transition-colors">
                  {topic.email}
                </span>
              </a>
            );
          })}
        </div>

        {/* Response time badge */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
          <Clock className="w-3.5 h-3.5" />
          <span>We typically respond within <strong className="text-zinc-600 dark:text-zinc-300">24 hours</strong> on business days (Mon–Fri, IST).</span>
        </div>
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

      {/* Direct email CTA */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#18181b]">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">Still need help?</p>
          <p className="text-xs text-zinc-500">Drop us an email and we&apos;ll get back to you personally.</p>
        </div>
        <a
          href="mailto:support@beingsde.com"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-5 py-2.5 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          Email Support
        </a>
      </div>

      {/* Footer nav */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex gap-6 text-xs text-zinc-400">
        <Link href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Terms of Service</Link>
      </div>
    </div>
  );
}
