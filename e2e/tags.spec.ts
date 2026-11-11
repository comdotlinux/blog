import { test, expect } from "@playwright/test";

test.describe("Tags Page", () => {
  test("loads tags page", async ({ page }) => {
    await page.goto("/tags/");
    await expect(page).toHaveTitle("Tags | Developer Musings");
  });

  test("lists all 14 tags", async ({ page }) => {
    await page.goto("/tags/");
    await expect(page.locator('#main-content a[href^="/tags/"]')).toHaveCount(
      14
    );
  });

  test("gradle tag page shows gradle posts", async ({ page }) => {
    await page.goto("/tags/gradle/");
    await expect(page).toHaveTitle("Tag: gradle | Developer Musings");
    await expect(page.locator("h1")).toHaveText("Tag: gradle");
    await expect(
      page.locator('#main-content a[href="/posts/gradle-tricks/"]')
    ).toBeVisible();
  });

  test("automation tag page loads", async ({ page }) => {
    await page.goto("/tags/automation/");
    await expect(page.locator("h1")).toHaveText("Tag: automation");
    await expect(page.locator("#main-content ul > li").first()).toBeVisible();
  });

  test("linux tag page loads", async ({ page }) => {
    await page.goto("/tags/linux/");
    await expect(page.locator("h1")).toHaveText("Tag: linux");
    await expect(page.locator("#main-content ul > li").first()).toBeVisible();
  });
});
