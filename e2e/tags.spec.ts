import { test, expect } from "@playwright/test";

test.describe("Tags Page", () => {
  test("loads tags page", async ({ page }) => {
    await page.goto("/tags/");
    await expect(page).toHaveURL(/\/tags/);
  });

  test("displays tag links", async ({ page }) => {
    await page.goto("/tags/");

    const tagLinks = page.locator('a[href*="/tags/"]');
    const count = await tagLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("gradle tag page shows gradle posts", async ({ page }) => {
    await page.goto("/tags/gradle/");

    await expect(page).toHaveURL(/\/tags\/gradle/);
    await expect(page.locator("text=Gradle").first()).toBeVisible();
  });

  test("automation tag page loads", async ({ page }) => {
    await page.goto("/tags/automation/");

    await expect(page).toHaveURL(/\/tags\/automation/);
    await expect(page.locator("ul li").first()).toBeVisible();
  });

  test("linux tag page loads", async ({ page }) => {
    await page.goto("/tags/linux/");

    await expect(page).toHaveURL(/\/tags\/linux/);
    await expect(page.locator("ul li").first()).toBeVisible();
  });
});
