import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Clock, HelpCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Being SDE — Get in Touch",
  description: "Contact the Being SDE (beingsde.in) team for editorial feedback, support, subscription assistance, partnerships, or technical inquiries.",
  alternates: {
    canonical: "https://beingsde.in/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-12">
      {/* Schema.org JSON-LD ContactPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Being SDE",
            "url": "https://beingsde.in/contact",
            "description": "Get in touch with the Being SDE support and editorial team.",
            "mainEntity": {
              "@type": "Organization",
              "name": "Being SDE",
              "email": "support.beingsde@gmail.com",
              "url": "https://beingsde.in"
            }
          }),
        }}
      />

      {/* HEADER SECTION */}
      <section className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest font-mono text-zinc-400">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Contact Being SDE
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
          Have a question about our system design curriculum, billing, content suggestions, or partnership opportunities? We&apos;d love to hear from you.
        </p>
      </section>

      {/* CONTACT INFO GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-3">
          <div className="p-2.5 w-fit rounded-sm bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">Email Support</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            For general inquiries, billing help, and feedback:
          </p>
          <a
            href="mailto:support.beingsde@gmail.com"
            className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            support.beingsde@gmail.com
          </a>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-3">
          <div className="p-2.5 w-fit rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">Response Time</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Our team responds to all inquiries within <strong>24 to 48 business hours</strong> (Monday–Friday, 9:00 AM – 6:00 PM IST).
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-3">
          <div className="p-2.5 w-fit rounded-sm bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-900">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">Operating Region</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Being SDE Education Platform<br />
            Bengaluru, Karnataka, India<br />
            Website: <strong>beingsde.in</strong>
          </p>
        </div>

      </section>

      {/* FORM & FAQ SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form Client Component */}
        <div className="lg:col-span-7 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">Send Us a Message</h2>
            <p className="text-xs text-zinc-500">Fill out the form below and our team will get back to you.</p>
          </div>

          <ContactForm />
        </div>

        {/* Quick Links & FAQ Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4">
            <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zinc-400" /> Frequently Asked
            </h3>
            
            <div className="text-xs space-y-3 text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-200">How do I cancel my subscription?</p>
                <p className="mt-0.5">Visit the <Link href="/subscriptions" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">Subscriptions page</Link> to cancel anytime with one click.</p>
              </div>

              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-200">Looking for self-service support?</p>
                <p className="mt-0.5">Check out our <Link href="/support" className="underline hover:text-zinc-900 dark:hover:text-zinc-100">Support Help Center</Link> for common FAQs.</p>
              </div>

              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-200">Want to check our legal policies?</p>
                <p className="mt-0.5">Read our <Link href="/privacy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms of Service</Link>.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
