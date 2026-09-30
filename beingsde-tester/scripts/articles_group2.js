/**
 * Group 2: System Architectures & HLD Breakdowns (Part 2)
 */

module.exports = {
  "job-scheduler": {
    title: "Design a Distributed Job Scheduler",
    slug: "job-scheduler",
    description: "Design a scalable, highly available distributed job scheduler capable of orchestrating recurring (cron) and one-time delayed jobs with at-least-once execution.",
    difficulty: "HARD",
    category: "Infrastructure & Messaging",
    estimatedTimeMinutes: 45,
    tags: ["Infrastructure & Messaging", "Job Scheduler", "Cron", "Distributed Systems", "Worker Queues"],
    isPremium: true,
    contentMarkdown: `# Design a Distributed Job Scheduler (Airflow / Temporal / Quartz Scale)

Distributed job schedulers coordinate execution of millions of recurring (cron) and ad-hoc delayed tasks across worker clusters with at-least-once execution guarantees, dependency graphs (DAGs), and automatic retry semantics.

---

## 1. System Requirements

### Functional Requirements
1. **Submit Jobs**: Users/services can submit one-time delayed jobs (\`run_at: timestamp\`) or recurring cron jobs (\`cron: "*/5 * * * *"\`).
2. **Execution Guarantees**: Tasks must trigger within a few seconds of scheduled execution time.
3. **Task Dependencies (DAGs)**: Support execution pipelines where Task B only runs after Task A completes successfully.
4. **Retry & Backoff**: Automatic retries with exponential backoff and jitter on worker failure.
5. **Job Monitoring & Status**: Real-time dashboard to inspect job execution state (\`PENDING\`, \`RUNNING\`, \`SUCCESS\`, \`FAILED\`).

### Non-Functional Requirements
1. **Scalability**: Support scheduling 100M+ tasks per day with peak trigger rates of 50,000 tasks/second.
2. **High Availability**: Master/Coordinator nodes must failover seamlessly without dropping scheduled tasks.
3. **Durability**: Zero task loss if a node crashes right before trigger time.

---

## 2. Core Architecture: Hierarchical Time Wheel & Database Partitioning

### The Hierarchical Hashed Timing Wheel
Instead of polling the database with \`SELECT * FROM jobs WHERE trigger_time <= NOW()\` (which locks tables and scales poorly), the scheduler uses an in-memory Hierarchical Timing Wheel:
* Divided into Second, Minute, Hour, and Day circular ring buffers.
* Tasks are placed into buckets corresponding to execution offsets.
* As the clock advances each second, the current bucket's tasks are immediately drained into a distributed task queue (Kafka / RabbitMQ).

---

## 3. High-Level Architecture Blueprint

\`\`\`
                                  +-----------------------+
                                  |    Client Services    |
                                  +-----------+-----------+
                                              |
                                              | POST /jobs
                                              v
                                  +-----------------------+
                                  |     Scheduler API     |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Primary Storage DB    |
                                  | (PostgreSQL / TiDB)   |
                                  +-----+-----------+-----+
                                        |           |
             +--------------------------+           +--------------------------+
             |                                                                 |
             v                                                                 v
+------------------------+                                         +------------------------+
| Scheduler Coordinator  |                                         |  Distributed Message   |
| (Leader Election via   |                                         |  Queue (Kafka / SQS)   |
| ZooKeeper / Raft)      |                                         +-----------+------------+
+-----------+------------+                                                     |
            |                                                                  v
            +==== Dispatches Tasks Due Now ====================================>+
                                                                               |
                                                                               v
                                                                   +------------------------+
                                                                   | Worker Nodes Cluster   |
                                                                   | (Task Execution Pods)  |
                                                                   +------------------------+
\`\`\`

---

## 4. Staff-Level Deep Dives

### Deep Dive 1: Preventing Duplicate Executions
In distributed systems, networks partition and workers experience garbage collection pauses.
* **Distributed Lock with Fencing Tokens**: Before executing, the worker acquires a Redis / ZooKeeper lock. The lock issues a monotonically incrementing fencing token. If a paused worker wakes up, its stale token is rejected by the database.
* **Idempotency Keys**: Workers pass the \`task_execution_id\` to downstream APIs to ensure side effects are safely deduplicated.
`
  },

  "metrics-monitoring": {
    title: "Design a Metrics Monitoring & Alerting System",
    slug: "metrics-monitoring",
    description: "Design a high-throughput time-series metrics ingestion and alerting platform modeled after Prometheus and Datadog, supporting Gorilla compression and rollups.",
    difficulty: "HARD",
    category: "Infrastructure & Messaging",
    estimatedTimeMinutes: 45,
    tags: ["Infrastructure & Messaging", "Time Series", "Observability", "Prometheus", "Kafka", "Databases & Storage"],
    isPremium: true,
    contentMarkdown: `# Design a Metrics Monitoring & Alerting System (Prometheus / Datadog Scale)

Observability platforms ingest millions of metric data points per second from microservices, store them in time-series databases, evaluate real-time alert rules, and render low-latency query dashboards.

---

## 1. System Requirements

### Functional Requirements
1. **Metrics Ingestion**: Collect counters, gauges, and histograms from distributed hosts and microservices (e.g. \`cpu_usage{host="srv-1"} 78.4 1672531199\`).
2. **Time-Series Querying**: Support fast range queries and aggregations across custom tag dimensions.
3. **Alerting Rules**: Continuously evaluate alerting thresholds (e.g. \`p99 latency > 500ms for 5m\`) and dispatch PagerDuty/Slack webhooks.
4. **Dashboards**: Visualize real-time graphs with sub-second page loads.

### Non-Functional Requirements
1. **Massive Write Throughput**: Ingest 10 Million metric samples per second.
2. **Storage Efficiency**: Compress time-series data to $< 1.5\\text{ bytes per data point}$ using delta-of-delta and Gorilla compression.
3. **Query Latency**: Dashboard queries over past 1 hour return in $< 200\\text{ms}$.

---

## 2. Ingestion Model: Pull vs. Push

### Pull Model (Prometheus Style)
* The central metrics engine periodically scrapes an \`/actuator/prometheus\` HTTP endpoint exposed by each microservice.
* **Pros**: Simple client implementation; easy detection of down/unreachable nodes.
* **Cons**: Requires service discovery mechanism (Consul/Kubernetes DNS); struggles with ephemeral serverless functions (AWS Lambda).

### Push Model (Datadog Style)
* Lightweight agents running on every server stream UDP/gRPC packets to a local forwarder or central collector.
* **Pros**: Natural fit for dynamic/ephemeral workers; supports high-frequency telemetry.
* **Cons**: Influx spikes can overwhelm ingestion servers unless cushioned by an upstream Kafka buffer.

---

## 3. High-Level Architecture Blueprint

\`\`\`
                          +-----------------------+
                          |   Monitored Services  |
                          +-----------+-----------+
                                      |
                                      | gRPC / OTLP Metrics Stream
                                      v
                          +-----------------------+
                          |   Ingestion Gateway   |
                          +-----------+-----------+
                                      |
                                      v
                          +-----------------------+
                          | Kafka Metrics Buffer  |
                          +-----+-----------+-----+
                                |           |
       +------------------------+           +------------------------+
       | Raw Metrics Stream                 | Alert Evaluation Stream
       v                                    v
+------------------------+           +------------------------+
| Time-Series DB (TSDB)  |           | Alerting Rule Engine   |
| (Gorilla Compression / |           | (Sliding Window Engine)|
| ClickHouse / InfluxDB) |           +-----------+------------+
+------------------------+                       |
                                                 v
                                     +------------------------+
                                     | PagerDuty / Slack Alert|
                                     +------------------------+
\`\`\`
`
  },

  "online-auction": {
    title: "Design an Online Auction System (eBay / Real-Time Bidding)",
    slug: "online-auction",
    description: "Design an online auction platform handling high-concurrency last-second bid sniping, atomic bid ordering, and post-auction payment settlement.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "E-Commerce", "Real-Time", "Concurrency", "Redis", "Distributed Locking"],
    isPremium: true,
    contentMarkdown: `# Design an Online Auction System (eBay Scale)

Online auction systems allow sellers to list rare items for timed bidding. As the countdown clock ticks toward zero, hundreds of eager buyers engage in "bid sniping" (submitting bids in the final seconds), demanding atomic concurrency control and instant broadcast updates.

---

## 1. System Requirements

### Functional Requirements
1. **Create Listings**: Sellers specify item details, reserve price, starting bid, and auction end timestamp.
2. **Place Bids**: Buyers place bids higher than the current highest bid + minimum increment.
3. **Real-time Price Broadcast**: All users viewing the auction see the updated leading bid within $< 200\\text{ms}$.
4. **Sniping Protection / Soft Close**: If a bid is submitted in the final 2 minutes, auto-extend the auction by 2 minutes to prevent bot exploitation.
5. **Auction Settlement**: When the timer expires, the highest bidder wins and enters the payment checkout flow.

### Non-Functional Requirements
1. **Strict Bid Consistency**: Exactly one leading bid at any price point; race conditions must never record overlapping winners.
2. **Sub-second Latency**: Bid placement must acknowledge in $< 50\\text{ms}$.
3. **High Availability**: 99.99% availability during high-traffic auction closes.

---

## 2. Concurrency & Bid Placement Engine
Handling 10,000 users bidding simultaneously in the last second requires memory-speed atomic transactions:

\`\`\`lua
-- Redis Lua Script: Atomic Bid Verification & Update
local auction_id = KEYS[1]
local new_bid = tonumber(ARGV[1])
local user_id = ARGV[2]

local current_bid = tonumber(redis.call('HGET', auction_id, 'highest_bid') or '0')
local end_time = tonumber(redis.call('HGET', auction_id, 'end_time'))
local now = tonumber(ARGV[3])

if now > end_time then
    return {err = "AUCTION_CLOSED"}
end

if new_bid > current_bid then
    redis.call('HSET', auction_id, 'highest_bid', new_bid, 'highest_bidder', user_id)
    -- Extend time if bid placed in last 2 minutes (120 seconds)
    if (end_time - now) < 120 then
        redis.call('HSET', auction_id, 'end_time', end_time + 120)
    end
    return {ok = "BID_ACCEPTED"}
else
    return {err = "OUTBID"}
end
\`\`\`
`
  },

  "price-tracking-service": {
    title: "Design a Price Tracking & Alert System (CamelCamelCamel)",
    slug: "price-tracking-service",
    description: "Architect a large-scale e-commerce price monitoring platform featuring distributed web scraping, time-series price history, and instant price drop alert notifications.",
    difficulty: "MEDIUM",
    category: "System Architectures",
    estimatedTimeMinutes: 40,
    tags: ["System Architectures", "Web Scraping", "Alerting", "Time Series", "Distributed Crawling"],
    isPremium: true,
    contentMarkdown: `# Design a Price Tracking Service (CamelCamelCamel Scale)

Price tracking platforms track historical pricing fluctuations across millions of products on Amazon, Best Buy, and Walmart, notifying bargain-hunters via email or SMS when an item drops below their target threshold.

---

## 1. System Requirements

### Functional Requirements
1. **Track Product**: Users can paste an e-commerce URL and set a desired target price (e.g. *"Alert me if Sony WH-1000XM5 drops below $250"*).
2. **Periodic Price Ingestion**: System periodically fetches the current price for all monitored product IDs.
3. **Price History Charting**: Display historical price movements over 1-year and all-time spans.
4. **Trigger Notifications**: When a price drop is confirmed, immediately dispatch an email/push notification to all subscribed users.

### Non-Functional Requirements
1. **Politeness & Anti-Bot Resilience**: Rotate proxy IPs, adhere to rate limits, and randomize request intervals to avoid IP bans.
2. **Dynamic Polling Intervals**: Products with volatile prices or high popularity are checked more frequently (e.g. every 1 hour) than dormant products (once every 24 hours).
`
  },

  "news-aggregator": {
    title: "Design a News Aggregator (Google News)",
    slug: "news-aggregator",
    description: "Design a real-time news aggregation platform featuring distributed RSS crawling, article deduplication with SimHash, topic clustering, and personalized ranking.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "Search", "Clustering", "SimHash", "NLP", "Machine Learning"],
    isPremium: true,
    contentMarkdown: `# Design a News Aggregator (Google News Scale)

Google News ingests hundreds of thousands of articles published daily across thousands of media outlets, clusters stories covering the exact same event into a single headline card, and personalizes feeds to reader interests.

---

## 1. System Requirements

### Functional Requirements
1. **Content Crawling**: Ingest news articles via publisher RSS feeds, sitemaps, and direct web crawling.
2. **Deduplication & Clustering**: Group disparate articles describing the same breaking news story into one cluster.
3. **Category Tagging**: Classify articles into sections (World, Business, Technology, Science).
4. **Personalized Feed**: Rank stories based on freshness, publisher authority, and reader historical clicks.

### Non-Functional Requirements
1. **Freshness**: Breaking news stories must appear in user feeds within $< 5\\text{ minutes}$ of publication.
2. **High Read Throughput**: Serve 50,000+ QPS of personalized feed views with low latency ($< 150\\text{ms}$).

---

## 2. Article Deduplication via SimHash & MinHash
When multiple journalists cover a White House press release, their articles share 70%+ identical phrasing.
* **SimHash**: Generates a 64-bit fingerprint of an article where similar text generates similar hash bit patterns (unlike cryptographic hashes like SHA-256 where 1 bit change flips 50% of bits).
* **Hamming Distance**: If the Hamming distance between two SimHash fingerprints is $\\le 3\\text{ bits}$, the articles are marked as duplicates and merged into the same cluster.
`
  },

  "flash-sale": {
    title: "Design a Flash Sale System (High Concurrency Checkout)",
    slug: "flash-sale",
    description: "Design an ultra-high concurrency flash sale checkout engine that prevents overselling, withstands sudden 100x traffic spikes, and enforces queue fairness.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "High Concurrency", "E-Commerce", "Rate Limiting", "Redis Lua", "Virtual Waiting Room"],
    isPremium: true,
    contentMarkdown: `# Design a Flash Sale System (High Concurrency Ticket & Item Checkout)

Flash sales (like Black Friday console releases or Taylor Swift ticket drops) subject systems to extreme surges—millions of concurrent users contending for only 1,000 available inventory units in the span of 10 seconds.

---

## 1. System Requirements

### Functional Requirements
1. **Browse Flash Sale**: Users view item details and remaining inventory count in real time.
2. **Virtual Waiting Room**: Queue users fairly when traffic exceeds platform capacity.
3. **Atomic Inventory Reservation**: Reserve an item for 10 minutes to allow the buyer to complete payment.
4. **Order Placement & Payment**: Complete checkout or release inventory back to the pool if payment expires.

### Non-Functional Requirements
1. **Zero Overselling**: Under no circumstances can 1,001 items be sold when only 1,000 exist.
2. **Database Protection**: Shield the relational database from millions of concurrent queries.
3. **Fairness**: Minimize automated bot advantages using CAPTCHA challenges and rate limiting.

---

## 2. High-Level Architecture Blueprint

\`\`\`
                             +-----------------------+
                             |    Shopper Traffic    |
                             +-----------+-----------+
                                         |
                                         v
                             +-----------------------+
                             | Virtual Waiting Room  |
                             | (Cloudflare Waiting   |
                             | Room / Token Bucket)  |
                             +-----------+-----------+
                                         |
                                         v Admitted Traffic
                             +-----------------------+
                             |  Flash Sale Service   |
                             +-----------+-----------+
                                         |
                                         v
                             +-----------------------+
                             |   Redis Cluster       |
                             | (Atomic Lua Inventory |
                             | Reservation Engine)   |
                             +-----------+-----------+
                                         |
                                         v (Reserved Success)
                             +-----------------------+
                             | Kafka Checkout Queue  |
                             +-----------+-----------+
                                         |
                                         v
                             +-----------------------+
                             | Payment & Order Svc   |
                             | (RDBMS Transactions)  |
                             +-----------------------+
\`\`\`
`
  },

  "notification-system": {
    title: "Design a Distributed Notification System",
    slug: "notification-system",
    description: "Architect a multi-channel notification engine delivering billions of push notifications, SMS texts, and emails with user preference filters, rate limiting, and priority queues.",
    difficulty: "MEDIUM",
    category: "Infrastructure & Messaging",
    estimatedTimeMinutes: 40,
    tags: ["Infrastructure & Messaging", "Notifications", "Kafka", "Push Notifications", "Twilio", "APNS / FCM"],
    isPremium: true,
    contentMarkdown: `# Design a Distributed Notification System (Multi-Channel Scale)

Notification systems orchestrate trillions of alerts across Apple Push Notification service (APNs), Firebase Cloud Messaging (FCM), SMS (Twilio), and Email (SendGrid / SES).

---

## 1. System Requirements

### Functional Requirements
1. **Multi-Channel Delivery**: Support iOS/Android Push, SMS, Email, and in-app inbox notifications.
2. **Priority Tiers**: Urgent alerts (Two-Factor OTP codes) take precedence over promotional marketing emails.
3. **User Notification Settings**: Users can opt out of specific categories (e.g. turn off marketing push).
4. **Deduplication & Rate Limiting**: Prevent spamming a user with multiple repeated alerts within a short window.

### Non-Functional Requirements
1. **Low Latency for High-Priority Alerts**: OTP delivery latency $< 5\\text{ seconds}$.
2. **Massive Throughput**: Handle 1 Billion notifications per day.
3. **Resilience & Failover**: Automatic fallback between SMS/email gateways if a third-party vendor experiences outages.
`
  },

  "online-chess": {
    title: "Design an Online Multiplayer Chess Platform",
    slug: "online-chess",
    description: "Design a real-time multiplayer chess platform featuring Elo matchmaking, WebSocket move synchronization, server-side rule verification, and clock timers.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "Gaming", "WebSockets", "Real-Time", "Matchmaking", "Redis"],
    isPremium: true,
    contentMarkdown: `# Design an Online Multiplayer Chess Platform (Chess.com / Lichess Scale)

Online multiplayer chess systems require low-latency real-time bidirectional move transmission, tamper-proof server-side move validation, sub-millisecond clock tracking, and fair Elo-based matchmaking.

---

## 1. System Requirements

### Functional Requirements
1. **Matchmaking**: Pair players of comparable Elo ratings within seconds for specified time controls (e.g. 3m Blitz, 10m Rapid).
2. **Real-time Move Synchronization**: Broadcast player moves over WebSockets with latency compensation.
3. **Authoritative Server Validation**: Validate chess move legality on the server to prevent cheating.
4. **Game Clocks**: Track player time down to the millisecond with increment bonuses (+2s per move).
5. **Spectating**: Thousands of spectators can watch high-profile grandmaster matches simultaneously.

### Non-Functional Requirements
1. **Move Latency**: End-to-end move dissemination $< 50\\text{ms}$.
2. **Lag Compensation**: Accurately subtract network transit latency so players don't lose on time due to network jitter.
3. **Scalability**: Support 500,000 concurrent active chess games.
`
  }
};
