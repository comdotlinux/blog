import slugifyLib from "slugify";
import kebabCase from "lodash.kebabcase";
import type { BlogFrontmatter } from "@content/_schemas";

export const slugifyStr = (str: string): string => {
  return slugifyLib(kebabCase(str), { lower: true, strict: true });
};

const slugify = (post: BlogFrontmatter): string => {
  return post.postSlug ? slugifyStr(post.postSlug) : slugifyStr(post.title);
};

export const slugifyAll = (arr: string[]): string[] => {
  return arr.map(str => slugifyStr(str));
};

export default slugify;
