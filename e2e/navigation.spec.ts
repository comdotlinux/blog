import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("can navigate from home to posts", async ({ page }) => {
    await page.goto("/");

    await page.locator('nav a[href="/posts"]').click();
    await expect(page).toHaveURL(/\/posts/);
  });

  test("can navigate from home to tags", async ({ page }) => {
    await page.goto("/");

    await page.locator('nav a[href="/tags"]').click();
    await expect(page).toHaveURL(/\/tags/);
  });

  test("can navigate from home to about", async ({ page }) => {
    await page.goto("/");

    await page.locator('nav a[href="/about"]').click();
    await expect(page).toHaveURL(/\/about/);
  });

  test("can navigate from home to search", async ({ page }) => {
    await page.goto("/");

    await page.locator('a[href="/search"]').click();
    await expect(page).toHaveURL(/\/search/);
  });

  test("logo/title navigates to home", async ({ page }) => {
    await page.goto("/posts/");

    await page.locator('a.logo, header a[href="/"]').first().click();
    await expect(page).toHaveURL("/");
  });

  test("about page loads correctly", async ({ page }) => {
    await page.goto("/about/");

    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("404 page shows for invalid routes", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/");
    expect(response?.status()).toBe(404);
  });
});
