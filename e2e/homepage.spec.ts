import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Developer Musings/);
  });

  test("displays blog posts", async ({ page }) => {
    await page.goto("/");
    // Cards are rendered as li elements
    const posts = page.locator("ul li a h2, ul li a h3");
    await expect(posts.first()).toBeVisible();
  });

  test("has working navigation links", async ({ page }) => {
    await page.goto("/");

    // Check Posts link (without trailing slash)
    const postsLink = page.locator('nav a[href="/posts"]');
    await expect(postsLink).toBeVisible();

    // Check Tags link
    const tagsLink = page.locator('nav a[href="/tags"]');
    await expect(tagsLink).toBeVisible();

    // Check About link
    const aboutLink = page.locator('nav a[href="/about"]');
    await expect(aboutLink).toBeVisible();
  });

  test("displays social links", async ({ page }) => {
    await page.goto("/");
    // Check that social links section exists
    const socialLinks = page.locator('a[href*="github.com"]');
    await expect(socialLinks.first()).toBeVisible();
  });
});
