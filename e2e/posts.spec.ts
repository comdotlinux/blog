import { test, expect } from "@playwright/test";

test.describe("Posts Page", () => {
  test("listing shows perPage (3) posts", async ({ page }) => {
    await page.goto("/posts/");
    await expect(page.locator("#main-content ul > li")).toHaveCount(3);
  });

  test("listing paginates to /posts/2/", async ({ page }) => {
    await page.goto("/posts/2/");
    await expect(page.locator("#main-content ul > li")).toHaveCount(2);
  });

  test("can navigate to individual post", async ({ page }) => {
    await page.goto("/posts/");
    await page.locator("#main-content ul > li a h2").first().click();
    await expect(page).toHaveURL(/\/posts\/[a-z][a-z-]+\/$/);
  });

  test("post detail page has content", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    await expect(page.locator("h1")).toHaveText("Gradle Tricks");
    await expect(page.locator("#article")).toBeVisible();
  });

  test("post date is shown in Europe/Berlin", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const time = page.locator("#main-content time").first();
    await expect(time).toHaveAttribute("datetime", "2022-11-26T23:03:05.000Z");
    await expect(time).toHaveText("27 Nov, 2022");
  });

  test("post has its tags", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const hrefs = await page
      .locator('#main-content a[href^="/tags/"]')
      .evaluateAll(els => els.map(el => el.getAttribute("href")));
    expect(hrefs).toEqual([
      "/tags/automation/",
      "/tags/build/",
      "/tags/gradle/",
    ]);
  });

  test.describe("sidebar table of contents", () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test("lists the post headings", async ({ page }) => {
      await page.goto(
        "/posts/followup-latest-version-of-the-tools-using-asdf/"
      );
      const links = page.locator("[data-toc-nav] a[href^='#']");
      expect(await links.count()).toBeGreaterThanOrEqual(2);
      await expect(links.first()).toBeVisible();
    });

    test("article has no inline Table of contents heading", async ({
      page,
    }) => {
      await page.goto(
        "/posts/followup-latest-version-of-the-tools-using-asdf/"
      );
      await expect(
        page.locator("#article h2", { hasText: /table of contents/i })
      ).toHaveCount(0);
    });
  });

  test("whitespace around inline code survives HTML compression", async ({
    page,
  }) => {
    await page.goto("/posts/gradle-tricks/");
    const paragraph = page.locator("#article p", {
      has: page.locator("code", { hasText: /^--scan$/ }),
    });
    expect(await paragraph.textContent()).toContain("--scan for");
  });

  test("edit link points at the post source on GitHub", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    const editLinks = page.locator('a[href*="/blog/edit/"]');
    expect(await editLinks.count()).toBeGreaterThan(0);
    for (const href of await editLinks.evaluateAll(els =>
      els.map(el => el.getAttribute("href"))
    )) {
      expect(href).toBe(
        "https://github.com/comdotlinux/blog/edit/main/src/content/posts/gradle-tricks.md"
      );
    }
  });

  test("has 6 share links", async ({ page }) => {
    await page.goto("/posts/gradle-tricks/");
    await expect(page.locator('a[title^="Share this post"]')).toHaveCount(6);
  });
});
