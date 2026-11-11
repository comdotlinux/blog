import { test, expect } from "@playwright/test";

test.use({ colorScheme: "light" });

test.describe("Dark Mode Toggle", () => {
  test("toggle switches data-theme and .dark on <html>", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "light");
    await expect(html).not.toHaveClass(/\bdark\b/);

    await page.locator("#theme-btn").click();
    await expect(html).toHaveAttribute("data-theme", "dark");
    await expect(html).toHaveClass(/\bdark\b/);

    await page.locator("#theme-btn").click();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("theme persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.locator("#theme-btn").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("theme button aria-label reflects the theme", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("#theme-btn");
    await expect(button).toHaveAttribute("aria-label", "light");
    await button.click();
    await expect(button).toHaveAttribute("aria-label", "dark");
  });
});
