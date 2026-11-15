import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDocument } from "yaml";

export const cmsRoot = join(import.meta.dirname, "../..");
export const repoRoot = join(cmsRoot, "..");

// Same options as the blog's parser (@astrojs/internal-helpers/yaml), so dates parse the same way.
export function parseYaml(source: string): unknown {
  const doc = parseDocument(source, {
    customTags: ["timestamp"],
    merge: true,
    schema: "core",
  });
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJS();
}

export function frontmatter(markdown: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  if (!match) throw new Error("no frontmatter");
  return parseYaml(match[1]) as Record<string, unknown>;
}

// Vitest cannot import astro:content, so the posts schema keys are read as text.
export function blogPostKeys(): Set<string> {
  const source = readFileSync(join(repoRoot, "src/content.config.ts"), "utf8");
  const start = source.indexOf("const posts = defineCollection(");
  const objectStart = source.indexOf("z.object({", start);
  const objectEnd = source.indexOf("\n    }),", objectStart);
  if (start < 0 || objectStart < 0 || objectEnd < 0) {
    throw new Error("posts schema not found in src/content.config.ts");
  }
  const keys = source
    .slice(objectStart, objectEnd)
    .split("\n")
    .map(line => /^\s+(\w+):/.exec(line)?.[1])
    .filter((key): key is string => Boolean(key));
  return new Set(keys);
}

export interface Field {
  name: string;
  widget: string;
  required?: boolean;
  default?: unknown;
  time_format?: string | false;
  date_format?: string;
  modes?: string[];
}

export interface CmsConfig {
  backend: { name: string; repo: string; branch: string };
  publish_mode?: string;
  output?: { omit_empty_optional_fields?: boolean };
  collections: {
    name: string;
    folder: string;
    extension: string;
    format: string;
    fields: Field[];
  }[];
}

export function cmsConfig(): CmsConfig {
  return parseYaml(
    readFileSync(join(cmsRoot, "public/admin/config.yml"), "utf8")
  ) as CmsConfig;
}
