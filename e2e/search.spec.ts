import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test("navigates to search page", async ({ page }) => {
    await page.goto("/");

    // Click search link/button
    const searchLink = page.locator('a[href="/search"]').first();
    await searchLink.click();

    await expect(page).toHaveURL(/\/search/);
  });

  test("search input is visible on search page", async ({ page }) => {
    await page.goto("/search/");

    // Input has name="search" and type="text"
    const searchInput = page.locator('input[name="search"]');
    await expect(searchInput).toBeVisible();
  });

  test("searches for 'gradle' and finds gradle post", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("gradle");

    // Wait for search results
    await page.waitForTimeout(500);

    // Check that gradle post appears in results
    const results = page.locator("text=Gradle Tricks");
    await expect(results.first()).toBeVisible();
  });

  test("searches for 'tmux' and finds tmux post", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("tmux");

    await page.waitForTimeout(500);

    const results = page.locator("text=tmux");
    await expect(results.first()).toBeVisible();
  });

  test("shows result count for search", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("gradle");

    await page.waitForTimeout(500);

    // Check for "Found X result(s)" text
    const resultCount = page.locator("text=Found");
    await expect(resultCount).toBeVisible();
  });

  test("updates URL with search query", async ({ page }) => {
    await page.goto("/search/");

    const searchInput = page.locator('input[name="search"]');
    await searchInput.fill("test");

    await page.waitForTimeout(500);

    // URL should contain query parameter
    await expect(page).toHaveURL(/q=test/);
  });
});
