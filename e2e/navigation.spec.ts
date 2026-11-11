import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("can navigate from home to posts", async ({ page }) => {
    await page.goto("/");
    await page.locator('#nav-menu a[href="/posts/"]').click();
    await expect(page).toHaveURL(/\/posts\/$/);
    await expect(page.locator("h1")).toHaveText("Posts");
  });

  test("can navigate from home to tags", async ({ page }) => {
    await page.goto("/");
    await page.locator('#nav-menu a[href="/tags/"]').click();
    await expect(page).toHaveURL(/\/tags\/$/);
    await expect(page.locator("h1")).toHaveText("Tags");
  });

  test("can navigate from home to about", async ({ page }) => {
    await page.goto("/");
    await page.locator('#nav-menu a[href="/about/"]').click();
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test("can navigate from home to search", async ({ page }) => {
    await page.goto("/");
    await page.locator('#nav-menu a[href="/search/"]').click();
    await expect(page).toHaveURL(/\/search\/$/);
    await expect(page.locator("h1")).toHaveText("Search");
  });

  test("site title navigates to home", async ({ page }) => {
    await page.goto("/posts/");
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL("/");
  });

  test("about page loads correctly", async ({ page }) => {
    const response = await page.goto("/about/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });

  test("404 page shows for invalid routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toHaveText("404");
  });

  test("has no archives link", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href*="/archives"]')).toHaveCount(0);
  });
});
