import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | beingsde.com",
  description: "Learn how beingsde collects, uses, and protects your personal information.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-base font-bold tracking-tight border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
      {title}
    </h2>
    <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pl-3">
      {children}
    </div>
  </section>
);

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest font-mono text-zinc-400">Legal</span>
        <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-zinc-500">
          Last updated: <strong>June 2026</strong>. This policy explains how beingsde.com handles your data.
        </p>
      </div>

      {/* Intro */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        At <strong>beingsde.com</strong>, we take your privacy seriously. This Privacy Policy describes what
        information we collect, how we use it, and the choices you have regarding your data. By using our
        platform you agree to the practices described below.
      </p>

      <Section title="1. Information We Collect">
        <p>We collect the following categories of information when you use beingsde.com:</p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li><strong>Account data</strong> — your name, email address, and encrypted password when you register.</li>
          <li><strong>Usage data</strong> — pages visited, topics viewed, practice sessions completed, and time spent on the platform, collected automatically via server logs and analytics.</li>
          <li><strong>Payment data</strong> — billing information processed securely through Razorpay. We never store raw card numbers on our servers.</li>
          <li><strong>Technical data</strong> — IP address, browser type, device information, and cookies necessary for authentication and performance.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li>To provide, operate, and improve the beingsde learning platform.</li>
          <li>To authenticate you and keep your account secure.</li>
          <li>To process subscription payments and send billing receipts.</li>
          <li>To send transactional emails (e.g., email verification, password reset). We do not send marketing emails without your consent.</li>
          <li>To analyse aggregated usage patterns and improve our content catalogue.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </Section>

      <Section title="3. Cookies & Tracking">
        <p>
          We use strictly necessary cookies for session management and JWT-based authentication. We do not
          use third-party advertising cookies. You can disable cookies in your browser settings, but some
          features (such as staying logged in) will not work without them.
        </p>
      </Section>

      <Section title="4. Data Sharing">
        <p>We do not sell, rent, or trade your personal information. We share data only with:</p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li><strong>Razorpay</strong> — for payment processing, subject to their own Privacy Policy.</li>
          <li><strong>MongoDB Atlas</strong> — as our database provider, hosting data in secure cloud infrastructure.</li>
          <li><strong>Law enforcement</strong> — when required by applicable law or valid legal process.</li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        <p>
          We retain your account data for as long as your account is active. If you delete your account,
          we will purge your personal data within 30 days, except where retention is required by law
          (e.g., payment records for 7 years under Indian GST regulations).
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          All passwords are stored as BCrypt hashes — we never store plain-text passwords. Data in transit
          is protected by TLS/HTTPS. We conduct regular security reviews of our infrastructure.
          Despite these measures, no system is 100% secure; please use a strong unique password and
          keep your credentials confidential.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li>Access a copy of the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Object to or restrict certain processing activities.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:privacy@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            privacy@beingsde.com
          </a>.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          beingsde.com is not directed at children under 13 years of age. We do not knowingly collect
          personal information from children. If you believe a child has provided us with personal data,
          please contact us immediately and we will delete it.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify registered users of material
          changes via email or an in-app notification at least 14 days before they take effect.
          Continued use of the platform after that date constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section title="10. Contact Us">
        <p>
          If you have questions or concerns about this Privacy Policy, please reach out to us at{" "}
          <a href="mailto:privacy@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            privacy@beingsde.com
          </a>{" "}
          or visit our{" "}
          <Link href="/support" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Support page
          </Link>.
        </p>
      </Section>

      {/* Footer nav */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex gap-6 text-xs text-zinc-400">
        <Link href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Terms of Service</Link>
        <Link href="/support" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Support</Link>
      </div>
    </div>
  );
}
