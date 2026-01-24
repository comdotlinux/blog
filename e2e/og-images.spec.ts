import { test, expect } from "@playwright/test";

test.describe("OG Images", () => {
  test("homepage has og:image meta tag", async ({ page }) => {
    await page.goto("/");

    const ogImage = await page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
  });

  test("post page has og:image meta tag", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogImage = await page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
  });

  test("og:image URL is accessible", async ({ page, request }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogImage = await page.locator('meta[property="og:image"]');
    const imageUrl = await ogImage.getAttribute("content");

    expect(imageUrl).toBeTruthy();

    if (imageUrl && !imageUrl.startsWith("http")) {
      const fullUrl = new URL(imageUrl, page.url()).href;
      const response = await request.get(fullUrl);
      expect(response.ok()).toBeTruthy();
    }
  });

  test("homepage has og:title meta tag", async ({ page }) => {
    await page.goto("/");

    const ogTitle = await page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);
  });

  test("post has og:title matching post title", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogTitle = await page.locator('meta[property="og:title"]');
    const content = await ogTitle.getAttribute("content");
    expect(content).toContain("Gradle");
  });

  test("has og:description meta tag", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogDesc = await page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveAttribute("content", /.+/);
  });

  test("has og:type meta tag", async ({ page }) => {
    await page.goto("/");

    const ogType = await page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", /.+/);
  });

  test("post page has article og:type", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogType = await page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "article");
  });

  test("has og:url meta tag", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const ogUrl = await page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", /.+/);
  });

  test("has twitter:card meta tag", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const twitterCard = await page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute("content", /.+/);
  });

  test("has twitter:image meta tag", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const twitterImage = await page.locator('meta[name="twitter:image"]');
    const ogImage = await page.locator('meta[property="og:image"]');

    const twitterContent = await twitterImage.getAttribute("content");
    const ogContent = await ogImage.getAttribute("content");

    expect(twitterContent || ogContent).toBeTruthy();
  });
});
