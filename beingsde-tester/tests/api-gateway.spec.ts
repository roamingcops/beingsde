import { test, expect } from "@playwright/test";

test.describe("API Gateway Topic Page", () => {
  test("should render API Gateway page with comprehensive content, tables, alerts, and simulator", async ({ page }) => {
    // Navigate to local API Gateway topic page
    const response = await page.goto("/topics/api-gateway", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    // 1. Verify Metadata & Header
    const heading = page.locator("h1").first();
    await expect(heading).toHaveText("API Gateway");
    
    // Check estimated time badge
    await expect(page.locator("text=35 Min")).toBeVisible();
    await expect(page.locator("text=Infrastructure & Messaging").first()).toBeVisible();

    // 2. Verify that Video Lecture and PDF Blueprint tabs are NOT present
    await expect(page.locator("text=Video Lecture")).not.toBeVisible();
    await expect(page.locator("text=PDF blueprint")).not.toBeVisible();
    await expect(page.locator("text=Download PDF Blueprint")).not.toBeVisible();

    // 3. Verify Key Section Headings
    await expect(page.locator("h2", { hasText: "1. Architectural Role & The Modern Edge Tier" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "2. End-to-End Request Lifecycle & Edge Pipeline" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "3. Traffic Routing, Dynamic Discovery & Envoy xDS Architecture" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "4. Edge Security: Zero-Trust \"Passport\" Exchange & Authentication" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "5. Distributed Rate Limiting & Traffic Shaping at Scale" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "6. Resilience Engineering: Circuit Breaking, Timeouts & Bulkheading" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "7. Backend-for-Frontend (BFF) & Request Aggregation" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "8. Protocol Mediation: REST to gRPC Transcoding" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "9. Real-World Architecture: Event Loops vs. Thread-per-Request" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "10. The 45-Minute FAANG Interview Blueprint" })).toBeVisible();

    // 4. Verify Tables
    const tables = page.locator("table");
    const tableCount = await tables.count();
    expect(tableCount).toBeGreaterThanOrEqual(3);

    // Check specific table headers
    await expect(page.locator("th", { hasText: "Tier Component" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Algorithm" })).toBeVisible();
    await expect(page.locator("th", { hasText: "Dimension" })).toBeVisible();
    await expect(page.locator("td", { hasText: "Concurrency Model" })).toBeVisible();

    // 5. Verify Callout Alert Blocks
    await expect(page.locator("text=North-South vs. East-West Traffic Flow")).toBeVisible();
    await expect(page.locator("text=Defending Against Header Spoofing")).toBeVisible();
    await expect(page.locator("text=Golden Rules of Gateway Retries")).toBeVisible();
    await expect(page.locator("text=Key Interview Takeaway")).toBeVisible();

    // 6. Verify Code Blocks with Copy Buttons
    const codeBlocks = page.locator("pre code");
    const codeCount = await codeBlocks.count();
    expect(codeCount).toBeGreaterThanOrEqual(4);

    const copyButtons = page.locator("button", { hasText: "Copy" });
    const copyCount = await copyButtons.count();
    expect(copyCount).toBeGreaterThanOrEqual(4);

    // 7. Verify Right Sidebar Rate Limiter Simulator
    await expect(page.locator("text=Rate Limiter Simulator")).toBeVisible();
    const sendReqButton = page.locator("button", { hasText: "Send Client Request" });
    await expect(sendReqButton).toBeVisible();

    // Click request button to test simulator interaction
    await sendReqButton.click();
    await expect(page.locator("text=200 OK").first()).toBeVisible();

    // 8. Capture Screenshots for visual validation
    await page.screenshot({ path: "test-results/api-gateway-full.png", fullPage: true });
  });
});
