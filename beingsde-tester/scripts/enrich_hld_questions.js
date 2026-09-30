const fs = require("fs");
const path = require("path");

const QUESTIONS_FILE = path.join(__dirname, "../../beingsde-ui/src/data/hld-questions.json");

const questionTables = {
  1: `
| Database Type | Schema Model | ACID Guarantees | Horizontal Scalability | Best Fit Workload |
| :--- | :--- | :--- | :--- | :--- |
| **SQL (Relational)** | Strict tabular schema (Foreign Keys). | Full ACID out of the box. | Challenging (Requires manual sharding/replicas). | Financial ledgers, ERP, core order checkouts. |
| **NoSQL (Document)** | Flexible JSON/BSON documents. | Single-document ACID (BASE). | Native auto-sharding out of the box. | E-commerce catalogs, user profile preferences. |
| **NoSQL (Wide-Column)** | Partition & Clustering key table. | Tunable eventual consistency. | Massive linear write scale across petabytes. | Time-series telemetry, chat messaging history. |
| **NoSQL (Key-Value)** | Opaque string or byte values. | Atomic single-key mutations. | Ultra-fast memory-speed cluster scaling. | Session storage, caching, shopping carts. |
`,

  2: `
| Scaling Approach | Scaling Dimension | Hardware Upper Bounds | Downtime Risk | Engineering Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Vertical Scaling (Scale Up)** | Add CPU, RAM, NVMe disk to existing server. | Hard physical limit (e.g. 128 cores, 4 TB RAM). | Requires downtime for hardware resize. | **Very Low** (Single codebase, zero distributed logic). |
| **Horizontal Scaling (Scale Out)** | Add more commodity worker nodes behind a Load Balancer. | Virtually unbounded linear scalability. | **Zero Downtime** (Rolling deployments & failover). | **High** (Network partitions, state synchronization, consistency). |
`,

  4: `
| Scaling Layer | Component | Architecture Responsibility | Production Technology |
| :--- | :--- | :--- | :--- |
| **Edge Routing** | Layer 7 Load Balancer | TLS termination, WebSocket handshake upgrade, sticky sessions. | Cloudflare, AWS ALB, Nginx. |
| **Connection Tier** | Gateway Socket Pods | Maintains open TCP sockets (epoll/kqueue), 100k+ connections per node. | Node.js (ws), Go (Gorilla), Netty. |
| **Message Backplane** | Distributed Pub/Sub | Inter-server message fanout across disparate gateway nodes. | Redis Pub/Sub, Redis Streams, Kafka. |
| **Presence Store** | Distributed In-Memory Store | Tracks mapping of \`user_id\` -> \`gateway_node_id\`. | Redis Cluster, Apache Cassandra. |
`,

  6: `
| DynamoDB Key / Index | Partitioning Scope | Sort Capabilities | Consistency Options | Throughput Billing |
| :--- | :--- | :--- | :--- | :--- |
| **Partition Key (PK)** | Determines physical storage partition. | Hash match (\`=\`) only. | Strong or Eventual. | Base Table RCU / WCU. |
| **Sort Key (SK)** | Physical row order within partition. | Range queries (\`begins_with\`, \`between\`). | Strong or Eventual. | Base Table RCU / WCU. |
| **Local Secondary Index (LSI)** | Same PK as base table; different SK. | Range queries on new attribute. | Strong or Eventual. | Shares Base Table capacity (10 GB max limit). |
| **Global Secondary Index (GSI)** | Completely new PK and SK. | Global range queries across all items. | **Eventual Consistency Only**. | Dedicated provisioned RCU / WCU (Unbounded). |
`,

  8: `
| Distributed Transaction Pattern | Coordination Style | Locking Duration | Network Partition Tolerance | Failure Recovery |
| :--- | :--- | :--- | :--- | :--- |
| **Two-Phase Commit (2PC)** | Centralized Coordinator. | Heavy (locks database rows across all phases). | Poor (coordinator failure locks entire cluster). | Rollback transaction. |
| **Saga (Choreography)** | Decentralized (Kafka events). | None (each service commits local ACID transaction). | High (services process events asynchronously). | Compensating transactions. |
| **Saga (Orchestration)** | Centralized Workflow Engine. | None (local transactions orchestrated sequentially). | High (orchestrator handles timeouts & retries). | Compensating transactions (Temporal/Cadence). |
`,

  9: `
| Hash Partitioning Scheme | Keys Migrated on Node Add/Remove | Load Distribution Uniformity | Node Failure Impact | Production Standard |
| :--- | :--- | :--- | :--- | :--- |
| **Naive Modulo (\`hash % N\`)** | $\\approx \\frac{N-1}{N}$ (almost 100% of dataset). | Clustered hot spots. | Complete cache eviction avalanche. | Single-node only. |
| **Naive Consistent Hashing** | $\\approx \\frac{1}{N}$ keys (only neighbor slice). | Poor without uniform ring placement. | Neighbor node absorbs double load. | Academic prototype. |
| **Consistent Hashing with V-Nodes** | $\\approx \\frac{1}{N}$ keys (distributed across all nodes). | **Excellent** (150–250 virtual nodes per server). | Load distributed evenly across all surviving nodes. | Cassandra, DynamoDB, Redis Cluster. |
`,

  10: `
| Rate Limiting Algorithm | Burst Tolerance | Memory Footprint per Client | Concurrency Implementation | Industry Standard |
| :--- | :--- | :--- | :--- | :--- |
| **Token Bucket** | Allows bursts up to bucket capacity. | 16 bytes (Tokens + LastRefillTime). | Atomic Redis Lua script. | AWS API Gateway, Stripe. |
| **Leaky Bucket** | Strictly smooths output rate. | Queue buffer size. | Lock-based FIFO queue. | Egress packet shapers. |
| **Fixed Window Counter** | Allows $2\\times$ burst at window boundary. | 8 bytes (Single counter integer). | Redis \`INCR\` + \`EXPIRE\`. | Basic tier rate limits. |
| **Sliding Window Log** | Mathematically exact rate. | High (Stores timestamp per request). | Redis Sorted Set (\`ZREMRANGEBYSCORE\`). | Strict financial security APIs. |
`,

  11: `
| Stampede Mitigation Strategy | Mechanism | DB Load on Cache Expiry | Latency Penalty | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Mutex Lock (Single Flight)** | Only 1 worker acquires distributed lock to compute DB value. | Strictly 1 DB query. | Other requests wait 50–200ms for lock release. | High-cost SQL aggregations. |
| **Probabilistic Early Expiration (XFetch)** | Refreshes cache asynchronously before actual TTL based on probability. | Near zero DB spikes. | Zero wait latency for end users. | Top-read viral keys (news, product drops). |
| **Cache Pre-Warming** | Scheduled cron job hydrates cache before expected traffic drops. | Zero peak spikes. | Zero user latency. | Super Bowl ads, Black Friday sales. |
`,

  12: `
| ID Generation Architecture | ID Size / Type | Generation Throughput | Monotonic Ordering | Single Point of Failure |
| :--- | :--- | :--- | :--- | :--- |
| **UUIDv4** | 128-bit String | Infinite (Decentralized client-side). | **No** (Random distribution degrades B-Tree indexing). | Zero SPOF. |
| **Auto-Increment DB (Ticket Server)** | 64-bit Integer | Limited by DB master write capacity (2k–5k/s). | Strictly sequential. | Central DB is SPOF. |
| **Twitter Snowflake** | 64-bit Integer | **10,000+ IDs/ms per worker node**. | **Time-ordered** (Timestamp + Machine ID + Sequence). | Zero SPOF (Independent nodes). |
| **MongoDB ObjectId** | 96-bit Hex String | High (Client-side generation). | Time-ordered prefix. | Zero SPOF. |
`,

  13: `
| Delivery Guarantee | Producer Config | Consumer Offset Commit | Risk of Duplicates | Performance Impact |
| :--- | :--- | :--- | :--- | :--- |
| **At-Most-Once** | \`acks=0\` or \`acks=1\` | Auto-commit offset *before* processing message. | Zero duplicates (Risk of data loss on crash). | Highest throughput. |
| **At-Least-Once** | \`acks=all\`, retries $> 0$ | Commit offset *after* message processing succeeds. | High risk of duplicate processing (requires idempotency). | Standard production baseline. |
| **Exactly-Once (EOS)** | \`enable.idempotence=true\` | Two-Phase Commit Transactional API across topics. | Zero duplicates, zero loss. | Moderate overhead (transactional state log). |
`,

  15: `
| Fanout Architecture | Ingestion Cost (Post Write) | Retrieval Cost (Feed Read) | Storage Footprint | Production Application |
| :--- | :--- | :--- | :--- | :--- |
| **Fanout-on-Write (Push)** | $O(N)$ where $N$ is follower count (expensive for celebrities). | $O(1)$ fast Redis read ($<20\\text{ms}$). | High (stores post ID in millions of feeds). | Regular users (<25k followers). |
| **Fanout-on-Read (Pull)** | $O(1)$ single write to author timeline. | $O(K)$ merge-sort of followed creators at read time. | Minimal (stores post once). | High-follower accounts (>100k followers). |
| **Hybrid Fanout** | Push for standard users, Pull for celebrities. | Fast $O(1)$ feed load merged with celebrity posts. | Balanced. | **Twitter, Instagram, LinkedIn**. |
`,

  16: `
| PACELC Model | If Partitioned ($P$) Choose: | Else ($E$) Choose: | Concrete Database Example |
| :--- | :--- | :--- | :--- |
| **PC / EC** | Consistency ($C$) over Availability. | Consistency ($C$) over Latency. | **Google Cloud Spanner, CockroachDB** |
| **PC / EL** | Consistency ($C$) over Availability. | Latency ($L$) over Consistency. | **PostgreSQL / MySQL with Async Read Replicas** |
| **PA / EL** | Availability ($A$) over Consistency. | Latency ($L$) over Consistency. | **Apache Cassandra, Amazon DynamoDB, Couchbase** |
| **PA / EC** | Availability ($A$) over Consistency. | Consistency ($C$) over Latency. | **VoltDB, BigTable (Tunable configurations)** |
`,

  17: `
| Storage Engine | Write Strategy | Read Strategy | Random I/O Impact | Best Fit Workload |
| :--- | :--- | :--- | :--- | :--- |
| **B-Tree** | In-place overwrite of disk pages. | Direct $O(\\log N)$ point lookups. | High random write I/O. | Read-heavy OLTP databases (PostgreSQL, MySQL). |
| **LSM-Tree** | Sequential append to MemTable + Commit Log. | Multi-SSTable scan filtered by Bloom Filters. | **Zero random write I/O** (pure sequential disk writes). | High-ingestion write workloads (Cassandra, RocksDB). |
`,

  18: `
| Retry Strategy | Formula / Backoff Delay | Stampede Prevention | Server Protection |
| :--- | :--- | :--- | :--- |
| **Fixed Interval** | $\\Delta t = C$ | **None** (Workers synchronize, repeatedly hammering server). | Dangerous. |
| **Exponential Backoff** | $\\Delta t = B \\times 2^{\\text{attempt}}$ | Low (Workers space out over time, but stay in sync). | Moderate. |
| **Exponential Backoff + Full Jitter** | $\\Delta t = \\text{random}(0, B \\times 2^{\\text{attempt}})$ | **Maximum** (Spreads worker retries uniformly across timeline). | **AWS Best Practice**. |
`,

  19: `
| Catalog Search Pattern | Query Engine | Search Latency | Fuzzy / Typo Support | Multi-Facet Filters |
| :--- | :--- | :--- | :--- | :--- |
| **SQL \`LIKE '%term%'\`** | Relational DB | $> 1,000\\text{ms}$ (Full scan). | None. | Slow (requires multi-index scans). |
| **Elasticsearch (Lucene)** | Inverted Index | $< 30\\text{ms}$. | Levenshtein edit distance built-in. | Instantaneous facet aggregations. |
| **Vector Search (ANN)** | HNSW Graph Index | $< 50\\text{ms}$. | Semantic conceptual matching. | Requires hybrid vector + scalar filter. |
`,

  20: `
| Gateway Feature | L4 Proxy (HAProxy / NLB) | L7 Gateway (Kong / Envoy / APISIX) | In-App Middleware |
| :--- | :--- | :--- | :--- |
| **Routing Granularity** | IP address & TCP/UDP port only. | HTTP Path, Method, Headers, Cookies. | Internal method calls. |
| **SSL / TLS Termination** | Fast hardware pass-through. | Full certificate termination & inspection. | None. |
| **Authentication & JWT** | Not supported. | Centralized token validation & rate limiting. | Duplicated across each service. |
| **Latency Overhead** | Sub-millisecond. | 2–5 milliseconds. | Zero network overhead. |
`,

  21: `
| Eviction Policy | Eviction Criteria | Memory Overhead | Cache Hit Ratio Pattern | Ideal Workload |
| :--- | :--- | :--- | :--- | :--- |
| **LRU (Least Recently Used)** | Evicts key with oldest access timestamp. | Doubly linked list pointers. | High for recency-skewed traffic. | General-purpose web caches. |
| **LFU (Least Frequently Used)** | Evicts key with lowest access counter. | Frequency bucket counters. | High for stable popular items. | E-commerce product catalogs. |
| **ARC (Adaptive Replacement)** | Dynamically balances between LRU and LFU. | High (tracks ghost lists of evicted keys). | Consistently superior hit rates. | ZFS storage, high-end database caches. |
`,

  22: `
| Circuit Breaker State | Traffic Allowed Downstream? | Transition Condition | Action on Failure |
| :--- | :--- | :--- | :--- |
| **CLOSED (Normal)** | 100% of requests pass through. | Failure rate exceeds threshold (e.g. 50%). | Trip circuit to **OPEN**. |
| **OPEN (Tripped)** | **Zero requests** (Fails fast immediately). | Cooldown sleep window expires (e.g. 30s). | Transition to **HALF-OPEN**. |
| **HALF-OPEN (Trial)** | Canary sample of requests (e.g. 5%). | Canary requests succeed $\\rightarrow$ **CLOSED**; any fail $\\rightarrow$ **OPEN**. | Returns fallback response. |
`,

  23: `
| Replication Topology | Write Destination | Read Scalability | Conflict Resolution | Failover Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Master-Replica** | Single primary master node. | High (multiple read replicas). | None needed (single write stream). | Moderate (Sentinel / Raft leader promotion). |
| **Multi-Master** | Any master in the cluster. | High. | Complex (Last-Write-Wins or CRDTs). | Low (other masters already active). |
| **Leaderless (Dynamo)** | Quorum write across $W$ nodes. | High ($R$ nodes read). | Read repair & anti-entropy Merkle trees. | Zero (no masters to elect). |
`,

  24: `
| CDN Strategy | Caching Location | Content Type | Latency Reduction Mechanism |
| :--- | :--- | :--- | :--- |
| **Edge Caching** | Point of Presence (PoP) nearest to user. | Static assets (Images, JS, CSS, MP4). | Eliminates origin server roundtrips ($<15\\text{ms}$). |
| **Dynamic Site Acceleration** | Intermediate routing nodes. | Dynamic API payloads. | TCP route optimization, connection reuse, pre-warmed TLS. |
| **Origin Shield** | Centralized caching tier in front of origin. | Cache misses from edge PoPs. | Prevents thundering herds from collapsing origin servers. |
`,

  25: `
| Distributed Lock System | Consensus Algorithm | Heartbeat / Expiration | Split-Brain Resilience | Performance |
| :--- | :--- | :--- | :--- | :--- |
| **Redis (Redlock)** | Independent quorum votes across 5 nodes. | Time-To-Live (TTL) auto-expiry. | Moderate (clock drift can invalidate assumptions). | **Ultra-Fast** (<1ms in RAM). |
| **ZooKeeper** | ZAB (Atomic Broadcast). | Ephemeral node deleted on session loss. | **Guaranteed** (Strict CP quorum). | Fast (2-5ms). |
| **etcd** | Raft consensus. | Lease keepalive with revision tokens. | **Guaranteed** (Kubernetes gold standard). | Fast (2-5ms). |
`,

  27: `
| Push Channel | Protocol | Latency SLA | Cost per Message | Delivery Reliability |
| :--- | :--- | :--- | :--- | :--- |
| **Apple APNs / Google FCM** | HTTP/2 Persistent Stream | $< 500\\text{ms}$ | Free | Best-effort (Requires device connection). |
| **SMS (Twilio / Sinch)** | Telephony SS7 / SMPP | 2–5 seconds | High ($0.01–$0.05/msg) | High (Guaranteed delivery network). |
| **Email (SendGrid / SES)** | SMTP over TLS | 5–60 seconds | Very Low ($0.10/1k msgs) | Subject to spam folder filters. |
`,

  28: `
| Storage Architecture | Metadata Handling | Block Size | Scalability Limit | Ideal Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon S3 (Object Storage)** | Distributed flat namespace (Key-Value). | Arbitrary (Up to 5 TB per object). | Unlimited exabytes. | Media files, backups, data lake storage. |
| **Hadoop HDFS** | Centralized NameNode in RAM. | Large contiguous blocks (128 MB). | Petabytes (bounded by NameNode memory). | Batch MapReduce & big data analytical jobs. |
`,

  29: `
| Load Balancer Tier | Operating OSI Layer | Routing Decisions Based On | Throughput / Overhead | SSL / TLS Termination |
| :--- | :--- | :--- | :--- | :--- |
| **Layer 4 (L4 / NLB)** | Transport Layer (TCP / UDP). | IP address & Port number. | **Maximum** (Zero packet inspection). | Passthrough without decryption. |
| **Layer 7 (L7 / ALB / Envoy)**| Application Layer (HTTP / gRPC). | URL Path, Headers, Cookies, JSON body. | Moderate (Requires full HTTP/2 framing). | Full TLS offload & header inspection. |
`,

  30: `
| OAuth 2.0 Flow | Security Vulnerability | Client Type | Token Exposure Risk | Modern Status |
| :--- | :--- | :--- | :--- | :--- |
| **Implicit Grant** | Access token returned directly in URL hash. | SPAs & Mobile. | High (Token leaked in browser history/logs). | **Deprecated & Banned**. |
| **Auth Code (with Secret)** | Secret cannot be hidden on public clients. | Backend Web Apps. | Low (Token exchanged backchannel). | Standard for server-side apps. |
| **Auth Code + PKCE** | Cryptographic code verifier / challenge. | SPAs & Mobile. | **Zero** (Intercepted auth codes cannot be exchanged). | **Current Industry Standard**. |
`,

  31: `
| Caching Pattern | App Write Flow | DB Write Flow | Cache Stale Window | Write Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Cache-Aside** | App writes to DB. | App invalidates/deletes cache key. | Brief read window. | Low. |
| **Write-Through** | App writes to Cache. | Cache synchronously writes to DB. | Zero stale data. | High (Waits for DB commit). |
| **Write-Back (Write-Behind)** | App writes to Cache. | Cache asynchronously batches to DB. | Eventual consistency. | **Lowest** (Returns immediately). |
`,

  32: `
| Architecture Paradigm | Network Traffic Handling | Encryption & Auth | Observability | Developer Overhead |
| :--- | :--- | :--- | :--- | :--- |
| **In-Code SDKs (Hystrix)** | Embedded in app process. | Manual TLS per service. | In-app metrics libraries. | High (Tied to specific programming languages). |
| **Service Mesh (Istio/Envoy)**| Transparent sidecar proxy per pod. | Automatic mTLS & mutual zero-trust. | Automatic distributed tracing & metrics. | **Zero application code changes** (Polyglot). |
`,

  33: `
| Telemetry Ingestion Model | Communication Direction | Network / Firewall Configuration | Resource Consumption on Worker |
| :--- | :--- | :--- | :--- |
| **Pull Model (Prometheus)** | Central server scrapes target \`/metrics\`. | Requires open inbound ports on all targets. | Minimal (Worker serves simple text HTTP endpoint). |
| **Push Model (Datadog)** | Agent pushes metrics to central collector. | Inbound ports closed; only outbound egress needed. | Moderate (Agent runs background batching daemon). |
`,

  34: `
| Connection Model | Memory Footprint on DB Master | Connection Setup Latency | Throughput Under 10k Threads |
| :--- | :--- | :--- | :--- |
| **Connection-per-Request** | Catastrophic (PostgreSQL forks process per socket). | 30–100ms TLS/Auth handshake per query. | DB engine crashes due to thread thrashing. |
| **HikariCP Connection Pool** | Fixed bounded memory (e.g. 50 connections). | **Sub-millisecond** (Reuses pre-warmed open sockets). | Optimal (Eliminates CPU context-switch overhead). |
`,

  35: `
| Idempotency Implementation | Storage Tier | Collision Behavior | Production Standard |
| :--- | :--- | :--- | :--- |
| **DB Unique Constraint** | Primary Relational DB (\`idempotency_key\`). | Returns SQL duplicate key violation (\`23505\`). | Mission-critical financial ledgers. |
| **Redis Distributed Lock + Key** | Redis Cluster (\`SET key val NX EX 120\`). | Returns HTTP 409 Conflict immediately. | High-throughput payment gateways (Stripe). |
`,

  36: `
| Real-Time Communication | Directionality | Connection State | Server Resource Utilization | Mobile Battery Efficiency |
| :--- | :--- | :--- | :--- | :--- |
| **Short Polling** | Unidirectional | Stateless | High (Repeated TCP handshakes) | Poor |
| **Long Polling** | Unidirectional | Stateful HTTP hold | Moderate | Fair |
| **Server-Sent Events (SSE)** | Unidirectional (Server -> Client) | Persistent HTTP/2 stream | Low (Multiplexed) | High |
| **WebSockets** | Full-Duplex Bidirectional | Persistent TCP socket | Moderate | Good |
`,

  37: `
| Tracing Primitive | Scope | Information Contained | Propagation Header |
| :--- | :--- | :--- | :--- |
| **Trace ID** | Entire end-to-end request lifecycle across all microservices. | Globally unique 64/128-bit identifier. | \`traceparent\` (W3C standard) |
| **Span ID** | Single unit of contiguous work within a specific microservice. | Start time, duration, service name, tags, error flags. | \`traceparent\` |
| **Baggage** | Cross-cutting user/tenant context passed across RPC boundaries. | User ID, tenant tier, feature flags. | \`baggage\` |
`,

  38: `
| Disaster Recovery Strategy | RTO (Recovery Time) | RPO (Data Loss) | Cost & Complexity |
| :--- | :--- | :--- | :--- |
| **Backup & Restore** | Hours to Days | Hours | Lowest |
| **Active-Passive (Pilot Light)** | 10–30 minutes | Minutes | Moderate |
| **Active-Passive (Warm Standby)**| Under 5 minutes | Sub-minute | High |
| **Active-Active (Multi-Region)** | **Near Zero (Immediate failover)** | Zero to Sub-second | **Highest** (Requires CRDTs & multi-region consensus) |
`,

  39: `
| Redirection Strategy | Browser Caching Behavior | Analytics Capture Accuracy | Server Load Impact |
| :--- | :--- | :--- | :--- |
| **HTTP 301 Moved Permanently** | Browser caches destination URL permanently. | Poor (Cached clicks bypass URL shortener). | **Lowest** (Reduces server traffic by 80%). |
| **HTTP 302 Found (Temporary)** | Browser queries URL shortener on every click. | **100% Exact click count and telemetry**. | Moderate (Every click hits shortener backend). |
`,

  40: `
| Bloom Filter Parameter | Mathematical Variable | Optimal Tuning Formula |
| :--- | :--- | :--- |
| **Bit Array Size** | $m$ | $m = -\\frac{n \\ln p}{(\\ln 2)^2}$ |
| **Number of Hash Functions** | $k$ | $k = \\frac{m}{n} \\ln 2$ |
| **False Positive Rate** | $p$ | Typically configured at $1\\%$ ($p=0.01$) requiring $\\approx 9.6\\text{ bits/item}$. |
`,

  41: `
| Crawler Subsystem | Engineering Challenge | Distributed Solution |
| :--- | :--- | :--- |
| **URL Frontier** | Politeness (preventing DDoS on target websites). | Multi-queue architecture with per-host polite rate limiters (1-2s delay). |
| **URL Deduplication** | Billions of URLs already crawled. | Bloom Filter + In-Memory Key-Value database. |
| **Content Deduplication** | Mirror sites & syndicated press articles. | SimHash / MinHash 64-bit fingerprinting with Hamming distance $\\le 3$. |
`,

  42: `
| Architecture Paradigm | State Representation | Read Model | Auditability | Refactoring Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Traditional CRUD** | Mutable rows in database tables. | Queries hit same tables or replicas. | Lost historical updates without separate audit logs. | Low. |
| **Event Sourcing** | Immutable append-only log of domain events. | Replayed state from beginning of time or snapshot. | **100% complete forensic audit trail**. | High (Event schema migration challenges). |
| **CQRS** | Separate Command (Write) and Query (Read) models. | Optimized read database (e.g. Elasticsearch). | High when combined with event streams. | Moderate (Eventual consistency between models). |
`,

  44: `
| Deadlock Strategy | Detection Mechanism | Resolution Action | Performance Impact |
| :--- | :--- | :--- | :--- |
| **Wait-For Graph Cycle Detection** | Database engine traverses directed dependency graph. | Aborts the "victim" transaction with least work done. | Low background overhead. |
| **Lock Timeout** | Timer expires if lock cannot be acquired within threshold. | Aborts waiting query and rolls back transaction. | Simple, but can cause false aborts under heavy load. |
| **Deterministic Ordering** | Application code acquires locks in identical alphabetical order. | **Prevents deadlocks from ever forming**. | **Zero database aborts**; requires strict coding hygiene. |
`,

  45: `
| Redis Component | Architectural Mechanism | Technical Benefit |
| :--- | :--- | :--- |
| **I/O Multiplexing** | Non-blocking Linux \`epoll\` event loop. | Single thread handles 100k+ concurrent client sockets without thread contention. |
| **Dynamic Resizing (Rehash)** | Progressive incremental rehashing across requests. | Zero latency freezing when expanding hash table buckets. |
| **Persistence (AOF vs RDB)** | Sequential disk append vs fork-based memory snapshots. | Fast recovery time with sub-second durability guarantees. |
`,

  46: `
| Deployment Strategy | Downtime | Rollback Speed | Infrastructure Cost | Blast Radius Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Rolling Deployment** | Zero | Slower (Requires reverse roll). | Standard ($1\\times$). | Moderate (Bugs hit all users gradually). |
| **Blue-Green Deployment** | Zero | **Instantaneous** (Switch router traffic). | High ($2\\times$ full environment cost). | Low (Immediate rollback to Blue environment). |
| **Canary Deployment** | Zero | Fast | Low ($1.1\\times$). | **Lowest** (Only 1–5% of live traffic tests new code). |
`,

  47: `
| Data Category | Cryptographic Standard | Key Management | Salt / Nonce Requirement |
| :--- | :--- | :--- | :--- |
| **User Passwords** | Adaptive Slow Hashing (**Argon2id / bcrypt**) | Irreversible one-way hash | Unique random salt per password (prevents Rainbow Tables). |
| **PII & Card Numbers** | Authenticated Encryption (**AES-256 GCM**) | AWS KMS / HashiCorp Vault | Unique 96-bit Initialization Vector (IV) per record. |
| **API Keys & Tokens** | High-Speed Digest (**HMAC-SHA256**) | Secret signature key | Salted token prefix. |
`,

  48: `
| Geospatial Index | Structure | Query Complexity | Best Used For |
| :--- | :--- | :--- | :--- |
| **Geohash (Base-32)** | 1D string prefix grid. | Fast B-Tree range query. | Point searches with rectangular bounding boxes. |
| **Google S2 Geometry** | 64-bit integer Hilbert curve. | $O(\\log N)$ integer comparisons. | Global spatial indexing without polar distortion (Uber). |
| **QuadTree** | 2D recursive tree. | Fast spatial quadrant pruning. | In-memory spatial index with varying density (Yelp). |
`,

  49: `
| Database Architecture | Microservice Autonomy | Schema Migration Risk | Cross-Service Queries | Blast Radius |
| :--- | :--- | :--- | :--- | :--- |
| **Shared Database (Anti-pattern)**| Low (All services locked to single DB). | High (Altering table breaks multiple teams). | Trivial SQL \`JOIN\`. | **Critical** (Single DB crash takes down entire company). |
| **Database-per-Service** | **100% Autonomous**. | Zero blast radius across services. | Requires API calls or asynchronous CQRS events. | **Isolated** (Service A outage does not affect Service B). |
`,

  50: `
| Collaboration Algorithm | Central Sequencer Required? | Conflict Resolution Mechanism | Memory Overhead | Industry Adoption |
| :--- | :--- | :--- | :--- | :--- |
| **Operational Transformation (OT)**| **Yes** (Single server linearizes all operations). | Positional transformation matrices. | Low (Stores only current document state). | Google Docs, Etherpad. |
| **CRDT (Conflict-Free Replicated)**| **No** (Peer-to-peer / decentralized friendly). | Mathematically commutative immutable IDs. | High (Requires tombstones for deletions). | Figma, Apple Notes, Yjs, Automerge. |
`
};

function run() {
  console.log(`Reading questions from: ${QUESTIONS_FILE}`);
  const raw = fs.readFileSync(QUESTIONS_FILE, "utf-8");
  const questions = JSON.parse(raw);
  console.log(`Total questions: ${questions.length}`);

  let updatedCount = 0;
  let alreadyHadTable = 0;

  questions.forEach((q) => {
    const hasTable = (q.contentMarkdown || "").includes("| ---") || (q.contentMarkdown || "").includes("| :---");

    if (questionTables[q.questionId]) {
      if (!hasTable) {
        q.contentMarkdown = (q.contentMarkdown || "").trim() + "\n\n### Key Architectural Comparison\n" + questionTables[q.questionId].trim() + "\n";
        updatedCount++;
        console.log(`[INJECTED QUESTION TABLE] -> Q${q.questionId}: ${q.title}`);
      } else {
        alreadyHadTable++;
      }
    } else if (hasTable) {
      alreadyHadTable++;
    }
  });

  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2), "utf-8");
  console.log(`\nResults:`);
  console.log(`Total questions: ${questions.length}`);
  console.log(`Updated with tables: ${updatedCount}`);
  console.log(`Already had tables: ${alreadyHadTable}`);
}

run();
