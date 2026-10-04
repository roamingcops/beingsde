const fs = require("fs");
const path = require("path");

const topicsFilePath = path.join(__dirname, "../../beingsde-ui/src/data/topics.json");
const markdownFilePath = path.join(__dirname, "q4_article.md");

console.log("Reading topics from:", topicsFilePath);
console.log("Reading markdown from:", markdownFilePath);

const topics = JSON.parse(fs.readFileSync(topicsFilePath, "utf-8"));
const articleContent = fs.readFileSync(markdownFilePath, "utf-8");

const slug = "sde-q4-showcase-playbook";
const existingIdx = topics.findIndex((t) => t.slug === slug);

const newTopic = {
  id: "60c72b2f9b1d8a234a9e1e99",
  title: "What SDEs Can Do in the Last Quarter of the Year to Showcase Impact & Win Promotions",
  slug: slug,
  description: "The definitive Q4 endgame guide for Software Engineers: the 6 high-leverage plays, manager calibration scripts, holiday freeze hardening, toil automation, and week-by-week timeline.",
  difficulty: "MEDIUM",
  category: "System Architectures",
  estimatedTimeMinutes: 30,
  tags: [
    "Career & Promotion",
    "Staff Engineer",
    "Performance Review",
    "Leadership Principles",
    "Operational Excellence",
    "Deployment Owner",
    "Q4 Strategy"
  ],
  isPremium: false,
  contentMarkdown: articleContent,
  prerequisites: [
    "Software Engineering Fundamentals",
    "STAR-I Performance Framework"
  ],
  imageUrl: "/images/redis-caching-diagram.png",
  videoUrl: "https://cdn.beingsde.com/videos/redis_hld_720p.mp4",
  pdfUrl: "https://cdn.beingsde.com/pdfs/redis_hld_notes.pdf"
};

if (existingIdx >= 0) {
  topics[existingIdx] = newTopic;
  console.log("Updated existing topic at index:", existingIdx);
} else {
  topics.push(newTopic);
  console.log("Added new topic. Total topics:", topics.length);
}

fs.writeFileSync(topicsFilePath, JSON.stringify(topics, null, 2), "utf-8");
console.log("Successfully saved topics.json!");
