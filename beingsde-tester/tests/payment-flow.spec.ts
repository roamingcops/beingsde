import { test, expect } from "@playwright/test";

test.describe("Razorpay Payment Integration & Sandbox Simulation Flow", () => {
  test.beforeEach(async ({ page, request }) => {
    // 1. Reset test database and reset user role to FREE_USER
    await request.delete("http://localhost:8081/api/v1/interviews/test/cleanup");

    // 2. Perform standard login
    await page.goto("/login");
    await page.fill("#email-input", "testuser@beingsde.com");
    await page.fill("#password-input", "testuser123");
    await page.click("#login-submit-btn");
    await page.waitForURL("**/topics");
  });

  test("should successfully purchase subscription via sandbox payment simulator and cancel it", async ({ page }) => {
    // Navigate to Subscriptions page
    await page.goto("/subscriptions");
    await expect(page.locator("h1")).toHaveText("Structured Pricing Plans");

    // Click "Upgrade to Premium" button
    const upgradeButton = page.locator('button:has-text("Upgrade to Premium")');
    await expect(upgradeButton).toBeVisible();
    await upgradeButton.click();

    // Verify sandbox payment modal appears
    const modalHeading = page.locator("text=Simulate Razorpay Payment");
    await expect(modalHeading).toBeVisible();

    // Confirm simulated payment
    const simulateBtn = page.locator('button:has-text("Simulate Success")');
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();

    // Verify success alert message
    const successMsg = page.locator("text=Payment successful! Sandbox user upgraded to Premium tier.");
    await expect(successMsg).toBeVisible();

    // Wait for auto-reload to fetch new status
    await page.waitForTimeout(2500);

    // Verify Active Subscription status panel appears
    const activeSubHeading = page.locator("text=Active Premium Subscription");
    await expect(activeSubHeading).toBeVisible();

    // Click "Cancel Subscription" button
    const cancelBtn = page.locator('button:has-text("Cancel Subscription")');
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Verify cancellation success message
    const cancelSuccessMsg = page.locator("text=Subscription cancelled successfully. Auto-pay has been disabled.");
    await expect(cancelSuccessMsg).toBeVisible();

    // Verify status panel changes to Cancelled Subscription (Pending Expiry)
    const cancelledSubHeading = page.locator("text=Cancelled Subscription (Pending Expiry)");
    await expect(cancelledSubHeading).toBeVisible();
  });
});
