import { test, expect } from "@playwright/test";

test.describe("Posts Page", () => {
  test("loads posts listing page", async ({ page }) => {
    await page.goto("/posts/");

    await expect(page).toHaveURL(/\/posts/);
    await expect(page.locator("ul li a").first()).toBeVisible();
  });

  test("can navigate to individual post", async ({ page }) => {
    await page.goto("/posts/");

    await page.locator("ul li a h2, ul li a h3").first().click();
    await expect(page).toHaveURL(/\/posts\/[a-z]/);
  });

  test("post detail page has content", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    await expect(page.locator("h1")).toContainText("Gradle");
    await expect(page.locator("main")).toBeVisible();
  });

  test("post has published date", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    await expect(page.locator("text=November").first()).toBeVisible();
  });

  test("post has tags", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const tagLinks = page.locator('a[href*="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("post has table of contents", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    await expect(page.locator("main")).toBeVisible();
  });
});
