import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Developer Musings/);
  });

  test("displays blog posts", async ({ page }) => {
    await page.goto("/");
    const posts = page.locator("ul li a h2, ul li a h3");
    await expect(posts.first()).toBeVisible();
  });

  test("has working navigation links", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('nav a[href="/posts"]')).toBeVisible();
    await expect(page.locator('nav a[href="/tags"]')).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
  });

  test("displays social links", async ({ page }) => {
    await page.goto("/");
    const socialLinks = page.locator('a[href*="github.com"]');
    await expect(socialLinks.first()).toBeVisible();
  });
});
