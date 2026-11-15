import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cmsRoot } from "./helpers";

const html = readFileSync(join(cmsRoot, "public/admin/index.html"), "utf8");

describe("admin/index.html", () => {
  it("loads an exact Sveltia version with subresource integrity", () => {
    expect(html).toMatch(
      /src="https:\/\/unpkg\.com\/@sveltia\/cms@\d+\.\d+\.\d+\/dist\/sveltia-cms\.js"/
    );
    expect(html).toMatch(/integrity="sha384-[A-Za-z0-9+/=]{64}"/);
    expect(html).toContain('crossorigin="anonymous"');
  });

  it("is not indexed", () => {
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });
});
