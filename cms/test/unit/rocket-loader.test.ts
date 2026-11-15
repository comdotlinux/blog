import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";
import { cmsRoot } from "./helpers";

// Rocket Loader is on for the kulkarni.cloud zone; it rewrites script tags and Sveltia then never starts.
it("opts the Sveltia script out of Cloudflare Rocket Loader", () => {
  const html = readFileSync(join(cmsRoot, "public/admin/index.html"), "utf8");
  expect(html).toMatch(/<script[^>]*sveltia-cms\.js[^>]*data-cfasync="false"/s);
});
