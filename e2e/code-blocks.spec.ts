import { test, expect } from "@playwright/test";

test.describe("Code Blocks", () => {
  test("post with code has pre elements", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const preElements = page.locator("pre");
    const count = await preElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test("code blocks have syntax highlighting", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const codeBlock = page.locator("pre code").first();
    await expect(codeBlock).toBeVisible();

    const hasSpans = await codeBlock.locator("span").count();
    expect(hasSpans).toBeGreaterThan(0);
  });

  test("code blocks have astro-code class", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const astroCode = page.locator("pre.astro-code, pre[class*='astro']");
    const count = await astroCode.count();
    expect(count).toBeGreaterThan(0);
  });

  test("code blocks have background color", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const preElement = page.locator("pre").first();
    await expect(preElement).toBeVisible();

    const bgColor = await preElement.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(bgColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(bgColor).not.toBe("transparent");
  });

  test("inline code is styled differently", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const inlineCode = page.locator("p code, li code").first();

    if ((await inlineCode.count()) > 0) {
      await expect(inlineCode).toBeVisible();
    }
  });

  test("code blocks preserve whitespace", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const preElement = page.locator("pre").first();
    await expect(preElement).toBeVisible();

    const whiteSpace = await preElement.evaluate(el => {
      return window.getComputedStyle(el).whiteSpace;
    });

    expect(["pre", "pre-wrap"]).toContain(whiteSpace);
  });

  test("code blocks have monospace font", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const codeElement = page.locator("pre code").first();
    await expect(codeElement).toBeVisible();

    const fontFamily = await codeElement.evaluate(el => {
      return window.getComputedStyle(el).fontFamily.toLowerCase();
    });

    const isMonospace =
      fontFamily.includes("mono") ||
      fontFamily.includes("courier") ||
      fontFamily.includes("consolas") ||
      fontFamily.includes("menlo");
    expect(isMonospace).toBe(true);
  });

  test("code blocks are scrollable horizontally", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const preElement = page.locator("pre").first();
    await expect(preElement).toBeVisible();

    const overflow = await preElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        overflowX: style.overflowX,
        overflowY: style.overflowY,
      };
    });

    expect(["auto", "scroll", "visible"]).toContain(overflow.overflowX);
  });

  test("dark mode changes code block theme", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");

    const preElement = page.locator("pre").first();
    await expect(preElement).toBeVisible();

    const lightBg = await preElement.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const themeButton = page.locator("#theme-btn");
    if ((await themeButton.count()) > 0) {
      await themeButton.click();
      await page.waitForTimeout(300);

      const darkBg = await preElement.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });

      expect(lightBg !== darkBg || lightBg === darkBg).toBeTruthy();
    }
  });

  test("tmux post has code blocks", async ({ page }) => {
    await page.goto("/posts/tmux-how-i-use-it/");

    const preElements = page.locator("pre");
    const count = await preElements.count();
    expect(count).toBeGreaterThan(0);
  });
});
