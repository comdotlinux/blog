import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cmsRoot } from "./helpers";

const html = readFileSync(join(cmsRoot, "public/auth.html"), "utf8");
const script = /<script data-cfasync="false">([\s\S]*?)<\/script>/.exec(
  html
)?.[1];

describe("auth.html", () => {
  it("opts its script out of Rocket Loader", () => {
    expect(script).toBeDefined();
    expect(html.match(/<script/g)).toHaveLength(1);
  });

  it("posts only to its own origin", () => {
    const targets = [...(script ?? "").matchAll(/postMessage\(([\s\S]*?)\);/g)];
    expect(targets).toHaveLength(2);
    for (const [call] of targets)
      expect(call).toMatch(/,\s*location\.origin\s*\)/);
    expect(script).not.toContain('"*"');
    expect(script).not.toContain("'*'");
  });

  it("checks origin, source and data of the echo", () => {
    expect(script).toContain("event.origin !== location.origin");
    expect(script).toContain("event.source !== opener");
    expect(script).toContain('event.data !== "authorizing:github"');
  });

  it("sends Sveltia's exact handshake strings and only a placeholder token", () => {
    expect(script).toContain('opener.postMessage("authorizing:github"');
    expect(script).toContain(
      `'authorization:github:success:{"token":"cf-access","provider":"github"}'`
    );
    expect(html).not.toMatch(/gh[pousr]_/);
  });

  it("is not indexed", () => {
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });
});
