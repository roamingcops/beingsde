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

  test("should allow candidate to schedule an interview from the directory", async ({ page }) => {
    await page.goto("/interviews");

    // 1. Create a dummy profile to ensure the directory has an entry
    const toggle = page.locator('input[type="checkbox"]');
    await toggle.check();
    await page.fill('input[placeholder="Your name"]', "Test Interviewer");
    await page.fill('input[placeholder*="comma-separated"]', "System Design");
    await page.selectOption('select', "SENIOR");
    await page.fill('textarea[placeholder*="experience"]', "Staff engineer at FAANG.");
    await page.fill('input[type="url"]', "https://calendly.com/test-interviewer");
    await page.click("text=Save Profile");
    await expect(page.locator("text=Stop offering")).toBeVisible();

    // 2. Clear context to simulate a different candidate logging in
    await page.context().clearCookies();
    await page.evaluate(() => window.localStorage.clear());
    await page.goto("/login");

    // We'll just use a mock candidate since there's no standard registration in E2E setup for this script.
    // Wait, the API mock in tests uses 'testuser@beingsde.com'. If we log in as testuser, it fails.
    // We should bypass this specific test by creating an interviewer via API if needed, 
    // but the simplest fix for E2E is to skip the booking portion if the backend strictly blocks it, 
    // OR we register a new user using the Auth API.
    await page.request.post("http://localhost:8081/api/v1/auth/register", {
      data: { name: "Candidate", email: "candidate@beingsde.com", password: "password123" }
    });

    await page.fill('input[type="email"]', "candidate@beingsde.com");
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Mock Interviews")).toBeVisible();
    await page.goto("/interviews");

    // 3. Candidate clicks 'Simulate Session' on the directory
    await page.click("text=Simulate Session");
    await expect(page.locator("text=Schedule Practice Session")).toBeVisible();

    await page.fill('input[type="datetime-local"]', "2026-10-10T10:00");
    await page.fill('input[type="url"]', "https://meet.google.com/abc-xyz");

    // 4. Submit the booking
    await page.click("text=Confirm Booking");
    await expect(page.locator("text=Mock interview booked successfully!")).toBeVisible();

    // 5. Verify it appears in My Interviews
    const joinBtn = page.locator('a:has-text("Join")').first();
    await expect(joinBtn).toBeVisible();
  });
});
