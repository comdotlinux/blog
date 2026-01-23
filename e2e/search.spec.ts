import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("navigates to search page", async ({ page }) => {
    await page.goto("/");

    await page.locator('a[href="/search"]').first().click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("search input is visible on search page", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await expect(searchInput).toBeVisible();
  });

  test("searches for 'gradle' and finds gradle post", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("gradle");
    await page.waitForTimeout(500);

    await expect(page.locator("text=Gradle Tricks").first()).toBeVisible();
  });

  test("searches for 'tmux' and finds tmux post", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("tmux");
    await page.waitForTimeout(500);

    await expect(page.locator("text=tmux").first()).toBeVisible();
  });

  test("shows result count for search", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("gradle");
    await page.waitForTimeout(500);

    await expect(page.locator("text=Found")).toBeVisible();
  });

  test("updates URL with search query", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("test");
    await page.waitForTimeout(500);

    await expect(page).toHaveURL(/q=test/);
  });
});
