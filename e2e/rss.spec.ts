import { test, expect } from "@playwright/test";

test.describe("RSS Feed", () => {
  test("RSS feed is accessible", async ({ page }) => {
    const response = await page.goto("/rss.xml");

    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("xml");
  });

  test("RSS feed contains posts", async ({ page }) => {
    await page.goto("/rss.xml");

    const content = await page.content();

    // Check for RSS structure
    expect(content).toContain("<rss");
    expect(content).toContain("<channel>");
    expect(content).toContain("<item>");
  });

  test("RSS feed has correct site title", async ({ page }) => {
    await page.goto("/rss.xml");

    const content = await page.content();
    expect(content).toContain("Developer Musings");
  });
});
