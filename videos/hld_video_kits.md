# HLD YouTube Video Production Kits (2-3 Minutes Each)

This document contains scene-by-scene video generation prompts (optimized for Google Gemini Veo), storyboards, and narration scripts for 5 system design topics. Use these scripts to record your audio and input the scene prompts directly into Gemini Veo to generate your visuals!

---

## Topic 1: Design a Distributed Caching System (Redis)
**Pacing Guideline**: 130 words per minute (approx. 2.5 minutes total runtime)

### Scene 1: The Bottleneck (0:00 - 0:30)
* **Veo Video Prompt**: A cinematic, high-contrast animation of a single database server glowing red under intense load. Thousands of glowing blue light pulses (representing network requests) fly from user devices towards the server, bottlenecking and causing it to flicker and freeze. Dark tech aesthetic, sleek lines, 3D render.
* **Narration Script**: 
  > "Imagine your application is growing, and suddenly millions of users are trying to load the same landing page. Every single click sends a query directly to your relational database. Relational databases store data on disk, which is slow. Soon, disk I/O bottlenecks, query queues grow, and your website crawls to a halt. How do we solve this scale crisis?"

### Scene 2: Enter the Cache (0:30 - 1:00)
* **Veo Video Prompt**: A transparent 3D glass box labeled 'RAM Cache' floating in front of the database server. Glowing request pulses now hit the glass cache box and bounce back instantly, lighting up bright white, while only a tiny trickle of pulses proceed to the database behind it. Modern isometric grid.
* **Narration Script**: 
  > "We introduce a caching layer. Caching stores frequently accessed data in Random Access Memory, or RAM. Since RAM is orders of magnitude faster than reading from disk, read latency drops from milliseconds to microseconds. When a request comes in, we check the cache first. If it's a cache hit, we return the data instantly. If it's a miss, we query the database, write the result to the cache, and return."

### Scene 3: Cache Eviction Policies (1:00 - 1:30)
* **Veo Video Prompt**: A grid of data cubes inside the RAM cache. A timer dial appears over old blocks, and as the grid fills, the oldest, dimmest block turns grey and is vaporized out of the box, replaced immediately by a bright new data block. Clean vector animation style.
* **Narration Script**: 
  > "But RAM is expensive and limited. We can't cache everything. When the cache is full, how do we decide what to throw away? This is where eviction policies come in. The most common is LRU, or Least Recently Used. It tracks access patterns and evicts the data that hasn't been requested for the longest time. LFU, or Least Frequently Used, evicts data based on frequency counts."

### Scene 4: Stale Data & Consistency (1:30 - 2:00)
* **Veo Video Prompt**: A split screen. On the left, a user updates their profile name in a database. On the right, the cache still shows the old name. A red warning icon flashes between them, then a yellow lightning bolt syncs the cache with the new database entry. Technical blueprint layout.
* **Narration Script**: 
  > "Storing data in two places creates consistency challenges. If a user updates their profile, the database changes, but the cache might still hold the old data. We handle this using write strategies like Write-Through, where we write to both cache and database simultaneously, or Cache-Aside, where the application invalidates the cached key upon a database update."

### Scene 5: High-Availability Redis (2:00 - 2:30)
* **Veo Video Prompt**: A network map showing a Master Redis node duplicating its data to three replication nodes. The Master node suddenly disappears, and one of the replicas immediately glows gold and takes over the traffic. Smooth transition animation.
* **Narration Script**: 
  > "For production, a single cache server is a single point of failure. Redis achieves high availability using a Master-Replica architecture. If the Master node goes down, sentinel systems detect the failure and promote a replica to Master in seconds, ensuring your app stays blazing fast."

---

## Topic 2: Consistent Hashing
**Pacing Guideline**: 130 words per minute (approx. 2.5 minutes total runtime)

### Scene 1: The Problem with Modulo Hashing (0:00 - 0:30)
* **Veo Video Prompt**: An abstract digital diagram showing 4 server nodes. Request items with integer IDs are mapped to servers using simple arrows. Suddenly, one server explodes, and all the arrows scramble wildly, redirecting to different servers. Clean 2D motion graphics.
* **Narration Script**: 
  > "When caching data across multiple servers, we need to know which server holds which key. The naive way is modulo hashing: hashing the key and modulo-ing it by the number of servers. But what happens if you add a new server, or one crashes? The denominator changes, causing almost all keys to remap. Your cache hit rate drops to zero, flooding your database."

### Scene 2: The Hash Ring (0:30 - 1:00)
* **Veo Video Prompt**: A glowing neon circle representing a circular coordinate ring from 0 to 2^32 - 1. Server nodes appear as colored dots at random points along the perimeter of the circle. Dynamic 3D rotational view.
* **Narration Script**: 
  > "Consistent hashing solves this by mapping both servers and keys onto a virtual circle, called the hash ring. The ring represents a range of hash values. We hash each server's IP address or name to determine its coordinate position on this ring."

### Scene 3: Mapping Keys (1:00 - 1:30)
* **Veo Video Prompt**: Small white dots (keys) landing on the ring. Smooth clockwise arrows sweep from each key along the perimeter of the ring until they land on the nearest colored server dot. Technical blueprint look.
* **Narration Script**: 
  > "To locate the cache server for a specific key, we hash the key to place it on the ring. Then, we travel clockwise along the ring's edge until we encounter the first server node. That server is designated to hold our key. When a server is added or removed, only a small fraction of keys are remapped, keeping the rest of the cache intact."

### Scene 4: Virtual Nodes & Load Balance (1:30 - 2:00)
* **Veo Video Prompt**: One server dot is flooded with keys, while others are empty. Suddenly, the server nodes multiply into hundreds of smaller, semi-transparent ghost nodes distributed evenly around the entire ring, spreading the keys perfectly. Futuristic UI dashboard.
* **Narration Script**: 
  > "But what if servers are distributed unevenly? One server might end up handling a massive arc of the ring, creating a hotspot. Consistent hashing fixes this using Virtual Nodes. Instead of placing a server once, we assign it multiple virtual coordinates across the ring. This balances the partition load evenly across all physical hardware."

### Scene 5: Summary (2:00 - 2:30)
* **Veo Video Prompt**: Zoom out of the balanced hash ring with smooth, stable network packets flowing effortlessly. A final logo graphic displaying the words 'Consistent Hashing: Resilient & Scalable'. Flat UI design.
* **Narration Script**: 
  > "By mapping items onto a ring, consistent hashing minimizes key remapping during server membership changes. It is the secret scaling engine behind Amazon DynamoDB, Cassandra, and distributed cache clusters globally."

---

## Topic 3: Design a URL Shortener (TinyURL)
**Pacing Guideline**: 130 words per minute (approx. 2.5 minutes total runtime)

### Scene 1: The Concept (0:00 - 0:30)
* **Veo Video Prompt**: A long, messy website URL string spanning across the screen. An digital blade cuts it, collapsing it into a neat, short code like 'tinyurl.com/a9F2b'. A hand clicks it, and it instantly expands back into the long URL. Ultra-minimalist dark mode design.
* **Narration Script**: 
  > "A URL shortener takes a long link and encodes it into a compact, easily shareable string. But beneath this simple interface lies a major database scaling and concurrency problem. How do we build a system that can handle millions of shortens and billions of redirections daily?"

### Scene 2: Encoding Mechanics (0:30 - 1:00)
* **Veo Video Prompt**: A conversion counter showing base-10 numbers rapidly transforming into base-62 alphanumeric characters (containing lowercase, uppercase, and digits). Digital matrix code streams.
* **Narration Script**: 
  > "To represent billions of URLs with just 7 characters, we use Base-62 encoding. Base-62 includes numbers zero through nine, and all lowercase and uppercase letters. A 7-character string in Base-62 gives us sixty-two to the power of seven, which is over three-point-five trillion unique combinations."

### Scene 3: The Concurrency Problem (1:00 - 1:30)
* **Veo Video Prompt**: Two different database connections attempting to insert a record at the exact same millisecond. Red conflict markers spark as they collide trying to reserve the same short code.
* **Narration Script**: 
  > "If we use a standard auto-incrementing database ID to generate our codes, we face a bottleneck at high scale. Distributed servers trying to generate IDs concurrently will collide, creating lock contentions and slowing down inserts. How do we generate unique IDs without database bottlenecks?"

### Scene 4: Key Generation Service (KGS) (1:30 - 2:00)
* **Veo Video Prompt**: A central server labeled 'KGS' dispensing unique ID tokens in batches (like golden tickets) to multiple worker application servers. The worker servers immediately process URL inputs using their batches. 3D block blueprint architecture.
* **Narration Script**: 
  > "We introduce a Key Generation Service, or KGS. The KGS pre-generates unique random IDs and stores them in a database. When an application server needs to shorten a URL, it requests a batch of IDs from the KGS. These IDs are kept in memory on the application server. This eliminates database lookup collisions during the shortening process."

### Scene 5: Redirection Scaling (2:00 - 2:30)
* **Veo Video Prompt**: A high-speed network path where a redirect request lands, hits a Redis Cache instantly, fetches the destination URL, and redirects the user with a '301 Moved Permanently' header without ever hitting the main database. Clean flow diagram.
* **Narration Script**: 
  > "For redirection, we use HTTP 301 'Moved Permanently'. We store mappings in a cache like Redis. Since redirects are heavy reads and rarely change, caching keeps read latency ultra-low, protecting our main database from traffic spikes."

---

## Topic 4: Event-Driven Scaling with Apache Kafka
**Pacing Guideline**: 130 words per minute (approx. 2.5 minutes total runtime)

### Scene 1: Point-to-Point Mess (0:00 - 0:30)
* **Veo Video Prompt**: A chaotic spiderweb of line connections linking multiple databases, microservices, analytics blocks, and payment processors together. Packets collide and the web gets increasingly tangled. Dark theme.
* **Narration Script**: 
  > "In microservice architectures, services need to talk. But as you add services, direct point-to-point connections create a chaotic web. If one database goes down, upstream services crash. How do we decouple these services while scaling data flow?"

### Scene 2: The Commit Log (0:30 - 1:00)
* **Veo Video Prompt**: A long, glowing digital tape labeled 'Kafka Topic'. Block segments representing event records are appended sequentially to the end of the tape. An arrow pointer labeled 'Consumer Offset' moves step-by-step along the tape.
* **Narration Script**: 
  > "Enter Apache Kafka, a distributed, append-only commit log. Instead of direct calls, producers publish events to Kafka 'Topics'. The events are written sequentially to disk, making writes extremely fast. Consumers then subscribe to these topics and pull events at their own pace."

### Scene 3: Partitions & Parallelism (1:00 - 1:30)
* **Veo Video Prompt**: A single Kafka Topic splitting vertically into 3 parallel partition tracks. Different streams of messages flow through the partitions simultaneously, consumed by different instances in a Consumer Group. High-speed vector movement.
* **Narration Script**: 
  > "Kafka scales topics by dividing them into Partitions. Partitions are distributed across different brokers in a cluster. This allows multiple consumers in a consumer group to read from different partitions concurrently, enabling massive parallel throughput."

### Scene 4: Fault Tolerance & Replication (1:30 - 2:00)
* **Veo Video Prompt**: A partition replication map. A master partition broker fails (turns grey), and a follower replica broker immediately lights up green as the new leader, keeping the data flowing. 3D grid layout.
* **Narration Script**: 
  > "To ensure durability, partitions are replicated across multiple brokers. Each partition has a leader and multiple followers. If a broker hosting a leader partition crashes, Kafka automatically promotes an in-sync follower replica to leader, preventing data loss."

### Scene 5: Summary (2:00 - 2:30)
* **Veo Video Prompt**: Decoupled systems communicating cleanly through a central Kafka hub. Text slide: 'Apache Kafka: Scalable, Decoupled, Resilient'. Premium digital branding.
* **Narration Script**: 
  > "By buffering events in an append-only partition log, Kafka decouples systems, guarantees message order within partitions, and scales horizontal throughput to millions of events per second."

---

## Topic 5: Design an Ad Click Aggregator
**Pacing Guideline**: 130 words per minute (approx. 2.5 minutes total runtime)

### Scene 1: Scale of Clicks (0:00 - 0:30)
* **Veo Video Prompt**: A digital map of the world. Millions of glowing click markers pop up simultaneously across countries, funneling into a streaming pipeline. The dashboard indicates '100,000 clicks/sec'. High energy animation.
* **Narration Script**: 
  > "Ad platforms serve millions of ads worldwide. Every click generates a tracking event. When processing hundreds of thousands of clicks per second, we cannot write each event directly to a relational database. We need a system that aggregates these clicks in real-time."

### Scene 2: Stream Processing (0:30 - 1:00)
* **Veo Video Prompt**: Click events streaming through a Kafka buffer, then entering a real-time computation engine (labeled 'Apache Flink / Spark Streaming') that groups click counts by Ad ID on the fly. Technological blueprint.
* **Narration Script**: 
  > "Our architecture starts with a messaging queue like Kafka to absorb incoming spikes. Next, a stream processing framework like Apache Flink pulls events and aggregates clicks in memory. Rather than saving individual logs, we calculate running sums by Ad ID."

### Scene 3: Time Windows (1:00 - 1:30)
* **Veo Video Prompt**: An animation illustrating a 1-minute time block. Click events falling within the boundaries are calculated, summarized, and packed into a single database write packet at the 60-second mark. Vector motion graphics.
* **Narration Script**: 
  > "We aggregate data using Time Windows. A Tumbling Window divides time into fixed, non-overlapping segments, like every one minute. A Sliding Window tracks moving ranges, like clicks in the last five minutes, updated every ten seconds. This drops database write volumes by ninety-nine percent."

### Scene 4: Write-Heavy Storage (1:30 - 2:00)
* **Veo Video Prompt**: Aggregated data packets entering a NoSQL wide-column database (labeled 'Cassandra / HBase'). The database writes records sequentially to an append-only commit log (SSTables) in microseconds. High tech grid display.
* **Narration Script**: 
  > "For storage, we choose a write-optimized NoSQL database like Cassandra. Cassandra uses LSM trees, writing updates sequentially to a commit log and memtable in memory before flushing to disk, eliminating random disk seeks."

### Scene 5: Summary (2:00 - 2:30)
* **Veo Video Prompt**: A clean analytics dashboard loading aggregated charts instantly. Text slide: 'Ad Click Aggregation: Real-Time, Scalable, Accurate'. Sleek vector transition.
* **Narration Script**: 
  > "By buffering with Kafka, aggregating in-memory with Flink, and storing in Cassandra, our ad click aggregator processes massive global scale with sub-second dashboard query latencies."
