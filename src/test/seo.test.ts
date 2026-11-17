import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { escapeHtml } from "@tanstack/router-core";
import {
  CONTENT_LASTMOD,
  DEFAULT_SITE_URL,
  SITE_URL,
  absoluteUrl,
  indexableEntries,
  jsonLd,
  pageDescription,
  pageHead,
  pageTitle,
  renderLlms,
  renderRobots,
  renderSitemap,
  resolveSiteUrl,
  utilityNoindex,
} from "@/lib/seo";

const FORBIDDEN_KEYS = new Set(["aggregateRating", "review", "reviewCount", "author", "offers", "price", "priceCurrency"]);

function walk(value: unknown, seen: Set<string>) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, seen));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    seen.add(key);
    walk(child, seen);
  }
}

describe("search metadata", () => {
  it("uses the production origin unless an env override is valid", () => {
    expect(SITE_URL).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("https://preview.example")).toBe("https://preview.example");
    expect(resolveSiteUrl("notaurl")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("https://fixorrefund.shop/extra")).toBe(DEFAULT_SITE_URL);
  });

  it("gives every indexable page a short unique title, description, canonical and parseable JSON-LD", () => {
    const titles = new Set<string>();
    for (const entry of indexableEntries()) {
      const head = pageHead(entry.lang, entry.page, entry.path);
      const title = pageTitle(entry.lang, entry.page);
      const description = pageDescription(entry.lang, entry.page);
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThan(0);
      expect(description.length).toBeLessThanOrEqual(160);
      expect(title.toLowerCase()).not.toContain("lovable");
      titles.add(`${entry.lang}:${entry.page}`);
      const canonical = head.links.find((link) => link.rel === "canonical")?.href;
      expect(canonical).toBe(absoluteUrl(entry.path));
      expect(head.meta.find((item) => "name" in item && item.name === "robots")).toMatchObject({
        content: "index, follow",
      });
      expect(head.meta.find((item) => "property" in item && item.property === "og:url")).toMatchObject({
        content: canonical,
      });
      const ld = head.meta.find((item) => item && "script:ld+json" in item);
      expect(ld && "script:ld+json" in ld).toBe(true);
      if (!ld || !("script:ld+json" in ld)) continue;
      const parsed = JSON.parse(escapeHtml(JSON.stringify(ld["script:ld+json"])).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"'));
      expect(parsed["@context"]).toBe("https://schema.org");
      const keys = new Set<string>();
      walk(parsed, keys);
      for (const key of FORBIDDEN_KEYS) expect(keys.has(key)).toBe(false);
      expect(JSON.stringify(parsed)).toBe(JSON.stringify(jsonLd(entry.lang, entry.page, entry.path)));
    }
    expect(titles.size).toBe(12);
  });

  it("publishes the same sitemap, robots and llms text as the static files", () => {
    const sitemap = renderSitemap();
    const robots = renderRobots();
    const llms = renderLlms();
    expect(readFileSync("public/sitemap.xml", "utf8")).toBe(sitemap);
    expect(readFileSync("public/robots.txt", "utf8")).toBe(robots);
    expect(readFileSync("public/llms.txt", "utf8")).toBe(llms);
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toHaveLength(indexableEntries().length);
    expect(new Set(locs).size).toBe(locs.length);
    expect(sitemap).toContain(`<lastmod>${CONTENT_LASTMOD}</lastmod>`);
    expect(sitemap).not.toContain("<html");
    for (const agent of ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "Bingbot"]) {
      expect(robots).toContain(`User-agent: ${agent}\nAllow: /`);
    }
    expect(robots).toContain(`Sitemap: ${DEFAULT_SITE_URL}/sitemap.xml`);
    expect(robots).not.toContain("Disallow:");
    for (const loc of locs) expect(llms).toContain(loc);
    const keys = readdirSync("public").filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
    expect(keys).toEqual(["5e32a25e36947c74d3391465b1c0229c.txt"]);
    expect(readFileSync(`public/${keys[0]}`, "utf8")).toBe("5e32a25e36947c74d3391465b1c0229c");
  });

  it("noindexes query strings and error statuses only", () => {
    expect(utilityNoindex(new URL("https://fixorrefund.shop/en"), 200)).toBe(false);
    expect(utilityNoindex(new URL("https://fixorrefund.shop/en?lang=el"), 200)).toBe(true);
    expect(utilityNoindex(new URL("https://fixorrefund.shop/missing"), 404)).toBe(true);
    expect(utilityNoindex(new URL("https://fixorrefund.shop/"), 500)).toBe(true);
  });
});
