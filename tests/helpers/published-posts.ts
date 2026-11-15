import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseYaml } from "@astrojs/internal-helpers/yaml";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import config from "../../astro-paper.config";
import { slugifyStr } from "../../src/utils/slugify";

dayjs.extend(utc);
dayjs.extend(timezone);

const postsDir = join(import.meta.dirname, "../../src/content/posts");

interface PostData {
  draft?: boolean;
  pubDatetime: string | Date;
  timezone?: string;
  tags?: string[];
  ogImage?: unknown;
}

function readPosts(): PostData[] {
  return readdirSync(postsDir)
    .filter(name => /^[^_].*\.mdx?$/.test(name))
    .map(name => {
      const source = readFileSync(join(postsDir, name), "utf8");
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
      return parseYaml(match?.[1] ?? "") as PostData;
    });
}

export const published = readPosts().filter(post => {
  if (post.draft) return false;
  const tz = post.timezone || config.site.timezone || "UTC";
  const publishDay = dayjs(post.pubDatetime).tz(tz).startOf("day");
  return !publishDay.isAfter(dayjs().tz(tz).startOf("day"));
});

export const tags = [
  ...new Set(
    published.flatMap(post => (post.tags ?? ["others"]).map(slugifyStr))
  ),
];
