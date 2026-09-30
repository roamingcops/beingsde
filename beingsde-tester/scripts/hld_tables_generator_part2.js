/**
 * Part 2: Expert Trade-Off & Decision Tables for Databases & Real-World Case Studies
 */

module.exports = {
  redis: `
## Key Architecture Trade-Offs & Decision Matrix

| Redis Clustering Architecture | Sharding Mechanism | Failover Mechanism | Scalability Limit | Ideal Production Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Master-Replica (Standalone)** | None (single primary node). | Manual intervention. | Limited by single machine RAM (e.g. 64 GB). | Small apps, development environments, session caches. |
| **Redis Sentinel** | None (single master + read replicas). | Automated Sentinel quorum failover. | Write throughput bounded by single master CPU. | Highly available read-heavy caches under 50 GB. |
| **Redis Cluster** | Hash slots (\`16,384\` slots via CRC16). | Automated master-replica failover via gossip. | Scales to 1,000+ nodes, terabytes of memory. | Large-scale microservice platforms (Uber, Twitter). |
| **Twemproxy / Envoy Proxy** | Client-side or proxy consistent hashing. | External health checking. | High throughput; hides sharding from legacy clients. | Large heterogeneous Redis/Memcached fleets. |

### Persistence Trade-Offs: RDB vs. AOF

| Persistence Mode | Recovery Speed | Data Loss Risk (RPO) | Disk I/O Overhead | Production Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **RDB (Snapshotting)** | Ultra-fast (loads raw binary memory image). | High (all writes since last snapshot lost, e.g. 5m). | Low during interval, bursty during fork. | Backups and disaster recovery cold storage. |
| **AOF (\`fsync everysec\`)** | Slower (must replay every write command). | Minimal (at most 1 second of data lost). | Predictable, continuous background disk write. | Financial or session data requiring durability. |
| **Hybrid (RDB + AOF)** | Fast (loads RDB base, replays incremental AOF). | Minimal (<1 second). | Balanced. | **Production Standard** in Redis 5.0+. |
`,

  elasticsearch: `
## Key Architecture Trade-Offs & Decision Matrix

| Search Indexing Technology | Algorithm / Data Structure | Search Latency | Write / Ingestion Latency | Ideal Workload |
| :--- | :--- | :--- | :--- | :--- |
| **Inverted Index (Lucene / ES)** | Postings list of term-to-document IDs. | Sub-50ms fuzzy & full-text search. | Slower (requires text tokenization and segment merge). | E-commerce catalogs, log analytics (ELK), document search. |
| **B-Tree Index (PostgreSQL/MySQL)** | Balanced multi-way search tree. | Fast for exact matches and range filters. | Fast, in-place updates. | Relational OLTP transactions, primary key lookups. |
| **Columnar Index (ClickHouse)** | Column-oriented compressed blocks. | Lightning-fast for aggregations (\`SUM\`, \`AVG\`). | High latency for point lookups; optimized for batch inserts. | Big data analytical queries (OLAP), telemetry metrics. |
| **Vector Index (HNSW)** | Hierarchical Navigable Small World graphs. | Fast approximate nearest neighbor search. | Computationally intensive index construction. | Semantic search, LLM embeddings, image similarity. |
`,

  cassandra: `
## Key Architecture Trade-Offs & Decision Matrix

| Feature Dimension | Apache Cassandra (Wide-Column) | Amazon DynamoDB | Apache HBase |
| :--- | :--- | :--- | :--- |
| **Architecture** | Masterless, decentralized peer-to-peer ring (Gossip protocol). | Fully managed cloud service (Proprietary Paxos / Raft). | Master-slave (HMaster + RegionServers backed by HDFS). |
| **Single Point of Failure** | Zero SPOF (any node can accept writes). | Zero SPOF (managed multi-AZ replication). | HMaster failure can stall metadata mutations. |
| **Write Performance** | Extreme throughput via append-only commit log & MemTables. | High throughput, governed by provisioned WCUs. | High throughput, optimized for batch Hadoop jobs. |
| **Tuning Complexity** | High (JVM garbage collection, tombstone compaction). | Very Low (serverless, AWS managed). | High (ZooKeeper, HDFS, RegionServer tuning). |
| **Consistency Model** | Tunable consistency (\`ONE\`, \`QUORUM\`, \`LOCAL_QUORUM\`, \`ALL\`). | Eventually consistent (default) or Strongly Consistent read. | Strongly consistent reads out of the box. |
`,

  dynamodb: `
## Key Architecture Trade-Offs & Decision Matrix

| Index Type | Partition Key (PK) | Sort Key (SK) | Consistency Support | Throughput Allocation |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Index (Base Table)** | Table Hash Key | Table Range Key | Strong & Eventual Consistency | Base Table RCU / WCU |
| **Local Secondary Index (LSI)** | Same PK as Base Table | Different SK | Strong & Eventual Consistency | Shares Base Table RCU / WCU (Max 10 GB per item collection) |
| **Global Secondary Index (GSI)** | Completely New PK | Completely New SK | **Eventual Consistency Only** | Independent provisioned RCU / WCU (Unbounded size) |
`,

  "time-series-databases": `
## Key Architecture Trade-Offs & Decision Matrix

| TSDB Engine | Storage Format | Ingestion Speed | Query Flexibility | Best Fit Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Prometheus TSDB** | Local disk chunks with Gorilla delta-of-delta. | High (millions samples/sec per node). | PromQL (optimized for alerting and sliding windows). | Kubernetes cluster monitoring, microservice alerts. |
| **ClickHouse** | Columnar storage with MergeTree engine. | Extremely High (100M+ rows/sec batch). | Full SQL with joins and complex window functions. | Large-scale event analytics, ad-tech, billing audits. |
| **TimescaleDB** | PostgreSQL extension (Hypertables). | Moderate (bounded by PostgreSQL engine). | 100% PostgreSQL SQL compliance with relational joins. | Mixed workloads needing relational foreign keys + time-series. |
| **InfluxDB** | Time-Structured Merge Tree (TSM). | High. | InfluxQL / Flux. | IoT sensor tracking, environmental monitoring. |
`,

  "how-shopify-moved-inventory-reservations-from-redis-to-mysql": `
## Key Architecture Trade-Offs & Decision Matrix

| Architectural Pattern | Redis In-Memory Reservations (Old) | Sharded MySQL Transactional Reservations (New) |
| :--- | :--- | :--- |
| **Data Durability** | Risk of data loss on Redis crashes; complex AOF fsync latency trade-offs. | 100% durable ACID storage backed by InnoDB Write-Ahead Logging (WAL). |
| **Memory Cost** | Prohibitively expensive RAM scaling during flash sales (Black Friday / Cyber Monday). | Inexpensive NVMe disk storage with memory buffering in InnoDB buffer pool. |
| **Data Consistency** | Dual-write problem: reconciling Redis inventory with MySQL order database. | Single source of truth: inventory and order records reside in the same database engine. |
| **Concurrency Mechanism** | Redis single-threaded atomic Lua scripts. | Sharded MySQL row-level locking with short, deterministic transaction boundaries. |
`,

  "how-discord-moved-trillions-of-messages-to-scylladb": `
## Key Architecture Trade-Offs & Decision Matrix

| Metric / Dimension | Apache Cassandra (Old) | ScyllaDB (New) |
| :--- | :--- | :--- |
| **Implementation Language** | Java (JVM based) | C++20 (Seastar asynchronous framework) |
| **Garbage Collection Pauses**| Frequent Stop-The-World (STW) GC pauses causing p99 latency spikes of 1-3 seconds. | **Zero GC pauses**; manual deterministic memory management. |
| **Thread Architecture** | Multi-threaded with OS context switching and lock contention. | **Thread-per-core (Shared-nothing)** architecture pinned to CPU cores. |
| **Hardware Efficiency** | Required 177 Cassandra nodes running hot. | **72 ScyllaDB nodes** handled twice the traffic with flat sub-15ms p99 latency. |
| **Tombstone Handling** | Query timeouts when scanning deleted message tombstones. | Highly optimized disk scans with fast tombstone compaction filters. |
`,

  "how-slack-put-kafka-in-front-of-its-redis-job-queue": `
## Key Architecture Trade-Offs & Decision Matrix

| Architecture Pipeline | Redis-Only Job Queue (Old) | Kafka-Buffered Redis Queue (New) |
| :--- | :--- | :--- |
| **Surge Absorption** | Redis memory filled up rapidly during bursty notification waves, causing OOM crashes. | Kafka absorbs massive multi-gigabyte ingestion spikes on disk with zero memory pressure. |
| **Queue Starvation** | Slow or long-running worker tasks starved high-priority message queues. | Rate-limited workers pull from Kafka into Redis only when Redis capacity is available. |
| **Partitioning & Ordering** | Limited ordering semantics across Redis lists. | Kafka partition key routing guarantees strict chronological order per workspace/channel. |
`,

  "how-figma-built-multiplayer-editing-on-simplified-crdts": `
## Key Architecture Trade-Offs & Decision Matrix

| Collaboration Strategy | Operational Transformation (OT) | Full Academic CRDT (e.g. RGA/Yjs) | Figma's Simplified Tree CRDT |
| :--- | :--- | :--- | :--- |
| **Central Sequence Server** | Required to linearize all operations globally. | Not required (peer-to-peer friendly). | Required (single server per document room). |
| **Memory Overhead** | Low (only stores current document state). | Very High (stores historical ID tombstones for every deleted character). | Low (tree nodes store latest property modification timestamps). |
| **Convergence Guarantee** | Complex transformation matrices prone to edge bugs. | Mathematically guaranteed convergence. | Guaranteed by Last-Write-Wins (LWW) per object property. |
`,

  "how-spotify-serves-point-queries-from-an-exabyte-data-lake": `
## Key Architecture Trade-Offs & Decision Matrix

| Data Access Architecture | Distributed Key-Value Store (Cassandra) | Full Data Lake Scan (Presto / Spark) | Bloom-Indexed Parquet Reader (Spotify) |
| :--- | :--- | :--- | :--- |
| **Hardware Infrastructure Cost** | Massive (thousands of dedicated, warm database nodes). | High compute cost to scan terabytes per point query. | **Zero dedicated database nodes**; direct query over cold cloud object storage. |
| **Query Latency** | Sub-10ms point lookup. | 15-60 seconds per query. | **Sub-50ms point query** via footers and Bloom filter pruning. |
| **Data Duplication** | High (must ingest data into both data lake and database). | Zero (queries raw data lake). | Zero (indexes existing Parquet files in place). |
`
};
