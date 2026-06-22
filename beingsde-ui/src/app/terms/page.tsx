import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | beingsde.com",
  description: "Read the terms and conditions that govern your use of beingsde.com.",
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

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 flex flex-col gap-10">

      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest font-mono text-zinc-400">Legal</span>
        <h1 className="text-4xl font-black tracking-tight">Terms of Service</h1>
        <p className="text-sm text-zinc-500">
          Last updated: <strong>June 2026</strong>. Please read these terms carefully before using the platform.
        </p>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of <strong>beingsde.com</strong> (the
        &ldquo;Platform&rdquo;), operated by the beingsde team (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By creating an account or
        using the Platform, you agree to be bound by these Terms.
      </p>

      <Section title="1. Eligibility">
        <p>
          You must be at least 13 years old to use beingsde.com. By using the Platform you represent that
          you meet this requirement. If you are using the Platform on behalf of an organisation, you
          represent that you are authorised to bind that organisation to these Terms.
        </p>
      </Section>

      <Section title="2. Account Registration">
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li>You must provide accurate, current, and complete information during registration.</li>
          <li>You are responsible for maintaining the confidentiality of your credentials.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must notify us immediately at{" "}
            <a href="mailto:support@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              support@beingsde.com
            </a>{" "}if you suspect unauthorised access to your account.
          </li>
          <li>We reserve the right to terminate accounts that contain false information or that violate these Terms.</li>
        </ul>
      </Section>

      <Section title="3. Subscriptions & Payments">
        <p>
          beingsde.com offers free and paid subscription tiers. Paid features are available upon
          subscribing to a plan.
        </p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li>All payments are processed securely through <strong>Razorpay</strong>.</li>
          <li>Subscription fees are billed in advance on a monthly or annual basis depending on your chosen plan.</li>
          <li>Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes.</li>
          <li>
            <strong>Refund Policy:</strong> You may request a full refund within <strong>7 days</strong> of
            your initial subscription purchase if you are not satisfied. Renewals are non-refundable.
            To request a refund, contact{" "}
            <a href="mailto:billing@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              billing@beingsde.com
            </a>.
          </li>
          <li>We reserve the right to change pricing with 30 days&apos; notice. Price changes will not affect the current billing period of existing subscribers.</li>
        </ul>
      </Section>

      <Section title="4. Permitted Use">
        <p>You may use the Platform for personal, non-commercial learning purposes. You agree not to:</p>
        <ul className="list-disc list-inside flex flex-col gap-1.5 ml-2">
          <li>Copy, reproduce, redistribute, or resell any Platform content without prior written consent.</li>
          <li>Share your account credentials or subscription access with others.</li>
          <li>Attempt to reverse-engineer, scrape, or systematically download Platform content.</li>
          <li>Use the Platform to harass, threaten, or harm other users.</li>
          <li>Upload or transmit malicious code, spam, or unauthorised advertising.</li>
          <li>Circumvent any technical measures we use to enforce access controls.</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>
          All content on beingsde.com — including text, diagrams, code samples, illustrations, and system
          design exercises — is owned by or licensed to beingsde.com and is protected by copyright law.
        </p>
        <p>
          You are granted a limited, non-exclusive, non-transferable licence to access and use the content
          solely for your own personal learning. No content may be used in training AI models, published on
          other platforms, or otherwise exploited commercially without written permission.
        </p>
      </Section>

      <Section title="6. User-Generated Content">
        <p>
          If the Platform allows you to submit notes, comments, or other content, you retain ownership of
          that content. By submitting it, you grant us a worldwide, royalty-free licence to store, display,
          and use it to operate and improve the Platform. You are solely responsible for the accuracy and
          legality of content you submit.
        </p>
      </Section>

      <Section title="7. Disclaimers">
        <p>
          The Platform and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
          kind, express or implied. We do not guarantee that the Platform will be uninterrupted, error-free,
          or that the content will be accurate or up-to-date. System design concepts evolve rapidly;
          always cross-reference with official documentation.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>
          To the maximum extent permitted by applicable law, beingsde.com and its team members shall not
          be liable for any indirect, incidental, special, or consequential damages arising from your use
          of (or inability to use) the Platform, including loss of data, loss of earnings, or loss of
          business opportunities. Our total liability for any claim shall not exceed the amount you paid
          us in the 3 months preceding the claim.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws of India. Any disputes
          arising under these Terms shall be subject to the exclusive jurisdiction of the courts located
          in New Delhi, India.
        </p>
      </Section>

      <Section title="10. Changes to These Terms">
        <p>
          We may update these Terms from time to time. We will give registered users at least 14 days&apos;
          notice of material changes via email or an in-app notification. Continued use of the Platform
          after the effective date constitutes acceptance of the updated Terms.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Questions about these Terms? Contact us at{" "}
          <a href="mailto:legal@beingsde.com" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            legal@beingsde.com
          </a>{" "}
          or visit our{" "}
          <Link href="/support" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Support page
          </Link>.
        </p>
      </Section>

      {/* Footer nav */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex gap-6 text-xs text-zinc-400">
        <Link href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Privacy Policy</Link>
        <Link href="/support" className="underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">Support</Link>
      </div>
    </div>
  );
}
