/**
 * Curated, expert trade-off and comparison tables for all High-Level Design (HLD) topics.
 */

module.exports = {
  // --- Core Databases & Storage ---
  "sharding": `
## Key Architecture Trade-Offs & Decision Matrix

| Sharding Strategy | Partitioning Logic | Pros | Cons / Challenges | Best Used When |
| :--- | :--- | :--- | :--- | :--- |
| **Range-Based Sharding** | Keys grouped by natural range (e.g., A–C, D–F or Date ranges). | Simple range queries; data stored sequentially. | Severe write hot-spots on recent date ranges. | Historical time-series archiving. |
| **Hash-Based Sharding** | \`hash(shard_key) % N_shards\` (MurmurHash3). | Uniform write distribution; eliminates hot-spots. | Range queries require querying every shard ("scatter-gather"). | User IDs, Order IDs, Key-Value lookups. |
| **Directory-Based Sharding** | Centralized lookup service maps IDs to shard locations. | Dynamic rebalancing without moving entire ranges. | Lookup service is a single point of failure and adds latency hop. | Multi-tenant SaaS with custom tenant tiers. |
| **Consistent Hashing** | Keys and nodes mapped onto a 32-bit token ring. | Adding/removing shards only remaps \`1/N\` of keys. | Requires virtual nodes to prevent uneven distribution. | Distributed caches (Redis, Memcached) & NoSQL rings. |
`,

  "database-indexing": `
## Key Architecture Trade-Offs & Decision Matrix

| Index Structure | Primary Operations | Time Complexity | Storage Overhead | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **B-Tree (Default)** | Equality (\`=\`), Range (\`<\`, \`>\`), Prefix (\`LIKE 'abc%'\`). | $O(\\log N)$ read / write | Moderate (10–25% of table size) | Primary keys, Foreign keys, timestamp ranges. |
| **Hash Index** | Exact Equality (\`=\`) only. | $O(1)$ average read | Low | Exact match key-value lookups (no range support). |
| **GIN (Generalized Inverted)** | Contains (\`@>\`), Array overlap (\`&&\`), Full-text search. | $O(\\log N)$ read, slower write | High (can exceed raw column size) | JSONB columns, tag arrays, document search. |
| **GiST (Generalized Search Tree)**| Spatial proximity, bounding box overlap, geometry. | $O(\\log N)$ spatial read | Moderate | PostGIS geospatial queries, bounding polygons. |
| **BRIN (Block Range Index)** | Min/Max values per physical disk page block. | $O(N)$ with block pruning | Tiny (<1% of B-Tree size) | Multi-terabyte append-only time-series tables. |
`,

  "caching": `
## Key Architecture Trade-Offs & Decision Matrix

| Caching Pattern | Read Flow | Write Flow | Consistency Guarantee | Best Used When |
| :--- | :--- | :--- | :--- | :--- |
| **Cache-Aside (Lazy Loading)** | App reads Cache; on miss, reads DB & populates Cache. | App writes directly to DB; invalidates or deletes Cache entry. | Eventual Consistency (slight read window of stale data). | Read-heavy workloads with unpredictable access patterns (Memcached/Redis). |
| **Read-Through** | App always reads Cache; Cache library hydrates itself from DB on miss. | App writes to DB; Cache library updates or invalidates. | Eventual Consistency (simplified application code). | Centralized data access layer with uniform query keys. |
| **Write-Through** | App reads Cache directly. | App writes to Cache; Cache synchronously writes to DB before return. | Strong Consistency (Cache and DB always in sync). | Financial or inventory data where stale reads cause business loss. Higher write latency. |
| **Write-Back (Write-Behind)** | App reads Cache directly. | App writes to Cache immediately; Cache asynchronously batches writes to DB. | Eventual Consistency (Risk of data loss if cache crashes before flush). | Write-heavy telemetry, view counters, game state sessions. |
| **Refresh-Ahead** | Cache automatically re-fetches hot keys before TTL expires. | Independent write pipeline. | High Freshness, zero cache miss latency spikes. | Highly predictable read keys (e.g. top news headlines, stock tickers). |
`,

  "consistent-hashing": `
## Key Architecture Trade-Offs & Decision Matrix

| Partitioning Scheme | Remapping on Node Addition | Hotspot Vulnerability | Implementation Complexity | Industry Standard |
| :--- | :--- | :--- | :--- | :--- |
| **Modulo Hashing (\`key % N\`)** | Moves $\\approx \\frac{N-1}{N}$ keys (almost 100% of data). | High if key distribution has patterns. | Trivial | Strictly single-node or static topologies. |
| **Naive Consistent Hashing** | Moves only $\\approx \\frac{1}{N}$ keys to neighbor. | High (nodes can be placed close together on ring). | Moderate | Baseline academic models. |
| **Consistent Hashing with Virtual Nodes** | Moves only $\\approx \\frac{1}{N}$ keys uniformly across all nodes. | Negligible (150–250 V-Nodes guarantee uniform distribution). | Moderate | Amazon DynamoDB, Apache Cassandra, Discord. |
`,

  "cap-theorem": `
## Key Architecture Trade-Offs & Decision Matrix

| System Classification | Consistency Guarantee | Availability During Network Partition | Partition Tolerance | Real-World Database Examples |
| :--- | :--- | :--- | :--- | :--- |
| **CP (Consistency + Partition Tolerance)** | Linearizable / Strong Consistency. All nodes return identical data. | Non-Available: Rejects writes if quorum partition cannot be reached. | Guaranteed | Google Cloud Spanner, Apache ZooKeeper, etcd, MongoDB (majority write). |
| **AP (Availability + Partition Tolerance)** | Eventual Consistency. Nodes return potentially stale data during split. | Available: Always accepts reads and writes across both partitions. | Guaranteed | Apache Cassandra, Amazon DynamoDB, Couchbase, Riak. |
| **CA (Consistency + Availability)** | Strong Consistency and High Availability simultaneously. | **Impossible over real networks** (networks inevitably partition/drop packets). | None | Single-node PostgreSQL or MySQL (no network partitioning across nodes). |
`,

  "real-time-updates": `
## Key Architecture Trade-Offs & Decision Matrix

| Technology | Directionality | Protocol / Transport | Connection State Overhead | Battery / Mobile Friendly | Ideal Production Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Short Polling** | Unidirectional (Client -> Server) | Standard HTTP/1.1 or HTTP/2 | Stateless (fresh TCP/TLS handshake each cycle) | Poor (wakes radio every few seconds) | Low-frequency status checks (e.g. payment processing modal). |
| **Long Polling** | Unidirectional (Client holds HTTP open) | HTTP request held until data ready | Moderate (holds connection threads open) | Moderate | Legacy browser fallback when WebSockets are blocked by proxies. |
| **Server-Sent Events (SSE)** | Unidirectional (Server -> Client) | HTTP/2 streaming | Low (multiplexed over single HTTP/2 connection) | High (automatic reconnect, built-in retry) | LLM token streaming (ChatGPT), stock price feeds, live sports scores. |
| **WebSockets** | Full-Duplex Bidirectional | Persistent TCP connection (WSS) | High (stateful socket tables on server gateways) | Moderate (requires heartbeat pings) | Multiplayer gaming, collaborative whiteboards (Figma), chat apps (Discord). |
| **WebRTC** | Peer-to-Peer Bidirectional | UDP (SRTP / SCTP) | Very Low on servers (P2P mesh once signaled) | High bandwidth on clients | Video/Voice calls (Zoom), low-latency peer-to-peer data channels. |
`,

  // --- System Architectures (HLD Problems) ---
  "uber": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Geospatial Indexing** | Geohash (Base-32 strings) | **Google S2 Geometry (64-bit cell IDs)** | S2 projects Earth onto a cube with Hilbert curves, avoiding Geohash distortion near poles and cell boundary edge anomalies. |
| **Driver Location Streaming** | HTTP Short Polling (every 3s) | **Persistent WebSockets / gRPC over TCP** | Millions of drivers transmitting GPS coordinates every 4 seconds would overwhelm HTTP connection pools. WebSockets maintain open streams with tiny 40-byte binary payloads. |
| **Dispatch Architecture** | Centralized Relational Query | **Ringpop / Distributed In-Memory Shards** | Uber partitions dispatch regions into distinct city clusters. Queries execute in memory in $<10\\text{ms}$ rather than hitting disk. |
`,

  "whatsapp": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Connection Protocol** | HTTP REST Polling | **Custom Erlang/BEAM XMPP-based WebSockets** | Erlang processes consume only 2 KB RAM per connection, allowing a single server to maintain 2M+ concurrent open chat sockets. |
| **Message Storage** | Store all messages in permanent DB | **Ephemeral Store-and-Forward Buffer** | Once delivered to the recipient device, messages are permanently erased from WhatsApp servers, minimizing storage liability and enabling true E2E encryption. |
| **Media Delivery** | Stream media through chat socket | **Encrypted Blob Storage (S3 + CDN) with Thumbnail Push** | High-resolution photos/videos are uploaded to encrypted blob storage; only the decryption key and tiny thumbnail are routed through the real-time chat channel. |
`,

  "youtube": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Video Streaming Protocol** | Monolithic MP4 Progressive Download | **Adaptive Bitrate Streaming (HLS / MPEG-DASH)** | Splits video into 2-6 second chunks encoded in multiple resolutions (1080p, 720p, 480p). Client dynamically adjusts quality based on network bandwidth. |
| **Transcoding Pipeline** | Monolithic server per video | **Distributed DAG Chunk Transcoding** | Videos are split into 10-second segments and transcoded concurrently across hundreds of spot worker nodes, reducing processing time from hours to minutes. |
| **Caching Strategy** | Uniform Cache across all videos | **Tiered 80/20 Edge Caching** | Top 20% viral videos are pushed to Edge CDNs and ISP Point-of-Presence (PoP) caches; long-tail videos are retrieved on-demand from cold object storage. |
`,

  "dropbox": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Chunking Strategy** | Fixed-size chunking (e.g. 4 MB) | **Content-Defined Chunking (Rabin Fingerprints)** | If a user inserts 1 byte at the start of a 1 GB file, fixed chunking shifts all boundaries, forcing 100% re-upload. Rabin fingerprinting keeps 99% of chunks identical. |
| **Delta Sync** | Upload whole modified file | **Block-Level Deduplication & Delta Upload** | Client only uploads the modified 4 MB chunk hashes, drastically saving cellular bandwidth and cloud storage costs. |
| **Metadata Storage** | Relational Database (single node) | **Distributed Sharded DB (Edgestore / MySQL)** | File tree hierarchy and revision logs are partitioned by \`user_id\` and \`namespace_id\` across thousands of shards. |
`,

  "ticketmaster": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Seat Concurrency Control**| Relational Row Locks (\`SELECT FOR UPDATE\`) | **Redis In-Memory Distributed Lock + TTL** | Relational DB locks create thread starvation and connection timeouts under 100,000 QPS. Redis holds the seat for 10 minutes with zero database contention. |
| **Traffic Surge Management**| Auto-scale web servers on demand | **Virtual Waiting Room (Queue-it / Token Bucket)** | Extreme 100x traffic surges (Taylor Swift) cannot be absorbed by auto-scaling. A virtual waiting room meters incoming traffic to match backend checkout throughput. |
`,

  "tinder": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Recommendation Engine** | Live Geospatial SQL Query on every swipe | **Pre-computed Candidate Deck in Redis** | Querying nearest users on every swipe would collapse databases. Recommendations are pre-computed in background batches and streamed into user session queues. |
| **Match Detection** | Asynchronous cron worker matching swipes | **Two-Way Atomic Redis Key Lookup** | When User A swipes right on B, check if key \`swipe:B:A\` exists. If yes, trigger an immediate match event in $<5\\text{ms}$ and dispatch push notifications. |
`,

  "leetcode": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Code Sandboxing** | Full Linux Virtual Machines (KVM) | **MicroVMs (AWS Firecracker) / Docker with gVisor** | Full VMs take 15-30 seconds to boot. Firecracker boots in $< 100\\text{ms}$ with strong hypervisor-level isolation and tiny memory footprint. |
| **Submission Processing** | Synchronous HTTP execution | **Asynchronous Priority Queue (Kafka / RabbitMQ)** | Prevents long-running or infinite user loops (\`while(true)\`) from tying up API web server worker threads. |
`,

  "web-crawler": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **URL Frontier Ordering** | Simple FIFO Queue | **Politeness & Priority Two-Tier Queue Mesh** | FIFO queue risks DDoS-ing a single target domain. Two-tier queues isolate domains into separate queues with polite delay timers (1-2s between requests). |
| **Deduplication** | Relational DB lookup of URL string | **Bloom Filter + Distributed In-Memory Key-Value** | Querying disk for billions of candidate links is too slow. A Bloom Filter filters 99% of unseen URLs in RAM at microsecond speeds. |
`,

  "ad-click-aggregator": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **Aggregation Engine** | Batch MapReduce (Hadoop / Spark Batch) | **Stateful Stream Processing (Apache Flink)** | Batch processing introduces 15-60 minute delays. Flink aggregates metrics in sliding windows in real time with exact sub-second accuracy. |
| **Click Deduplication** | Ignore duplicate clicks | **Sliding Deduplication Buffer (Redis + Cassandra)** | Advertisers must not be billed for accidental double-clicks or click-fraud bot loops. Clicks are deduplicated across a 10-minute sliding window. |
`,

  "fb-news-feed": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A: Fanout-on-Write (Push) | Option B: Fanout-on-Read (Pull) | Option C: Hybrid Fanout (Selected) |
| :--- | :--- | :--- | :--- |
| **Regular Users (<25k followers)** | Writes post ID to all followers' timelines. | Queries followed users' posts at read time. | **Push model**: Inexpensive fanout; feed loads in $<50\\text{ms}$. |
| **Celebrities (>100k followers)** | Write amplification bottleneck (millions of writes). | High latency; requires merging thousands of feeds. | **Pull model**: Celebrity posts are merged dynamically into follower feeds at read time. |
`,

  "bitly": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Dimension | Option A | Option B (Selected) | Trade-Off & Production Rationale |
| :--- | :--- | :--- | :--- |
| **ID Generation** | MD5 Hash truncated to 7 chars | **Distributed 64-bit Snowflake ID -> Base62** | MD5 truncation causes frequent hash collisions requiring retry loops. Snowflake counter converted to Base62 guarantees 100% collision-free URLs. |
| **HTTP Redirection Code** | 301 Moved Permanently | **302 Found (Temporary Redirect)** | 301 is cached by browsers, preventing click analytics. 302 forces every visit to route through the shortener, capturing accurate telemetry. |
`,

  "rate-limiter": `
## Key Architecture Trade-Offs & Decision Matrix

| Algorithm | Traffic Shaping (Bursts) | Memory Consumption | Concurrency Handling | Production Standard |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket** | Allows bursts up to bucket capacity; smooths refill. | Minimal (Tokens count + Timestamp). | Highly efficient via atomic Redis Lua scripts. | AWS API Gateway, Stripe API, Cloudflare. |
| **Leaky Bucket** | Strictly smooths output rate; drops overflow. | Minimal (FIFO queue buffer). | Queue locks required under multi-threading. | Network packet egress, webhook dispatchers. |
| **Fixed Window Counter** | Allows $2\\times$ burst at window boundaries. | Extremely low (single integer counter). | Trivial (\`INCR\` and \`EXPIRE\`). | Basic user quotas (e.g. 1000 requests/day). |
| **Sliding Window Log** | Mathematically exact; zero boundary spikes. | High (stores timestamp of every request in ZSET). | Memory intensive under heavy traffic. | Strict financial APIs, fraud prevention. |
| **Sliding Window Counter** | Approximate ($\approx 99\\%$ accuracy); low memory. | Low (previous window counter + current counter). | Extremely fast memory calculation. | Nginx rate limiting, high-throughput microservices. |
`
};
