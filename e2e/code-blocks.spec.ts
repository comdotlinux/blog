import { test, expect } from "@playwright/test";

test.use({ colorScheme: "light" });

test.describe("Code Blocks", () => {
  test("gradle post has shiki code blocks", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    expect(await page.locator("pre.astro-code").count()).toBeGreaterThan(0);
  });

  test("code tokens carry --shiki-dark variables", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const pre = page.locator("pre.astro-code").first();
    await expect(pre).toHaveAttribute("style", /--shiki-dark:/);
    expect(
      await pre.locator('code span[style*="--shiki-dark"]').count()
    ).toBeGreaterThan(0);
  });

  test("code block colour changes in dark theme", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const pre = page.locator("pre.astro-code").first();
    const style = () =>
      pre.evaluate(el => {
        const s = getComputedStyle(el);
        return `${s.backgroundColor} ${s.color}`;
      });
    const light = await style();

    await page.locator("#theme-btn").click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await style()).not.toBe(light);
  });

  test("code blocks scroll horizontally instead of wrapping", async ({
    page,
  }) => {
    await page.goto("/posts/gradle-tricks/");
    const pre = page.locator("pre.astro-code").first();
    const css = await pre.evaluate(el => {
      const s = getComputedStyle(el);
      return { overflowX: s.overflowX, whiteSpace: s.whiteSpace };
    });
    expect(["auto", "scroll"]).toContain(css.overflowX);
    expect(css.whiteSpace).toBe("pre");
  });

  test("code blocks use a monospace font", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const fontFamily = await page
      .locator("pre.astro-code code")
      .first()
      .evaluate(el => getComputedStyle(el).fontFamily.toLowerCase());
    expect(fontFamily).toContain("mono");
  });

  test("tmux post has code blocks", async ({ page }) => {
    await page.goto("/posts/tmux-how-i-use-it/");
    expect(await page.locator("pre.astro-code").count()).toBeGreaterThan(0);
  });
});
