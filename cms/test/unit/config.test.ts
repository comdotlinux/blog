import { describe, expect, it } from "vitest";
import { blogPostKeys, cmsConfig, type Field } from "./helpers";

const config = cmsConfig();
const posts = config.collections.find(c => c.name === "posts");
const field = (name: string): Field | undefined =>
  posts?.fields.find(f => f.name === name);

describe("blog schema key list", () => {
  it("parses the posts schema keys from src/content.config.ts", () => {
    const keys = blogPostKeys();
    for (const key of ["title", "description", "pubDatetime"]) {
      expect(keys).toContain(key);
    }
  });
});

describe("config.yml", () => {
  it("targets this repo on main through the editorial workflow", () => {
    expect(config.backend).toEqual({
      name: "github",
      repo: "comdotlinux/blog",
      branch: "main",
      base_url: "https://cms.blog.kulkarni.cloud",
      auth_endpoint: "auth",
      api_root: "https://cms.blog.kulkarni.cloud/gh/api/v3",
      auth_methods: ["oauth"],
    });
    expect(config.publish_mode).toBe("editorial_workflow");
  });

  it("omits empty optional fields so modDatetime is never written as ''", () => {
    expect(config.output?.omit_empty_optional_fields).toBe(true);
  });

  it("writes posts as Markdown with frontmatter into src/content/posts", () => {
    expect(posts).toMatchObject({
      folder: "src/content/posts",
      extension: "md",
      format: "frontmatter",
    });
  });

  it("uses only keys the blog schema knows, plus the body", () => {
    const allowed = new Set([...blogPostKeys(), "body"]);
    for (const f of posts?.fields ?? []) expect(allowed).toContain(f.name);
  });

  it("leaves out the fields the plan excludes", () => {
    const names = posts?.fields.map(f => f.name);
    for (const name of [
      "ogImage",
      "canonicalURL",
      "hideEditPost",
      "hideToc",
      "timezone",
    ]) {
      expect(names).not.toContain(name);
    }
  });

  it("requires title, description and pubDatetime", () => {
    for (const name of ["title", "description", "pubDatetime"]) {
      expect(field(name), name).toBeDefined();
      expect(field(name)?.required, name).not.toBe(false);
    }
  });

  it("stores pubDatetime and modDatetime as date-only YYYY-MM-DD", () => {
    for (const name of ["pubDatetime", "modDatetime"]) {
      expect(field(name), name).toMatchObject({
        widget: "datetime",
        time_format: false,
        date_format: "YYYY-MM-DD",
      });
    }
    expect(field("modDatetime")?.required).toBe(false);
  });

  it("defaults draft to false", () => {
    expect(field("draft")).toMatchObject({ widget: "boolean", default: false });
  });

  it("edits the body as raw Markdown first", () => {
    expect(field("body")).toMatchObject({ widget: "markdown" });
    expect(field("body")?.modes?.[0]).toBe("raw");
  });
});
