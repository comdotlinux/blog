import { test, expect } from "@playwright/test";

test.describe("Tags Page", () => {
  test("loads tags page", async ({ page }) => {
    await page.goto("/tags/");

    await expect(page).toHaveURL(/\/tags/);
  });

  test("displays tag links", async ({ page }) => {
    await page.goto("/tags/");

    // Should have multiple tag links
    const tagLinks = page.locator('a[href*="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("gradle tag page shows gradle posts", async ({ page }) => {
    await page.goto("/tags/gradle/");

    await expect(page).toHaveURL(/\/tags\/gradle/);

    // Should show the gradle post
    const gradlePost = page.locator("text=Gradle");
    await expect(gradlePost.first()).toBeVisible();
  });

  test("automation tag page loads", async ({ page }) => {
    await page.goto("/tags/automation/");

    await expect(page).toHaveURL(/\/tags\/automation/);
    // Should have at least one post
    const posts = page.locator("ul li");
    await expect(posts.first()).toBeVisible();
  });

  test("linux tag page loads", async ({ page }) => {
    await page.goto("/tags/linux/");

    await expect(page).toHaveURL(/\/tags\/linux/);
    const posts = page.locator("ul li");
    await expect(posts.first()).toBeVisible();
  });
});
