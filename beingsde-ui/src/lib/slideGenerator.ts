export interface Slide {
  slideNumber: number;
  timestamp: string;
  title: string;
  subtitle?: string;
  veoPrompt?: string;
  narrationScript: string;
  bulletPoints: string[];
  diagramTitle?: string;
  diagramCode?: string;
  keyTakeaway?: string;
  type?: 'problem' | 'architecture' | 'deepdive' | 'case-study' | 'summary';
}

const CUSTOM_SLIDE_DECKS: Record<string, Slide[]> = {
  "design-distributed-caching-redis": [
    {
      slideNumber: 1,
      timestamp: "0:00 - 0:30",
      title: "Scene 1: The Bottleneck",
      subtitle: "Relational Disk I/O Under Heavy Traffic Spikes",
      veoPrompt: "Cinematic 3D animation of a database server glowing red under intense load. Thousands of blue pulses (network requests) fly toward it, creating disk I/O queue bottlenecks.",
      narrationScript: "Imagine your application is growing, and suddenly millions of users are trying to load the same landing page. Every single click sends a query directly to your relational database. Relational databases store data on disk, which is slow. Soon, disk I/O bottlenecks, query queues grow, and your website crawls to a halt. How do we solve this scale crisis?",
      bulletPoints: [
        "Relational DBs store data primarily on disk (high random read/write latency).",
        "Synchronous disk I/O bottlenecks at p99 response times during user spikes.",
        "Query connection pools exhaust rapidly under simultaneous landing page loads.",
        "Single Point of Failure (SPOF) risks database crash and full downtime."
      ],
      diagramTitle: "Un-cached Relational DB Bottleneck",
      diagramCode: `[Client Fleet] ---> 10,000 req/sec ---> [ Load Balancer ]
                                                 |
                                         (Disk Queue Bottleneck)
                                                 v
                                   [ Relational DB (Disk I/O) ] 🔥 100% CPU`,
      keyTakeaway: "Directly querying disk-backed databases for static or hot data is the primary bottleneck in high-throughput applications.",
      type: "problem"
    },
    {
      slideNumber: 2,
      timestamp: "0:30 - 1:00",
      title: "Scene 2: Enter the Cache",
      subtitle: "RAM-Based Caching Layer & Latency Reductions",
      veoPrompt: "A transparent 3D glass box labeled 'RAM Cache' floating in front of the database server. Glowing pulses hit the cache and bounce back instantly into bright light, while only a trickle goes to DB.",
      narrationScript: "We introduce a caching layer. Caching stores frequently accessed data in Random Access Memory, or RAM. Since RAM is orders of magnitude faster than reading from disk, read latency drops from milliseconds to microseconds. When a request comes in, we check the cache first. If it's a cache hit, we return the data instantly. If it's a miss, we query the database, write the result to the cache, and return.",
      bulletPoints: [
        "In-Memory RAM lookups run in sub-millisecond (<1ms) latencies.",
        "Cache Hit: Serve directly from Redis RAM (95%+ traffic offloaded from DB).",
        "Cache Miss: Fallback to SQL DB, populate cache asynchronously, return payload.",
        "Reduces DB load while accelerating throughput to hundreds of thousands ops/sec."
      ],
      diagramTitle: "Cache-Aside Architecture Flow",
      diagramCode: `[Client Request] ---> [ Application Server ]
                             |               ^
                   1. Check  |               | 2. Return Cache Hit (<1ms)
                             v               |
                    [ In-Memory Redis Cache (RAM) ]
                             | (Cache Miss)
                             v
                  [ Primary Relational Database (Disk) ]`,
      keyTakeaway: "Cache-Aside pattern shields downstream databases from repetitive read traffic by storing hot keys in volatile RAM.",
      type: "architecture"
    },
    {
      slideNumber: 3,
      timestamp: "1:00 - 1:30",
      title: "Scene 3: Cache Eviction Policies",
      subtitle: "Memory Allocation & Eviction Strategies (LRU vs LFU)",
      veoPrompt: "Grid of data cubes inside the RAM cache box. As new bright cubes arrive, older dim blocks turn grey and evaporate cleanly via a smooth timer dial animation.",
      narrationScript: "But RAM is expensive and limited. We can't cache everything. When the cache is full, how do we decide what to throw away? This is where eviction policies come in. The most common is LRU, or Least Recently Used. It tracks access patterns and evicts the data that hasn't been requested for the longest time. LFU, or Least Frequently Used, evicts data based on frequency counts.",
      bulletPoints: [
        "LRU (Least Recently Used): Evicts keys with oldest last-access timestamp.",
        "LFU (Least Frequently Used): Evicts keys with lowest request counter.",
        "TTL (Time To Live): Hard expiration timestamps to prevent permanent stale data.",
        "Memory Bounding: Ensures Redis never exceeds hardware memory capacity."
      ],
      diagramTitle: "LRU Doubly Linked List Eviction Queue",
      diagramCode: `[HEAD: Most Recent] <-> [Key 402] <-> [Key 109] <-> [Key 88] <-> [TAIL: Oldest]
                                                                        |
                                                               (Evicted when full)
                                                                        v
                                                                   [ Vaporized ]`,
      keyTakeaway: "Choose LRU for temporal data access patterns and LFU for frequency-driven hot key persistence.",
      type: "deepdive"
    },
    {
      slideNumber: 4,
      timestamp: "1:30 - 2:00",
      title: "Scene 4: Stale Data & Consistency",
      subtitle: "Invalidation Strategies (Write-Through vs Cache-Aside)",
      veoPrompt: "Split screen showing DB update on left and stale cache on right. Red alert icon flashes, then a yellow bolt syncs both nodes simultaneously.",
      narrationScript: "Storing data in two places creates consistency challenges. If a user updates their profile, the database changes, but the cache might still hold the old data. We handle this using write strategies like Write-Through, where we write to both cache and database simultaneously, or Cache-Aside, where the application invalidates the cached key upon a database update.",
      bulletPoints: [
        "Write-Through: App writes to Cache first, Cache synchronously writes to DB.",
        "Write-Back (Write-Behind): Async DB writes in batches (high throughput, risk of loss).",
        "Cache Invalidation: Delete cache key on DB write to guarantee fresh read on next miss.",
        "Single-Flight Locks: Prevents cache stampede spikes when keys expire."
      ],
      diagramTitle: "Cache Invalidation Strategy",
      diagramCode: `[Client Update] ---> 1. UPDATE DB ---> [ PostgreSQL ]
                           |
                           +---> 2. DEL KEY  ---> [ Redis Cache ]
                           
(Next Read Request results in a fresh query & repopulates cache with new DB data)`,
      keyTakeaway: "Invalidating cached keys on update is simpler and safer than complex multi-node distributed transactions.",
      type: "deepdive"
    },
    {
      slideNumber: 5,
      timestamp: "2:00 - 2:30",
      title: "Scene 5: High-Availability Redis",
      subtitle: "Master-Replica Sharding & Sentinel Auto-Failover",
      veoPrompt: "Network diagram showing Redis Master replicating to 3 nodes. Master explodes, and Sentinel system immediately promotes Replica 1 to Master in glowing gold.",
      narrationScript: "For production, a single cache server is a single point of failure. Redis achieves high availability using a Master-Replica architecture. If the Master node goes down, sentinel systems detect the failure and promote a replica to Master in seconds, ensuring your app stays blazing fast.",
      bulletPoints: [
        "Master Node accepts all write commands and streams replication logs.",
        "Replica Nodes handle read throughput scaling horizontally.",
        "Redis Sentinels perform health checks, quorum voting, and automatic failover.",
        "Redis Cluster uses 16,384 hash slots to shard key spaces across nodes seamlessly."
      ],
      diagramTitle: "Redis Master-Replica & Sentinel Quorum Topology",
      diagramCode: `                    [ Redis Sentinel Group ]
                            | (Monitors Health & Failover)
                            v
     +----------------> [ Redis Master ] <----------------+
     | (Async Stream)            |                        |
     v                           v                        v
[ Replica 1 (Read) ]    [ Replica 2 (Read) ]    [ Replica 3 (Read) ]`,
      keyTakeaway: "Master-Replica sharding paired with Sentinel quorum monitoring guarantees high availability and zero single points of failure.",
      type: "summary"
    }
  ],
  "consistent-hashing-basic": [
    {
      slideNumber: 1,
      timestamp: "0:00 - 0:30",
      title: "Scene 1: The Problem with Modulo Hashing",
      subtitle: "Cache Stampedes During Server Membership Changes",
      veoPrompt: "Digital diagram showing 4 servers. Key IDs map via simple arrows. Suddenly 1 server explodes and all arrows scramble wildly across remaining nodes.",
      narrationScript: "When caching data across multiple servers, we need to know which server holds which key. The naive way is modulo hashing: hashing the key and modulo-ing it by the number of servers. But what happens if you add a new server, or one crashes? The denominator changes, causing almost all keys to remap. Your cache hit rate drops to zero, flooding your database.",
      bulletPoints: [
        "Traditional Formula: server_id = hash(key) % N.",
        "When N changes (node added/removed), ~100% of key mappings shift.",
        "Causes catastrophic Cache Stampedes directly onto downstream DBs.",
        "Unacceptable in cloud environments with dynamic auto-scaling fleets."
      ],
      diagramTitle: "Modulo Hashing Re-mapping Crisis",
      diagramCode: `Key "user_42" -> hash(key) % 4 = Server 2
(Node 4 added -> N becomes 5)
Key "user_42" -> hash(key) % 5 = Server 0  ❌ (CACHE MISS! Re-mapped!)`,
      keyTakeaway: "Modulo hashing invalidates nearly all cached keys whenever server cluster size changes.",
      type: "problem"
    },
    {
      slideNumber: 2,
      timestamp: "0:30 - 1:00",
      title: "Scene 2: The Hash Ring",
      subtitle: "Mapping Nodes and Keys onto a Shared Circular Coordinate System",
      veoPrompt: "Glowing neon circle representing coordinate space 0 to 2^32 - 1. Server nodes appear as colored dots at random points along the perimeter in 3D view.",
      narrationScript: "Consistent hashing solves this by mapping both servers and keys onto a virtual circle, called the hash ring. The ring represents a range of hash values. We hash each server's IP address or name to determine its coordinate position on this ring.",
      bulletPoints: [
        "Shared Hash Range: SHA-1 or MD5 hash space from 0 to 2^32 - 1.",
        "Server Positioning: hash(server_ip) determines node location on the ring.",
        "Key Positioning: hash(item_key) determines key coordinate on the exact same ring.",
        "Decouples server node assignment from fixed cluster sizes."
      ],
      diagramTitle: "The 360° Circular Hash Ring",
      diagramCode: `                    [ 0 / 2^32-1 ]
              . - ~ - . 
          . '           ' .  [ Node A (hash: 0x1F) ]
        /                   \\
       |    HASH RING        |
        \\                   / [ Node B (hash: 0x8A) ]
          . '           ' .
              . - ~ - .
             [ Node C ]`,
      keyTakeaway: "Consistent hashing maps nodes and keys onto a unified mathematical ring independent of server count.",
      type: "architecture"
    },
    {
      slideNumber: 3,
      timestamp: "1:00 - 1:30",
      title: "Scene 3: Mapping Keys Clockwise",
      subtitle: "Minimizing Data Movement During Node Scaling",
      veoPrompt: "Small white dots (keys) landing on ring. Clockwise arrows sweep along perimeter until landing on nearest server node.",
      narrationScript: "To locate the cache server for a specific key, we hash the key to place it on the ring. Then, we travel clockwise along the ring's edge until we encounter the first server node. That server is designated to hold our key. When a server is added or removed, only a small fraction of keys are remapped, keeping the rest of the cache intact.",
      bulletPoints: [
        "Clockwise Search: Move clockwise from key position to nearest active node.",
        "Node Addition: Only keys between new node and predecessor are relocated (1/N of total keys).",
        "Node Crash: Keys assigned to dead node fall over to next clockwise node.",
        "Preserves 90%+ of cache hit rate during dynamic scaling events."
      ],
      diagramTitle: "Clockwise Key Routing",
      diagramCode: `Key Position (0x45) ------(Clockwise Search)------> [ Node B at 0x8A ]
                                                            (Assigned Server)`,
      keyTakeaway: "Only K/N keys are moved when node count changes, keeping global cache hit rates high.",
      type: "architecture"
    },
    {
      slideNumber: 4,
      timestamp: "1:30 - 2:00",
      title: "Scene 4: Virtual Nodes (V-Nodes)",
      subtitle: "Preventing Hotspots and Achieving Uniform Load Balance",
      veoPrompt: "One server dot flooded with keys. Server nodes split into hundreds of ghost nodes spread evenly around the ring, distributing key density perfectly.",
      narrationScript: "But what if servers are distributed unevenly? One server might end up handling a massive arc of the ring, creating a hotspot. Consistent hashing fixes this using Virtual Nodes. Instead of placing a server once, we assign it multiple virtual coordinates across the ring. This balances the partition load evenly across all physical hardware.",
      bulletPoints: [
        "Virtual Nodes: Assign 100-200 virtual positions per physical server (e.g. ServerA-1, ServerA-2).",
        "Uniform Distribution: Interleaves virtual nodes to eliminate arc length imbalance.",
        "Heterogeneous Hardware: Allocate more V-Nodes to high-spec server hardware.",
        "Hotspot Protection: Prevents single-node CPU overload."
      ],
      diagramTitle: "Virtual Node Ring Interleaving",
      diagramCode: `[Ring: 0 -> 2^32-1]
... [A-1] ... [B-1] ... [C-1] ... [A-2] ... [B-2] ... [C-2] ... [A-3] ...`,
      keyTakeaway: "Virtual nodes smooth out ring coverage and balance key density uniformly across server fleets.",
      type: "deepdive"
    },
    {
      slideNumber: 5,
      timestamp: "2:00 - 2:30",
      title: "Scene 5: Production Industry Use Cases",
      subtitle: "Distributed Databases & Global CDN Caching Systems",
      veoPrompt: "Zoom out of hash ring with smooth network packets flowing effortless. Title card: 'Consistent Hashing: Resilient & Scalable'.",
      narrationScript: "By mapping items onto a ring, consistent hashing minimizes key remapping during server membership changes. It is the secret scaling engine behind Amazon DynamoDB, Cassandra, and distributed cache clusters globally.",
      bulletPoints: [
        "Amazon DynamoDB: Partitions data across storage nodes on a Dynamo hash ring.",
        "Apache Cassandra: Ring-based peer-to-peer data replication across nodes.",
        "Discord: Routes WebSocket gateway socket connections to server worker pools.",
        "Memcached / Redis Clients: Client-side consistent hashing ring key routing."
      ],
      diagramTitle: "Global System Architecture Footprint",
      diagramCode: `[ Client Request ] ---> [ Hash Ring Router ] ---> [ Targeted Shard Node ]
                                                        (Zero Database Flooding)`,
      keyTakeaway: "Consistent hashing is foundational for building elastic, fault-tolerant distributed storage systems.",
      type: "summary"
    }
  ],
  "kafka-event-driven-scaling": [
    {
      slideNumber: 1,
      timestamp: "0:00 - 0:30",
      title: "Scene 1: Point-to-Point Mess",
      subtitle: "Coupling & Tightly Connected Microservice Cascades",
      veoPrompt: "A chaotic spiderweb of line connections linking databases, microservices, analytics, and payment processors. Packets collide and the web gets increasingly tangled.",
      narrationScript: "In microservice architectures, services need to talk. But as you add services, direct point-to-point connections create a chaotic web. If one database goes down, upstream services crash. How do we decouple these services while scaling data flow?",
      bulletPoints: [
        "N*(N-1) Connection Complexity: Point-to-point HTTP integrations create extreme coupling.",
        "Cascading Outages: Slow downstream service blocks upstream callers.",
        "Data Loss Risk: synchronous network timeouts drop messages during traffic spikes.",
        "Hard to Add Consumers: Every new analytics worker requires API changes."
      ],
      diagramTitle: "Tightly Coupled Point-to-Point Web",
      diagramCode: `[Order Service] ---> [Payment] ---> [Inventory] ---> [Notification]
      |                   |              |                 |
      +-------------------+--------------+-----------------+ 💥 (Cascading Failure)`,
      keyTakeaway: "Direct synchronous microservice calls create tight coupling and cascading failure modes.",
      type: "problem"
    },
    {
      slideNumber: 2,
      timestamp: "0:30 - 1:00",
      title: "Scene 2: The Commit Log",
      subtitle: "Distributed Append-Only Topics & Offset Tracking",
      veoPrompt: "Glowing digital tape labeled 'Kafka Topic'. Block segments representing event records append sequentially to tape. Consumer Offset arrow moves along tape.",
      narrationScript: "Enter Apache Kafka, a distributed, append-only commit log. Instead of direct calls, producers publish events to Kafka 'Topics'. The events are written sequentially to disk, making writes extremely fast. Consumers then subscribe to these topics and pull events at their own pace.",
      bulletPoints: [
        "Append-Only Log: Sequential disk I/O yields million+ ops/sec throughput.",
        "Decoupled Producers & Consumers: Producers write; consumers pull at their own pace.",
        "Offset Tracking: Consumers track their position (offset) inside topic logs.",
        "Message Replayability: Retain logs for N days, enabling past event replay."
      ],
      diagramTitle: "Kafka Commit Log & Offset Pointer",
      diagramCode: `[Producer] ---> Write [ Event 0 ] [ Event 1 ] [ Event 2 ] [ Event 3 ]
                                                          ^
                                                    [ Consumer Offset Pointer ]`,
      keyTakeaway: "Kafka's append-only commit log turns disk I/O into ultra-fast sequential streaming.",
      type: "architecture"
    },
    {
      slideNumber: 3,
      timestamp: "1:00 - 1:30",
      title: "Scene 3: Partitions & Parallelism",
      subtitle: "Horizontal Scaling & Consumer Group Routing",
      veoPrompt: "Kafka Topic splitting vertically into 3 parallel partition tracks. Streams flow through partitions simultaneously, consumed by different instances in Consumer Group.",
      narrationScript: "Kafka scales topics by dividing them into Partitions. Partitions are distributed across different brokers in a cluster. This allows multiple consumers in a consumer group to read from different partitions concurrently, enabling massive parallel throughput.",
      bulletPoints: [
        "Partitions: Topics divide into partitions distributed across cluster brokers.",
        "Partition Key Routing: hash(key) % Partitions routes events to target partition.",
        "Strict Per-Partition Ordering: Messages in the same partition are strictly ordered.",
        "Consumer Group Scaling: Max consumer concurrency equals topic partition count."
      ],
      diagramTitle: "Topic Partitioning & Consumer Group Parallelism",
      diagramCode: `                    +---> [ Partition 0 ] ---> [ Consumer Worker 1 ]
[ Topic: Orders ] --+---> [ Partition 1 ] ---> [ Consumer Worker 2 ]
                    +---> [ Partition 2 ] ---> [ Consumer Worker 3 ]`,
      keyTakeaway: "Partitions are the fundamental unit of horizontal scalability and throughput in Kafka.",
      type: "deepdive"
    },
    {
      slideNumber: 4,
      timestamp: "1:30 - 2:00",
      title: "Scene 4: Fault Tolerance & Replication",
      subtitle: "Leader-Follower Replicas & High Availability",
      veoPrompt: "Partition replication map. Master partition broker fails (turns grey), and follower replica broker immediately lights up green as new leader.",
      narrationScript: "To ensure durability, partitions are replicated across multiple brokers. Each partition has a leader and multiple followers. If a broker hosting a leader partition crashes, Kafka automatically promotes an in-sync follower replica to leader, preventing data loss.",
      bulletPoints: [
        "Replication Factor: Keeps N copies of partitions across distinct broker nodes.",
        "In-Sync Replicas (ISR): List of followers fully synced with partition leader.",
        "Producer Acknowledgments: acks=all guarantees message persistence across ISR before returning.",
        "Zookeeper / KRaft Controller: Handles instant broker failover and leader election."
      ],
      diagramTitle: "Leader-Follower Partition Replication Topology",
      diagramCode: `[ Broker 1 (Leader P0) ] ===(Replication Stream)===> [ Broker 2 (Follower P0) ]
          | (Crash Event)
          v
[ Broker 2 Promoted to New Leader ] ---> Data Stream Preserved (Zero Loss)`,
      keyTakeaway: "Partition replication factor paired with acks=all guarantees zero data loss during node failures.",
      type: "deepdive"
    },
    {
      slideNumber: 5,
      timestamp: "2:00 - 2:30",
      title: "Scene 5: Production Architecture",
      subtitle: "Event-Driven Scaling Summary",
      veoPrompt: "Decoupled systems communicating cleanly through central Kafka hub. Text slide: 'Apache Kafka: Scalable, Decoupled, Resilient'.",
      narrationScript: "By buffering events in an append-only partition log, Kafka decouples systems, guarantees message order within partitions, and scales horizontal throughput to millions of events per second.",
      bulletPoints: [
        "Netflix: Ingests 1.4+ Trillion events/day for video analytics and telemetry.",
        "Swiggy / Blinkit: Processes real-time delivery partner location coordinates.",
        "Uber: Real-time dynamic surge pricing and ride matching dispatch pipelines.",
        "Guarantees: At-least-once, at-most-once, or exactly-once delivery semantics."
      ],
      diagramTitle: "Decoupled Event-Driven Backbone",
      diagramCode: `[ Producers ] ---> [ Apache Kafka Cluster Hub ] ---> [ Consumers & Analytics ]`,
      keyTakeaway: "Kafka serves as the central Nervous System for decoupled, event-driven microservices.",
      type: "summary"
    }
  ],
  "ad-click-aggregator": [
    {
      slideNumber: 1,
      timestamp: "0:00 - 0:30",
      title: "Scene 1: Scale of Clicks",
      subtitle: "Real-Time Ingestion of 100,000+ Click Events/Sec",
      veoPrompt: "Digital map of the world. Millions of glowing click markers pop up simultaneously across countries, funneling into streaming pipeline (100,000 clicks/sec).",
      narrationScript: "Ad platforms serve millions of ads worldwide. Every click generates a tracking event. When processing hundreds of thousands of clicks per second, we cannot write each event directly to a relational database. We need a system that aggregates these clicks in real-time.",
      bulletPoints: [
        "Scale Target: 100,000+ ad click events per second (Global Traffic).",
        "Direct DB Write Bottleneck: 100,000 DB inserts/sec causes immediate table locking.",
        "Accuracy Constraint: Sub-second dashboard query latency with zero over-counting.",
        "Fraud Prevention: De-duplicating duplicate clicks from bot networks."
      ],
      diagramTitle: "Global Click Ingestion Challenge",
      diagramCode: `[ 100,000 Global Clicks/sec ] ---> [ API Gateway ] ---> ❌ DB Direct Write Fails`,
      keyTakeaway: "Raw event volume requires streaming aggregation before persisting data to database ledgers.",
      type: "problem"
    },
    {
      slideNumber: 2,
      timestamp: "0:30 - 1:00",
      title: "Scene 2: Stream Processing",
      subtitle: "Kafka Buffer & Apache Flink In-Memory Aggregation",
      veoPrompt: "Click events streaming through Kafka buffer, entering real-time engine (Apache Flink) that groups click counts by Ad ID on the fly.",
      narrationScript: "Our architecture starts with a messaging queue like Kafka to absorb incoming spikes. Next, a stream processing framework like Apache Flink pulls events and aggregates clicks in memory. Rather than saving individual logs, we calculate running sums by Ad ID.",
      bulletPoints: [
        "Kafka Buffering: Absorbs sudden traffic surges without losing click payloads.",
        "Apache Flink: Stateful stream processor executing stateful map-reduce aggregations.",
        "In-Memory Running Sums: KeyBy(ad_id) groups clicks into running counters.",
        "Write Reduction: Reduces write volume from 100,000 events/sec to 100 aggregated updates/sec."
      ],
      diagramTitle: "Flink In-Memory Stream Aggregation Pipeline",
      diagramCode: `[ Raw Clicks ] ---> [ Kafka Buffer ] ---> [ Apache Flink (KeyBy: ad_id) ]
                                                       |
                                            (99.9% Write Volume Reduction)
                                                       v
                                            [ Aggregate: Ad 84 -> +4,200 clicks ]`,
      keyTakeaway: "In-memory stream aggregation turns massive event streams into compact, efficient database updates.",
      type: "architecture"
    },
    {
      slideNumber: 3,
      timestamp: "1:00 - 1:30",
      title: "Scene 3: Time Windows",
      subtitle: "Tumbling vs Sliding Aggregation Windows",
      veoPrompt: "Animation illustrating 1-minute time block. Click events falling within boundaries are summarized and packed into a single write packet at 60s mark.",
      narrationScript: "We aggregate data using Time Windows. A Tumbling Window divides time into fixed, non-overlapping segments, like every one minute. A Sliding Window tracks moving ranges, like clicks in the last five minutes, updated every ten seconds. This drops database write volumes by ninety-nine percent.",
      bulletPoints: [
        "Tumbling Window: Non-overlapping fixed time bounds (e.g. 0:00-0:01, 0:01-0:02).",
        "Sliding Window: Overlapping rolling time ranges (e.g. last 5 minutes updated every 10s).",
        "Watermarking: Handles late-arriving network event timestamps seamlessly.",
        "Checkpointing: Flink persistent state snapshots guarantee exactly-once processing."
      ],
      diagramTitle: "1-Minute Tumbling Window Aggregation",
      diagramCode: `[ 0s - 60s Clicks Window ] ===(Summarized at 60s mark)===> [ 1 DB Batch Record ]`,
      keyTakeaway: "Time windowing slashes database write ops by 99% while maintaining sub-second reporting precision.",
      type: "deepdive"
    },
    {
      slideNumber: 4,
      timestamp: "1:30 - 2:00",
      title: "Scene 4: Write-Heavy NoSQL Storage",
      subtitle: "Cassandra LSM-Tree Append-Only Engine",
      veoPrompt: "Aggregated data packets entering NoSQL wide-column DB (Cassandra). DB writes records sequentially to append-only commit log (SSTables) in microseconds.",
      narrationScript: "For storage, we choose a write-optimized NoSQL database like Cassandra. Cassandra uses LSM trees, writing updates sequentially to a commit log and memtable in memory before flushing to disk, eliminating random disk seeks.",
      bulletPoints: [
        "LSM-Tree Engine: Sequential append-only disk writes (Zero random seeks).",
        "Primary Key Design: Partition Key (ad_id) + Clustering Key (window_start_time).",
        "Sub-Millisecond Ingestion: Writes hit MemTable & WAL in RAM immediately.",
        "Scalable OLAP Querying: Advertisers query historical window totals effortlessly."
      ],
      diagramTitle: "Cassandra LSM Storage Ingestion",
      diagramCode: `[ Flink Aggregates ] ---> [ MemTable & WAL (RAM) ] ---> [ SSTable (Disk Append) ]`,
      keyTakeaway: "LSM-Tree storage engines like Cassandra provide near-infinite write scalability for time-series aggregate data.",
      type: "deepdive"
    },
    {
      slideNumber: 5,
      timestamp: "2:00 - 2:30",
      title: "Scene 5: Production Summary",
      subtitle: "End-to-End Ad Click Aggregator Architecture",
      veoPrompt: "Clean analytics dashboard loading aggregated charts instantly. Text slide: 'Ad Click Aggregation: Real-Time, Scalable, Accurate'.",
      narrationScript: "By buffering with Kafka, aggregating in-memory with Flink, and storing in Cassandra, our ad click aggregator processes massive global scale with sub-second dashboard query latencies.",
      bulletPoints: [
        "End-to-End Latency: Sub-1 second from user click to advertiser dashboard.",
        "Fault Tolerance: Kafka offset replay + Flink state checkpoints.",
        "Idempotent Storage: Deduplicates duplicate click events using Bloom Filters.",
        "Scalability: Horizontally scales up to millions of clicks per second."
      ],
      diagramTitle: "Complete Ad Click Aggregator Architecture",
      diagramCode: `[ Click Event ] -> [ Gateway ] -> [ Kafka ] -> [ Flink ] -> [ Cassandra ] -> [ Dashboard ]`,
      keyTakeaway: "Kafka + Flink + Cassandra is the gold-standard architecture for high-volume stream aggregation.",
      type: "summary"
    }
  ]
};

export function getSlidesForTopic(topic: { slug: string; title: string; category?: string; contentMarkdown?: string }): Slide[] {
  if (CUSTOM_SLIDE_DECKS[topic.slug]) {
    return CUSTOM_SLIDE_DECKS[topic.slug];
  }

  // Fallback / Automatic Slide Generator from Topic Markdown Content
  const markdown = topic.contentMarkdown || "";
  const lines = markdown.split("\n");

  const overviewPoints: string[] = [];
  const archPoints: string[] = [];
  const deepDivePoints: string[] = [];
  const caseStudyPoints: string[] = [];

  let currentSection = "overview";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#") || trimmed.startsWith("##")) {
      const lower = trimmed.toLowerCase();
      if (lower.includes("goal") || lower.includes("overview") || lower.includes("concept") || lower.includes("1.")) {
        currentSection = "overview";
      } else if (lower.includes("design") || lower.includes("architecture") || lower.includes("component") || lower.includes("2.")) {
        currentSection = "arch";
      } else if (lower.includes("deep") || lower.includes("optimization") || lower.includes("scale") || lower.includes("trade") || lower.includes("3.")) {
        currentSection = "deepdive";
      } else if (lower.includes("case") || lower.includes("real") || lower.includes("reference") || lower.includes("4.")) {
        currentSection = "casestudy";
      }
    } else if (trimmed.startsWith("*") || trimmed.startsWith("-") || /^\d+\./.test(trimmed)) {
      const cleanPoint = trimmed.replace(/^[\*\-\d\.]+\s*/, "").replace(/[\*\_\`]/g, "");
      if (cleanPoint.length > 10 && cleanPoint.length < 200) {
        if (currentSection === "overview" && overviewPoints.length < 4) overviewPoints.push(cleanPoint);
        else if (currentSection === "arch" && archPoints.length < 4) archPoints.push(cleanPoint);
        else if (currentSection === "deepdive" && deepDivePoints.length < 4) deepDivePoints.push(cleanPoint);
        else if (currentSection === "casestudy" && caseStudyPoints.length < 4) caseStudyPoints.push(cleanPoint);
      }
    }
  }

  // Populate defaults if parsing returned few bullet points
  if (overviewPoints.length === 0) {
    overviewPoints.push(
      `Architectural breakdown and requirements for ${topic.title}.`,
      "High availability and fault tolerance SLA targets (99.99% uptime).",
      "Sub-100ms latency targets across distributed regional nodes.",
      "Scalability constraints for peak throughput and storage limits."
    );
  }
  if (archPoints.length === 0) {
    archPoints.push(
      "Decoupled microservices architecture communicating via API Gateway.",
      "In-memory caching layer (Redis) to accelerate frequent read paths.",
      "Persistent database tier with master-replica sharding strategy.",
      "Asynchronous event queues (Kafka) for background processing."
    );
  }
  if (deepDivePoints.length === 0) {
    deepDivePoints.push(
      "Distributed locks and idempotency keys to prevent race conditions.",
      "Database partitioning and indexing for optimal query performance.",
      "Circuit breakers and rate limiters protecting downstream backends.",
      "Data replication and failover orchestration across availability zones."
    );
  }
  if (caseStudyPoints.length === 0) {
    caseStudyPoints.push(
      "FAANG Enterprise Pattern: High-scale implementation patterns.",
      "CDN edge distribution and geo-routing for global low latency.",
      "Observability and telemetry collection with metrics monitoring.",
      "Cost optimization through tiered storage and automated auto-scaling."
    );
  }

  return [
    {
      slideNumber: 1,
      timestamp: "0:00 - 0:30",
      title: `1. Overview & System Goals`,
      subtitle: `Core Objectives for ${topic.title}`,
      veoPrompt: `Cinematic blueprint visual illustrating the core concepts and architectural scope of ${topic.title}.`,
      narrationScript: `Welcome to this high-level design lecture on ${topic.title}. In this module, we will deconstruct the core architectural challenges, scalability bottlenecks, and production-grade design trade-offs required to build this system at FAANG scale.`,
      bulletPoints: overviewPoints,
      diagramTitle: "System Constraints & Scope",
      diagramCode: `[ User Fleet ] ---> [ Global Gateway ] ---> [ System Domain: ${topic.title} ]
                                                    |
                                                    v
                                       [ SLA: High Availability & Low Latency ]`,
      keyTakeaway: `Understand the system constraints and SLA targets before designing the component architecture.`,
      type: "problem"
    },
    {
      slideNumber: 2,
      timestamp: "0:30 - 1:00",
      title: `2. High-Level Architecture`,
      subtitle: "Component Breakdown & Request Flow",
      veoPrompt: "3D architectural schematic mapping client edge gateways, caching nodes, application microservices, and persistent database clusters.",
      narrationScript: "Let's examine the high-level architecture. Requests land at our edge load balancers, pass through security and rate limiting layers, and reach decoupled microservices. We isolate read and write workloads using caching layers and distributed queues.",
      bulletPoints: archPoints,
      diagramTitle: "End-to-End High Level Topology",
      diagramCode: `[ Client ] ---> [ API Gateway / CDN ]
                     |
                     +---> [ Cache Layer (Redis) ]
                     |
                     +---> [ Microservices Cluster ]
                     |
                     +---> [ Storage Layer (DB / S3) ]`,
      keyTakeaway: "Separate read and write paths using caching layers and message brokers to maximize system throughput.",
      type: "architecture"
    },
    {
      slideNumber: 3,
      timestamp: "1:00 - 1:30",
      title: `3. Deep Dives & Trade-offs`,
      subtitle: "Scalability, Sharding & Resiliency",
      veoPrompt: "Technical animation showing database sharding key routing, lock acquisition, and distributed consensus mechanics.",
      narrationScript: "Moving on to technical deep-dives. Scaling this system requires solving critical race conditions, database partitioning challenges, and avoiding cache stampedes. We apply distributed locking, rate limiting, and exponential backoff jitter.",
      bulletPoints: deepDivePoints,
      diagramTitle: "Scale & Reliability Mechanics",
      diagramCode: `[ Concurrent Requests ] ---> [ Rate Limiter / Mutex Lock ]
                                    |
                                    v
                         [ Safe Atomic Execution ] ---> [ Write-Ahead Log ]`,
      keyTakeaway: "Always evaluate concurrency controls and failover mechanisms to protect downstream components.",
      type: "deepdive"
    },
    {
      slideNumber: 4,
      timestamp: "1:30 - 2:00",
      title: `4. Real-World Case Studies`,
      subtitle: "Enterprise Production Implementations",
      veoPrompt: "Dashboard displaying enterprise scale metrics, global server maps, and real-time streaming pipelines.",
      narrationScript: "Let's review real-world industry implementations. Major tech companies like Netflix, Uber, Amazon, and Zomato leverage these exact patterns to process billions of requests daily with sub-millisecond latencies.",
      bulletPoints: caseStudyPoints,
      diagramTitle: "Production Scale Footprint",
      diagramCode: `[ Global Traffic ] ---> [ Edge POPs ] ---> [ Sharded Clusters ] ---> [ Sub-5ms Response ]`,
      keyTakeaway: "Leverage battle-tested cloud design patterns and proven enterprise architectural implementations.",
      type: "case-study"
    },
    {
      slideNumber: 5,
      timestamp: "2:00 - 2:30",
      title: `5. Interview Answer Key`,
      subtitle: "Summary & Golden Rules",
      veoPrompt: "Clean summary card displaying key decision matrices and interview golden rules.",
      narrationScript: "To wrap up: in your system design interview, start by clarifying requirements and SLAs, present a clean high-level component diagram, and address scaling trade-offs explicitly. Following these golden rules will ensure a top-tier interview performance.",
      bulletPoints: [
        "Always clarify non-functional requirements (throughput, storage, latency, availability).",
        "Start with a simple baseline design before introducing complex distributed sharding.",
        "Explicitly quantify read vs write ratios to justify caching and database selections.",
        "Proactively discuss single points of failure, failover orchestration, and monitoring."
      ],
      diagramTitle: "System Design Checklist",
      diagramCode: `[ 1. Requirements ] -> [ 2. High Level Design ] -> [ 3. Deep Dives ] -> [ 4. Trade-offs ]`,
      keyTakeaway: "State your architectural trade-offs explicitly and validate your design against non-functional SLA requirements.",
      type: "summary"
    }
  ];
}
