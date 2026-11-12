import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";

const paths = readFileSync(
  new URL("./fixtures/urls.txt", import.meta.url),
  "utf8"
)
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean);

test.describe("URL preservation", () => {
  for (const path of paths) {
    test(`${path} returns 200`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(200);
    });
  }

  test("/posts/1/ meta-refreshes to /posts/", async ({ request }) => {
    const html = await (await request.get("/posts/1/")).text();
    expect(html).toMatch(
      /<meta http-equiv="refresh" content="0;url=\/posts\/">/
    );
  });

  test("unknown path returns 404", async ({ request }) => {
    const response = await request.get("/no-such-page/");
    expect(response.status()).toBe(404);
  });

  test("RSS item links equal the old ones", async ({ request }) => {
    const xml = await (await request.get("/rss.xml")).text();
    const links = [...xml.matchAll(/<item>.*?<link>([^<]+)<\/link>/gs)].map(
      m => m[1]
    );
    expect(links).toEqual([
      "https://blog.kulkarni.cloud/posts/some-interesting-features-in-github-actions/",
      "https://blog.kulkarni.cloud/posts/gradle-tricks/",
      "https://blog.kulkarni.cloud/posts/tmux-how-i-use-it/",
      "https://blog.kulkarni.cloud/posts/followup-latest-version-of-the-tools-using-asdf/",
      "https://blog.kulkarni.cloud/posts/on-the-topic-of-tools-their-versions-and-automated-installations/",
    ]);
  });

  test("old ampersand-less slug is not served", async ({ request }) => {
    const response = await request.get(
      "/posts/on-the-topic-of-tools-their-versions-automated-installations/"
    );
    expect(response.status()).toBe(404);
  });
});
