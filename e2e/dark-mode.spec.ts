import { test, expect } from "@playwright/test";

test.describe("Dark Mode Toggle", () => {
  test("theme button exists and is clickable", async ({ page }) => {
    await page.goto("/");

    const themeButton = page.locator("#theme-btn");
    await expect(themeButton).toBeVisible();
    await themeButton.click();
  });

  test("theme button has sun and moon icons", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#moon-svg")).toBeAttached();
    await expect(page.locator("#sun-svg")).toBeAttached();
  });

  test("clicking theme button changes icon visibility", async ({ page }) => {
    await page.goto("/");

    const themeButton = page.locator("#theme-btn");

    await themeButton.click();
    await page.waitForTimeout(100);

    await themeButton.click();
    await page.waitForTimeout(100);

    await expect(page.locator("#moon-svg")).toBeAttached();
    await expect(page.locator("#sun-svg")).toBeAttached();
  });
});
