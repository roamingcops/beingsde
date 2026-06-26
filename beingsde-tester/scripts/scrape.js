const { chromium } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Default paths
const STATE_FILE = path.join(__dirname, "../state.json");
const DEFAULT_OUTPUT = path.join(__dirname, "../../beingsde-ui/src/data/topics.json");

// Helper: Generate a mock MongoDB ObjectId
function generateObjectId() {
  return crypto.randomBytes(12).toString("hex");
}

// Helper: Convert string to kebab-case slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper: Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    login: null,
    urls: [],
    output: DEFAULT_OUTPUT,
    selector: "article, main, .content, #content, .post-body, .article-body, body",
    premium: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--login" && args[i + 1]) {
      params.login = args[i + 1];
      i++;
    } else if (args[i] === "--urls" && args[i + 1]) {
      params.urls = args[i + 1].split(",").map(u => u.trim());
      i++;
    } else if (args[i] === "--output" && args[i + 1]) {
      params.output = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === "--selector" && args[i + 1]) {
      params.selector = args[i + 1];
      i++;
    } else if (args[i] === "--premium") {
      params.premium = true;
    }
  }
  return params;
}

// Main execution function
async function run() {
  const params = parseArgs();

  if (!params.login && params.urls.length === 0) {
    console.log(`
Usage:
  1. Login & Save Session:
     node scripts/scrape.js --login https://example.com/login

  2. Scrape List of URLs:
     node scripts/scrape.js --urls https://example.com/article-1,https://example.com/article-2 --selector ".article-content" [--premium]

Options:
  --login <url>       Navigate to URL, launch headed browser, wait for login, save session to state.json.
  --urls <urls>       Comma-separated list of URLs to scrape using saved state.json.
  --selector <css>    CSS selector for the main article text area (default: article/main/body tags).
  --output <path>     Path to output JSON file (default: beingsde-ui/src/data/topics.json).
  --premium           Flag the scraped articles as PREMIUM (default is false/free).
    `);
    process.exit(0);
  }

  // --- LOGIN MODE ---
  if (params.login) {
    console.log(`Launching headed browser to log in at: ${params.login}`);
    console.log("Please perform the login inside the browser window. The script will save state when the browser is closed or after 2 minutes.");
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(params.login);

    // Keep browser open until closed by user or timeout
    return new Promise((resolve) => {
      browser.on("disconnected", async () => {
        try {
          await context.storageState({ path: STATE_FILE });
          console.log(`Successfully saved session state to: ${STATE_FILE}`);
        } catch (e) {
          console.error("Failed to save session state:", e);
        }
        resolve();
      });

      // Automatically timeout after 3 minutes if not closed
      setTimeout(async () => {
        if (browser.isConnected()) {
          try {
            await context.storageState({ path: STATE_FILE });
            console.log(`Timeout reached. Automatically saved session state to: ${STATE_FILE}`);
            await browser.close();
          } catch (e) {
            console.error("Failed to close/save state:", e);
          }
        }
        resolve();
      }, 180000);
    });
  }

  // --- SCRAPING MODE ---
  console.log(`Preparing to scrape ${params.urls.length} URLs...`);
  const browser = await chromium.launch({ headless: true });
  
  let contextOptions = {};
  if (fs.existsSync(STATE_FILE)) {
    console.log(`Loading saved authentication state from: ${STATE_FILE}`);
    contextOptions.storageState = STATE_FILE;
  } else {
    console.log("No state.json found. Running session-less scraper.");
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // Load existing topics JSON
  let existingTopics = [];
  if (fs.existsSync(params.output)) {
    try {
      const data = fs.readFileSync(params.output, "utf-8");
      existingTopics = JSON.parse(data);
      console.log(`Loaded ${existingTopics.length} existing topics from: ${params.output}`);
    } catch (e) {
      console.warn(`Could not parse output file, starting fresh: ${e.message}`);
    }
  }

  for (const url of params.urls) {
    try {
      console.log(`Scraping: ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });

      // Extract article content
      const articleData = await page.evaluate((config) => {
        const titleEl = document.querySelector("h1") || document.querySelector("title");
        const title = titleEl ? titleEl.innerText.trim() : "Scraped Article";
        
        // Find main content container
        const contentEl = document.querySelector(config.selector);
        let contentHtml = "";
        let textContent = "";
        
        if (contentEl) {
          contentHtml = contentEl.innerHTML;
          textContent = contentEl.innerText || "";
        } else {
          contentHtml = document.body.innerHTML;
          textContent = document.body.innerText || "";
        }

        // Custom simple HTML to Markdown converter running inside DOM context
        function htmlToMarkdown(htmlString) {
          let doc = new DOMParser().parseFromString(htmlString, 'text/html');
          
          // Basic replacements
          let markdown = "";
          
          function walk(node) {
            if (node.nodeType === Node.TEXT_NODE) {
              markdown += node.nodeValue;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const tag = node.tagName.toLowerCase();
              if (tag === 'h1') markdown += "\n# ";
              else if (tag === 'h2') markdown += "\n## ";
              else if (tag === 'h3') markdown += "\n### ";
              else if (tag === 'p') markdown += "\n\n";
              else if (tag === 'strong' || tag === 'b') markdown += "**";
              else if (tag === 'em' || tag === 'i') markdown += "*";
              else if (tag === 'code') markdown += " `";
              else if (tag === 'pre') markdown += "\n```\n";
              else if (tag === 'li') markdown += "\n* ";
              else if (tag === 'br') markdown += "\n";
              
              for (let child of node.childNodes) {
                walk(child);
              }
              
              if (tag === 'strong' || tag === 'b') markdown += "**";
              else if (tag === 'em' || tag === 'i') markdown += "*";
              else if (tag === 'code') markdown += "` ";
              else if (tag === 'pre') markdown += "\n```\n";
              else if (tag === 'h1' || tag === 'h2' || tag === 'h3') markdown += "\n";
            }
          }
          
          walk(doc.body);
          
          // Clean up formatting
          return markdown
            .replace(/\n\s*\n\s*\n/g, "\n\n") // Collapse multiple blank lines
            .trim();
        }

        const contentMarkdown = htmlToMarkdown(contentHtml);
        
        // Retrieve meta tags for description or tags
        const metaDesc = document.querySelector("meta[name='description']");
        const description = metaDesc ? metaDesc.getAttribute("content") : textContent.substring(0, 160).replace(/\s+/g, " ") + "...";
        
        const metaKeywords = document.querySelector("meta[name='keywords']");
        const keywords = metaKeywords ? metaKeywords.getAttribute("content").split(",").map(k => k.trim()) : [];

        return {
          title,
          description,
          contentMarkdown,
          keywords,
          wordCount: textContent.split(/\s+/).filter(Boolean).length
        };
      }, { selector: params.selector });

      // Generate additional details
      const slug = generateSlug(articleData.title);
      const estimatedTime = Math.max(5, Math.ceil(articleData.wordCount / 200)); // ~200 wpm
      
      // Determine category based on URL
      let category = "Core Fundamentals";
      if (url.includes("/deep-dives/")) {
        const infraSlugs = ["kafka", "api-gateway", "flink", "zookeeper", "rate-limiter", "job-scheduler", "metrics-monitoring"];
        if (infraSlugs.some(s => url.includes(s))) {
          category = "Infrastructure & Messaging";
        } else {
          category = "Databases & Storage";
        }
      } else if (url.includes("/problem-breakdowns/")) {
        const storageSlugs = ["distributed-cache", "redis", "cassandra", "dynamodb", "postgresql"];
        const infraSlugs = ["distributed-rate-limiter", "job-scheduler", "metrics-monitoring"];
        if (storageSlugs.some(s => url.includes(s))) {
          category = "Databases & Storage";
        } else if (infraSlugs.some(s => url.includes(s))) {
          category = "Infrastructure & Messaging";
        } else {
          category = "System Architectures";
        }
      }

      // Prepend category to tags if not already present
      let rawTags = articleData.keywords.filter(k => k !== "Scraped");
      if (rawTags.length === 0) {
        rawTags = ["Systems"];
      }
      if (!rawTags.includes(category)) {
        rawTags.unshift(category);
      }

      const newTopic = {
        id: generateObjectId(),
        title: articleData.title,
        slug: slug,
        description: articleData.description,
        difficulty: "MEDIUM", // Default difficulty
        category: category,
        estimatedTimeMinutes: estimatedTime,
        tags: rawTags,
        isPremium: params.premium,
        contentMarkdown: articleData.contentMarkdown,
        prerequisites: [],
        videoUrl: "",
        pdfUrl: ""
      };

      // Check if topic with this slug already exists to prevent duplicates
      const existingIndex = existingTopics.findIndex(t => t.slug === slug);
      if (existingIndex > -1) {
        // Keep same ID, but update contents
        newTopic.id = existingTopics[existingIndex].id;
        existingTopics[existingIndex] = newTopic;
        console.log(`Updated existing topic matching slug: ${slug}`);
      } else {
        existingTopics.push(newTopic);
        console.log(`Added new topic: ${newTopic.title} (${slug})`);
      }

    } catch (e) {
      console.error(`Error scraping ${url}:`, e);
    }
  }

  await browser.close();

  // Save the updated list back to JSON
  try {
    fs.mkdirSync(path.dirname(params.output), { recursive: true });
    fs.writeFileSync(params.output, JSON.stringify(existingTopics, null, 2), "utf-8");
    console.log(`Successfully saved all topics to: ${params.output}`);
  } catch (e) {
    console.error("Failed to write output JSON:", e);
  }
}

run();
