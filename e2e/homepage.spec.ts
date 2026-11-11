import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle("Developer Musings");
  });

  test("shows perIndex (4) recent posts", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#recent-posts li")).toHaveCount(4);
  });

  test("has nav links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("#nav-menu");
    await expect(nav.locator('a[href="/posts/"]')).toBeVisible();
    await expect(nav.locator('a[href="/tags/"]')).toBeVisible();
    await expect(nav.locator('a[href="/about/"]')).toBeVisible();
    await expect(nav.locator('a[href="/search/"]')).toBeVisible();
  });

  test("shows 9 social links", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator('#hero a[title*="Developer Musings"]')
    ).toHaveCount(9);
  });

  for (const [host, name] of [
    ["youtube.com", "YouTube"],
    ["reddit.com", "Reddit"],
    ["mastodon.social", "Mastodon"],
  ]) {
    test(`${name} social link uses the explicit linkTitle`, async ({
      page,
    }) => {
      await page.goto("/");
      const link = page.locator(`#hero a[href*="${host}"]`);
      await expect(link).toHaveAttribute(
        "title",
        `Developer Musings on ${name}`
      );
      await expect(link).toHaveAccessibleName(`Developer Musings on ${name}`);
    });
  }
});
