/**
 * Batch A: In-depth System Architecture Breakdowns
 */

module.exports = {
  "flash-sale": {
    title: "Design a Flash Sale System (High Concurrency Checkout)",
    slug: "flash-sale",
    description: "Design an ultra-high concurrency flash sale checkout engine that prevents overselling, withstands sudden 100x traffic spikes, and enforces queue fairness.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "High Concurrency", "E-Commerce", "Rate Limiting", "Redis Lua", "Virtual Waiting Room"],
    isPremium: true,
    contentMarkdown: `# Design a Flash Sale System (High Concurrency Checkout)

Flash sales—such as limited sneaker drops, Black Friday PlayStation launches, or Taylor Swift concert tickets—present one of the most brutal engineering challenges in distributed systems: millions of concurrent users slamming the platform to buy only 1,000 available items within the span of 30 seconds.

---

## 1. System Requirements

### Functional Requirements
1. **Flash Sale Landing Page**: Display item details, current price, countdown timer, and live inventory state (\`IN_STOCK\`, \`FEW_LEFT\`, \`SOLD_OUT\`).
2. **Virtual Waiting Room**: When incoming traffic surpasses backend capacity, queue users fairly in a virtual waiting room with an estimated wait time.
3. **Atomic Inventory Reservation**: Reserve an item for 10 minutes upon successful checkout entry. If the user completes payment within 10 minutes, the order is confirmed; otherwise, inventory releases back to the pool.
4. **Order Placement & Idempotent Payment**: Securely finalize checkout with payment gateway integrations without double charges.
5. **Anti-Bot & Abuse Prevention**: Block scripted automated bot scalpers using CAPTCHAs, device fingerprinting, and account velocity checks.

### Non-Functional Requirements
1. **Strict Zero Overselling**: 1,000 available items must result in *at most* 1,000 confirmed sales. Overbooking is catastrophic.
2. **Database Protection**: The relational database must never be exposed to millions of concurrent read/write requests; traffic must be absorbed at the edge and memory tier.
3. **High Availability**: 99.99% uptime during the 30-minute flash sale window.
4. **Fairness**: Prevent early request leaks and ensure fair FIFO or lottery-based admission from the virtual waiting room.

---

## 2. Capacity & Scale Estimation

* **Total Inventory**: 5,000 units.
* **Registered Shoppers**: 2,000,000 users.
* **Traffic Surge at Drop (T=0)**: 500,000 concurrent active users clicking "Buy Now" within the first 5 seconds $\\rightarrow 100,000\\text{ peak QPS}$.
* **Database Master Capacity**: Standard PostgreSQL master handles ~2,000 write transactions/sec.
* **Core Problem**: $100,000\\text{ write QPS} \\gg 2,000\\text{ DB write capacity}$. The system will experience catastrophic database thread pool exhaustion without front-line shielding.

---

## 3. High-Level Architecture Blueprint

\`\`\`
                                  +-----------------------+
                                  |    Shopper Clients    |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Cloudflare CDN Edge   |
                                  | (Static Assets Cache) |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  |  Virtual Waiting Room |
                                  | (Token Bucket / FIFO) |
                                  +-----------+-----------+
                                              | Admitted Shoppers (10k QPS)
                                              v
                                  +-----------------------+
                                  |   Flash Sale Gateway  |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Redis Cluster Memory  |
                                  | (Atomic Lua Script    |
                                  | Inventory Reservation)|
                                  +-----+-----------+-----+
                                        |           |
             +--------------------------+           +--------------------------+
             | (Reserved Success)                   | (Stock Depleted)
             v                                      v
+------------------------+             +------------------------+
|  Kafka Order Queue     |             | Return Immediate       |
|  (Buffered Writes)     |             | "Sold Out" Payload     |
+-----------+------------+             +------------------------+
            |
            v
+------------------------+
|  Order Execution Svc   |
|  (RDBMS Transaction)   |
+-----------+------------+
            |
            v
+------------------------+
|  Payment Gateway (PSP) |
+------------------------+
\`\`\`

---

## 4. Deep Dives & Core Engineering Patterns

### Deep Dive 1: The Virtual Waiting Room
Before shoppers hit application servers, they encounter an edge Virtual Waiting Room:
1. At $T-15\\text{ minutes}$, arriving visitors receive a cryptographically signed cookie containing an assigned queue ticket number.
2. The waiting room uses WebSockets or periodic polling (every 5s) to check queue progression.
3. At drop time, the admission engine admits users in batches (e.g. 2,000 users per second) matching backend processing capacity.
4. Admitted users receive a temporary JWT checkout token valid for 10 minutes.

### Deep Dive 2: Atomic Inventory Reservation with Redis Lua
Relational row locks (\`SELECT ... FOR UPDATE\`) cause deadlocks under 100,000 concurrent updates. Instead, inventory is pre-warmed in Redis and reserved atomically via Lua:

\`\`\`lua
-- KEYS[1]: flash_sale:{item_id}:stock
-- KEYS[2]: flash_sale:{item_id}:reservations
-- ARGV[1]: user_id
-- ARGV[2]: quantity (e.g., 1)
-- ARGV[3]: reservation_ttl_seconds (e.g., 600)

local stock = tonumber(redis.call('get', KEYS[1]) or '0')
if stock < tonumber(ARGV[2]) then
    return -1 -- SOLD_OUT
end

-- Check if user already has an active reservation
if redis.call('hexists', KEYS[2], ARGV[1]) == 1 then
    return -2 -- ALREADY_RESERVED
end

-- Atomically decrement stock and record user reservation
redis.call('decrby', KEYS[1], ARGV[2])
redis.call('hset', KEYS[2], ARGV[1], ARGV[3])
return 1 -- SUCCESS
\`\`\`
Because Redis executes Lua scripts as a single atomic, uninterruptible operation on its event loop, race conditions are mathematically impossible.

### Deep Dive 3: Inventory Release on Payment Expiration
If a user reserves an item but abandons checkout:
* The reservation carries a 10-minute TTL.
* When the timer expires, a Redis KeySpace notification or a delayed Kafka message triggers a compensation worker that increments the Redis inventory counter: \`INCRBY flash_sale:{item_id}:stock 1\`.
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

Modern consumer and enterprise products deliver billions of notifications daily across Apple Push Notification service (APNs), Firebase Cloud Messaging (FCM), SMS aggregators (Twilio), and Transactional Email (SendGrid / AWS SES).

---

## 1. System Requirements

### Functional Requirements
1. **Multi-Channel Dispatch**: Support iOS/Android Push Notifications, SMS, Email, and in-app bell notifications.
2. **Templating Engine**: Dynamically render notifications with user-specific localization, names, and promotional copy.
3. **User Notification Preferences**: Respect granular user opt-in/opt-out preferences (e.g., disable marketing emails while keeping security SMS enabled).
4. **Rate Limiting & Anti-Spam**: Throttle non-critical alerts to prevent overwhelming users (e.g. max 3 marketing pushes per user per day).
5. **Priority Scheduling**: Urgent notifications (Two-Factor OTP codes, fraud alerts) bypass marketing queues and deliver in $< 3\\text{ seconds}$.

### Non-Functional Requirements
1. **High Throughput**: Capable of processing 1 Billion notifications/day with peak surges of 100,000 notifications/sec.
2. **Resilience**: Zero lost mission-critical alerts; automatic failover between third-party SMS/Email vendors.
3. **Observability**: Real-time delivery status tracking (sent, delivered, opened, bounced).

---

## 2. High-Level Architecture Blueprint

\`\`\`
                                  +-----------------------+
                                  |  Microservices Engine |
                                  |  (Order, Auth, Fraud) |
                                  +-----------+-----------+
                                              |
                                              | POST /api/v1/notifications
                                              v
                                  +-----------------------+
                                  |  Notification Gateway |
                                  |  (Auth, Validation)   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  |  Deduplication Filter |
                                  |  & User Opt-Out Check |
                                  +-----+-----------+-----+
                                        |           |
             +--------------------------+           +--------------------------+
             | High Priority (OTP)                  | Normal / Bulk Marketing
             v                                      v
+------------------------+             +------------------------+
|  Kafka Priority Queue  |             |  Kafka Standard Queue  |
+-----------+------------+             +-----------+------------+
            |                                      |
            +-------------------+------------------+
                                |
                                v
                    +-----------------------+
                    | Worker Dispatch Pools |
                    +-----+-----+-----+-----+
                          |     |     |     |
            +-------------+     |     |     +-------------+
            |                   |     |                   |
            v                   v     v                   v
     +------------+      +------------+      +------------+      +------------+
     | Apple APNs |      | Google FCM |      | Twilio SMS |      | AWS SES    |
     +------------+      +------------+      +------------+      +------------+
\`\`\`

---

## 3. Deep Dives & Edge Case Handling

### Deep Dive 1: Deduplication via In-Memory Hashes
To prevent accidental loops where a buggy payment service sends 50 duplicate SMS receipts:
* Hash: \`SHA256(user_id + channel + event_type + timestamp_minute)\`.
* The gateway attempts to store this key in Redis with \`SET key 1 NX EX 300\`. If key already exists, the duplicate notification is silently discarded.

### Deep Dive 2: Provider Failover & Circuit Breakers
If Twilio suffers an outage in Europe, SMS queues will back up.
* Workers monitor vendor error rates via a **Resilience4j / Envoy Circuit Breaker**.
* If error rate exceeds 10%, the system trips the breaker and routes European SMS traffic to a secondary vendor (e.g. Sinch or Infobip) within 500ms.
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

Multiplayer chess platforms host hundreds of thousands of concurrent real-time matches. Unlike turn-based games where players submit asynchronous moves, bullet and blitz chess require sub-millisecond clock tracking, lag compensation, anti-cheat telemetry, and instant spectator broadcasts.

---

## 1. System Requirements

### Functional Requirements
1. **Matchmaking Engine**: Pair players based on Elo rating, preferred time control (e.g. 3m+0s Blitz, 10m+0s Rapid), and geographic proximity within 5 seconds.
2. **Real-time Move Synchronization**: Transmit moves bidirectionally over WebSockets with latency $< 50\\text{ms}$.
3. **Authoritative Server Move Validation**: Validate every move against standard FIDE chess rules (including En Passant, Castling, Pawn Promotion, 50-move rule, and 3-fold repetition).
4. **Precise Game Clocks**: Track player remaining time down to the millisecond with increment bonuses.
5. **Live Spectating**: Enable thousands of concurrent users to watch high-profile grandmaster matches without loading the game server.

### Non-Functional Requirements
1. **Move Latency & Fluidity**: End-to-end move dissemination latency $< 50\\text{ms}$.
2. **Lag Compensation**: Accurately subtract network transit time from clocks so players on mobile connections aren't unfairly penalized.
3. **Cheat Resistance**: Prevent client-side memory tampering and clock manipulation.

---

## 2. High-Level Architecture Blueprint

\`\`\`
                                  +-----------------------+
                                  |    Player Clients     |
                                  +-----------+-----------+
                                              |
                                              | WebSockets (WSS)
                                              v
                                  +-----------------------+
                                  | Game Gateway Cluster  |
                                  | (Session Sticky LB)   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Game Engine Pod       |
                                  | (In-Memory Game State |
                                  | & Authoritative Clock)|
                                  +-----+-----------+-----+
                                        |           |
             +--------------------------+           +--------------------------+
             |                                                                 |
             v Move Validated                                                  v Spectator Broadcast
+------------------------+                                         +------------------------+
| Append-Only Move Log   |                                         | Redis Pub/Sub          |
| (Redis Streams / Kafka)|                                         | Spectator Hub          |
+-----------+------------+                                         +-----------+------------+
            |                                                                  |
            v                                                                  v
+------------------------+                                         +------------------------+
| Game Archive DB        |                                         | 10,000+ Spectator WSS  |
| (PostgreSQL PGN Store) |                                         | Connections            |
+------------------------+                                         +------------------------+
\`\`\`

---

## 3. Deep Dives

### Deep Dive 1: Server-Authoritative Clock & Lag Compensation
Client-side timers can be hacked with browser debugger pauses. Therefore, the server is the single source of truth for clocks:
1. When Player White makes a move, the client sends:
   \`{ game_id: "g123", move: "e2e4", client_sent_ts: 1672531200100 }\`.
2. The server records receipt timestamp: \`server_recv_ts: 1672531200150\`.
3. The server computes half the Round-Trip Time (RTT) using historical ping heartbeats.
4. Player White's clock is debited by:
   $$\\Delta t = \\text{server\\_recv\\_ts} - \\text{turn\\_start\\_ts} - \\text{estimated\\_transit\\_lag}$$
   with a maximum lag compensation clamp (e.g. capped at 200ms) to prevent exploitation of fake high ping.

### Deep Dive 2: In-Memory Board Representation (Bitboards)
Instead of a slow 2D array (\`board[8][8]\`), high-performance chess engines use **Bitboards**:
* The 64 squares of the chessboard are represented as a single 64-bit integer (\`uint64_t\`).
* A bit is set to 1 if a piece occupies that square.
* Pawn moves, knight leaps, and ray-casting for rooks/queens are computed using ultra-fast bitwise operations (\`AND\`, \`OR\`, \`XOR\`, \`popcount\`), validating moves in nanoseconds.
`
  },

  yelp: {
    title: "Design Yelp (Proximity Location Search & Spatial Indexing)",
    slug: "yelp",
    description: "Design a geospatial proximity search engine capable of locating nearby restaurants and businesses using Geohashes, QuadTrees, and Google S2 cells.",
    difficulty: "MEDIUM",
    category: "System Architectures",
    estimatedTimeMinutes: 40,
    tags: ["System Architectures", "Geospatial", "Proximity Search", "Geohash", "QuadTree", "Databases & Storage"],
    isPremium: true,
    contentMarkdown: `# Design Yelp (Proximity Location Search)

Proximity search systems allow users to query: *"Find the top-rated Italian restaurants within a 3-mile radius of my current GPS coordinates."* Serving this efficiently requires specialized geospatial indexing structures that turn 2D spatial coordinate searches into lightning-fast range queries.

---

## 1. System Requirements

### Functional Requirements
1. **Search Businesses**: Query places by GPS coordinates, radius, category (Restaurants, Bars), and filters (Rating, Price).
2. **Business Profiles**: View business details, operating hours, photos, and aggregate ratings.
3. **Reviews & Ratings**: Add reviews and ratings (1–5 stars) with photos.
4. **Business Registration & Updates**: Business owners can register new locations and edit details.

### Non-Functional Requirements
1. **Ultra-Fast Search Latency**: Geospatial queries should return within $< 100\\text{ms}$.
2. **High Read Throughput**: Search traffic is massive (100,000+ QPS), whereas business location changes are rare (write QPS $< 50$).
3. **Boundary Correctness**: Avoid missing nearby venues situated across grid boundary seams.

---

## 2. Geospatial Indexing Strategies

### 1. Geohashing
* Hierarchically subdivides the surface of the earth into a 32-character grid (base-32).
* Longer prefixes represent smaller bounding boxes:
  * Length 4: $\\approx 39\\text{ km} \\times 19\\text{ km}$
  * Length 5: $\\approx 4.9\\text{ km} \\times 4.9\\text{ km}$
  * Length 6: $\\approx 1.2\\text{ km} \\times 0.6\\text{ km}$
* **Boundary Problem**: If a user is 10 meters inside cell \`9q8yy\`, a venue 20 meters away in neighboring cell \`9q8yz\` won't match a prefix search!
* **Solution**: Always query the user's geohash plus the **8 surrounding neighbor cells**.

### 2. QuadTrees
* An in-memory 2D tree where every node recursively subdivides into 4 quadrants (NW, NE, SW, SE).
* A node splits only when it contains more than $N$ businesses (e.g. 100 venues).
* Dense cities (Manhattan) have deep trees; rural areas have shallow trees, optimizing memory footprint.

---

## 3. High-Level Architecture Blueprint

\`\`\`
                                  +-----------------------+
                                  |     Mobile Client     |
                                  +-----------+-----------+
                                              |
                                              | GET /search?lat=37.77&lng=-122.41&r=3km
                                              v
                                  +-----------------------+
                                  |     API Gateway       |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------------------+
                                  | Proximity Search Svc  |
                                  +-----+-----------+-----+
                                        |           |
             +--------------------------+           +--------------------------+
             | 1. Find Business IDs                 | 2. Hydrate Details
             v                                      v
+------------------------+             +------------------------+
|  Spatial Index Cache   |             |  PostgreSQL / DynamoDB |
|  (Redis GEO / S2 cells)|             |  (Business Profiles DB)|
+------------------------+             +------------------------+
\`\`\`
`
  },

  strava: {
    title: "Design Strava (Fitness Tracking & Segment Leaderboards)",
    slug: "strava",
    description: "Architect a fitness tracking platform processing high-frequency GPS activity streams, map matching, spatial segment detections, and real-time leaderboards.",
    difficulty: "HARD",
    category: "System Architectures",
    estimatedTimeMinutes: 45,
    tags: ["System Architectures", "Geospatial", "Leaderboards", "Time Series", "Redis Sorted Sets"],
    isPremium: true,
    contentMarkdown: `# Design Strava (Fitness Tracking & Segment Leaderboards)

Strava processes millions of high-frequency GPS activity streams uploaded by athletes, automatically detecting when a user traversed a designated "Segment" (e.g. a steep hill climb) and updating competitive global leaderboards.

---

## 1. System Requirements

### Functional Requirements
1. **Activity Recording & Upload**: Ingest GPX / FIT files containing timestamped latitude, longitude, elevation, and heart rate telemetry.
2. **Segment Matching**: Automatically detect if any portion of an activity polyline matches a crowdsourced segment.
3. **Real-time Leaderboards**: Rank the fastest all-time efforts (KOM/QOM) on any segment with instant updates.
4. **Activity Feed & Kudos**: Social feed showing friends' recent workouts.

### Non-Functional Requirements
1. **High Ingestion Throughput**: Process bursty uploads on Sunday mornings without backlog.
2. **Accurate Map Matching**: Resilient against noisy GPS drift and signal drops under tree cover.
3. **Sub-Second Leaderboard Reads**: Leaderboard queries must return in $< 50\\text{ms}$.

---

## 2. Segment Detection Algorithm: Spatial Bounding & Polyline Frechet Distance
1. **Bounding Box Filter**: Every segment has an entry bounding box and exit bounding box indexed by Geohash. If an activity doesn't intersect both, it's discarded immediately.
2. **Frechet / Hausdorff Distance**: Measures similarity between the candidate GPS trajectory and the canonical segment path.
3. **Time Calculation**: Interpolate exact timestamps at the start and finish lines to record elapsed time down to the hundredth of a second.
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

  "distributed-cache": {
    title: "Design a Distributed Cache (Redis / Memcached Cluster)",
    slug: "distributed-cache",
    description: "Design an in-memory distributed key-value caching system featuring consistent hashing, eviction policies (LRU/LFU), replication, and stampede prevention.",
    difficulty: "HARD",
    category: "Databases & Storage",
    estimatedTimeMinutes: 45,
    tags: ["Databases & Storage", "Caching", "Consistent Hashing", "Distributed Systems", "In-Memory"],
    isPremium: true,
    contentMarkdown: `# Design a Distributed Cache (Redis / Memcached Cluster)

Distributed in-memory caches sit in front of primary databases to slash read latencies from milliseconds to microseconds and absorb massive traffic spikes.

---

## 1. Core Design Goals
1. **Microsecond Latency**: Read and write operations complete in $< 1\\text{ms}$.
2. **Horizontal Scalability**: Add or remove cache nodes dynamically with minimal key movement via Consistent Hashing.
3. **High Availability**: Master-replica node pairs with automated failover via Raft or Gossip consensus.
4. **Smart Eviction**: Bound memory usage using Least Recently Used (LRU) or Least Frequently Used (LFU) algorithms.

---

## 2. Key Architecture Elements

### Consistent Hashing Ring
* Keys and cache nodes are mapped onto a 32-bit or 64-bit integer hash ring.
* Keys are assigned to the first node encountered clockwise.
* **Virtual Nodes**: Each physical server is assigned 100–250 virtual points on the ring to prevent unbalanced "hot spots" and guarantee uniform key distribution.

### Mitigating Cache Stampede (Thundering Herd)
When a hot key expires, thousands of concurrent requests miss the cache simultaneously, threatening to take down the underlying database.
* **Probabilistic Early Expiration (XFetch)**:
  $$\\Delta - \\beta \\times \\ln(\\text{rand}()) > \\text{TTL}$$
  Clients randomly refresh the cache in the background slightly before official expiration.
* **Mutex Locking**: Only the first worker to miss the cache acquires a distributed lock to recompute the database value; all other threads sleep briefly and read the refreshed cache.
`
  },

  "design-distributed-caching-redis": {
    title: "Design a Distributed Caching System (Redis Architecture)",
    slug: "design-distributed-caching-redis",
    description: "Comprehensive architecture guide for designing production-grade Redis distributed caching clusters: master-replica replication, Redis Sentinel, Redis Cluster sharding, and memory eviction.",
    difficulty: "HARD",
    category: "Databases & Storage",
    estimatedTimeMinutes: 40,
    tags: ["Databases & Storage", "Redis", "Caching", "Consistent Hashing", "Replication", "In-Memory"],
    isPremium: false,
    contentMarkdown: `# Design a Distributed Caching System (Redis Architecture)

Redis is an in-memory data structure store used as a distributed cache, message broker, and streaming engine. At scale, running single-node Redis creates single points of failure and memory bottlenecks, requiring distributed clustering architectures.

---

## 1. Redis High-Availability Architectures

### Architecture 1: Redis Sentinel (Master-Replica Failover)
* A primary node handles writes and asynchronously replicates to one or more standby replicas.
* **Sentinel Nodes**: 3 or 5 independent Sentinel daemons monitor node health via heartbeats.
* **Quorum Failover**: If the master becomes unresponsive, Sentinels vote to promote the most up-to-date replica to master and reconfigure clients automatically.

### Architecture 2: Redis Cluster (Horizontal Sharding)
* Distributes keys across up to 1,000 master nodes using **16,384 Hash Slots**:
  $$\\text{slot} = \\text{CRC16}(key) \\pmod{16384}$$
* Clients cache the hash slot routing table. If a key is queried on the wrong node, the node responds with a \`-MOVED <slot> <target_ip>\` redirection.
`
  },

  "consistent-hashing-basic": {
    title: "Consistent Hashing Architecture & Implementation",
    slug: "consistent-hashing-basic",
    description: "Deep dive into consistent hashing algorithms, virtual nodes, token rings, and minimal key remapping during cluster resizing in distributed databases.",
    difficulty: "MEDIUM",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 35,
    tags: ["Core Fundamentals", "Consistent Hashing", "Distributed Systems", "Sharding", "Cassandra", "DynamoDB"],
    isPremium: false,
    contentMarkdown: `# Consistent Hashing Architecture & Implementation

In distributed databases and caching tiers, mapping data keys to server nodes using standard modulo hashing (\`hash(key) % N\`) is disastrous when servers are added or removed, because changing $N$ forces almost 100% of keys to move, triggering a catastrophic cache stampede.

---

## 1. The Consistent Hashing Ring
* Both nodes and data keys are mapped onto a fixed circular space (e.g. $[0, 2^{32}-1]$) using a cryptographic hash function like MD5 or MurmurHash3.
* To locate a key, traverse the ring clockwise until encountering the first node token.

### Minimal Key Migration Property
When a node is added or removed, only $1/N$ of keys are relocated to adjacent neighbors, while the remaining $(N-1)/N$ keys stay exactly where they are!

---

## 2. Virtual Nodes (V-Nodes)
* **The Hotspot Flaw**: In a naive 3-node ring, hash points might cluster together, leaving one server with 70% of keys and another with 5%.
* **The Solution**: Assign each physical machine 100–300 "virtual nodes" scattered randomly across the ring (e.g. \`NodeA#1\`, \`NodeA#2\`, etc.).
* Guarantees statistically uniform load distribution and seamless capacity scaling.
`
  },

  "design-url-shortener": {
    title: "Design a URL Shortener (TinyURL / Bitly Architecture)",
    slug: "design-url-shortener",
    description: "Design a scalable URL shortening service capable of handling billions of redirects: Base62 encoding, distributed ID generation, database indexing, and 301 vs 302 redirect trade-offs.",
    difficulty: "EASY",
    category: "System Architectures",
    estimatedTimeMinutes: 30,
    tags: ["System Architectures", "URL Shortener", "Base62", "Caching", "NoSQL", "Snowflake"],
    isPremium: false,
    contentMarkdown: `# Design a URL Shortener (TinyURL / Bitly Architecture)

URL shorteners convert long URLs (e.g. 150 characters) into concise aliases (e.g. \`https://sho.rt/aX9z3\`), serving massive 100:1 read-to-write redirect traffic.

---

## 1. System Requirements

### Functional Requirements
1. **Shorten URL**: Given a long URL, return a unique 7-character short alias.
2. **Redirect**: Accessing the short link redirects the user to the original destination URL.
3. **Analytics**: Track total clicks and click timestamp metrics.
4. **Custom Aliases**: Optional user-specified vanity URLs (e.g. \`/black-friday\`).

### Non-Functional Requirements
1. **Low Redirect Latency**: Redirections should complete in $< 20\\text{ms}$.
2. **High Availability**: 99.999% uptime for redirect resolution.

---

## 2. Base62 Encoding & Unique ID Generation
A 7-character alphanumeric string using Base62 characters (\`[a-z, A-Z, 0-9]\`) provides:
$$62^7 \\approx 3.52 \\times 10^{12} \\text{ (3.5 Trillion unique short URLs)}$$

### Distributed ID Generator (Snowflake Pattern)
Rather than hashing the URL (which causes collisions and requires database lookups), generate a 64-bit integer using a distributed ID generator (Twitter Snowflake), then convert that integer directly to Base62:
\`\`\`
ID: 10,000,000,000 -> Base62: "aZ4b1q"
\`\`\`

---

## 3. HTTP 301 vs. HTTP 302 Redirection
* **301 Moved Permanently**: Browsers cache the redirect locally. Subsequent clicks bypass the URL shortener server completely.
  * *Pros*: Lowest server load.
  * *Cons*: Analytics (click counts) cannot be recorded for cached clicks!
* **302 Found (Temporary Redirect)**: The browser always queries the URL shortener on every click.
  * *Pros*: 100% accurate click analytics and tracking.
  * *Cons*: Higher server traffic.
`
  }
};
