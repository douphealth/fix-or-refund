import { HISTORICAL_REVIEW_DATE } from "./engine/governance";
import { get } from "./engine/i18n";
import { EU_COUNTRIES } from "./engine/rules";

/** Production origin. Override at build time with VITE_SITE_URL or SITE_URL. */
export const DEFAULT_SITE_URL = "https://fixorrefund.shop";

/**
 * Desk copy and this indexation pass are dated 17 November 2026
 * (see docs/UPGRADE_VERIFICATION.md). Per-page timestamps are not recorded.
 */
export const CONTENT_LASTMOD = "2026-11-17";

export const TRUST_PAGE_IDS = ["coverage", "methodology", "privacy", "ownership", "guides"] as const;
export type TrustPageId = (typeof TRUST_PAGE_IDS)[number];
export type PageId = "checker" | TrustPageId;
export type Lang = "en" | "el";

export const GUIDE_SECTIONS = [
  { id: "seller", titleKey: "guideSellerTitle", bodyKey: "guideSellerBody" },
  { id: "warranty", titleKey: "guideWarrantyTitle", bodyKey: "guideWarrantyBody" },
  { id: "used", titleKey: "guideUsedTitle", bodyKey: "guideUsedBody" },
  { id: "escalation", titleKey: "guideEscalationTitle", bodyKey: "guideEscalationBody" },
] as const;

const OG_PATH = "/og.png";
const BRAND = "Fix or Refund?";

function text(lang: Lang, key: string): string {
  const value = get(lang, key) as unknown;
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

export function resolveSiteUrl(value?: string): string {
  const env = import.meta.env;
  const configured = value?.trim() || env?.VITE_SITE_URL?.trim() || env?.SITE_URL?.trim();
  const candidate = (configured || DEFAULT_SITE_URL).replace(/\/+$/, "");
  if (!/^https?:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(candidate)) return DEFAULT_SITE_URL;
  return candidate;
}

export const SITE_URL = resolveSiteUrl();

export function isLang(value: string): value is Lang {
  return value === "en" || value === "el";
}

export function isTrustPage(value: string): value is TrustPageId {
  return (TRUST_PAGE_IDS as readonly string[]).includes(value);
}

export function pagePath(lang: Lang, page: PageId): string {
  return page === "checker" ? `/${lang}` : `/${lang}/${page}`;
}

export function absoluteUrl(path: string, site: string = SITE_URL): string {
  const base = site.replace(/\/+$/, "");
  if (path === "/" || path === "") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function indexableEntries(): Array<{ path: string; lang: Lang; page: PageId }> {
  const pages: PageId[] = ["checker", ...TRUST_PAGE_IDS];
  const localized = (["en", "el"] as const).flatMap((lang) =>
    pages.map((page) => ({ path: pagePath(lang, page), lang, page })),
  );
  return [{ path: "/", lang: "en", page: "checker" }, ...localized];
}

function brandSuffix(lang: Lang): string {
  return lang === "el" ? "Οδηγός καταναλωτή" : "Consumer Desk";
}

export function pageTitle(lang: Lang, page: PageId): string {
  if (page === "checker") {
    const titled = `${text(lang, "deskTitle")} — ${brandSuffix(lang)}`;
    return titled.length <= 60 ? titled : text(lang, "deskTitle");
  }
  const base = text(lang, `${page}Title`);
  const titled = `${base} — ${BRAND}`;
  if (titled.length <= 60) return titled;
  return base.length <= 60 ? base : base.slice(0, 60).trim();
}

/** Meta descriptions stay within 160 characters and only use existing sentences. */
export function clampDescription(value: string, max = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  const sentences = normalized.split(/(?<=[.!?])\s+/);
  let built = "";
  for (const sentence of sentences) {
    const next = built ? `${built} ${sentence}` : sentence;
    if (next.length > max) break;
    built = next;
  }
  if (built.length >= 40) return built;
  const cut = normalized.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > 40 ? cut.slice(0, space) : cut).replace(/[.,;:\s]+$/, "");
}

export function pageIntro(lang: Lang, page: PageId): string {
  return text(lang, page === "checker" ? "deskIntro" : `${page}Intro`);
}

export function pageDescription(lang: Lang, page: PageId): string {
  return clampDescription(pageIntro(lang, page));
}

function languageAlternates(page: PageId): { en: string; el: string; xDefault: string } {
  if (page === "checker") return { en: "/en", el: "/el", xDefault: "/" };
  return { en: `/en/${page}`, el: `/el/${page}`, xDefault: `/en/${page}` };
}

function organization(site: string) {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl("/", site)}#organization`,
    name: BRAND,
    url: absoluteUrl("/", site),
    logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg", site) },
  };
}

function website(lang: Lang, site: string) {
  return {
    "@type": "WebSite",
    "@id": `${absoluteUrl("/", site)}#website`,
    name: BRAND,
    url: absoluteUrl("/", site),
    description: text(lang, "deskIntro"),
    inLanguage: ["en", "el"],
    publisher: { "@id": `${absoluteUrl("/", site)}#organization` },
  };
}

export function jsonLd(lang: Lang, page: PageId, path: string, site: string = SITE_URL) {
  const canonical = absoluteUrl(path, site);
  const title = page === "checker" ? text(lang, "deskTitle") : text(lang, `${page}Title`);
  const description = pageIntro(lang, page);
  if (page === "checker") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        organization(site),
        website(lang, site),
        {
          "@type": "WebApplication",
          name: BRAND,
          url: canonical,
          description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          inLanguage: lang,
          publisher: { "@id": `${absoluteUrl("/", site)}#organization` },
        },
      ],
    };
  }

  const crumbHome = absoluteUrl(pagePath(lang, "checker"), site);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: text(lang, "deskTitle"), item: crumbHome },
      { "@type": "ListItem", position: 2, name: title, item: canonical },
    ],
  };

  if (page === "coverage") {
    const countries = EU_COUNTRIES as unknown as ReadonlyArray<readonly [string, string, string]>;
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb,
        {
          "@type": "ItemList",
          name: title,
          description,
          itemListElement: countries.map((row, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: lang === "el" ? row[2] : row[1],
            description: text(lang, row[0] === "GR" ? "coverageNational" : "coverageBaseline"),
          })),
        },
      ],
    };
  }

  if (page === "guides") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb,
        {
          "@type": "ItemList",
          name: title,
          description,
          itemListElement: GUIDE_SECTIONS.map((section, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: text(lang, section.titleKey),
            description: text(lang, section.bodyKey),
            url: `${canonical}#${section.id}`,
          })),
        },
      ],
    };
  }

  if (page === "methodology") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        breadcrumb,
        {
          "@type": "Article",
          headline: title,
          description,
          articleBody: `${description}\n\n${text(lang, "methodologyBody")}`,
          inLanguage: lang,
          mainEntityOfPage: canonical,
          publisher: { "@type": "Organization", name: BRAND, url: absoluteUrl("/", site) },
        },
      ],
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb,
      {
        "@type": "WebPage",
        name: title,
        description,
        url: canonical,
        inLanguage: lang,
        isPartOf: { "@type": "WebSite", name: BRAND, url: absoluteUrl("/", site) },
      },
    ],
  };
}

export function pageHead(lang: Lang, page: PageId, path?: string) {
  const resolved = path ?? pagePath(lang, page);
  const canonical = absoluteUrl(resolved);
  const title = pageTitle(lang, page);
  const description = pageDescription(lang, page);
  const image = absoluteUrl(OG_PATH);
  const alternates = languageAlternates(page);
  const ogType = page === "methodology" || page === "guides" ? "article" : "website";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: BRAND },
      { property: "og:locale", content: lang === "el" ? "el_GR" : "en_GB" },
      { property: "og:locale:alternate", content: lang === "el" ? "en_GB" : "el_GR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: BRAND },
      { "script:ld+json": jsonLd(lang, page, resolved) },
    ],
    links: [
      { rel: "canonical", href: canonical },
      { rel: "alternate", hrefLang: "en", href: absoluteUrl(alternates.en) },
      { rel: "alternate", hrefLang: "el", href: absoluteUrl(alternates.el) },
      { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(alternates.xDefault) },
    ],
  };
}

export function notFoundHead(lang: Lang = "en") {
  return {
    meta: [
      { title: text(lang, "missingTitle") },
      { name: "description", content: text(lang, "missingBody") },
      { name: "robots", content: "noindex" },
    ],
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderSitemap(site: string = SITE_URL): string {
  const urls = indexableEntries()
    .map(
      (entry) =>
        `  <url><loc>${escapeXml(absoluteUrl(entry.path, site))}</loc><lastmod>${CONTENT_LASTMOD}</lastmod></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const ROBOTS_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "Googlebot",
  "Twitterbot",
  "facebookexternalhit",
] as const;

export function renderRobots(site: string = SITE_URL): string {
  const groups = ROBOTS_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /\n`).join("\n");
  return `${groups}\nUser-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml", site)}\n`;
}

export function renderLlms(site: string = SITE_URL): string {
  const pages = indexableEntries()
    .map((entry) => {
      const label = pageTitle(entry.lang, entry.page);
      return `- [${label}](${absoluteUrl(entry.path, site)}): ${pageIntro(entry.lang, entry.page)}`;
    })
    .join("\n");
  return [
    `# ${BRAND}`,
    "",
    `> ${text("en", "deskIntro")}`,
    "",
    text("en", "ownershipIntro"),
    "",
    text("en", "coveragePending"),
    "",
    text("en", "privacyIntro"),
    "",
    `${text("en", "sourceStatus")}: ${HISTORICAL_REVIEW_DATE}. ${text("en", "reviewPending")}`,
    "",
    "## Pages",
    "",
    pages,
    "",
  ].join("\n");
}

function textFile(body: string, contentType: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600",
    },
  });
}

export function sitemapResponse(site: string = SITE_URL): Response {
  return textFile(renderSitemap(site), "application/xml; charset=utf-8");
}

export function robotsResponse(site: string = SITE_URL): Response {
  return textFile(renderRobots(site), "text/plain; charset=utf-8");
}

export function llmsResponse(site: string = SITE_URL): Response {
  return textFile(renderLlms(site), "text/plain; charset=utf-8");
}

/** Query strings, missing pages, and server errors are not indexable content. */
export function utilityNoindex(url: URL, status: number): boolean {
  return url.search.length > 0 || status === 404 || status >= 500;
}
