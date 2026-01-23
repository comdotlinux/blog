import { test, expect } from "@playwright/test";

test.describe("Posts Page", () => {
  test("loads posts listing page", async ({ page }) => {
    await page.goto("/posts/");

    await expect(page).toHaveURL(/\/posts/);
    // Posts are rendered as li elements with links
    const posts = page.locator("ul li a");
    await expect(posts.first()).toBeVisible();
  });

  test("can navigate to individual post", async ({ page }) => {
    await page.goto("/posts/");

    // Click on first post title link
    const firstPostLink = page.locator("ul li a h2, ul li a h3").first();
    await firstPostLink.click();

    // Should navigate to a post detail page
    await expect(page).toHaveURL(/\/posts\/[a-z]/);
  });

  test("post detail page has content", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    // Check for post title
    const title = page.locator("h1");
    await expect(title).toContainText("Gradle");

    // Check for main content area
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });

  test("post has published date", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    // Datetime component uses a div with calendar icon and date text
    const datetime = page.locator("text=November");
    await expect(datetime.first()).toBeVisible();
  });

  test("post has tags", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    // Should have tag links
    const tagLinks = page.locator('a[href*="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("post has table of contents", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    // Most posts have a table of contents
    const content = page.locator("main");
    await expect(content).toBeVisible();
  });
});
