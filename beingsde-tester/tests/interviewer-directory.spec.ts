import { test, expect } from "@playwright/test";

test.describe("Interviewer Directory E2E Flow", () => {
  test.beforeEach(async ({ page, request }) => {
    // Clean up test database before each test run
    await request.delete("http://localhost:8081/api/v1/interviews/test/cleanup");

    await page.goto("/login");
    await page.fill("#email-input", "testuser@beingsde.com");
    await page.fill("#password-input", "testuser123");
    await page.click("#login-submit-btn");
    await page.waitForURL("**/topics");
  });

  test("should create interviewer profile and see it in directory", async ({ page }) => {
    await page.goto("/interviews");
    await expect(page.locator("h1")).toHaveText("Mock Interviews");

    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();

    await page.fill('input[placeholder="Your name"]', "Test Interviewer");
    await page.fill('input[placeholder*="comma-separated"]', "Redis, Kafka");
    await page.selectOption('select', "SENIOR");
    await page.fill('textarea[placeholder*="experience"]', "Staff engineer at FAANG.");
    await page.fill('input[type="url"]', "https://calendly.com/test-interviewer");

    await page.click("text=Save Profile");
    await expect(page.locator("text=Stop offering")).toBeVisible();

    await page.goto("/interviews");
    const dirCard = page.locator("text=Test Interviewer");
    await expect(dirCard).toBeVisible();

    const redisTag = page.locator("text=Redis");
    await expect(redisTag).toBeVisible();

    const kafkaTag = page.locator("text=Kafka");
    await expect(kafkaTag).toBeVisible();

    const calButton = page.locator('a:has-text("Book via Calendly")');
    await expect(calButton).toBeVisible();
  });

  test("should display empty states when no interviewers available", async ({ page }) => {
    await page.goto("/interviews");

    const emptyText = page.locator("text=No interviewers available right now.");
    await expect(emptyText).toBeVisible();
  });

  test("should show My Interviews empty state", async ({ page }) => {
    await page.goto("/interviews");

    const section = page.locator("text=My Interviews");
    await expect(section).toBeVisible();

    const emptyState = page.locator("text=No interviews yet");
    await expect(emptyState).toBeVisible();
  });
});
