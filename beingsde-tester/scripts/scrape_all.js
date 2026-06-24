const { execSync } = require("child_process");
const path = require("path");

const BASE_URL = "https://www.hellointerview.com";

const URLS = [
  // 1. Core Concepts (FREE)
  { url: `${BASE_URL}/learn/system-design/core-concepts/api-design`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/data-modeling`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/caching`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/sharding`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/consistent-hashing`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/cap-theorem`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/db-indexing`, premium: false },
  { url: `${BASE_URL}/learn/system-design/core-concepts/numbers-to-know`, premium: false },

  // 2. Patterns (FREE)
  { url: `${BASE_URL}/learn/system-design/patterns/realtime-updates`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/dealing-with-contention`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/multi-step-processes`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/scaling-reads`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/scaling-writes`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/large-blobs`, premium: false },
  { url: `${BASE_URL}/learn/system-design/patterns/long-running-tasks`, premium: false },

  // 3. Deep Dives (FREE)
  { url: `${BASE_URL}/learn/system-design/deep-dives/redis`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/elasticsearch`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/kafka`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/api-gateway`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/cassandra`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/dynamodb`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/postgres`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/flink`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/zookeeper`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/proximity-search`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/time-series-databases`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/data-structures-for-big-data`, premium: false },
  { url: `${BASE_URL}/learn/system-design/deep-dives/vector-databases`, premium: false },

  // 4. Problem Breakdowns / Questions (PREMIUM)
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/bitly`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/dropbox`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/gopuff`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/ticketmaster`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/fb-news-feed`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/tinder`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/leetcode`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/whatsapp`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/distributed-rate-limiter`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/fb-live-comments`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/fb-post-search`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/top-k`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/uber`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/youtube`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/web-crawler`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/ad-click-aggregator`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/google-news`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/yelp`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/strava`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/online-auction`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/camelcamelcamel`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/instagram`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/robinhood`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/google-docs`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/distributed-cache`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/job-scheduler`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/payment-system`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/metrics-monitoring`, premium: true },
  { url: `${BASE_URL}/learn/system-design/problem-breakdowns/chatgpt`, premium: true }
];

async function main() {
  console.log(`Starting massive scrape of ${URLS.length} system design articles...`);
  
  const scraperPath = path.join(__dirname, "scrape.js");
  
  // We scrape them in sequential batches to prevent network congestion or CPU load
  for (let i = 0; i < URLS.length; i++) {
    const item = URLS[i];
    console.log(`\n[${i + 1}/${URLS.length}] Processing: ${item.url} (Premium: ${item.premium})`);
    
    const command = `node "${scraperPath}" --urls "${item.url}" --selector "#markdown" ${item.premium ? "--premium" : ""}`;
    try {
      execSync(command, { stdio: "inherit" });
    } catch (e) {
      console.error(`Failed to scrape ${item.url}:`, e.message);
    }
    
    // Tiny cooling off period to avoid rate-limiting triggers
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("\nFinished massive scrape successfully!");
}

main();
