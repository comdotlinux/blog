import { test, expect } from "@playwright/test";

const searchInput = ".pagefind-ui__search-input";

test.describe("Search Functionality", () => {
  test("navigates to search page", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/search/"]').first().click();
    await expect(page).toHaveURL(/\/search\/$/);
  });

  test("search input is visible on search page", async ({ page }) => {
    await page.goto("/search/");
    await expect(page.locator(`#pagefind-search ${searchInput}`)).toBeVisible();
  });

  test("searches for 'gradle' and finds gradle post", async ({ page }) => {
    await page.goto("/search/");
    await page.locator(searchInput).fill("gradle");
    await expect(
      page.locator(".pagefind-ui__result-title", { hasText: "Gradle Tricks" })
    ).toBeVisible();
  });

  test("searches for 'tmux' and finds tmux post", async ({ page }) => {
    await page.goto("/search/");
    await page.locator(searchInput).fill("tmux");
    await expect(
      page.locator(".pagefind-ui__result-title", {
        hasText: "tmux, how I use it",
      })
    ).toBeVisible();
  });

  test("shows result count for search", async ({ page }) => {
    await page.goto("/search/");
    await page.locator(searchInput).fill("gradle");
    await expect(page.locator(".pagefind-ui__message")).toHaveText(
      /\d+ results? for gradle/
    );
  });

  test("updates URL with search query", async ({ page }) => {
    await page.goto("/search/");
    await page.locator(searchInput).fill("tmux");
    await expect(page).toHaveURL(/\?q=tmux/);
  });
});
