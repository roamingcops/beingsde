/**
 * Part 3: Architecture Trade-Off & Decision Tables for remaining HLD topics
 */

module.exports = {
  kafka: `
## Key Architecture Trade-Offs & Decision Matrix

| Message Broker Platform | Message Delivery Model | Throughput Capacity | Message Ordering Guarantee | Replayability |
| :--- | :--- | :--- | :--- | :--- |
| **Apache Kafka** | Pull-based (Dumb broker, smart consumer) | Extremely High (1M+ events/sec per cluster) | Strictly guaranteed **within partition** | **Yes** (immutable append-only commit log with configurable retention) |
| **RabbitMQ** | Push-based (Smart broker, dumb consumer) | Moderate (20k–50k msgs/sec) | Guaranteed in single-queue FIFO | **No** (messages deleted upon acknowledgment) |
| **AWS SQS** | Pull-based managed cloud queue | High (virtually unlimited with standard queue) | Best-effort (Strict FIFO requires SQS FIFO with 300 TPS limit) | **No** (messages deleted after receipt) |
| **Apache Pulsar** | Unified streaming + queuing (BookKeeper storage) | Extremely High | Guaranteed within partition | **Yes** (tiered offload to S3/GCS) |
`,

  temporal: `
## Key Architecture Trade-Offs & Decision Matrix

| Workflow Orchestrator | Execution Paradigm | State Durability | Fault Recovery Mechanism | Best Fit Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Temporal / Cadence** | Code-as-Workflows (Go/Java/TS) | **Durable Execution** via append-only Event History. | Replays event history in memory to resume code at exact line of failure. | Mission-critical distributed sagas, payment flows, customer onboarding. |
| **Apache Airflow** | Python DAGs scheduled in batches | Database state table polling. | Task retry from start of task failure. | Scheduled Big Data ETL, machine learning batch model training. |
| **AWS Step Functions** | JSON-based State Machine definitions | Managed cloud state transitions. | Configured retry/catch state handlers. | Serverless microservice orchestration (AWS Lambda native). |
| **Celery** | Python distributed worker task queue | Ephemeral Redis/RabbitMQ message state. | Worker restarts task from beginning. | Simple asynchronous background jobs (sending emails, thumbnail resizing). |
`,

  "data-modeling": `
## Key Architecture Trade-Offs & Decision Matrix

| Modeling Paradigm | Normalization Level | Read Performance | Write / Update Performance | Ideal Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Normalized Relational (3NF)** | High (Zero redundant data; foreign keys enforce integrity). | Slower for complex views (requires multi-table JOINs). | Fast and anomaly-free (update data in exactly one place). | Financial ledgers, ERP systems, core user authentication. |
| **Denormalized Document (NoSQL)** | Low (Data embedded in JSON documents / pre-joined). | Ultra-fast point reads (single disk lookup fetches entire page). | Slower and complex updates (must update duplicates across documents). | User activity feeds, e-commerce product detail pages. |
| **Wide-Column Model (Cassandra)** | Query-Driven (One table per specific query pattern). | Extreme sequential read performance on partition key. | Fast append writes; no support for ad-hoc relational queries. | Time-series telemetry, chat messaging history, IoT sensors. |
| **Graph Model (Neo4j / Amazon Neptune)** | Relationship-First (Nodes, Edges, Properties). | Fast multi-hop traversals ($O(1)$ pointer chasing). | Slower bulk ingestion; high memory overhead for graph traversal. | Social connection graphs, fraud detection rings, recommendation engines. |
`,

  "proximity-search": `
## Key Architecture Trade-Offs & Decision Matrix

| Spatial Indexing Scheme | Representation | Query Performance | Memory Footprint | Boundary Edge Handling |
| :--- | :--- | :--- | :--- | :--- |
| **Geohash (Base-32)** | Hierarchical 1D string grid (e.g. \`9q8yy\`). | Fast prefix range query in B-Trees. | Low (compact strings). | Requires querying 8 adjacent neighbor cells to avoid missing border venues. |
| **Google S2 Geometry** | 64-bit integer space-filling Hilbert curve cells. | Extreme ($O(\\log N)$ 64-bit integer comparison). | Minimal (single uint64). | Superior (uniform cell shapes without polar distortions). |
| **QuadTree** | In-memory 2D tree (each node has 4 quadrants). | Fast recursive spatial traversal. | Moderate (dynamically expands in dense areas). | Natural boundary handling across spatial splits. |
| **R-Tree / PostGIS** | Hierarchical minimum bounding rectangles (MBR). | Flexible for irregular polygons and arbitrary shapes. | High (expensive disk page bounding box re-calculations). | Best for complex spatial geometric intersections (city boundaries). |
`,

  "local-delivery-service": `
## Key Architecture Trade-Offs & Decision Matrix

| Dispatch Strategy | Matching Algorithm | Customer Wait Latency | Driver Utilization | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **Greedy Nearest Neighbor** | Immediately assigns the single closest idle driver. | Low upfront dispatch delay. | Poor (sub-optimal global routing; causes driver starvation). | Small local fleets (<50 drivers). |
| **Batch Optimization Window** | Gathers orders & drivers in 10-30s windows; solves Kuhn-Munkres bipartite matching. | Slightly higher dispatch delay (+15s). | **High** (maximizes global driver efficiency, multi-order batching). | DoorDash, Uber Eats, GoPuff. |
`,

  "fb-live-comments": `
## Key Architecture Trade-Offs & Decision Matrix

| Live Streaming Challenge | Naive Solution | Production Solution | Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Celebrity Broadcast (1M Viewers)** | Fanout comment write to all 1M client sockets. | **Client-Side Comment Sampling & Edge Aggregation** | Humans cannot read 50,000 comments/sec. Edge nodes drop 95% of comments, streaming only a smooth 20 comments/sec sample. |
| **Write Surge Ingestion** | Direct write to relational database. | **Kafka Partition Buffer + Redis Ring Buffer** | Absorbs viral spikes without database locks; recent comments are cached in circular memory buffers. |
`,

  "fb-post-search": `
## Key Architecture Trade-Offs & Decision Matrix

| Search Architecture | Storage Engine | Query Latency | Real-Time Indexing Delay | Best Fit |
| :--- | :--- | :--- | :--- | :--- |
| **SQL \`LIKE '%term%'\`** | PostgreSQL / MySQL | $> 2,000\\text{ms}$ (Full table scan) | Instantaneous | Small internal admin tools (<10k records). |
| **Elasticsearch Cluster** | Apache Lucene Inverted Index | $< 50\\text{ms}$ | 1–2 seconds (segment refresh) | General e-commerce & post text search. |
| **Custom Sharded Inverted Index** | In-Memory Shards partitioned by User ID | $< 15\\text{ms}$ | $< 500\\text{ms}$ | Facebook Unicorn search engine (searching friend-only posts). |
`,

  "youtube-top-k": `
## Key Architecture Trade-Offs & Decision Matrix

| Top-K Algorithm | Memory Usage | Precision Guarantee | Streaming Real-Time? | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Exact Hash Table + Min-Heap** | $O(N)$ (prohibitive for billions of videos) | 100% Exact | No (memory explosion) | Small datasets with finite keys. |
| **Count-Min Sketch + Min-Heap** | $O(w \\times d)$ (fixed constant memory, e.g. 10 MB) | Approximate with bounded $(\\epsilon, \\delta)$ error | **Yes** (processes millions events/sec) | YouTube trending video rankings, viral tweet detection. |
| **Lossy Counting / Space-Saving** | $O(1/\\epsilon)$ memory | Guaranteed error $\\le \\epsilon N$ | **Yes** | Real-time network telemetry, DDoS attack mitigation. |
`,

  "5-techniques-meta-uses-to-scale-a-database-to-millions-of-clients": `
## Key Architecture Trade-Offs & Decision Matrix

| Meta Scaling Technique | Core Problem Solved | Mechanism & How It Works | Real-World Impact at Meta |
| :--- | :--- | :--- | :--- |
| **ZGateway Connection Multiplexing** | Database connection pool exhaustion caused by 100,000+ app servers. | Pools thousands of client connections into a handful of persistent database backend channels. | Reduced database server connections by **90%**, slashing RAM and context switching. |
| **Query Routing & Read Delegation** | Replica lag causing stale reads on critical updates. | Tracks transaction Log Sequence Numbers (LSN); routes fresh writes to primary, consistent reads to replicas. | Maximized read replica offload while guaranteeing read-your-own-writes consistency. |
| **ZippyDB Dynamic Distributed Caching** | High read contention on hot database keys. | Distributed RocksDB-backed key-value cache layer with automatic lease invalidation. | Absorbs **99% of read queries** before they ever reach underlying persistent databases. |
| **Adaptive Query Throttling** | Thundering herds and runaway batch scripts taking down clusters. | Token bucket rate limiting applied per tenant and query cost footprint. | Prevented cascading outages across Meta's global infrastructure. |
`
};
