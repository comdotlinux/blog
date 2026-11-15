import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("admin page is served with the pinned script and integrity", async ({
  request,
}) => {
  const res = await request.get("/admin/");
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).toContain("https://unpkg.com/@sveltia/cms@");
  expect(html).toMatch(/integrity="sha384-[A-Za-z0-9+/=]{64}"/);
});

test("config.yml is served unchanged", async ({ request }) => {
  const res = await request.get("/admin/config.yml");
  expect(res.status()).toBe(200);
  const local = readFileSync(
    join(import.meta.dirname, "../../public/admin/config.yml"),
    "utf8"
  );
  expect(await res.text()).toBe(local);
});
