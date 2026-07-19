"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Shield,
  Trophy,
  BookOpen,
  Star,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Brain,
  Users,
} from "lucide-react";

type Level = "SDE1" | "SDE2" | "SDE3" | "Principal";
type Category =
  | "Ownership"
  | "Conflict"
  | "Delivery"
  | "Ambiguity"
  | "Technical Leadership"
  | "Customer Obsession";

interface LevelAnswer {
  level: Level;
  focus: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyTakeaway: string;
}

interface BarRaiserQuestion {
  id: number;
  title: string;
  category: Category;
  principle: string;
  why: string;
  redFlags: string[];
  greenFlags: string[];
  levels: LevelAnswer[];
}

const LEVEL_CONFIG: Record<Level, { label: string; color: string; bg: string; border: string; badge: string }> = {
  SDE1: {
    label: "SDE 1 · Junior Engineer",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  SDE2: {
    label: "SDE 2 · Mid-Level Engineer",
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    badge: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  },
  SDE3: {
    label: "SDE 3 · Senior Engineer",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  },
  Principal: {
    label: "Principal Engineer",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; bg: string }> = {
  Ownership: { icon: Shield, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
  Conflict: { icon: MessageSquare, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" },
  Delivery: { icon: Zap, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/30" },
  Ambiguity: { icon: Brain, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
  "Technical Leadership": { icon: BarChart3, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  "Customer Obsession": { icon: Target, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/30" },
};

const questions: BarRaiserQuestion[] = [
  {
    id: 1,
    title: "Tell me about a time you fundamentally disagreed with a senior engineer or manager on a technical design. How did you handle it?",
    category: "Conflict",
    principle: "Have Backbone; Disagree and Commit",
    why: "Bar Raisers want to see that you will speak up when something is wrong, even to authority figures, AND that you can do so with data and respect — not ego. They also want to see that you will fully commit once a decision is made, even if it is not yours.",
    redFlags: [
      "Just went along with the decision to avoid conflict",
      "Went over the manager's head directly to escalate politically",
      "Held a grudge after losing the argument",
      "Could not describe WHY you disagreed — opinion vs. data",
    ],
    greenFlags: [
      "Used data, prototypes, or documented risk analysis to make the case",
      "Focused on the technical merit of the idea, not personal credit",
      "Committed fully to the team's final decision even when overruled",
      "Described the outcome and what you learned",
    ],
    levels: [
      {
        level: "SDE1",
        focus: "Respectfully raising a concern with data, and committing to the team decision",
        situation: "My team was building a new internal analytics dashboard. The Senior Engineer insisted on using Redux for state management because it was the company standard. As a fresh hire learning React, I could see that Redux was extremely heavy and complex for this particular use case — a read-only dashboard that only fetched and displayed metrics.",
        task: "I needed to propose React Query as a simpler alternative without coming across as arrogant or dismissive of the senior engineer's experience. The risk was being seen as a junior engineer overstepping or ignoring established team standards.",
        action: "Instead of voicing an opinion in standup, I dedicated my weekend to building a side-by-side proof-of-concept. The Redux version required 340 lines of boilerplate (actions, reducers, selectors, middleware). My React Query implementation achieved the exact same functionality in 80 lines. I quantified the bundle size increase Redux added (42KB gzipped). I scheduled a 1-on-1 with the Senior Engineer and presented both POCs, framing it as: 'I might be missing context on why we need Redux here — can you help me understand? And here is what I built to compare.' I made clear I would fully commit to whichever approach we chose.",
        result: "The Senior Engineer reviewed both POCs and agreed React Query was a better fit for this specific dashboard. We adopted it and the entire dashboard feature was delivered 20% faster with significantly less code. That senior engineer later became a mentor and told me he respected that I came with data, not just an opinion. Lesson: you earn the right to disagree by doing the work first.",
        keyTakeaway: "Data and prototypes beat opinions every time. Respect the process, not just the outcome you want.",
      },
      {
        level: "SDE2",
        focus: "Pushing back on product requirements that would create a technical time bomb",
        situation: "Our product manager wanted to launch an ML-powered recommendation feed in two weeks to beat a competitor to market. The proposed design was a direct synchronous HTTP call from our Node.js API to an ML inference service. I had profiled that service — its P99 latency was 1.8 seconds and our API SLA was 200ms. If the ML service had any hiccup, our entire user feed would return 504 Gateway Timeouts.",
        task: "My manager was fully aligned with the PM — the deadline was the top priority. I had to convince both of them (one technical, one non-technical) to accept a slightly different approach without killing the deadline. The stakes were high — we were approaching a Series B announcement.",
        action: "I wrote a 1-page Technical Risk Brief. It had one graph showing the ML service's P99 latency over the past 30 days — it had spiked to 4.5 seconds twice. I calculated: 'If the ML service goes down for 5 minutes, 100% of feed requests will return errors. Our Series B investor demo is in 3 weeks.' I then proposed a specific compromise: launch in two weeks, but I implement a Circuit Breaker Pattern. The feed first tries the ML service with a 200ms timeout, and if it fails, falls back to pre-computed cached recommendations updated hourly. I offered to implement the circuit breaker myself over the weekend at no delay to the launch.",
        result: "The PM and manager agreed. We launched on schedule. Eleven days after launch, the ML service experienced a GCP zone outage for 22 minutes. Our circuit breaker fired automatically. Zero user-facing errors were served. The PM personally thanked me. I later made the circuit breaker pattern a mandatory requirement in our API design checklist.",
        keyTakeaway: "Quantify the risk in business terms. Always give decision-makers a clear path forward — not just a warning.",
      },
      {
        level: "SDE3",
        focus: "Navigating cross-team architectural conflict with political stakes",
        situation: "We were migrating from a monolith to microservices over 18 months. The Staff Engineer from the Platform team, who had significant political capital and was close to the VP of Engineering, mandated that all new microservices share a single centralized distributed PostgreSQL cluster to reduce costs. I recognized this as the 'shared database anti-pattern' — it creates tight coupling between supposedly independent services and introduces noisy-neighbor failures.",
        task: "Pushing back on a Staff Engineer's mandate as a Senior Engineer requires careful navigation. Being right is not enough — I needed to make the case without creating an adversarial relationship that could damage my team's ability to get infrastructure support. My team was dependent on the Platform team for provisioning.",
        action: "I requested to present at the next Architecture Review Board. I didn't attack the idea — I brought a third-party case study. I researched a public post-mortem from Shopify where a shared database caused a cascading failure that took down checkout for 40 minutes because a marketing job ran a massive full-table scan. I reframed my concern: 'This design creates a blast radius problem, not just a cost problem.' I then proposed a middle ground: logically separated schemas on the same physical PostgreSQL cluster. Each microservice gets its own schema with its own credentials and Row Level Security policies but runs on the same hardware. Full data isolation, low operational overhead.",
        result: "The Staff Engineer agreed to the logical separation after reviewing the Shopify case study. Six months later, the Marketing team ran a poorly-indexed batch query that pegged database CPU at 95% for 8 minutes. Because of the logical isolation, the Payment service's connection pool was completely unaffected. I sent the Platform Staff Engineer a Slack message thanking him for agreeing to the compromise. That goodwill was banked for future technical debates.",
        keyTakeaway: "Third-party post-mortems from public companies are extremely powerful in technical debates. They remove the personal element completely.",
      },
      {
        level: "Principal",
        focus: "Stopping a company-defining technical decision that would have caused catastrophe",
        situation: "The VP of Engineering, driven by investor pressure to modernize, announced a full rewrite of our legacy Java billing system in Go. He had already gotten board approval, allocated 20 senior engineers, and set a 12-month timeline. The billing system processed $80M in annual recurring revenue. The legacy system was messy but worked. A full rewrite at this scale and timeline was, in my assessment, a near-certain failure — Second System Syndrome had claimed dozens of rewrites at our scale.",
        task: "This was not just a technical decision — it was a board-approved initiative with the VP's personal credibility attached. I had to present an alternative without making the VP feel ambushed. The cost of being wrong about the rewrite (missing a migration deadline while the legacy system continued to deteriorate) was enormous.",
        action: "I spent two weeks doing a deep profiling of the legacy system before saying anything. I discovered 80% of the latency came from a single database table: the ledger_entries table had 400M rows, no partitioning, and was experiencing lock contention because both reads (balance calculations) and writes (new transactions) were hitting the same B-Tree index. This was a solvable problem — not a language problem. I requested a private 30-minute session with the VP. I showed him the profiling data. Then I presented the Strangler Fig alternative: instead of rewriting 300,000 lines of billing logic, carve out only the high-contention ledger component into a new Go service backed by an append-only event log (Kafka + time-series optimized table). The legacy Java system reads from a replica. Two-slide comparison: Rewrite (12 months, 20 engineers, 100% feature freeze, high failure risk) vs. Strangler Fig (3 months, 4 engineers, no feature freeze, low risk).",
        result: "The VP agreed to pause the rewrite and greenlight the Strangler Fig. A team of 4 engineers, including me, extracted the ledger service in 11 weeks. Transaction throughput increased from 800 TPS to 9,200 TPS. P99 latency dropped from 1.8 seconds to 45ms. We saved approximately $2.4M in engineering costs and avoided what I am confident would have been a failed rewrite. The VP publicly cited this as a model for incremental modernization in his next board presentation.",
        keyTakeaway: "Always bring a quantified alternative to a fight. Never just say no. The most powerful engineering leadership moment is turning a yes to the wrong thing into a yes to the right thing.",
      },
    ],
  },
  {
    id: 2,
    title: "Tell me about the most complex technical problem or operational crisis you have ever had to resolve.",
    category: "Ownership",
    principle: "Ownership · Dive Deep · Bias for Action",
    why: "This question tests whether you can hold the full complexity of a production system in your head, stay calm under pressure, lead others, and drive to the root cause rather than treating symptoms. Bar Raisers look for methodical debugging, not lucky guessing.",
    redFlags: [
      "Blamed a third-party service or teammate without owning the overall resolution",
      "Could not describe the root cause — only the symptoms",
      "Fixed the symptom but not the root cause",
      "Did not add monitoring or a runbook after the incident",
    ],
    greenFlags: [
      "Described a structured debugging methodology — eliminated hypotheses one by one",
      "Showed deep technical depth: logs, profiling tools, network analysis",
      "Led cross-team coordination during the incident",
      "Fixed the root cause AND added prevention measures after the fact",
    ],
    levels: [
      {
        level: "SDE1",
        focus: "Persistence, knowing when to ask for help, building debugging instincts",
        situation: "Users started filing support tickets saying their profile photos were randomly disappearing — they would upload a photo, see it for a few minutes, and then it would vanish. The bug was intermittent. Refreshing the page sometimes brought the photo back. It worked perfectly 100% of the time on my local machine and on staging.",
        task: "I was assigned this ticket as the most junior engineer on the team with no prior experience with AWS S3, presigned URLs, or network-level debugging. The pressure was high because the CEO had received a complaint from an enterprise customer.",
        action: "I started with obvious things — cleared local cache, tested on different browsers. All fine. I pulled the production logs and found 403 Forbidden errors returning from S3 on image URL fetches, but only intermittently. The URLs looked structurally identical. I searched 'S3 403 Forbidden intermittent' and found a Stack Overflow answer about presigned URL expiration and clock skew. I ran `date` on the production server — it was 14 minutes behind UTC. The presigned URLs we generated were immediately considered expired by S3 because our server clock was wrong. I did not know how to fix a server clock, so I immediately asked my senior engineer. He taught me how to verify with NTP and wrote the Ansible playbook to enable NTP syncing across all servers. I watched every step and took detailed notes.",
        result: "The 403 errors stopped within minutes of NTP syncing. Zero recurrences. I wrote the post-mortem and added an 'AWS S3 403 Debugging Checklist' runbook to our team wiki. I also added a production monitoring alert that fires if any server's clock drifts more than 30 seconds. I learned more about debugging production systems in that one week than in the previous three months combined.",
        keyTakeaway: "Know the limits of your knowledge. Asking for help quickly, after genuinely trying, is a sign of strength. And always start with the logs — not your localhost.",
      },
      {
        level: "SDE2",
        focus: "Eliminating race conditions in a live payment system under extreme pressure",
        situation: "During a high-traffic Black Friday flash sale, customer support escalated urgently: several customers had been double-charged. Amounts ranged from $49 to $499. This was a P0 incident — real money was incorrectly leaving real people's bank accounts in real time.",
        task: "As the on-call engineer I had to simultaneously stop the bleeding, find the root cause in a codebase I had only partially owned, and coordinate with Legal and Finance who were being pulled into the incident.",
        action: "Step 1 — Stop the bleeding immediately: I put the payment endpoint behind a maintenance mode feature flag, serving a user-friendly error and stopping all new transactions while I investigated. Step 2 — Find the root cause: I pulled logs for all double-charged transactions. They all shared one pattern: two requests with the same orderId were processed within 300ms of each other. This was a classic TOCTOU (Time of Check vs. Time of Use) race condition. Our backend did SELECT then INSERT: check if payment exists, then if not found, create one. Two concurrent requests both saw 'no payment' and both proceeded to charge. Step 3 — Immediate fix (20 minutes): I added a unique database constraint on (orderId, status='completed'). Now duplicate inserts fail with an integrity error instead of succeeding. Step 4 — Proper fix (next day): I rewrote the payment logic using optimistic locking: UPDATE payments SET status='completed' WHERE orderId=? AND status='pending'. If zero rows are updated, another thread got there first.",
        result: "Double charges stopped immediately. Seven affected customers received full refunds the same day. Finance confirmed zero further incidents over the next six months of sales events. I added a concurrent integration test that spawns 50 simultaneous threads all attempting to pay for the same order — our new logic correctly processed exactly one payment and gracefully rejected the other 49.",
        keyTakeaway: "P0 incidents require two separate fixes: an immediate mitigation (often imperfect) and a proper root-cause fix. Do both and never conflate them.",
      },
      {
        level: "SDE3",
        focus: "Diagnosing a memory leak in a distributed Node.js production cluster with no logs",
        situation: "Our main Node.js API cluster (12 pods in Kubernetes, handling 40,000 RPM) experienced Out of Memory crashes every 12–14 hours like clockwork. Pods consumed memory steadily from 300MB to the 1.5GB container limit, then crashed. Kubernetes restarted them and the cycle repeated. The crashes happened at random times of day, ruling out a specific traffic spike. Standard APM tools showed memory growing but could not identify which objects were accumulating.",
        task: "I owned the API platform. The leaky service was our critical API gateway handling all client traffic. The leak existed in a Node.js process running 200+ npm packages — any one could be the culprit. Standard heap profiling via Node.js --inspect could not run on a live production pod without significant overhead.",
        action: "I devised a forensic investigation plan: First, I deployed a single canary pod with --expose-gc and a custom /admin/heapdump endpoint that wrote heap snapshots to S3 when called. Second, I wrote a cron job that called this endpoint every two hours and compared heap summaries to the previous snapshot. Third, after six hours I had three heap snapshots showing a clear trend: the Closure object count was growing from 12,000 to 180,000. Fourth, I loaded the heap snapshots into Chrome DevTools. The retained path for the closures all pointed to: AxiosInstance → interceptors → fulfilled. Fifth, I traced this to axios-retry, a library we had upgraded three weeks earlier — exactly when the crashes started. The new version was calling axios.interceptors.request.use() on every instantiation without a corresponding eject(). Each API request added a new interceptor to the global Axios instance, and interceptors are closures that hold references to the entire request context. Sixth, I wrote a patch: after each request, call axios.interceptors.request.eject(interceptorId) and submitted a PR upstream.",
        result: "Memory growth stopped completely. Pods ran stable for 30+ days with flat memory usage. My fix was merged into the open-source axios-retry repository. I documented the heap-dump debugging technique in our runbooks as the official playbook for all Node.js memory investigations. I also added a Kubernetes alert that fires when any pod's memory growth rate exceeds 10MB/hour consistently.",
        keyTakeaway: "Memory leaks require forensic tooling, not guesswork. Build your debugging infrastructure first, then investigate. The timestamp of a dependency upgrade is often your first clue.",
      },
      {
        level: "Principal",
        focus: "Diagnosing a TCP network-layer ghost that no application log could capture",
        situation: "A Fortune 500 enterprise client contributing $4.2M ARR reported random 502 Bad Gateway errors 3–4 times per week, each lasting 2–8 minutes. Our backend services showed 200 OK in every application log. Our load balancers showed no errors. Our database showed no issues. To every monitoring tool we had, the system was completely healthy — yet real users were getting 502s that we could reproduce with a script. The client's CTO had sent a legal notice citing our SLA contract.",
        task: "I needed to find the root cause across a stack that spanned the client's corporate proxy, our Cloudflare WAF, our AWS Network Load Balancer, our Kubernetes NGINX Ingress, and our application pods. The error was intermittent and seemingly random. Because all application logs showed 200 OK, I concluded the error was occurring at the network layer — below Layer 7 where application logs live.",
        action: "I deployed tcpdump sidecars to our NGINX Ingress pods using a privileged DaemonSet to capture raw TCP packets. I replicated the client's conditions by setting up an identical proxy configuration in our testing environment. After 48 hours, I had captured several 502 occurrences in the PCAP files. I analyzed the PCAP in Wireshark. The pattern was unmistakable: the 502s occurred when the client's HTTP/1.1 Keep-Alive connection was being reused AFTER our AWS Network Load Balancer had silently closed it. The NLB has a default idle connection timeout of 60 seconds — if no data is sent for 60 seconds, the NLB closes the connection silently with a RST packet sent only to our backend, not the client. The client's proxy was configured with a 90-second Keep-Alive timeout, so it believed the connection was still valid and reused it to send a new request. The NLB received this request on a dead connection and returned 502. Fix: I updated our NGINX Ingress to set keepalive_timeout 50s (just under the NLB's 60s timeout), ensuring our backend always closes the connection before the NLB does. I also enabled TCP Keepalive probes on the NLB using its target group settings.",
        result: "The 502 errors dropped to zero permanently. The client's CTO sent a personal email thanking us. I wrote an engineering blog post titled 'TCP Keep-Alive: The Ghost in the Network Stack' that was shared widely on Hacker News and became a reference document for our networking team's onboarding. I built a production network diagnostic runbook that is now standard procedure for all P0 investigations.",
        keyTakeaway: "When application logs say all is healthy but users see errors, drop down to the network layer. TCP is where many phantom bugs live — and you need tcpdump to see them.",
      },
    ],
  },
  {
    id: 3,
    title: "Describe a time you had to deliver a project under an impossibly tight deadline or significant constraints. What trade-offs did you make?",
    category: "Delivery",
    principle: "Bias for Action · Deliver Results · Frugality",
    why: "This question reveals how you think about prioritization, scope negotiation, and managing technical debt intentionally. Bar Raisers want to see that you can ship under pressure WITHOUT creating hidden landmines — and that your trade-offs were conscious and documented, not just corners cut blindly.",
    redFlags: [
      "Cut quality silently without communicating the technical debt being created",
      "Missed the deadline AND created technical debt at the same time",
      "Could not articulate why you made each specific trade-off",
      "Did not follow up on the technical debt after the deadline passed",
    ],
    greenFlags: [
      "Negotiated scope with data rather than simply accepting an impossible deadline",
      "Made trade-offs explicitly visible to all stakeholders before building",
      "Immediately created documented tech debt tickets for everything deferred",
      "Shipped on time and then paid back the debt in the next sprint",
    ],
    levels: [
      {
        level: "SDE1",
        focus: "Making explicit trade-offs and communicating them clearly to the team",
        situation: "My team needed to ship a Black Friday promotional banner across all 14 pages of our e-commerce site. The deadline was 48 hours — the event was live. The correct engineering approach was to refactor our shared Header component, which was CSS-spaghetti accumulated over four years of hacks, to properly support promotional banners. That refactor would take five days.",
        task: "I needed to ship the banner in 48 hours without the refactor. My risk was that a quick fix might introduce CSS specificity bugs that would break the existing header layout on some pages.",
        action: "I told my tech lead my plan before writing a single line of code: I would use CSS Modules scoped specifically to the new banner component so its styles could not leak into the existing header CSS at all. This approach was safe and isolated. I asked my tech lead to review the 10-minute plan before I started — he approved it. I got the implementation done in 6 hours. I immediately created a Jira ticket: [TECH DEBT] Refactor Header component to support promotional components natively, with a detailed description of why we could not do it properly this time and a link to the PR. I placed it in the next sprint.",
        result: "The banner shipped on time, worked across all 14 pages, and drove a 12% increase in promotional click-through. Two sprints later I picked up the tech debt ticket, spent four days doing the proper header refactor, and the next promotional campaign took only 2 hours to implement. My tech lead used my tech debt ticket as an example of how to handle deadline-driven debt correctly in our next team retrospective.",
        keyTakeaway: "Technical debt is acceptable when it is intentional, documented, and scheduled for payback. Invisible technical debt is malpractice.",
      },
      {
        level: "SDE2",
        focus: "Scope negotiation to deliver on time without creating a scaling time bomb",
        situation: "Our growth team requested a User Data Export feature for GDPR compliance — users needed to download all their data as a ZIP file. The PM wanted it in one week. I did the math: our largest users had up to 2GB of data across six database tables plus S3 files. A synchronous API call to generate and serve a 2GB ZIP would timeout after 30 seconds for large users and potentially crash the API server from memory pressure. The right solution was an asynchronous job queue, S3 presigned download URL, and email notification system — a four-week project.",
        task: "The PM was immovable on the one-week deadline because of a scheduled GDPR audit. I had to find an approach that was technically safe, deliverable in a week, and covered the real compliance requirement — not the theoretical extreme case.",
        action: "I brought the PM a specific scope negotiation backed by data: exports are limited to the last 12 months of activity (our legal team confirmed this covers 99% of GDPR requests), and we implement it as an async job using our existing PostgreSQL as a job store (a status column and a cron job) rather than setting up RabbitMQ from scratch. I showed the PM: only 0.3% of users had more than 12 months of active history. I promised that if the approach hit scaling limits in six months, I would personally lead the proper migration. Both constraints were documented in the ticket.",
        result: "We shipped in six days. The PostgreSQL-based async approach handled 100% of GDPR export requests for the next eight months without a single failure. By then, user growth had 5x'd and I led the proper Celery migration as promised. The PM cited this scope negotiation as an example of great engineering partnership in my performance review.",
        keyTakeaway: "Scope negotiation is an engineering skill. Know what 99% of users actually need and build that — not the hypothetical extreme edge case.",
      },
      {
        level: "SDE3",
        focus: "Leading a cross-team technical migration under a contractual M&A hard deadline",
        situation: "Our startup was acquired by a large public company. A hard contractual requirement stated that our user authentication must be integrated with the acquirer's Okta-based SAML SSO within 90 days of deal close, or employee acquisition bonus payments would be delayed. Our monolith had authentication logic scattered across 47 different API routes in six microservices, each with its own session management code. Properly refactoring all 47 routes to be SSO-aware would take six months minimum.",
        task: "As Engineering Lead for the integration I had three engineers, 90 days, and an outcome that directly affected my colleagues' financial compensation. The pressure was enormous and the scope was intractable via normal means.",
        action: "I recognized that touching 47 routes across six services in 90 days was not achievable without unacceptable quality risk. Instead I proposed an Auth Proxy architectural pattern: build a single new service that sits in front of all existing services, validates incoming Okta SAML tokens, translates them into our existing legacy JWT format, and forwards requests downstream as if they had been natively authenticated. None of our 47 existing routes needed to change a single line of code. I personally built the Auth Proxy in three weeks. The other two engineers spent the remaining six weeks on comprehensive E2E testing across every service and on Okta configuration. I explicitly documented the trade-offs in writing: the Auth Proxy is a single point of failure (mitigated with a standby replica and health checks), and two token formats now exist in circulation (with a 12-month plan to migrate all services to native SAML documented and committed to).",
        result: "We integrated with SSO in 61 days — 29 days ahead of the deadline. All employee acquisition bonus payments were processed on time. The Auth Proxy handled 100% of traffic without incident for 14 months, during which all six microservices were gradually migrated to native SSO support. The acquirer's engineering team adopted the Auth Proxy pattern for two other acquired companies.",
        keyTakeaway: "The best architecture for an impossible deadline is often a thin adapter layer that changes nothing downstream. Identify what must change vs. what can safely be wrapped.",
      },
      {
        level: "Principal",
        focus: "Architecting continent-scale data residency in 6 months without a multi-year rewrite",
        situation: "The company's go-to-market team identified a $50M ARR opportunity in the EU market. GDPR Article 46 required all EU user data to be physically stored and processed within the EU. Our architecture stored all data in a single globally-replicated US-East PostgreSQL cluster. Every data model, ORM query, and business logic layer assumed a single global database. A clean implementation of data residency would require rewriting the entire data layer — an estimated 18–24 month project. The EU launch window was six months.",
        task: "I was asked by the CTO to lead the architecture for EU data residency. Failing to launch in six months meant losing the market opportunity to a competitor. A rushed, poorly-designed implementation could mean a GDPR fine of up to 4% of annual global revenue.",
        action: "I identified that the core constraint was not the application code — it was data gravity. My design had four components: First, deploy a complete cell of our application stack in EU-West-1 in Ireland: separate RDS, separate app servers, separate S3 buckets. EU user data would never leave this cell. Second, maintain a small globally-replicated Control Plane database using DynamoDB Global Tables that stored only a user email-to-region mapping (US or EU). This held zero PII — purely a routing registry. Third, deploy Cloudflare Workers at the DNS edge. On every request, the Worker looks up the user's region from the Control Plane via DynamoDB DAX in under 5ms, then routes to either the US or EU cell. Application code was completely unchanged. Fourth, for the 3% of users with activity in both regions before the cutoff, we ran a one-time migration job that asked users to choose their primary region and moved their data. I explicitly documented accepted trade-offs: no cross-region friend features between EU and US users (acceptable per product requirements), 5–12ms of added routing latency (acceptable per SLA), and ongoing operational duplication cost for the EU cell (accepted as cost of business).",
        result: "EU launched in five months and three weeks — five days ahead of schedule. The architecture passed GDPR certification on the first audit with zero findings. The EU cell generated $8.7M ARR in its first 12 months. The Cell-Based Architecture became the company's standard global expansion playbook — we used the same pattern to launch in APAC nine months later. I was invited to present this architecture at AWS re:Invent the following year.",
        keyTakeaway: "Isolate the constraint and build around it. The impossible problem is often only impossible if you try to solve it the clean way. The elegant solution is the one you can actually ship.",
      },
    ],
  },
  {
    id: 4,
    title: "Tell me about a time you identified a major risk or problem before it became a crisis, and what you did about it.",
    category: "Ownership",
    principle: "Ownership · Invent and Simplify · Are Right, A Lot",
    why: "Bar Raisers are looking for engineers who act like owners of the entire system, not just their assigned ticket. This question identifies whether you proactively look for risks in things you do not directly own — and whether you do something about it even when it is not your job.",
    redFlags: [
      "Only noticed risks in systems you directly owned",
      "Identified the risk but waited for someone else to act on it",
      "Raised the concern once and dropped it when not immediately acted on",
      "Could not quantify the potential blast radius of the risk",
    ],
    greenFlags: [
      "Proactively audited a system you did not own",
      "Quantified the potential impact in dollars, users affected, or downtime",
      "Created an action plan, not just a warning or concern",
      "Persisted in raising the risk even when initially dismissed",
    ],
    levels: [
      {
        level: "SDE1",
        focus: "Noticing a data exposure risk in a code review and flagging it with specificity",
        situation: "I was casually cc'd on a PR for a new notification email feature. The PR looked correct at first glance, but I noticed the email template was loading a user's full profile object — including their hashed password, 2FA secret key, and all PII — into memory to personalize the email, even though it only used the user's first name and email address.",
        task: "This was not my PR to review and I had no authority to block it. But loading unnecessary sensitive data through memory creates a risk if there is ever a logging mistake — for example if the object accidentally gets serialized to a log line.",
        action: "I left a specific code review comment with a concrete proposal: 'This loads the full User entity but only uses user.firstName and user.email. Could we use a UserEmailDTO projection instead? This would prevent accidentally exposing passwordHash or totpSecret in future log statements or error traces.' I linked to a recent public post-mortem from another company where a similar pattern had led to credential exposure in Splunk logs.",
        result: "The PR author changed to a DTO projection. The tech lead commented: 'This is exactly the security-first review we should be doing on every PR.' The DTO pattern was added to our code review checklist. Three months later we implemented centralized structured logging — and because of the DTO pattern, no sensitive fields were present in any serialized log objects across the entire codebase.",
        keyTakeaway: "Security reviews do not require being a security engineer. Least privilege applies to objects in memory, not just to API permissions.",
      },
      {
        level: "SDE2",
        focus: "Identifying a scaling cliff before the traffic arrived",
        situation: "We were onboarding a new enterprise customer with two million users — ten times larger than our biggest existing customer. The Sales team announced the deal in a Slack channel with a go-live-in-45-days date. Someone casually mentioned they would be importing all two million user records via our standard CSV import API endpoint.",
        task: "I was not on the onboarding team and this was not my project. But I had written that CSV import endpoint 18 months earlier for our SMB customers, with a maximum of 10,000 records. It loaded the entire CSV file into memory before processing. Two million records at roughly 500 bytes per record equaled 1GB of RAM in a single Node.js process. It would crash instantly.",
        action: "I sent a message to the onboarding team lead in Slack: 'Congrats on the deal! Quick heads up — I wrote the CSV import endpoint. It loads the full file into memory and is not designed for more than 50,000 records. For two million records, it will OOM crash immediately. Happy to build a streaming bulk import before go-live — estimated effort is four days.' The team lead immediately brought me into a planning meeting. I implemented a streaming CSV parser using Node.js streams with bulk database insert batches of 1,000 records, processing in constant memory regardless of file size.",
        result: "The two million user import completed in 47 minutes with flat memory usage. The customer went live on day 44. The team lead included my proactive risk identification in the post-go-live review: 'This would have caused a P0 on day one of our most important customer relationship.' The streaming import became our standard architecture for all data imports.",
        keyTakeaway: "Watch for scale-cliff announcements in public channels. When someone casually mentions a 10x traffic event, that is your cue to audit every system that will receive that traffic.",
      },
      {
        level: "SDE3",
        focus: "Preventing a compliance disaster hidden inside a product roadmap",
        situation: "I was reviewing the upcoming Q3 product roadmap and noticed a new feature: Share any content item with external users via a public link. As a senior engineer I recognized this as a significant data governance risk — our content database stored items that enterprise customers had explicitly designated as Confidential, and we had contractually agreed that their data would never be accessible without authentication.",
        task: "The feature was already scoped, designed, and assigned to two engineers starting work Monday. Stopping or significantly altering a scoped roadmap feature requires navigating product management, the engineering manager, and potentially legal. I had no direct authority to block it.",
        action: "I sent a private message to the PM and EM (not a public channel) with a specific documented concern: 'This feature creates a mechanism to publicly expose data that our enterprise contracts define as protected. I found three enterprise contracts — attached — that explicitly prohibit unauthorized external access to customer content. If any enterprise user creates a public link for a Confidential item, we are in breach.' I did not just raise the problem — I proposed a solution: limit public link sharing to items explicitly marked Public by the content owner, with a UI confirmation dialog. This preserves 95% of the feature's use case while honoring all contractual obligations.",
        result: "Legal reviewed my flagged contracts and confirmed my concern was valid. The feature launched modified to only allow sharing of non-confidential items, with the safeguards I proposed. The PM said: 'This would have been a legal nightmare to unwind after launch.' I was asked to become a standing reviewer for product roadmap features with potential data governance implications.",
        keyTakeaway: "Read the roadmap, not just your assigned tickets. Features that touch data access patterns are frequently where legal and compliance risks are hiding.",
      },
      {
        level: "Principal",
        focus: "Identifying a systemic single point of failure in the company's global DR architecture",
        situation: "During a quarterly infrastructure review, I was reading through our AWS architecture diagram and noticed our primary Route 53 health checks — the DNS failover mechanism that would route traffic to our disaster recovery region if our primary region failed — were configured to query a health check endpoint hosted in the same primary region they were supposed to monitor. Additionally, all on-call engineers' PagerDuty escalation policies were configured to call a webhook routed through our primary region's API gateway.",
        task: "This meant that if our primary AWS region experienced a zone-wide outage, our DR failover would never trigger automatically (because the health checks themselves would also be down), AND our on-call engineers would never receive an alert (because PagerDuty's webhook would fail to reach our API gateway). We had a fully configured and paid-for DR region that would be completely useless in the exact scenario it was designed for.",
        action: "I documented this as a critical finding and scheduled a one-hour emergency architecture review with the VP of Engineering, our SRE lead, and the Head of Infrastructure. I brought a game day simulation plan rather than just a concern. We manually blocked all traffic to us-east-1 in our staging environment and watched. As predicted: health checks failed to detect the outage, no PagerDuty alerts fired, and traffic never failed over. The 45-minute simulation created an undeniable, visual case. I then proposed three specific fixes: first, move Route 53 health check endpoints to a separate AWS Lightsail instance in us-west-2 that pings our primary region externally. Second, configure PagerDuty to use their native HTTPS integration with no webhook dependency on our infrastructure. Third, add a Datadog canary synthetic monitor hosted entirely outside AWS that verifies our production API responds every 60 seconds.",
        result: "All three fixes were implemented within two weeks. Four months later, us-east-1 experienced a partial outage from an AWS networking event. Our external Route 53 health check detected the failure in 47 seconds. Automatic DNS failover completed in four minutes and twelve seconds. PagerDuty fired via its native integration simultaneously. The Datadog canary synthetic monitor provided the first alert within 60 seconds. Our DR region served traffic for two hours and 38 minutes during the incident with zero customer-visible impact. I presented this case study at an internal all-hands as an example of ownership beyond your team boundary.",
        keyTakeaway: "Test your failure detection under the exact failure conditions it is supposed to detect. A DR plan that has not been game-day tested is just a false sense of security.",
      },
    ],
  },
];

function STARSection({ label, color, bgColor, content }: {
  label: string;
  color: string;
  bgColor: string;
  content: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block mb-2 ${color}`}>{label}</span>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{content}</p>
    </div>
  );
}

function LevelAnswerCard({ answer }: { answer: LevelAnswer }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = LEVEL_CONFIG[answer.level];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${cfg.border}`}>
      <button
        className={`w-full flex items-center justify-between p-4 text-left gap-3 ${cfg.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 border rounded-full shrink-0 ${cfg.badge}`}>
            {answer.level}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{answer.focus}</span>
          </div>
        </div>
        <div className={`shrink-0 ${cfg.color}`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 space-y-3 border-t border-zinc-100 dark:border-zinc-800/60">
          <STARSection
            label="🎬 Situation — What was happening?"
            color="text-zinc-600 dark:text-zinc-400"
            bgColor="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700/50"
            content={answer.situation}
          />
          <STARSection
            label="🎯 Task — What was YOUR specific responsibility?"
            color="text-sky-600 dark:text-sky-400"
            bgColor="bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/50"
            content={answer.task}
          />
          <STARSection
            label="⚡ Action — What did YOU specifically do? (This is scored most heavily)"
            color="text-violet-600 dark:text-violet-400"
            bgColor="bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50"
            content={answer.action}
          />
          <STARSection
            label="🏆 Result — What was the measurable outcome?"
            color="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
            content={answer.result}
          />

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono block mb-1">Bar Raiser Key Takeaway</span>
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">{answer.keyTakeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, index }: { q: BarRaiserQuestion; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [activeLevel, setActiveLevel] = useState<Level | "ALL">("ALL");
  const catCfg = CATEGORY_CONFIG[q.category];
  const CatIcon = catCfg.icon;
  const displayedLevels = activeLevel === "ALL" ? q.levels : q.levels.filter(l => l.level === activeLevel);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold font-mono text-sm border border-zinc-200 dark:border-zinc-700">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catCfg.bg} ${catCfg.color} border border-current/10`}>
                <CatIcon className="w-3 h-3" />
                {q.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {q.principle}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-4">
              {q.title}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-lg p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3 h-3" /> Red Flags — Do Not Say These
                </span>
                <ul className="space-y-1.5">
                  {q.redFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3 h-3" /> Green Flags — Aim for These
                </span>
                <ul className="space-y-1.5">
                  {q.greenFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 py-2.5 rounded-lg transition-all bg-zinc-50/50 dark:bg-zinc-800/30"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Collapse All STAR Answers</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> View STAR Answers for All 4 Levels</>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-start gap-3 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg">
            <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-mono block mb-1">Why Bar Raisers Ask This Question</span>
              <p className="text-sm text-sky-800 dark:text-sky-300 leading-relaxed">{q.why}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 mb-2.5">Filter by your level:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLevel("ALL")}
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${activeLevel === "ALL" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100" : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 bg-white dark:bg-transparent"}`}
              >
                All Levels
              </button>
              {(["SDE1", "SDE2", "SDE3", "Principal"] as Level[]).map(lvl => {
                const cfg = LEVEL_CONFIG[lvl];
                return (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${activeLevel === lvl ? cfg.badge : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 bg-white dark:bg-transparent"}`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {displayedLevels.map(answer => (
              <LevelAnswerCard key={answer.level} answer={answer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BarRaiserPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");

  const categories: Array<{ id: Category | "ALL"; label: string; icon: React.ElementType }> = [
    { id: "ALL", label: "All Questions", icon: BookOpen },
    { id: "Ownership", label: "Ownership", icon: Shield },
    { id: "Conflict", label: "Conflict & Backbone", icon: MessageSquare },
    { id: "Delivery", label: "Delivery & Trade-offs", icon: Zap },
    { id: "Ambiguity", label: "Ambiguity", icon: Brain },
    { id: "Technical Leadership", label: "Technical Leadership", icon: BarChart3 },
    { id: "Customer Obsession", label: "Customer Obsession", icon: Target },
  ];

  const filtered = selectedCategory === "ALL" ? questions : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          Amazon Bar Raiser · Leadership Principles
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
          Bar Raiser Interview
          <br />
          <span className="text-zinc-400">Questions & STAR Answers</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The Bar Raiser ensures every hire raises the bar — a new hire must be better than 50% of people already doing that role. These questions probe ownership, backbone, and deep technical judgment. Each answer below is structured using the{" "}
          <strong className="text-zinc-700 dark:text-zinc-300">STAR method</strong> (Situation · Task · Action · Result) and tailored by engineering level with a real technical story.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(["SDE1", "SDE2", "SDE3", "Principal"] as Level[]).map(lvl => {
            const cfg = LEVEL_CONFIG[lvl];
            return (
              <span key={lvl} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded-full ${cfg.badge}`}>
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Engineering Levels", value: "4" },
          { icon: BookOpen, label: "Questions", value: String(questions.length) },
          { icon: Clock, label: "Avg Prep Time", value: "2 hrs" },
          { icon: Star, label: "STAR Stories", value: String(questions.length * 4) },
        ].map(stat => (
          <div key={stat.label} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl p-4 flex flex-col gap-1.5">
            <stat.icon className="w-4 h-4 text-zinc-400" />
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stat.value}</span>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl p-5">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          How to Use This Guide Effectively
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Study the Red & Green Flags First", desc: "Before reading any answer, internalize what Bar Raisers are actually scoring. The flags are more important than the stories themselves." },
            { step: "02", title: "Read Your Level's STAR Story", desc: "Read the answer at your current level carefully. Note the specific technical depth, scope of impact, and vocabulary expected for that level." },
            { step: "03", title: "Substitute Your Own Real Story", desc: "These are structural templates with fictional events. Replace the technical details with your own real experiences, keeping the STAR structure intact." },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <span className="text-2xl font-black text-zinc-200 dark:text-zinc-700 font-mono shrink-0 leading-none">{s.step}</span>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">{s.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category | "ALL")}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full transition-all ${
                active
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No questions in this category yet. More coming soon!</p>
          </div>
        )}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center space-y-4 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900/40 dark:to-zinc-950/40">
        <Trophy className="w-7 h-7 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Ready to Practice Live?</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">Schedule a mock interview with an experienced FAANG interviewer and get real-time feedback on your STAR answers.</p>
        <a
          href="/interviews"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Book a Mock Interview <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
