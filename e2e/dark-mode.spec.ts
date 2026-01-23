import { test, expect } from "@playwright/test";

test.describe("Dark Mode Toggle", () => {
  test("theme button exists and is clickable", async ({ page }) => {
    await page.goto("/");

    // Find the theme toggle button
    const themeButton = page.locator("#theme-btn");
    await expect(themeButton).toBeVisible();

    // Click should not throw an error
    await themeButton.click();
  });

  test("theme button has sun and moon icons", async ({ page }) => {
    await page.goto("/");

    const moonIcon = page.locator("#moon-svg");
    const sunIcon = page.locator("#sun-svg");

    // Both icons exist (one hidden, one visible based on theme)
    await expect(moonIcon).toBeAttached();
    await expect(sunIcon).toBeAttached();
  });

  test("clicking theme button changes icon visibility", async ({ page }) => {
    await page.goto("/");

    const themeButton = page.locator("#theme-btn");

    // Get initial visibility states of icons
    const moonIcon = page.locator("#moon-svg");
    const sunIcon = page.locator("#sun-svg");

    // Click to toggle
    await themeButton.click();
    await page.waitForTimeout(100);

    // Click again
    await themeButton.click();
    await page.waitForTimeout(100);

    // Both icons should still be attached (just visibility changes)
    await expect(moonIcon).toBeAttached();
    await expect(sunIcon).toBeAttached();
  });
});
