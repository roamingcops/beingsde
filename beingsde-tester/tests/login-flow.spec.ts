import { test, expect } from "@playwright/test";

test.describe("beingsde UI-Backend Login Integration Flow", () => {
  test("should successfully log in and redirect to topics dashboard", async ({ page }) => {
    // 1. Visit UI Login page
    await page.goto("/login");
    await expect(page).toHaveTitle(/beingsde/i);
    
    // 2. Assert page headings are present
    const heading = page.locator("h1");
    await expect(heading).toHaveText("Access Workbench");

    // 3. Fill in seeded test credentials
    await page.fill("#email-input", "testuser@beingsde.com");
    await page.fill("#password-input", "testuser123");

    // 4. Submit form
    await page.click("#login-submit-btn");

    // 5. Expect navigation to /topics
    await page.waitForURL("**/topics");
    await expect(page.locator("h1")).toHaveText("System Design Explorer");

    // 6. Verify JWT token is saved in client local storage
    const token = await page.evaluate(() => localStorage.getItem("accessToken"));
    expect(token).toBeTruthy();
    expect(token?.length).toBeGreaterThan(50);
    
    console.log(">>> Playwright E2E Integration Success! Token verified:", token?.substring(0, 30) + "...");
  });
});
