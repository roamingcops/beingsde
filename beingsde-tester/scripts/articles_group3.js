/**
 * Group 3: Deep Dives, Core Fundamentals & Distributed Patterns
 */

module.exports = {
  postgresql: {
    title: "PostgreSQL Deep Dive (Relational Architecture & Performance Tuning)",
    slug: "postgresql",
    description: "Deep dive into PostgreSQL internals: Multi-Version Concurrency Control (MVCC), Write-Ahead Logging (WAL), index structures (B-Tree, GIN, GiST), VACUUM tuning, and connection pooling.",
    difficulty: "HARD",
    category: "Databases & Storage",
    estimatedTimeMinutes: 40,
    tags: ["Databases & Storage", "PostgreSQL", "MVCC", "WAL", "Indexing", "Performance Tuning"],
    isPremium: false,
    contentMarkdown: `# PostgreSQL Deep Dive (Relational Architecture & Tuning)

PostgreSQL is one of the world's most battle-tested, feature-rich open-source relational database management systems. Understanding its internal execution model, indexing mechanics, and memory hierarchy is critical for designing scalable transactional systems.

---

## 1. Process Architecture & Memory Layout

PostgreSQL uses a multi-process architecture (rather than multi-threaded):
* **Postmaster (Main Process)**: Listens for incoming connections on port 5432 and forks a dedicated backend process for each client connection.
* **Shared Memory Area**:
  * **Shared Buffers**: Caches database disk pages (typically allocated 25–40% of total host RAM).
  * **WAL Buffers**: Buffers Write-Ahead Log entries before flushing to disk.
  * **CLOG (Commit Log)**: Tracks transaction commit/rollback status bits.
* **Per-Backend Private Memory**:
  * **\`work_mem\`**: Memory allocated for sorts, hash joins, and aggregations per query operation.
  * **\`maintenance_work_mem\`**: Memory used for VACUUM, CREATE INDEX, and foreign key validations.

---

## 2. Multi-Version Concurrency Control (MVCC)

PostgreSQL implements MVCC to allow readers not to block writers, and writers not to block readers.
* Every row (tuple) contains hidden header fields:
  * \`xmin\`: The transaction ID ($TxID$) that inserted the row.
  * \`xmax\`: The transaction ID that deleted or updated the row (0 if live).
* **Updates as Deletes + Inserts**: When a row is updated, PostgreSQL does not overwrite the existing data in-place. Instead, it marks the current tuple with \`xmax = current_txid\` and writes a completely new tuple with \`xmin = current_txid\`.

### The Problem: Table Bloat & Dead Tuples
Because dead tuples remain on disk to satisfy older active transaction snapshots, heavy update workloads cause table and index bloat.
* **VACUUM**: Scans pages, marks dead tuple space as reusable for future inserts.
* **Autovacuum Tuning**:
  * Lower \`autovacuum_vacuum_scale_factor\` (e.g. from 0.2 to 0.05) on high-write tables to trigger vacuuming sooner.
  * Increase \`autovacuum_cost_limit\` to prevent vacuum throttling during high I/O windows.

---

## 3. Write-Ahead Logging (WAL) & Durability
* Before any data page is modified in RAM (\`Shared Buffers\`), the change is sequentially written to the Write-Ahead Log on disk.
* **fsync**: Guarantees disk durability upon commit.
* **Checkpointing**: Flushes dirty shared buffer pages to the actual database files on disk and truncates old WAL logs.

---

## 4. Indexing Deep Dive: When to Use What
* **B-Tree (Default)**: Best for equality (\`=\`) and range queries (\`<\`, \`>\`, \`BETWEEN\`).
* **GIN (Generalized Inverted Index)**: Indexes composite elements (JSONB columns, full-text search tsvector, array intersections).
* **GiST (Generalized Search Tree)**: Used for geometric shapes, geospatial coordinates (PostGIS), and range types.
* **BRIN (Block Range Index)**: Extremely small index for multi-gigabyte tables where data is physically sorted by time (e.g. \`created_at\`).
`
  },

  flink: {
    title: "Apache Flink Deep Dive (Stateful Stream Processing)",
    slug: "flink",
    description: "Deep dive into Apache Flink: Exactly-Once processing semantics, Chandy-Lamport distributed checkpointing, Event Time vs Processing Time, Watermarks, and RocksDB state backends.",
    difficulty: "HARD",
    category: "Infrastructure & Messaging",
    estimatedTimeMinutes: 40,
    tags: ["Infrastructure & Messaging", "Stream Processing", "Apache Flink", "Event Time", "RocksDB", "Big Data"],
    isPremium: false,
    contentMarkdown: `# Apache Flink Deep Dive (Stateful Stream Processing)

Apache Flink is the gold standard for high-throughput, low-latency stateful stream processing, powering real-time fraud detection at Uber, metrics aggregation at Netflix, and clickstream analytics at Alibaba.

---

## 1. Stream Processing Fundamentals

### Time Semantics
* **Event Time**: The timestamp when the event actually occurred on the client device (e.g. smartphone sensor).
* **Ingestion Time**: The timestamp when the event entered the Kafka message broker.
* **Processing Time**: The local machine clock time on the Flink worker executing the operator.

### Watermarks: Handling Out-of-Order Data
Because mobile networks cause packets to arrive out of order, Flink uses **Watermarks**:
$$\\text{Watermark}(t) = \\max(\\text{EventTime}) - \\text{AllowedLateness}$$
A watermark of $t$ asserts: *"We assume no more events with timestamp $\\le t$ will arrive."* When the watermark passes a window's end time, the window is finalized and evaluated.

---

## 2. Fault Tolerance: Chandy-Lamport Checkpointing & Exactly-Once
Flink achieves true **Exactly-Once** state guarantees without stopping the stream:
1. **Checkpoint Barriers**: The JobManager injects checkpoint barriers into the source streams.
2. Barriers flow downstream interleaved with normal data tuples.
3. When an operator receives barriers from all input channels, it snapshots its local state asynchronously to durable storage (S3/HDFS).
4. If any node crashes, all operators roll back their state to the last successful checkpoint and Kafka source offsets are reset.

---

## 3. State Backends: Memory vs. RocksDB
* **HashMap State Backend**: State lives on the JVM heap. Ultra-fast microsecond access, but limited by host RAM.
* **EmbeddedRocksDBStateBackend**: Out-of-core state engine. Data is stored in local NVMe disk backed by LSM-trees. Supports terabytes of state per task slot.
`
  },

  zookeeper: {
    title: "Apache ZooKeeper Deep Dive (Consensus & Coordination)",
    slug: "zookeeper",
    description: "Explore Apache ZooKeeper: the ZAB (ZooKeeper Atomic Broadcast) consensus protocol, hierarchical ZNodes, ephemeral nodes, distributed locks, and split-brain mitigation.",
    difficulty: "HARD",
    category: "Infrastructure & Messaging",
    estimatedTimeMinutes: 40,
    tags: ["Infrastructure & Messaging", "Distributed Consensus", "ZooKeeper", "Coordination", "Distributed Locks"],
    isPremium: false,
    contentMarkdown: `# Apache ZooKeeper Deep Dive (Distributed Coordination)

ZooKeeper provides centralized coordination services for large distributed systems (Kafka, Hadoop, HBase), managing leader elections, service discovery registries, and distributed locks.

---

## 1. Data Model & ZNode Types
ZooKeeper structures data like an in-memory hierarchical Unix filesystem:
* **Persistent ZNodes**: Remain stored until explicitly deleted.
* **Ephemeral ZNodes**: Automatically deleted by the cluster when the client session disconnects or heartbeats time out. Perfect for leader election and service presence.
* **Sequential ZNodes**: Append a monotonically increasing 10-digit number to the path (e.g. \`/lock/node-0000000001\`). Used for FIFO distributed locking.

---

## 2. The ZAB Protocol (ZooKeeper Atomic Broadcast)
ZooKeeper does not run standard Raft or Paxos; it runs the proprietary **ZAB** protocol:
* **Leader Election Phase**: Nodes discover each other and elect the candidate with the highest epoch and transaction ID ($zxid$).
* **Atomic Broadcast Phase**: All state updates flow through the leader, which proposes transactions to follower nodes via two-phase commit over TCP.
* **Quorum Rule**: Writes succeed once a simple majority of nodes ($Q = \\lfloor N/2 \\rfloor + 1$) acknowledge the write to disk.

---

## 3. Building a Distributed Lock with ZooKeeper
1. Client creates an ephemeral sequential node under \`/locks/lock_\`.
2. Client inspects all children under \`/locks\`.
3. If its node has the lowest sequence number, it holds the lock!
4. If not, the client registers a **Watcher** only on the immediate preceding node (preventing the "Herd Effect" where all clients wake up simultaneously).
5. When the preceding node is deleted, the client is notified and acquires the lock.
`
  },

  "vector-databases": {
    title: "Vector Databases Deep Dive (HNSW, Embeddings & ANN Search)",
    slug: "vector-databases",
    description: "Deep dive into Vector Databases: high-dimensional embedding spaces, Approximate Nearest Neighbor (ANN) search algorithms, HNSW graphs, IVF-PQ, and similarity metrics.",
    difficulty: "HARD",
    category: "Databases & Storage",
    estimatedTimeMinutes: 40,
    tags: ["Databases & Storage", "Vector DB", "Embeddings", "HNSW", "AI / LLM", "ANN Search"],
    isPremium: false,
    contentMarkdown: `# Vector Databases Deep Dive (HNSW & ANN Search)

Vector databases (Pinecone, Milvus, Qdrant, pgvector) index multi-dimensional floating-point embeddings generated by machine learning models to enable semantic similarity search at millisecond latencies.

---

## 1. Distance Metrics for Embeddings
* **Cosine Similarity**: Measures the cosine of the angle between two vectors, invariant to vector magnitude:
  $$\\text{Cosine}(A, B) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$
* **Dot Product**: Useful when magnitude carries semantic weight (e.g. recommendation popularity).
* **Euclidean Distance ($L2$)**: Straight-line distance in Euclidean space.

---

## 2. Approximate Nearest Neighbor (ANN) Algorithms

Exact search ($K$-Nearest Neighbors) requires comparing the query vector against every record in the database ($O(N \\times D)$), which is prohibitively slow for millions of items. Vector DBs use ANN algorithms:

### Hierarchical Navigable Small World (HNSW)
* Inspired by the "Six Degrees of Separation" concept.
* Builds a multi-layer graph structure where upper layers contain sparse long-range highway edges, and lower layers contain dense local connections.
* Query starts at the top layer, performs greedy search, drops down a layer, and repeats, achieving $O(\\log N)$ search latency with high recall ($> 95\\%$).

### Inverted File Index with Product Quantization (IVF-PQ)
* Divides the vector space into Voronoi cells via $K$-Means clustering.
* Compresses 1,536-dimensional float32 vectors into small 8-bit quantization codes, slashing memory footprints by up to 95%.
`
  },

  "data-structures-for-big-data": {
    title: "Probabilistic Data Structures for Big Data",
    slug: "data-structures-for-big-data",
    description: "Master probabilistic data structures: Bloom Filters, HyperLogLog, Count-Min Sketch, and Cuckoo Filters to solve massive-scale cardinality and membership problems in constant memory.",
    difficulty: "HARD",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 35,
    tags: ["Core Fundamentals", "Data Structures", "Bloom Filter", "HyperLogLog", "Big Data", "Algorithms"],
    isPremium: false,
    contentMarkdown: `# Probabilistic Data Structures for Big Data

When operating at petabyte scale, exact data structures (like HashMaps and HashSet) consume hundreds of gigabytes of RAM. Probabilistic data structures trade a tiny, bounded margin of error for constant $O(1)$ memory efficiency.

---

## 1. Bloom Filter (Set Membership)
* **Goal**: Answer *"Has this URL been crawled?"* or *"Does this username exist?"* with zero false negatives.
* **Mechanism**: A bit array of size $m$ and $k$ independent hash functions.
* **Guarantees**:
  * If it returns **False**: The element is **definitely NOT** in the set.
  * If it returns **True**: The element is **probably** in the set (small false positive rate $p$).
* **Storage Savings**: Checks 1 Billion URLs using only ~1.2 GB of RAM instead of 64 GB for a HashSet.

---

## 2. HyperLogLog (Cardinality Counting)
* **Goal**: Count Unique Daily Active Users (DAU) or distinct IP addresses.
* **Mechanism**: Hashes incoming values, counts the number of leading zeros in the binary representation. The probability of seeing $k$ leading zeros is $2^{-k}$.
* **Scale**: HyperLogLog can estimate the cardinality of billions of items with an error rate under 1% using only **1.5 KB of memory**!

---

## 3. Count-Min Sketch (Frequency Estimation)
* **Goal**: Find the most frequent items ("Heavy Hitters" / Top-$K$ trending hashtags) in a streaming network.
* Uses a 2D array of counters with depth $d$ and width $w$. Increments counters on write, returns the minimum value across hashes on query.
`
  },

  "numbers-to-know": {
    title: "Latency & Scale Numbers Every Architect Must Know",
    slug: "numbers-to-know",
    description: "Essential hardware latency numbers, network transfer speeds, and storage sizing rules of thumb necessary to ace system design capacity estimations.",
    difficulty: "EASY",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 25,
    tags: ["Core Fundamentals", "Cheat Sheet", "Latency", "Capacity Planning", "Interviews"],
    isPremium: false,
    contentMarkdown: `# Latency & Scale Numbers Every Architect Must Know

In system design interviews, demonstrating intuition for physical hardware bounds, I/O latencies, and network transfer speeds separates Junior developers from Staff Engineers.

---

## 1. Computer Latency Numbers (Order of Magnitude)

| Operation | Real Time | Scaled to Human Seconds (1 CPU cycle = 1 sec) |
| :--- | :--- | :--- |
| **L1 CPU Cache Reference** | 0.5 ns | 1 second |
| **L2 CPU Cache Reference** | 7 ns | 14 seconds |
| **RAM (Main Memory) Read** | 100 ns | 3.3 minutes |
| **Read 1 MB sequentially from RAM** | 3,000 ns (3 µs) | 1.6 hours |
| **Read 1 MB sequentially from NVMe SSD** | 250,000 ns (250 µs) | ~3 days |
| **Read 1 MB sequentially from Spinning HDD** | 20,000,000 ns (20 ms) | ~7.5 months |
| **Same Datacenter Round Trip (LAN)** | 500,000 ns (0.5 ms) | ~6 days |
| **Cross-Continent Round Trip (SF to NYC)** | 40,000,000 ns (40 ms) | ~1.3 years |
| **Trans-Atlantic Cable (NYC to London)** | 100,000,000 ns (100 ms) | ~3.2 years |

---

## 2. Capacity Sizing Rules of Thumb
* **Seconds in a Day**: $\\approx 86,400 \\approx 10^5\\text{ seconds}$.
* **QPS Rule**: 1 Million requests per day $\\approx 12\\text{ QPS}$.
* **100 Million requests per day**: $\\approx 1,200\\text{ QPS}$.
* **1 Billion requests per day**: $\\approx 12,000\\text{ QPS}$.
* **Single Redis Instance Max Throughput**: 100,000 QPS (single-threaded CPU bound).
* **Single PostgreSQL Primary Instance**: 5,000–10,000 read QPS, 1,000–2,000 write QPS before sharding.
* **Single Kafka Broker Partition**: 10–20 MB/sec sequential throughput.
`
  },

  "dealing-with-contention": {
    title: "Dealing with High Concurrency & Contention",
    slug: "dealing-with-contention",
    description: "Strategies for mitigating hot keys, race conditions, and lock contention: Optimistic Concurrency Control, Pessimistic Locking, Distributed Redlock, and Write Coalescing.",
    difficulty: "HARD",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 35,
    tags: ["Core Fundamentals", "Concurrency", "Locking", "Distributed Systems", "Race Conditions"],
    isPremium: false,
    contentMarkdown: `# Dealing with High Concurrency & Contention

High contention occurs when multiple concurrent requests attempt to mutate the exact same resource simultaneously (e.g. reserving the last seat on a flight, flash sale checkout, viral tweet like counter).

---

## 1. Concurrency Control Strategies

### 1. Optimistic Concurrency Control (OCC)
* Assumes conflicts are rare. Every record has a \`version\` column:
  \`\`\`sql
  UPDATE inventory 
  SET quantity = quantity - 1, version = version + 1 
  WHERE item_id = 42 AND version = 5;
  \`\`\`
* If zero rows were updated, a concurrent thread modified the record first; the application retries.

### 2. Pessimistic Locking (\`SELECT ... FOR UPDATE\`)
* Acquires a row-level lock on the database before reading:
  \`\`\`sql
  BEGIN;
  SELECT quantity FROM inventory WHERE item_id = 42 FOR UPDATE;
  UPDATE inventory SET quantity = quantity - 1 WHERE item_id = 42;
  COMMIT;
  \`\`\`
* **Danger**: Can cause thread starvation, connection pool exhaustion, and deadlocks under high load.

### 3. Distributed In-Memory Locking (Redlock)
* Use Redis \`SET resource_name my_random_value NX PX 30000\` to acquire a lock across distributed workers with automated TTL release.

---

## 2. Advanced Mitigation: Write Coalescing & Sharded Counters
* **Sharded Counters**: If a celebrity post receives 100,000 likes per second, updating one row locks the database. Instead, create 20 counter slots (\`post_id_slot_1\` through \`post_id_slot_20\`). Writes increment a random slot; reads sum all slots.
* **Write Coalescing**: Buffer increments in an in-memory ring buffer and flush aggregate batch updates to disk once every 100ms.
`
  },

  "multi-step-processes": {
    title: "Multi-Step Distributed Workflows (Saga & Outbox Pattern)",
    slug: "multi-step-processes",
    description: "Architect resilient multi-step distributed workflows across microservices using Saga Orchestration, Two-Phase Commit (2PC), and Transactional Outbox patterns.",
    difficulty: "HARD",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 40,
    tags: ["Core Fundamentals", "Saga Pattern", "Distributed Transactions", "Transactional Outbox", "Event-Driven"],
    isPremium: false,
    contentMarkdown: `# Multi-Step Distributed Workflows (Sagas & Outbox)

In a microservices architecture, business workflows span multiple independent services (e.g. Order Service, Payment Service, Inventory Service). Because distributed Two-Phase Commit (2PC) does not scale well over networks, modern systems use the **Saga Pattern**.

---

## 1. The Saga Pattern

A Saga is a sequence of local transactions where each step updates a local database and emits a message. If a step fails, the Saga executes **Compensating Transactions** to undo prior steps:

\`\`\`
Step 1: Reserve Inventory (Success)
Step 2: Debit Customer Card (Failed - Insufficient Funds!)
Compensation Step 1: Release Reserved Inventory
\`\`\`

### Orchestration vs. Choreography
* **Choreography (Event-Driven)**: Services listen to Kafka events and publish completion events. Simple for short workflows, but difficult to monitor and debug as topologies grow.
* **Orchestration (Centralized Coordinator)**: A dedicated workflow engine (Temporal, AWS Step Functions) centrally commands each participant what step to execute next and handles timeouts.

---

## 2. The Transactional Outbox Pattern
How do you guarantee that a database update and a Kafka message emission both succeed without dual-write failures?
1. Write the business data AND the outbound event into an \`outbox\` table within the **same local ACID database transaction**.
2. A background Debezium (Change Data Capture) or Polling process reads the outbox table and streams the events to Kafka with at-least-once delivery.
`
  },

  "scaling-reads": {
    title: "Scaling Reads (Replication, CQRS & Multi-Level Caching)",
    slug: "scaling-reads",
    description: "Techniques for scaling read-heavy systems: Read Replicas, Multi-Tier Caching (L1/L2), Command Query Responsibility Segregation (CQRS), and Edge CDNs.",
    difficulty: "MEDIUM",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 30,
    tags: ["Core Fundamentals", "Scaling", "Caching", "CQRS", "Replication", "CDN"],
    isPremium: false,
    contentMarkdown: `# Scaling Reads (Replication, CQRS & Edge Caching)

Most consumer internet platforms (Twitter, YouTube, Wikipedia) experience extreme 100:1 or 1,000:1 read-to-write ratios.

---

## 1. Multi-Tier Caching Architecture
1. **L1 Client / Browser Cache**: Cache-Control headers, Service Worker caches, local storage.
2. **L2 Edge CDN**: Cloudflare / CloudFront caches static media, API responses, and HTML fragments close to the user's geographic location.
3. **L3 Application Local Memory**: In-memory Guava / Caffeine cache in service RAM ($< 1\\text{ µs}$ access).
4. **L4 Distributed In-Memory Cache**: Redis / Memcached cluster ($< 1\\text{ ms}$ access).

---

## 2. Database Read Replicas & Replication Lag
* Master handles writes; multiple Read Replicas serve read queries.
* **Read-Your-Own-Writes Consistency**: If a user updates their profile picture, their next read might query an asynchronous replica that is 500ms behind.
* **Solution**: Route queries to the primary database for 5 seconds after a write, or track the client's write $LSN$ (Log Sequence Number).
`
  },

  "scaling-writes": {
    title: "Scaling Writes (Sharding, Partitioning & Write-Ahead Queues)",
    slug: "scaling-writes",
    description: "Techniques for scaling write-heavy architectures: Horizontal Database Sharding, Hash vs Range Partitioning, Asynchronous Write Buffering, and LSM-Trees.",
    difficulty: "HARD",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 35,
    tags: ["Core Fundamentals", "Scaling", "Sharding", "Partitioning", "LSM Tree", "Databases"],
    isPremium: false,
    contentMarkdown: `# Scaling Writes (Sharding, Partitioning & Queues)

When write throughput exceeds the physical limits of a single database master's NVMe drive, systems must shard data across physical nodes and decouple writes through asynchronous queuing.

---

## 1. Database Sharding Strategies
* **Range-Based Sharding**: Partition data by alphabetical or numerical range (e.g. Users A–F on Shard 1, G–M on Shard 2).
  * *Pitfall*: Causes unbalanced write hot spots on specific ranges.
* **Hash-Based Sharding**: Compute \`hash(partition_key) % N_shards\` to distribute rows evenly.
* **Directory-Based Sharding**: A lookup service maps specific entities to shard IDs, enabling easy re-balancing.

---

## 2. Write Buffering & LSM-Trees
* Relational databases using B-Trees require random disk I/O, which degrades write speed.
* NoSQL databases (Cassandra, RocksDB) use **Log-Structured Merge-Trees (LSM-Trees)**:
  * Writes are appended sequentially to an in-memory **MemTable** and a commit log.
  * Flushed sequentially to immutable **SSTables** on disk, turning slow random writes into fast sequential writes.
`
  },

  "handling-large-blobs": {
    title: "Handling Large Blobs & File Uploads at Scale",
    slug: "handling-large-blobs",
    description: "Design resilient file and video upload pipelines: S3 Presigned URLs, Multipart Uploads, Resumable Chunking, and Zero-Copy streaming.",
    difficulty: "MEDIUM",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 30,
    tags: ["Core Fundamentals", "File Upload", "S3", "Multipart Upload", "Chunking", "Blob Storage"],
    isPremium: false,
    contentMarkdown: `# Handling Large Blobs & File Uploads at Scale

Streaming a 5 GB video file through your API Gateway consumes backend thread pools, eats memory buffers, and is vulnerable to complete failure if a cell tower disconnects at 99%.

---

## 1. Direct-to-Storage with Presigned URLs
Never pipe massive file payloads through your microservice containers!
1. Client requests upload ticket: \`POST /api/v1/uploads { filename: "vid.mp4", size: 5GB }\`.
2. Backend generates a cryptographically signed Amazon S3 / GCS **Presigned URL** with a 15-minute expiration.
3. Client uploads directly to the S3 bucket using HTTP \`PUT\`.
4. S3 fires an event notification (SNS / SQS) to trigger asynchronous transcoding pipelines.

---

## 2. Multipart & Resumable Uploads
* Splits the file into 5 MB–20 MB binary chunks on the client.
* Uploads chunks in parallel over multiple TCP streams.
* If Chunk #42 fails due to packet loss, only that 10 MB chunk is retried, not the entire 5 GB video.
`
  },

  "managing-long-running-tasks": {
    title: "Managing Long-Running Background Tasks",
    slug: "managing-long-running-tasks",
    description: "Architect async background job pipelines: task decoupling, polling vs Server-Sent Events vs Webhooks, dead letter queues, and graceful cancellation.",
    difficulty: "MEDIUM",
    category: "Core Fundamentals",
    estimatedTimeMinutes: 30,
    tags: ["Core Fundamentals", "Background Jobs", "Worker Queues", "Async Processing", "Webhooks"],
    isPremium: false,
    contentMarkdown: `# Managing Long-Running Background Tasks

Operations like generating complex tax PDF reports, running ML model inference, or exporting database backups take seconds to minutes, making synchronous HTTP request/response loops unfeasible.

---

## 1. Asynchronous Job Lifecycle Pattern
1. **Submit**: Client sends \`POST /reports/generate\`.
2. **Accept (202 Accepted)**: Server enqueues job into Kafka / SQS and returns \`HTTP 202 Accepted\` with a \`Location: /reports/status/{job_id}\` header.
3. **Execution**: Celery / Temporal worker consumes the job, updating status in Redis.
4. **Completion Delivery**:
   * **Client Polling**: Client polls status endpoint every 2 seconds with exponential backoff.
   * **Server-Sent Events (SSE)**: Server pushes real-time progress percentages (\`progress: 75%\`).
   * **Webhooks**: For B2B integrations, server executes an HTTP POST to the client's webhook endpoint upon job completion.
`
  }
};
