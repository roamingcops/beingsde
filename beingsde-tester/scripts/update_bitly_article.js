const fs = require("fs");
const path = require("path");

const TOPICS_FILE = path.join(__dirname, "../../beingsde-ui/src/data/topics.json");

const bitlyMarkdown = `# Design Bitly (Scalable URL Shortener & Analytics Platform)

URL shorteners like **Bitly**, **TinyURL**, and **t.co** transform long, unwieldy URLs into concise, branded links (e.g. \`https://sho.rt/aX9z3\`). While conceptually simple, designing a production-grade URL shortener tests an architect's mastery of high read-to-write ratios (100:1), distributed unique ID generation, Base62 encoding, sub-15ms redirection latency, cache stampede prevention, and high-throughput real-time clickstream analytics.

---

## 1. System Requirements

### Functional Requirements
1. **Shorten URL**: Given a long URL (e.g. \`https://www.example.com/products/electronics/item-49281?campaign=summer_sale\`), generate a unique, compact short URL (e.g. \`https://sho.rt/7kX2q\`).
2. **Redirection**: Accessing the short link immediately redirects the client's browser to the canonical original destination URL.
3. **Custom Vanity Aliases**: Users can optionally specify a custom alias (e.g. \`https://sho.rt/summer-promo\`) subject to availability and reservation policies.
4. **Link Expiration & TTL**: Users can set an optional expiration date. Once expired, links return an HTTP 404 or 410 Gone.
5. **Real-Time Click Analytics**: Track total visits, referrers, geographic locations (country, city), device/browser user-agents, and timestamp series for link owners.
6. **Link Management**: Authenticated users can list their shortened links, update destination targets, or disable links.

### Non-Functional Requirements
1. **Ultra-Low Redirection Latency**: The redirect request must execute with **p99 latency < 15ms** globally.
2. **High Availability**: 99.999% uptime for the redirection engine (no single point of failure; tolerates datacenter outages).
3. **Massive Read-to-Write Asymmetry**: Reads (redirects) outnumber writes (link creations) by at least **100:1 to 500:1**.
4. **Collision-Free Guarantee**: No two distinct URLs can ever receive the same short code.
5. **Zero Redirection Degradation from Analytics**: Click metrics logging must be asynchronous and decoupled so telemetry ingestion never delays user redirection.
6. **Anti-Abuse & Malicious URL Detection**: Scan destination URLs against threat feeds (e.g. Google Safe Browsing) to prevent malware and phishing.

---

## 2. Scale & Capacity Estimation

### Traffic Calculations
* **New URLs Shortened (Writes)**: $100\\text{ Million per month}$
  $$\\text{Write QPS} = \\frac{100 \\times 10^6}{30 \\times 86,400} \\approx 40\\text{ writes/sec (Peak: } 200\\text{ writes/sec)}$$
* **URL Redirections (Reads)**: $100:1\\text{ Read-to-Write Ratio} \\rightarrow 10\\text{ Billion redirects per month}$
  $$\\text{Read QPS} = \\frac{10 \\times 10^9}{30 \\times 86,400} \\approx 3,850\\text{ reads/sec (Peak: } 20,000\\text{ reads/sec)}$$

### Storage Calculations (5-Year Horizon)
* **Storage per URL Mapping**:
  * \`short_code\`: 7 bytes (VARCHAR)
  * \`original_url\`: 512 bytes average (VARCHAR)
  * \`user_id\`: 16 bytes (UUID)
  * \`created_at\` + \`expires_at\`: 16 bytes (Timestamps)
  * Metadata & Index B-Tree overhead: $\\approx 150\\text{ bytes}$
  * **Total per record**: $\\approx 700\\text{ bytes}$
* **5-Year Growth**:
  $$100\\text{M/month} \\times 12 \\times 5 = 6\\text{ Billion records}$$
  $$6 \\times 10^9 \\times 700\\text{ bytes} \\approx 4.2\\text{ TB (over 5 years)}$$
  *Takeaway:* $4.2\\text{ TB}$ is remarkably compact! A modest 3-node PostgreSQL or DynamoDB cluster can store the entire 5-year dataset with ease.

### Memory & Caching Calculations (80/20 Pareto Rule)
* Top 20% of active URLs drive 80% of daily redirect traffic.
* **Daily Redirects**: $\\frac{10 \\times 10^9}{30} \\approx 330\\text{ Million redirects/day}$.
* **Active URLs to Cache**: $330\\text{M} \\times 20\\% = 66\\text{ Million URLs}$.
* **Cache Memory Required**:
  $$66 \\times 10^6 \\times 700\\text{ bytes} \\approx 46\\text{ GB of RAM}$$
  *Takeaway:* A small Redis cluster (e.g. 2 instances of 32 GB RAM with master-replica replication) easily caches all hot redirect mappings in memory.

---

## 3. High-Level Architecture Blueprint

\`\`\`
                                      +------------------------------------+
                                      |            Client Web / App        |
                                      +------------------+-----------------+
                                                         |
                                                         | HTTPS
                                                         v
                                      +------------------------------------+
                                      |         Cloudflare Edge CDN        |
                                      |     (DNS, DDoS & Edge Caching)     |
                                      +------------------+-----------------+
                                                         |
                                                         v
                                      +------------------------------------+
                                      |          API Gateway / ALB         |
                                      |     (Rate Limiter, TLS Term)       |
                                      +--------+------------------+--------+
                                               |                  |
           +-----------------------------------+                  +-----------------------------------+
           | Write: POST /api/v1/urls                                 | Read: GET /{short_code}
           v                                                          v
+------------------------+                                 +------------------------+
| URL Shortening Service |                                 |  Redirection Service   |
+-----------+------------+                                 +-----------+------------+
            |                                                          |
            | 1. Generate Snowflake ID & Base62                        | 1. Check Redis Cache
            | 2. Verify Safe Browsing                                  v
            | 3. Write DB                                  +------------------------+
            v                                              |  Redis Cluster Cache   |
+------------------------+                                 |  (Hot URL Mappings)    |
| Primary Database       |                                 +-----------+------------+
| (PostgreSQL / DynamoDB)|<============================================+ (On Cache Miss: Fetch DB)
+------------------------+
                                                                       |
                                                                       | 2. Asynchronous Click Event
                                                                       v
                                                           +------------------------+
                                                           | Kafka Event Stream     |
                                                           | (topic: url-clicks)    |
                                                           +-----------+------------+
                                                                       |
                                                                       v
                                                           +------------------------+
                                                           | ClickHouse / Flink     |
                                                           | (Real-time Analytics)  |
                                                           +------------------------+
\`\`\`

---

## 4. Short Code Generation: Core Strategies

Generating a short code involves mapping a unique key into a compact alphanumeric namespace.

### The Character Space: Base62 Encoding
By using lowercase letters (\`a-z\`), uppercase letters (\`A-Z\`), and digits (\`0-9\`), we have $26 + 26 + 10 = 62$ distinct characters.
* A **6-character** string provides: $62^6 \\approx 56.8\\text{ Billion}$ unique combinations.
* A **7-character** string provides: $62^7 \\approx 3.52\\text{ Trillion}$ unique combinations.
* A **8-character** string provides: $62^8 \\approx 218\\text{ Trillion}$ unique combinations.

*Decision:* A **7-character Base62 code** provides more than enough capacity for centuries of growth while remaining short and easily readable.

---

### Comparison of Generation Approaches

| Generation Strategy | Mechanism | Collision Risk | Latency / Overhead | Production Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **1. Hash Truncation (MD5/SHA-256)** | \`MD5(long_url)\` truncated to first 7 chars. | **High collision rate** (Birthday paradox forces DB lookup & retry loops). | Slower ($O(K)$ queries on collisions). | **Not recommended** due to collision coordination. |
| **2. Auto-Increment SQL ID -> Base62** | Standard SQL auto-increment integer converted to Base62. | **Zero collisions**. | Fast, but single-master DB ID bottleneck; predictable sequential URLs. | Good for small apps; poor for distributed scale. |
| **3. Twitter Snowflake ID -> Base62** | 64-bit distributed time-ordered integer encoded into Base62. | **Zero collisions** across distributed nodes. | **Ultra-fast ($< 1\\text{ms}$ in-memory computation)**. | **Recommended Industry Standard**. |
| **4. Key Generation Service (KGS)** | Dedicated service pre-generates random 7-char codes in offline batches. | **Zero runtime collisions** (keys marked used). | Ultra-fast ($O(1)$ token grab from memory). | Excellent, but requires maintaining separate KGS cluster. |

---

### The Recommended Implementation: Snowflake ID + Base62

\`\`\`
+-------------------------------------------------------------------------+
| 1 bit (Unused) | 41 bits (Timestamp ms) | 10 bits (Node ID) | 12 bits (Seq) |
+-------------------------------------------------------------------------+
\`\`\`

1. **Generate 64-bit Snowflake ID**:
   * $41\\text{ bits}$ of millisecond timestamp (gives 69 years of epoch time).
   * $10\\text{ bits}$ of worker machine ID (supports 1,024 distributed worker pods).
   * $12\\text{ bits}$ of local sequence number (supports 4,096 IDs per millisecond per pod).
2. **Convert Integer to Base62**:
   \`\`\`python
   BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

   def id_to_base62(num: int) -> str:
       if num == 0:
           return BASE62_CHARS[0]
       result = []
       while num > 0:
           result.append(BASE62_CHARS[num % 62])
           num //= 62
       return "".join(reversed(result))

   def base62_to_id(short_code: str) -> int:
       num = 0
       for char in short_code:
           num = num * 62 + BASE62_CHARS.index(char)
       return num
   \`\`\`

**Why this wins**:
* Generation is completely decentralized: no locks, no round-trips to a database, and zero collisions.
* Converting a 64-bit integer produces a clean 7-to-10 character string deterministically in nanoseconds.

---

## 5. API Design & Data Models

### A. API Endpoints

#### 1. Shorten Long URL
\`\`\`http
POST /api/v1/urls
Content-Type: application/json
Authorization: Bearer <token> (Optional)

{
  "original_url": "https://www.example.com/products/item-9281?campaign=summer",
  "custom_alias": "summer-deals", // Optional
  "expires_in_days": 30           // Optional (default: never)
}
\`\`\`

**Response (HTTP 201 Created):**
\`\`\`json
{
  "short_code": "summer-deals",
  "short_url": "https://sho.rt/summer-deals",
  "original_url": "https://www.example.com/products/item-9281?campaign=summer",
  "created_at": "2026-09-30T20:00:00Z",
  "expires_at": "2026-10-30T20:00:00Z"
}
\`\`\`

#### 2. Redirect URL
\`\`\`http
GET /{short_code}
User-Agent: Mozilla/5.0 ...
Referer: https://twitter.com/
\`\`\`

**Response (HTTP 302 Found):**
\`\`\`http
HTTP/1.1 302 Found
Location: https://www.example.com/products/item-9281?campaign=summer
Cache-Control: private, max-age=90
\`\`\`

---

### B. Database Schema (PostgreSQL)

\`\`\`sql
CREATE TABLE url_mappings (
    id BIGINT PRIMARY KEY,                    -- Snowflake 64-bit ID
    short_code VARCHAR(32) NOT NULL UNIQUE,   -- Base62 short code or custom alias
    original_url TEXT NOT NULL,               -- Destination URL
    user_id UUID NULL,                        -- Owner account (if logged in)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Index for instant short code lookups
CREATE UNIQUE INDEX idx_url_mappings_short_code ON url_mappings(short_code);

-- Index for user dashboard retrieval
CREATE INDEX idx_url_mappings_user_id ON url_mappings(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;
\`\`\`

---

### C. Analytics Clickstream Schema (ClickHouse OLAP)

\`\`\`sql
CREATE TABLE url_clicks (
    short_code LowCardinality(String),
    clicked_at DateTime DEFAULT now(),
    ip_address IPv4,
    country LowCardinality(FixedString(2)),
    city LowCardinality(String),
    referer String,
    browser LowCardinality(String),
    os LowCardinality(String),
    device_type LowCardinality(String)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(clicked_at)
ORDER BY (short_code, clicked_at);
\`\`\`

---

## 6. Staff-Level Deep Dives

### Deep Dive 1: HTTP 301 vs. 302 vs. 307 Redirection

| HTTP Status Code | Browser Caching Behavior | Click Tracking & Analytics | Origin Server Load | Production Standard |
| :--- | :--- | :--- | :--- | :--- |
| **301 Moved Permanently** | Browser caches redirect permanently in disk cache. | **Broken**: Subsequent clicks bypass shortener servers completely. | Lowest server load. | SEO migrations only. |
| **302 Found (Temporary)** | Browser does **not** cache permanently (queries server on every click). | **100% Exact**: Every click reaches the shortener to record telemetry. | Moderate (absorbable via Redis). | **Standard Industry Baseline**. |
| **307 Temporary Redirect** | Guarantees HTTP method preservation (e.g. POST remains POST). | **100% Exact**. | Moderate. | High-security APIs and mobile deep links. |

*Recommendation:* Use **HTTP 302 Found** (or **307 Temporary Redirect**) with a short client-side cache header (\`Cache-Control: private, max-age=90\`). This ensures every unique visit is tracked in analytics while absorbing short-term accidental double-clicks.

---

### Deep Dive 2: Cache Optimization & Mitigating Cache Stampede
With 20,000 peak read QPS, every single cache miss threatens to hit the relational database.
1. **Cache-Aside Pattern**:
   * Worker checks \`redis.get("url:" + short_code)\`.
   * On Hit: Return \`original_url\` immediately (Latency: $< 1.5\\text{ms}$).
   * On Miss: Query PostgreSQL, write to Redis with a 24-hour TTL, and return.
2. **Negative Caching (Preventing Cache Penetration)**:
   * Attackers may query millions of random non-existent codes (\`https://sho.rt/fake123\`).
   * If a code doesn't exist in PostgreSQL, store a sentinel key in Redis:
     \`redis.set("url:fake123", "__NULL__", ex=120)\` (2-minute TTL).
   * Prevents repeated DB scans for invalid URLs.
3. **Probabilistic Early Expiration (XFetch)**:
   * To prevent a thundering herd when a viral link expires, background workers asynchronously re-fetch keys slightly before expiration based on read frequency.

---

### Deep Dive 3: Custom Vanity Aliases & Race Conditions
When a user submits \`custom_alias: "black-friday"\`, multiple concurrent users might claim it at the exact same millisecond.
* **Database Unique Constraint**: The \`short_code\` column has a strict \`UNIQUE\` index.
* **Atomic Claim Flow**:
  \`\`\`sql
  INSERT INTO url_mappings (id, short_code, original_url, user_id)
  VALUES (snowflake_id(), 'black-friday', 'https://...', user_id)
  ON CONFLICT (short_code) DO NOTHING;
  \`\`\`
* If zero rows are inserted, return \`HTTP 409 Conflict\` ("Custom alias already in use").

---

### Deep Dive 4: Asynchronous Click Analytics Pipeline
Click tracking must never block the redirect response:
1. When \`GET /{short_code}\` executes, the server immediately dispatches the \`HTTP 302\` redirect header to the user.
2. The server emits an asynchronous event to a **Kafka** topic:
   \`\`\`json
   {
     "short_code": "aX9z3",
     "timestamp": 1775073600,
     "ip": "203.0.113.195",
     "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0...)",
     "referer": "https://t.co/"
   }
   \`\`\`
3. A background **Flink / Go Stream Consumer** ingests events in batches:
   * Resolves IP to Country/City via an in-memory MaxMind GeoIP2 database ($< 2\\text{ µs}$).
   * Parses user-agent into Browser and OS.
   * Flushes bulk batches (e.g. 5,000 events) into **ClickHouse** every 1 second.
4. Fast analytical queries (e.g. *"Show clicks per day over the last 30 days"*) run on ClickHouse in under 15ms using compressed columnar storage.

---

### Deep Dive 5: URL Canonicalization & Security Filtering
Before saving a long URL, it must be canonicalized to avoid duplicate links and verified against threat lists:
1. **Canonicalization**:
   * Lowercase protocol and host (\`HTTPS://EXAMPLE.COM\` -> \`https://example.com\`).
   * Strip standard default ports (\`:80\`, \`:443\`).
   * Normalize path trailing slashes (\`/path/\` vs \`/path\`).
   * Sort query parameters alphabetically.
2. **Security & Phishing Check**:
   * Asynchronously query Google Safe Browsing API.
   * Check domain against known malicious registrar lists.
   * If flagged, mark \`is_active = FALSE\` and redirect to an intermediate safety warning interstitial.

---

## 7. Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Short Code Generation** | Cryptographic Hash (MD5 / SHA-256) | **Twitter Snowflake 64-bit ID -> Base62** | Hash truncation suffers from collision cascades requiring retries. Snowflake IDs are 100% collision-free, time-ordered, and generated in memory in $<1\\text{ms}$. |
| **Redirection Status** | HTTP 301 Moved Permanently | **HTTP 302 Found (with short private cache)** | 301 is permanently cached by client browsers, destroying click analytics. 302 guarantees 100% click telemetry capture. |
| **Primary Datastore** | Monolithic Single SQL Instance | **PostgreSQL with Read Replicas / DynamoDB** | Read traffic dominates (100:1). Read replicas or distributed key-value stores allow linear scaling across global regions. |
| **Analytics Ingestion** | Synchronous database write on redirect | **Asynchronous Kafka Event Bus -> ClickHouse OLAP** | Synchronous DB writes add 20–50ms to redirect latencies. Kafka decouples ingestion, keeping redirects sub-15ms. |
| **Cache Miss Handling** | Direct SQL query | **Cache-Aside + Negative Sentinel Caching** | Storing null sentinels prevents malicious actors from exhausting database connection pools with nonexistent short codes. |
`;

function run() {
  console.log(`Reading topics from: ${TOPICS_FILE}`);
  const raw = fs.readFileSync(TOPICS_FILE, "utf-8");
  const topics = JSON.parse(raw);
  
  const idx = topics.findIndex(t => t.slug === "bitly");
  if (idx === -1) {
    console.error("Could not find topic with slug 'bitly'!");
    process.exit(1);
  }

  topics[idx] = {
    ...topics[idx],
    title: "Design Bitly (Scalable URL Shortener & Analytics Platform)",
    slug: "bitly",
    description: "Design a high-scale URL shortening and click tracking service like Bitly or TinyURL capable of handling billions of redirects with sub-15ms latency.",
    difficulty: "EASY",
    category: "System Architectures",
    estimatedTimeMinutes: 35,
    tags: ["System Architectures", "URL Shortener", "Base62", "Caching", "Distributed Systems", "Analytics", "Snowflake"],
    isPremium: true,
    contentMarkdown: bitlyMarkdown.trim()
  };

  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), "utf-8");
  console.log(`Successfully updated Bitly article! Length: ${bitlyMarkdown.length} characters.`);
}

run();
