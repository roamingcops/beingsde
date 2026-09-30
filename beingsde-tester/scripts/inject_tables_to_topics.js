const fs = require("fs");
const path = require("path");

const TOPICS_FILE = path.join(__dirname, "../../beingsde-ui/src/data/topics.json");

const part1 = require("./hld_tables_generator");
const part2 = require("./hld_tables_generator_part2");
const part3 = require("./hld_tables_generator_part3");

const allTables = {
  ...part1,
  ...part2,
  ...part3
};

function run() {
  console.log(`Reading topics from: ${TOPICS_FILE}`);
  const raw = fs.readFileSync(TOPICS_FILE, "utf-8");
  const topics = JSON.parse(raw);
  console.log(`Total topics: ${topics.length}`);

  let updatedCount = 0;
  let alreadyHadTable = 0;

  topics.forEach((topic) => {
    const hasTable = (topic.contentMarkdown || "").includes("| ---") || (topic.contentMarkdown || "").includes("| :---");
    
    if (allTables[topic.slug]) {
      // Check if table is already in contentMarkdown
      if (!hasTable) {
        topic.contentMarkdown = (topic.contentMarkdown || "").trim() + "\n\n" + allTables[topic.slug].trim() + "\n";
        updatedCount++;
        console.log(`[INJECTED TABLE] -> ${topic.slug}`);
      } else {
        alreadyHadTable++;
      }
    } else if (!hasTable) {
      // Generate a structured default architectural trade-off table based on category and title
      let fallbackTable = "";
      if (topic.category === "Databases & Storage") {
        fallbackTable = `
## Key Architecture Trade-Offs & Decision Matrix

| Dimension | Strategy / Option A | Strategy / Option B | Trade-off & Recommendation |
| :--- | :--- | :--- | :--- |
| **Consistency vs Availability** | Strict ACID (Strong Consistency) | Eventual Consistency (BASE) | Use ACID for ledger & balances; use Eventual Consistency for read-heavy feeds. |
| **Data Partitioning** | Vertical Partitioning | Horizontal Sharding | Scale vertically until write IOPs saturate NVMe disks, then shard by entity ID. |
| **Caching Layer** | Cache-Aside (Lazy) | Write-Through | Cache-Aside minimizes cache memory footprint for long-tail query distributions. |
`;
      } else if (topic.category === "Infrastructure & Messaging") {
        fallbackTable = `
## Key Architecture Trade-Offs & Decision Matrix

| Dimension | Option A: Asynchronous / Decoupled | Option B: Synchronous RPC | Trade-off & Recommendation |
| :--- | :--- | :--- | :--- |
| **Communication Pattern** | Message Queues (Kafka / SQS) | Direct gRPC / REST Calls | Message queues prevent cascading failures and provide backpressure buffering. |
| **Failure Handling** | Dead Letter Queue (DLQ) with Exponential Backoff | Immediate Circuit Breaker trip | DLQ preserves unparseable messages for manual operational inspection. |
| **Ordering Guarantees** | Partition-level Strict FIFO | Unordered Parallel Execution | Partition-key routing guarantees chronological order per entity without global lock contention. |
`;
      } else {
        fallbackTable = `
## Key Architecture Trade-Offs & Decision Matrix

| Decision Factor | Choice A | Choice B | Selected Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Communication Protocol** | REST over HTTP/2 | WebSockets / gRPC | Use REST for stateless CRUD APIs; use WebSockets for low-latency bidirectional streaming. |
| **State Management** | Centralized Distributed Store | Local Memory with Sticky Sessions | Centralized Redis / Database state allows seamless container auto-scaling and zero-downtime rolling deploys. |
| **Concurrency Control** | Optimistic Locking (\`version\` column) | Pessimistic Locking (\`SELECT FOR UPDATE\`) | Optimistic locking delivers superior throughput for low-conflict consumer operations. |
`;
      }

      topic.contentMarkdown = (topic.contentMarkdown || "").trim() + "\n\n" + fallbackTable.trim() + "\n";
      updatedCount++;
      console.log(`[GENERATED TABLE] -> ${topic.slug}`);
    } else {
      alreadyHadTable++;
    }
  });

  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), "utf-8");
  console.log(`\nResults:`);
  console.log(`Total topics: ${topics.length}`);
  console.log(`Updated with tables: ${updatedCount}`);
  console.log(`Already had tables: ${alreadyHadTable}`);
}

run();
