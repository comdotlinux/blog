import { test, expect } from "@playwright/test";

const slugs = [
  "followup-latest-version-of-the-tools-using-asdf",
  "gradle-tricks",
  "on-the-topic-of-tools-their-versions-and-automated-installations",
  "some-interesting-features-in-github-actions",
  "tmux-how-i-use-it",
];

test.describe("OG Images", () => {
  for (const slug of slugs) {
    test(`${slug} has a reachable PNG og:image`, async ({ page, request }) => {
      await page.goto(`/posts/${slug}/`);
      const content = await page
        .locator('meta[property="og:image"]')
        .getAttribute("content");
      expect(content).toBe(`https://b.kulkarni.cloud/posts/${slug}/index.png`);

      const response = await request.get(new URL(content!).pathname);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
    });
  }

  test("homepage og:image is the site default", async ({ page }) => {
    await page.goto("/");
    const content = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(new URL(content!).pathname).toBe("/astropaper-og.jpg");
  });

  test("post has og:title, og:description and twitter:card", async ({
    page,
  }) => {
    await page.goto("/posts/gradle-tricks/");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Gradle Tricks/
    );
    await expect(
      page.locator('meta[property="og:description"]')
    ).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });

  test("old OG image path still serves a PNG", async ({ request }) => {
    const response = await request.get(
      "/On%20the%20topic%20of%20tools,%20their%20versions%20&%20automated%20installations.png"
    );
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
