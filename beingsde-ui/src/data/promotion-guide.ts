export interface TicketExample {
  id: string;
  ticketKey: string;
  title: string;
  level: "SDE1_TO_SDE2" | "SDE2_TO_SDE3" | "SDE3_TO_STAFF";
  principle: string;
  role: "Lead Developer" | "Deployment Owner" | "System Architect" | "Toil Automator";
  metrics: {
    label: string;
    value: string;
  }[];
  standardWriteup: {
    rating: "Meets Expectations";
    summary: string;
    flaws: string[];
  };
  exceedsWriteup: {
    rating: "Exceeds Expectations";
    situation: string;
    task: string;
    action: string;
    result: string;
    impact: string;
    customerObsessionAngle: string;
    seniorTraitsAngle: string;
  };
}

export interface FeedbackLogItem {
  id: string;
  date: string;
  area: string;
  managerFeedback: string;
  actionTaken: string;
  nextCatchupEvidence: string;
  managerResponse: string;
  status: "Closed Loop" | "In Progress" | "Mastered";
}

export interface AutomationProject {
  id: string;
  title: string;
  category: "CI/CD & Developer Velocity" | "Operational Toil & Runbooks" | "Data & Infrastructure" | "Reliability & Testing";
  problem: string;
  solution: string;
  hoursSavedPerWeek: number;
  engineersImpacted: number;
  annualHoursSaved: number;
  annualCostSavedUsd: string;
  seniorTraitDemonstrated: string;
}

export interface DeploymentChecklistItem {
  phase: "Pre-Deployment" | "Canary Stage" | "Traffic Ramp (25% → 100%)" | "Post-Deployment & Observability" | "Rollback Triggers";
  action: string;
  rationale: string;
  ownerCheck: string;
}

export const EVALUATION_PILLARS = [
  {
    id: "delivery",
    title: "1. Flawless Delivery & Scope Expansion",
    subtitle: "Going Over & Above Scheduled Commitments",
    icon: "Rocket",
    color: "emerald",
    summary:
      "Committees do not promote for simply checking off assigned Jira tickets. Exceeds Expectations means anticipating unstated edge cases, unblocking upstream dependencies, delivering ahead of deadline, and extending solutions to handle multi-quarter scale.",
    rubricComparison: [
      {
        level: "Meets Expectations",
        description: "Completes assigned tickets within estimated sprints; asks for help when blocked.",
      },
      {
        level: "Exceeds Expectations (Promo Ready)",
        description:
          "Anticipates architectural failure modes not in the PRD, builds automated regression guards, unblocks cross-team blockers proactively, and delivers critical business milestones with zero slipped milestones.",
      },
    ],
  },
  {
    id: "customer_obsession",
    title: "2. Customer & Business Obsession",
    subtitle: "Stretching & Extending for End-User Trust",
    icon: "Target",
    color: "pink",
    summary:
      "Software is built for business value and customer trust. Prove how your code prevented customer churn, salvaged high-stakes VIP partner deals, eliminated silent error states, or directly contributed to conversion and retention metrics.",
    rubricComparison: [
      {
        level: "Meets Expectations",
        description: "Builds user interface and APIs strictly as specified by product managers.",
      },
      {
        level: "Exceeds Expectations (Promo Ready)",
        description:
          "Dives deep into user error logs, identifies silent checkout or onboarding frictions, proposes UX/API enhancements backed by customer telemetry, and validates positive customer sentiment post-launch.",
      },
    ],
  },
  {
    id: "quality",
    title: "3. Defect-Free Quality & Resilience",
    subtitle: "Quantifying Zero-Defect Standards & Hard Data",
    icon: "Shield",
    color: "sky",
    summary:
      "Vague claims like 'I wrote clean code' are dismissed by committees. Quantify your defect escape rate, show zero P0/P1 production regressions over 6+ months, prove high test pyramid coverage, and document chaos/load testing validations.",
    rubricComparison: [
      {
        level: "Meets Expectations",
        description: "Tickets pass basic QA testing; fixes regressions when bugs are filed by testers.",
      },
      {
        level: "Exceeds Expectations (Promo Ready)",
        description:
          "0 P0/P1 regressions across releases, < 1% defect escape rate, authored comprehensive automated contract & integration test suites, and conducted load tests up to 3x peak capacity prior to rollout.",
      },
    ],
  },
  {
    id: "toil_automation",
    title: "4. Automation & Toil Elimination",
    subtitle: "Force Multiplication via Side Tickets",
    icon: "Zap",
    color: "amber",
    summary:
      "Senior engineers create leverage. Demonstrate how you tackled unassigned, painful manual chores—automating manual tenant provisioning, shaving 30 minutes off CI/CD build times, or building DLQ replay tools that save hundreds of engineering hours.",
    rubricComparison: [
      {
        level: "Meets Expectations",
        description: "Follows manual on-call runbooks; handles repetitive operations during on-call rotation.",
      },
      {
        level: "Exceeds Expectations (Promo Ready)",
        description:
          "Identifies repeated operational toil, scripts automated self-service tooling, eliminates recurring PagerDuty alerts, and quantifies annual engineering hours and dollars saved for the entire organization.",
      },
    ],
  },
  {
    id: "leadership",
    title: "5. Senior Traits & Deployment Ownership",
    subtitle: "Driving Ideas, Consensus, & Blast-Radius Mitigation",
    icon: "Users",
    color: "violet",
    summary:
      "You are promoted to Senior/Staff only after you have operated as one for 6+ months. Showcase proactive RFC proposals, cross-team consensus building, serving as primary Deployment Owner, and conducting blameless RCAs with 100% preventive action item closure.",
    rubricComparison: [
      {
        level: "Meets Expectations",
        description: "Participates in design reviews; attends deployments managed by senior engineers.",
      },
      {
        level: "Exceeds Expectations (Promo Ready)",
        description:
          "Authors RFCs with trade-off matrices, navigates team disagreement to consensus, commands high-stakes canary deployments with rollback plans, and mentors junior engineers into independent feature owners.",
      },
    ],
  },
];

export const TICKET_EXAMPLES: TicketExample[] = [
  {
    id: "ticket-1",
    ticketKey: "CORE-3829",
    title: "Zero-Downtime Distributed Payment Gateway & Idempotency Engine",
    level: "SDE2_TO_SDE3",
    principle: "Customer Obsession & Ownership",
    role: "Lead Developer",
    metrics: [
      { label: "Duplicate Billing Anomalies", value: "0 in 18M transactions" },
      { label: "P99 Checkout Latency", value: "Reduced by 38% (420ms → 260ms)" },
      { label: "Recovered Cart Abandonment", value: "$340,000 / quarter" },
      { label: "Post-Launch Defects", value: "0 P0/P1 incidents over 180 days" },
    ],
    standardWriteup: {
      rating: "Meets Expectations",
      summary:
        "Updated the payment processing service to integrate Stripe and Adyen webhooks. Added retry logic for transient timeouts and created a new database table for payment logs. Fixed several QA bugs before release.",
      flaws: [
        "Purely task-focused; reads like a daily changelog with no business context.",
        "Fails to mention customer impact or quantify transaction safety.",
        "Zero mention of concurrency edge cases or distributed systems challenges.",
        "Lacks architectural ownership and senior leadership signals.",
      ],
    },
    exceedsWriteup: {
      rating: "Exceeds Expectations",
      situation:
        "During high-concurrency peak flash sales (12,000 req/sec), transient downstream gateway timeouts caused customers to click 'Place Order' multiple times, resulting in 1.4% double-billing anomalies, customer complaints, and $45K in monthly chargeback fees.",
      task:
        "Architect and lead end-to-end delivery of a fault-tolerant, multi-provider payment settlement service with strict idempotency and zero duplicate transaction risk, while maintaining sub-300ms P99 latency.",
      action:
        "1. Architected a two-phase idempotency protocol using Redis distributed locks with cryptographic request fingerprinting (SHA-256 over user_id + cart_hash + idempotency_key) with a 120-second lease time.\n2. Designed an asynchronous outbox pattern using PostgreSQL and Kafka to guarantee atomic state transitions between order placement and gateway capture.\n3. Proactively engaged Payment Ops and Security to audit token handling, eliminating PCI compliance risks.\n4. Implemented automated Chaos Mesh synthetic network packet drop testing to verify graceful degradation to fallback gateways without customer session loss.",
      result:
        "Shipped across 3 production regions with 100% zero-downtime. Processed 18M+ transactions with ZERO duplicate charges, reduced P99 checkout latency from 420ms to 260ms, and recovered $340,000/quarter in previously lost abandoned carts.",
      impact:
        "Directly eliminated customer double-charge chargeback disputes ($45K/mo saved), boosted checkout conversion by 1.8%, and received direct recognition from the VP of Product.",
      customerObsessionAngle:
        "Refused to settle for standard gateway retries; recognized that any duplicate billing destroys customer brand trust. Added client-side transparent deduplication and self-healing status polling so customers never see a broken checkout spinner.",
      seniorTraitsAngle:
        "Authored RFC-114, aligned Core Commerce, Security, and Finance teams. Created the standard idempotency SDK now adopted by 4 other internal services.",
    },
  },
  {
    id: "ticket-2",
    ticketKey: "OPS-9102",
    title: "High-Throughput Multi-Region Kafka Inventory Sync & Blast-Radius Shield",
    level: "SDE2_TO_SDE3",
    principle: "Insist on Highest Standards & Deployment Owner",
    role: "Deployment Owner",
    metrics: [
      { label: "Data Freshness Lag", value: "Reduced from 4.2 hours to < 180ms" },
      { label: "Overselling Defect Rate", value: "Dropped to 0.00% across Black Friday" },
      { label: "Canary Rollback Time", value: "Automated trigger under 15 seconds" },
      { label: "Test Coverage Expansion", value: "48% → 92% with contract tests" },
    ],
    standardWriteup: {
      rating: "Meets Expectations",
      summary:
        "Wrote a Kafka consumer service to consume warehouse inventory updates and update the read cache. Configured consumer group partitions and deployed the service to Kubernetes.",
      flaws: [
        "Does not explain why the old system was failing or what risks were present.",
        "Omits the complex deployment strategy and canary safety rails.",
        "Fails to show senior deployment ownership or post-incident prevention.",
      ],
    },
    exceedsWriteup: {
      rating: "Exceeds Expectations",
      situation:
        "Legacy batch sync ran on a 4-hour cron, causing inventory mismatch where customers purchased items that were already out-of-stock at warehouses, leading to 2,400 monthly canceled orders and furious customer support escalation.",
      task:
        "Act as Primary Deployment Owner to design and deploy an event-driven real-time inventory replication engine capable of processing 65,000 events/sec with strict partition ordering and automated blast-radius containment.",
      action:
        "1. Designed key-based partition sharding in Kafka (keyed by warehouse_id + sku_id) ensuring strict in-order state transitions without cross-partition bottlenecks.\n2. Built an automated dead-letter queue (DLQ) with exponential backoff and jittered retry to prevent poison pill messages from stalling partition consumers.\n3. As Deployment Owner, drafted a 4-stage canary release plan (1% internal staff -> 5% test region -> 25% secondary DC -> 100% global) with automated Datadog metrics monitoring consumer lag and P99 write latency.\n4. Authored comprehensive unit, integration, and Pact contract tests, lifting package code coverage from 48% to 92%.",
      result:
        "Replaced the 4-hour batch delay with sub-180ms real-time inventory updates. Handled Black Friday peak of 78,000 msgs/sec with zero consumer lag and 0.00% overselling rate.",
      impact:
        "Eliminated customer order cancellation complaints due to out-of-stock items, saving an estimated $1.2M in annual refunded merchandise and warehouse restocking overhead.",
      customerObsessionAngle:
        "Protected the customer experience during high-demand product drops; customers received instant real-time low-stock alerts instead of receiving 'order canceled 2 days later' notification emails.",
      seniorTraitsAngle:
        "Served as Incident & Deployment Commander. Coordinated with 3 distributed warehouse IT teams, ran pre-flight dry runs in staging, and authored the team's standard Zero-Lag Kafka Deployment Runbook.",
    },
  },
  {
    id: "ticket-3",
    ticketKey: "VEL-4410",
    title: "Enterprise Multi-Tenant Provisioning CLI & Operational Toil Automation",
    level: "SDE1_TO_SDE2",
    principle: "Bias for Action & Deliver Results",
    role: "Toil Automator",
    metrics: [
      { label: "Tenant Provisioning Time", value: "3.5 days → 3.5 minutes" },
      { label: "Human Error Rate", value: "Zero configuration drift tickets" },
      { label: "Engineering Hours Saved", value: "480 hours / year across team" },
      { label: "Sales Demo Unblock Time", value: "Instant self-serve sandbox" },
    ],
    standardWriteup: {
      rating: "Meets Expectations",
      summary:
        "Created a Python script to automate database creation and IAM role setup for new customer tenants. Ran the script when DevOps tickets were assigned to me.",
      flaws: [
        "Makes an impactful force-multiplier look like a routine side chore.",
        "Fails to show self-initiation (did someone tell you to do this or did you identify the opportunity?).",
        "Omits the massive time and cost savings unlocked for the organization.",
      ],
    },
    exceedsWriteup: {
      rating: "Exceeds Expectations",
      situation:
        "Onboarding enterprise clients required 14 manual steps across AWS IAM, PostgreSQL schemas, DNS routing, and Redis namespace allocation. Engineers spent 4-6 hours per tenant, with an average ticket wait time of 3.5 business days, stalling enterprise pilot deals.",
      task:
        "Proactively eliminate onboarding toil by designing an idempotent, fully automated self-service provisioning CLI and GitHub Actions workflow with zero human credential exposure.",
      action:
        "1. Identified manual toil during my on-call rotation and initiated a self-directed side project.\n2. Built a modular CLI tool in Go (`tenantctl`) leveraging Terraform CDK and AWS SDK to automate VPC peering, DB migration seeding, and encryption key generation.\n3. Incorporated pre-flight validation checks (DNS availability, CIDR collision avoidance) and automatic rollback if any sub-step failed.\n4. Documented comprehensive developer guides and conducted a lunch-and-learn training session for Solutions Engineering and Support teams.",
      result:
        "Reduced tenant provisioning time from 3.5 business days to 3.5 minutes. Enabled 100% self-serve tenant generation by Solutions Architects without filing engineering tickets.",
      impact:
        "Saved 480+ engineering hours annually ($72K equivalent engineering capacity). Unblocked enterprise sales team to spin up custom demo sandboxes on live prospect calls, accelerating sales cycle velocity by 2 weeks.",
      customerObsessionAngle:
        "Understood that prospective B2B clients evaluate vendor agility during trial setup. The instant onboarding experience delivered an exceptional first impression to enterprise CTOs.",
      seniorTraitsAngle:
        "Self-started the project without waiting for product prioritization. Mentored 2 junior engineers by delegating the integration testing and DNS verification modules to them.",
    },
  },
  {
    id: "ticket-4",
    ticketKey: "ARCH-7701",
    title: "Cross-DC Fault-Tolerant Session Replication & Incident Commander",
    level: "SDE3_TO_STAFF",
    principle: "Are Right, A Lot & Think Big",
    role: "System Architect",
    metrics: [
      { label: "RTO (Recovery Time Objective)", value: "Reduced from 45 min to < 8 sec" },
      { label: "Availability SLA", value: "Maintained 99.995% uptime" },
      { label: "Infra Cost Optimization", value: "$18,500 / month savings" },
      { label: "Mentored Engineers", value: "3 SDE2s promoted to SDE3" },
    ],
    standardWriteup: {
      rating: "Meets Expectations",
      summary:
        "Migrated the user session storage from a single Redis instance to a multi-region Redis cluster. Wrote the migration script and updated the connection pooling config.",
      flaws: [
        "Grossly understates high-stakes architectural risk and organizational leadership.",
        "Reads like a junior infrastructure update rather than a Staff-level resiliency initiative.",
        "Zero mention of cross-team coordination, cost optimization, or mentorship.",
      ],
    },
    exceedsWriteup: {
      rating: "Exceeds Expectations",
      situation:
        "A severe cloud provider data center power failure caused a 42-minute global authentication outage because user session tokens were stored in a single active region. 3.2M active users were logged out simultaneously, leading to massive social media backlash and executive scrutiny.",
      task:
        "Act as Lead Architect to redesign global session state with active-active cross-datacenter replication, guaranteeing sub-10 second failover without increasing authentication API latency.",
      action:
        "1. Authored RFC-208 analyzing 4 architecture options (DynamoDB Global Tables vs Redis Enterprise CRDT vs Cassandra vs Local JWT with Token Revocation List).\n2. Proved through benchmarks that hybrid stateless Ed25519 JWTs with a regional Bloom-filtered revocation cache achieved < 1ms auth verification while cutting database IOPS by 60%.\n3. Championed the proposal across 4 engineering directors and the VP of Infrastructure, resolving strong pushback on backward compatibility through a dual-mode phased migration window.\n4. Spearheaded the incident response overhaul: created the team's Disaster Recovery playbook and trained 28 engineers across 3 timezones.",
      result:
        "Successfully conducted live production chaos testing (simulated full regional disconnection during business hours) with zero user session drops and failover time under 8 seconds.",
      impact:
        "Saved $18,500/month in idle Redis cross-region replication costs ($222,000/year). Protected enterprise 99.99% availability SLA, eliminating SLA penalty payout liabilities.",
      customerObsessionAngle:
        "Recognized that unexpected logouts erode customer confidence. Designed zero-friction token refresh so users never experience interruption even during full datacenter outages.",
      seniorTraitsAngle:
        "Exemplified Staff-level influence: took an ambiguous crisis, established consensus across multiple resistant teams, mentored 3 senior engineers throughout the delivery, and established an org-wide standard for Disaster Recovery.",
    },
  },
];

export const QUALITY_METRICS_DATA = [
  {
    category: "Defect Density & Post-Launch Bugs",
    target: "Zero P0/P1 Regressions across 6+ months",
    howToTrack:
      "Track JIRA tickets tagged as `type = Bug` and `priority in (P0, P1, Blocker)` originating from code you authored or reviewed. Record the post-launch window (30/60/90 days).",
    exampleMetric:
      "Authored and shipped 14 core production releases over 2 quarters resulting in 0 Sev-1/Sev-2 incidents and only 2 minor P3 UI glitches resolved within 24 hours.",
    formula: "Defect Escape Rate = (Prod Bugs / (QA Bugs + Prod Bugs)) * 100% -> Target < 2%",
  },
  {
    category: "Automated Test Pyramid Expansion",
    target: "Coverage > 85% + Contract/Integration suites",
    howToTrack:
      "Capture code coverage reports from SonarQube, Codecov, or Istanbul. Emphasize integration and contract tests rather than purely trivial getter/setter unit tests.",
    exampleMetric:
      "Increased repository test coverage from 44% to 88% by introducing 110+ automated Jest integration tests and Pact contract tests, preventing 8 schema-breaking PRs in CI.",
    formula: "Net Coverage Delta = (Post-Project Coverage % - Baseline Coverage %)",
  },
  {
    category: "Performance & Latency SLAs",
    target: "P95/P99 latency drops under load",
    howToTrack:
      "Use Datadog, Prometheus, or New Relic APM traces. Show before vs after latency distributions under identical or higher traffic loads.",
    exampleMetric:
      "Optimized database connection pooling and N+1 query patterns, reducing P99 latency on the checkout API from 680ms to 180ms during 3x traffic surges.",
    formula: "Latency Improvement % = ((P99_Before - P99_After) / P99_Before) * 100%",
  },
  {
    category: "Resilience & Chaos Engineering",
    target: "Graceful degradation without total outage",
    howToTrack:
      "Document simulated chaos experiments (e.g. database read replica termination, downstream payment timeout, Redis cache eviction).",
    exampleMetric:
      "Conducted pre-launch load tests up to 45,000 req/sec using k6; proved automatic circuit breaking gracefully falls back to cached responses with 0 dropped connections.",
    formula: "Max Resilient Load = Peak Tested QPS without Error Spike (> 0.01%)",
  },
];

export const AUTOMATION_PROJECTS: AutomationProject[] = [
  {
    id: "auto-1",
    title: "Automated Enterprise Tenant Provisioning Script & CLI",
    category: "Operational Toil & Runbooks",
    problem:
      "Onboarding an enterprise customer required 14 manual checklist steps across AWS IAM, PostgreSQL schemas, and DNS, taking 4 hours per customer and 3-5 days of ticket latency.",
    solution:
      "Created a Go CLI tool (`tenantctl`) and CI workflow that automates DB migration, VPC peering, and encryption keys with rollback safeguards.",
    hoursSavedPerWeek: 8,
    engineersImpacted: 15,
    annualHoursSaved: 416,
    annualCostSavedUsd: "$62,400",
    seniorTraitDemonstrated: "Turned repetitive operational drudgery into a 3-minute self-service experience.",
  },
  {
    id: "auto-2",
    title: "CI/CD Test Runner Parallelization & Docker Layer Caching",
    category: "CI/CD & Developer Velocity",
    problem:
      "Pull request CI test suites took 42 minutes to execute, leading to developer context-switching, delayed PR merges, and frequent developer frustration.",
    solution:
      "Restructured Dockerfile with multi-stage build cache, split test runners into 4 parallel shards using Jest matrix, and isolated flaky DB tests into mock containers.",
    hoursSavedPerWeek: 18,
    engineersImpacted: 35,
    annualHoursSaved: 936,
    annualCostSavedUsd: "$140,400",
    seniorTraitDemonstrated: "Force multiplier: unlocked daily engineering velocity across the entire engineering department.",
  },
  {
    id: "auto-3",
    title: "Dead-Letter Queue (DLQ) Auto-Replay & Poison-Pill Quarantine",
    category: "Reliability & Testing",
    problem:
      "On-call engineers were paged 12+ times a week for stuck Kafka messages, manually SSHing into jumpboxes to inspect and replay payloads.",
    solution:
      "Built an automated DLQ remediation worker with exponential jitter retry, Slack alert notifications, and a safe web UI for 1-click payload quarantine.",
    hoursSavedPerWeek: 5,
    engineersImpacted: 8,
    annualHoursSaved: 260,
    annualCostSavedUsd: "$39,000",
    seniorTraitDemonstrated: "Root-cause elimination of on-call burnout; reduced team alert fatigue by 75%.",
  },
  {
    id: "auto-4",
    title: "Automated Data Reconciliation & Anomaly Detection Cron",
    category: "Data & Infrastructure",
    problem:
      "Finance team spent 3 days at every month-end manually running SQL queries to reconcile billing records against Stripe payouts.",
    solution:
      "Authored an idempotent automated reconciliation pipeline in Python/Airflow that automatically flags discrepancy deltas > $1.00 directly to Slack.",
    hoursSavedPerWeek: 6,
    engineersImpacted: 6,
    annualHoursSaved: 312,
    annualCostSavedUsd: "$46,800",
    seniorTraitDemonstrated: "Cross-functional business obsession: unblocked Finance and eliminated financial reporting delays.",
  },
];

export const DEPLOYMENT_CHECKLIST: DeploymentChecklistItem[] = [
  {
    phase: "Pre-Deployment",
    action: "Dry-Run Schema Migrations with Zero Table Locks",
    rationale:
      "Ensure all DDL statements (e.g. adding columns, building indexes) use non-blocking options like PostgreSQL `CREATE INDEX CONCURRENTLY` or expand-and-contract patterns.",
    ownerCheck: "Verified on Staging replica with 10M synthetic rows; lock duration < 5ms.",
  },
  {
    phase: "Pre-Deployment",
    action: "Blast Radius & Rollback Runbook Verification",
    rationale:
      "Never deploy without an explicit, tested rollback playbook. If DB schema changed, verify code works with both version N and version N-1.",
    ownerCheck: "Backward compatibility confirmed; dual-read feature flags enabled.",
  },
  {
    phase: "Canary Stage",
    action: "1% Traffic Canary Routing with Live Anomaly Detection",
    rationale:
      "Route 1% of production traffic to new container instances. Monitor P99 latency, 5xx HTTP error rates, and CPU/memory footprint for 20 minutes.",
    ownerCheck: "Datadog canary monitor green: 5xx rate = 0.001%, P99 = 48ms.",
  },
  {
    phase: "Traffic Ramp (25% → 100%)",
    action: "Gradual Step-Up with Automated Circuit Breakers",
    rationale:
      "Ramp traffic in discrete stages: 1% -> 10% -> 50% -> 100%. Stop immediately if connection pool exhaustion or cache stampede occurs.",
    ownerCheck: "Database connection pool utilization stable at 38% under 50% ramp.",
  },
  {
    phase: "Rollback Triggers",
    action: "Automated Immediate Rollback Thresholds",
    rationale:
      "Define non-negotiable quantitative rollback limits before deploying, eliminating subjective hesitation during incidents.",
    ownerCheck: "Rule: Rollback if 5xx error rate > 0.05% for 60s OR P99 latency > 300ms.",
  },
  {
    phase: "Post-Deployment & Observability",
    action: "Post-Deploy Smoke Test & On-Call Handoff Signoff",
    rationale:
      "Execute automated synthetic browser smoke tests; verify key business funnels (signup, search, checkout) are completing successfully.",
    ownerCheck: "Synthetic checkout funnel passed 10/10 test runs; on-call channel notified.",
  },
];

export const CONTINUOUS_1ON1_LOG: FeedbackLogItem[] = [
  {
    id: "log-1",
    date: "July 14",
    area: "Technical Communication & Cross-Team Influence",
    managerFeedback:
      "'You have deep technical solutions, but in architectural syncs with the Data team, you tend to get bogged down in low-level details. You need to frame trade-offs in terms of business impact and clear alternatives for Principal Engineers.'",
    actionTaken:
      "Within 10 days, drafted RFC-108 for the new event streaming protocol. Structured it with an Executive Summary, 3 discrete alternatives with a CAP theorem trade-off matrix, and cost projections. Sent pre-read to the Data team lead 48 hours in advance.",
    nextCatchupEvidence:
      "Presented RFC-108 in the joint architecture forum. Gained consensus in a single 45-minute meeting without escalations. Forwarded positive Slack feedback from the Principal Engineer to my manager.",
    managerResponse:
      "'Fantastic turnaround. The structure of that RFC was night-and-day compared to last month. This is exactly the senior communication standard we look for in calibration.'",
    status: "Closed Loop",
  },
  {
    id: "log-2",
    date: "August 11",
    area: "Code Review Rigor & Turnaround Speed",
    managerFeedback:
      "'Junior engineers mentioned their PRs sometimes sit waiting for your review for 2+ days. When you do review, the comments are great, but the delay is slowing sprint velocity.'",
    actionTaken:
      "Blocked two dedicated 30-minute calendar slots daily (10:00 AM and 4:30 PM) exclusively for code reviews. Authored a PR checklist for junior engineers so common linting/test errors were resolved before review.",
    nextCatchupEvidence:
      "Demonstrated GitHub metrics: Average PR review response time dropped from 44 hours to 3.2 hours. Reviewed 28 PRs in 2 weeks with zero blocking bottlenecks.",
    managerResponse:
      "'Both junior devs personally mentioned in their 1:1s how much more unblocked they feel. Great demonstration of team leadership.'",
    status: "Mastered",
  },
  {
    id: "log-3",
    date: "September 08",
    area: "Operational Excellence & Incident Leadership",
    managerFeedback:
      "'You are great at fixing bugs when assigned, but during production incidents, you need to step up as Incident Commander rather than waiting for Senior SDEs to assign you tasks.'",
    actionTaken:
      "Volunteered as secondary on-call shadow. When a Sev-2 cache eviction spike occurred on Sep 18, immediately declared incident command, created the Slack war room, assigned investigation streams, and provided executive updates every 15 minutes.",
    nextCatchupEvidence:
      "Led the blameless post-mortem RCA document with 5-Whys. Completed 3 preventative action items (added Redis memory alert thresholds and TTL jitter) within 1 sprint.",
    managerResponse:
      "'Saw you run that Sev-2 on the 18th. Outstanding composure and clear communication. You have effectively closed this gap.'",
    status: "Closed Loop",
  },
];

export const TEMPLATES = {
  fullPromoDoc: `# Software Engineering Promotion & Year-End Self-Review Packet
**Candidate Name:** [Your Name]
**Current Level:** SDE-2 (L5 / Software Engineer II)
**Target Level:** Senior SDE (L6 / SDE-3 / Senior Software Engineer)
**Manager:** [Manager Name]
**Cycle:** [e.g., Annual Review 2026]

---

## 1. Executive Summary & Value Proposition
*In 3-4 sentences, articulate your overarching impact, sustained next-level scope, and primary value delivered to the business and engineering organization over the past 12 months.*

Over the past 12 months, I have operated continuously at the Senior SDE level by leading the architectural overhaul of our Core Commerce Settlement Platform, expanding throughput from 4,000 to 25,000 QPS while maintaining 99.995% uptime. I drove 3 cross-team RFCs, unblocked $1.4M in annual transaction revenue through zero-downtime idempotency guarantees, and reduced team operational toil by 480 engineering hours/year through automated developer tooling. Beyond technical delivery, I mentored 2 junior engineers through their first major feature ownership and served as Primary Deployment Owner for 18 production releases with zero P0/P1 defect escapes.

---

## 2. Key Initiatives & Project Tickets (STAR-I Framework)

### Project 1: Zero-Downtime Distributed Payment Gateway & Idempotency Engine
- **JIRA Ticket(s):** [CORE-3829, CORE-3910]
- **Role:** Lead Architect & Developer
- **Core Principles:** Customer Obsession, Ownership, Insist on Highest Standards

#### Situation
During high-concurrency peak flash sales (12,000 req/sec), transient downstream gateway timeouts caused customers to click 'Place Order' multiple times, resulting in 1.4% double-billing anomalies, customer complaints, and $45K in monthly chargeback fees.

#### Task
Architect and lead end-to-end delivery of a fault-tolerant, multi-provider payment settlement service with strict idempotency and zero duplicate transaction risk, while maintaining sub-300ms P99 latency.

#### Action
1. Architected a two-phase idempotency protocol using Redis distributed locks with cryptographic request fingerprinting (SHA-256 over user_id + cart_hash + idempotency_key) with a 120-second lease time.
2. Designed an asynchronous outbox pattern using PostgreSQL and Kafka to guarantee atomic state transitions between order placement and gateway capture.
3. Proactively engaged Payment Ops and Security to audit token handling, eliminating PCI compliance risks.
4. Implemented automated Chaos Mesh synthetic network packet drop testing to verify graceful degradation to fallback gateways without customer session loss.

#### Result & Hard Metrics
- Processed 18M+ transactions with ZERO duplicate charges.
- Reduced P99 checkout latency from 420ms to 260ms (38% improvement).
- Recovered $340,000/quarter in previously lost abandoned carts.
- Zero P0/P1 defect escapes across 180 days post-launch.

#### Customer & Business Obsession
Refused to settle for basic HTTP retries. Understood that accidental double-charges destroy customer brand trust. Added transparent client-side polling so customers never suffer stuck or ambiguous checkout screens.

---

## 3. Engineering Quality & Defect Justification
*Demonstrate with hard data that your code meets the highest engineering standards.*

| Metric Category | Standard Expectation | My Delivered Achievement | Evidence / Link |
| :--- | :--- | :--- | :--- |
| **P0 / P1 Regressions** | < 2 per year | **0 P0/P1 Regressions** over 12 months | [Link to JIRA filter] |
| **Defect Escape Rate** | < 5% | **0.4%** across 18 production releases | [Link to QA Metrics] |
| **Test Coverage** | 60% minimum | **88.4% Unit & Integration Coverage** | [SonarQube Dashboard] |
| **P99 API Latency** | < 500ms | **260ms under 3x peak load** | [Datadog Dashboard] |
| **Availability SLA** | 99.9% | **99.995% uptime maintained** | [PagerDuty SLA Report] |

---

## 4. Automation & Eliminating Toil ("Side Tickets" as Force Multipliers)
*Highlight self-directed initiatives that multiplied team velocity and eliminated manual labor.*

- **Initiative:** Enterprise Tenant Provisioning CLI (\`tenantctl\`)
  - **Problem:** Manual onboarding required 14 checklist steps and 3.5 days of ticket wait time per client.
  - **Solution:** Proactively authored an automated CLI in Go that provisions DB schemas, IAM roles, and DNS in under 4 minutes.
  - **ROI:** Saved **480 engineering hours/year** across 15 engineers (~$72,000 annual capacity unlocked).

- **Initiative:** CI/CD Build & Test Sharding
  - **Problem:** PR builds took 42 minutes, causing massive team context switching.
  - **Solution:** Restructured Docker multi-stage caching and sharded Jest tests across 4 runners.
  - **ROI:** Reduced build time from **42m to 8m**, saving 18 developer hours per week.

---

## 5. Senior Engineering Leadership & Deployment Ownership
*Prove you already operate at next-level maturity.*

### Deployment Ownership & Operational Excellence
- Acted as **Primary Deployment Owner** for 18 releases, including the high-stakes holiday peak release.
- Authored the team's **Canary Rollout & Blast-Radius Mitigation Playbook** (1% -> 10% -> 50% -> 100% automated step-up).
- Led **2 Blameless Post-Mortem RCAs**, driving 100% of preventative action items to completion within 1 sprint.

### Mentorship & Culture
- Formally mentored [Engineer A] from onboarding to independent ownership of the Notifications Service.
- Conducted **140+ thorough code reviews**, maintaining an average turnaround time under 3.5 hours.
- Led 2 engineering brown-bags on 'Distributed Locking Pitfalls in Redis' and 'Zero-Downtime PostgreSQL Schema Migrations'.

---

## 6. Continuous 1:1 Feedback & Growth Alignment Loop
*Document how feedback was received, addressed, and verified with management.*

| Date | Area for Improvement | Action Taken | Evidence Demonstrated in Next 1:1 | Manager Sign-Off |
| :--- | :--- | :--- | :--- | :--- |
| **Jul 14** | Technical communication in cross-team syncs | Authored RFC-108 with clear trade-off matrix and pre-read | Gained consensus in single 45m meeting; praised by Principal | Verified & Closed |
| **Aug 11** | Code review turnaround speed for junior PRs | Blocked 2 daily review slots; created PR checklist | Review turnaround dropped from 44h to 3.2h; junior devs unblocked | Verified & Closed |
| **Sep 08** | Step up as Incident Commander during Sev-2s | Volunteered as lead IC on Sep 18 outage; led 5-Whys RCA | Prevented incident recurrence; 3 action items shipped in 1 sprint | Verified & Closed |
`,

  ticketTemplate: `### [TICKET-ID] [Project Name / Ticket Title]
- **Role:** [Lead Developer / Deployment Owner / System Architect / Toil Automator]
- **Target Level:** [SDE1 → SDE2 / SDE2 → Senior SDE / Senior → Staff]
- **Core Principles:** [e.g., Customer Obsession, Ownership, Bias for Action]

#### 1. Situation & Context
*What business bottleneck, customer pain point, or architectural risk existed? Why was it critical now?*
[Describe situation here with baseline numbers: latency, bug rate, customer complaints, or revenue at risk]

#### 2. Task & Ownership Scope
*What was your explicit mandate? How did you stretch beyond the minimal requirements?*
[Define the scope and how you extended it to solve root causes rather than symptoms]

#### 3. Technical Actions Taken
*Detail your architectural choices, concurrency/fault-tolerance guards, and cross-team alignment:*
1. [Action 1: Architecture, database, or protocol decision]
2. [Action 2: Concurrency, caching, or data consistency guard]
3. [Action 3: Testing, chaos simulation, or canary deployment strategy]
4. [Action 4: Stakeholder alignment or developer documentation]

#### 4. Quantifiable Results & Metrics
*What changed? Use hard data:*
- **Primary Metric:** [e.g., Latency reduced from X to Y]
- **Defect Standard:** [e.g., 0 P0/P1 bugs in 90 days]
- **Business / Revenue Impact:** [e.g., $XK recovered or saved]
- **Scale:** [e.g., Handled XK QPS with zero downtime]

#### 5. Customer Obsession & Senior Traits Angle
- **Customer First:** [How this safeguarded customer trust or eliminated user friction]
- **Senior Leadership:** [RFC authored, junior engineers mentored, or runbook established]
`,

  oneOnOneTracker: `# Continuous 1:1 Growth & Feedback Alignment Matrix

| Date | Feedback / Growth Area Highlighted | Concrete Action Plan (Within 14 Days) | Measurable Evidence for Next Catchup | Manager Status |
| :--- | :--- | :--- | :--- | :--- |
| **[Date]** | [Verbatim feedback from manager] | [Code, RFC, or process action taken] | [PR link, dashboard metric, or peer feedback] | [Closed / In Progress] |
| **[Date]** | [Verbatim feedback from manager] | [Code, RFC, or process action taken] | [PR link, dashboard metric, or peer feedback] | [Closed / In Progress] |
| **[Date]** | [Verbatim feedback from manager] | [Code, RFC, or process action taken] | [PR link, dashboard metric, or peer feedback] | [Closed / In Progress] |

### Best Practices for Your 1:1 Catchups:
1. **Never hide constructive feedback:** Document the exact words your manager used.
2. **Follow the 14-day rule:** Never show up to the next catchup without verifiable evidence of progress.
3. **Ask for explicit confirmation:** Say: *"In our last catchup, you mentioned improving X. I did Y and here is the result. Do you agree this is now at the Senior standard?"*
4. **No Q4 surprises:** Calibration is decided in September/October. Ensure every gap has been closed months before formal submission.
`,
};
