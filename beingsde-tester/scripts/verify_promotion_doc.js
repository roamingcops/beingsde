const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  console.log("Navigating to http://localhost:3000/promotion-doc...");
  await page.goto("http://localhost:3000/promotion-doc", { waitUntil: "networkidle" });

  const screenshotDir = path.join(__dirname, "../screenshots");
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Screenshot 1: Hero and Tabs (Dark mode)
  await page.screenshot({ path: path.join(screenshotDir, "promo-hero-dark.png"), fullPage: false });
  console.log("Saved promo-hero-dark.png");

  // Check tab text content to ensure NO truncation
  const tabButtons = await page.$$eval("div:has(> button:has-text('Packet Blueprint')) button", (buttons) =>
    buttons.map((b) => b.innerText.trim())
  );
  console.log("Found tab buttons:", tabButtons);

  // Click on "Ticket Showcase & STAR-I"
  await page.click("button:has-text('Ticket Showcase & STAR-I')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, "promo-tickets-dark.png"), fullPage: false });
  console.log("Saved promo-tickets-dark.png");

  // Click on "Quality & Bug Counts"
  await page.click("button:has-text('Quality & Bug Counts')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, "promo-quality-dark.png"), fullPage: false });
  console.log("Saved promo-quality-dark.png");

  // Click on "Q4 Endgame Playbook"
  await page.click("button:has-text('Q4 Endgame Playbook')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, "promo-q4-dark.png"), fullPage: false });
  console.log("Saved promo-q4-dark.png");

  // Navigate to the standalone topic page
  await page.goto("http://localhost:3000/topics/sde-q4-showcase-playbook", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(screenshotDir, "topic-q4-article.png"), fullPage: false });
  console.log("Saved topic-q4-article.png");

  // Switch to light mode and take a screenshot of promotion doc
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("http://localhost:3000/promotion-doc", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(screenshotDir, "promo-hero-light.png"), fullPage: false });
  console.log("Saved promo-hero-light.png");

  await browser.close();
  console.log("Done!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
