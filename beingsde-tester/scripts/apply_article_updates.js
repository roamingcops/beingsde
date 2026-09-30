const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TOPICS_FILE = path.join(__dirname, "../../beingsde-ui/src/data/topics.json");

const group1 = require("./articles_group1");
const group2 = require("./articles_group2");
const group3 = require("./articles_group3");
const batchA = require("./enrich_batch_a");
const batchB = require("./enrich_batch_b");

const allEnrichments = {
  ...group1,
  ...group2,
  ...group3,
  ...batchA,
  ...batchB
};

function generateObjectId() {
  return crypto.randomBytes(12).toString("hex");
}

function run() {
  console.log(`Reading existing topics from: ${TOPICS_FILE}`);
  const raw = fs.readFileSync(TOPICS_FILE, "utf-8");
  let topics = JSON.parse(raw);
  console.log(`Current topic count: ${topics.length}`);

  let updatedCount = 0;
  let addedCount = 0;

  for (const [slug, enriched] of Object.entries(allEnrichments)) {
    const idx = topics.findIndex(t => t.slug === slug);
    if (idx !== -1) {
      // Update existing topic
      topics[idx] = {
        ...topics[idx],
        title: enriched.title || topics[idx].title,
        description: enriched.description || topics[idx].description,
        difficulty: enriched.difficulty || topics[idx].difficulty,
        category: enriched.category || topics[idx].category,
        estimatedTimeMinutes: enriched.estimatedTimeMinutes || topics[idx].estimatedTimeMinutes,
        tags: enriched.tags || topics[idx].tags,
        isPremium: enriched.isPremium !== undefined ? enriched.isPremium : topics[idx].isPremium,
        contentMarkdown: enriched.contentMarkdown,
      };
      updatedCount++;
      console.log(`[UPDATE] Enriched: ${slug} (${enriched.contentMarkdown.length} chars)`);
    } else {
      // Add new topic
      const newTopic = {
        id: generateObjectId(),
        title: enriched.title,
        slug: slug,
        description: enriched.description,
        difficulty: enriched.difficulty || "MEDIUM",
        category: enriched.category || "System Architectures",
        estimatedTimeMinutes: enriched.estimatedTimeMinutes || 30,
        tags: enriched.tags || ["System Architectures"],
        isPremium: enriched.isPremium || false,
        contentMarkdown: enriched.contentMarkdown,
        prerequisites: [],
        videoUrl: "",
        pdfUrl: ""
      };
      topics.push(newTopic);
      addedCount++;
      console.log(`[NEW] Added: ${slug}`);
    }
  }

  // Also clean up category for "how-*" in-the-wild articles if they got assigned Core Fundamentals
  topics.forEach(t => {
    if (t.slug.startsWith("how-") || t.slug.startsWith("5-techniques-")) {
      t.category = "System Architectures";
      if (!t.tags.includes("In The Wild")) {
        t.tags.unshift("In The Wild");
      }
      if (!t.tags.includes("Case Studies")) {
        t.tags.unshift("Case Studies");
      }
    }
    if (t.slug === "temporal") {
      t.category = "Infrastructure & Messaging";
    }
  });

  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2), "utf-8");
  console.log(`\nSuccessfully applied updates!`);
  console.log(`Total topics now: ${topics.length}`);
  console.log(`Updated topics: ${updatedCount}`);
  console.log(`Newly added topics: ${addedCount}`);
}

run();
