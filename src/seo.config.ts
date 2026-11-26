// Site-wide SEO settings used by src/lib/seo-edge.ts, /sitemap.xml and /llms.txt.
export type SeoPage = { path: string; title: string; section?: string; desc?: string; lastmod?: string };
import { TRUST_PAGES } from "@/components/desk/TrustPage";

export const SEO = {
  origin: "https://fixorrefund.shop",
  pagesDevHost: "fix-or-refund.pages.dev",
  name: "Fix or Refund?",
  description: "Broken product? A private consumer desk that checks your likely next step (repair, replacement or refund) with source-linked guidance on seller remedies. Not legal advice.",
  lang: "en",
  logo: "/favicon.svg" as string | undefined,
  sameAs: [] as string[],
  sectionNames: {} as Record<string, string>,
  keepTrailingSlash: false,
  // Google AdSense publisher ID ("ca-pub-…"). Empty = no ad code and no /ads.txt.
  adsenseClient: "",
};

export const LLMS_NOTES: string[] = [
  "Guidance is general consumer information, not legal advice; it explains possible remedies and links to official sources."
];

export function seoPages(): SeoPage[] {
  return [
    // The designed homepage: it canonicalises to itself, so it belongs in the sitemap too.
    { path: "/", title: "Fix or Refund? — EU consumer rights checker", section: "Consumer desk" },
    { path: "/en", title: "Fix or Refund? — Consumer Desk (English)", section: "Consumer desk" },
    { path: "/el", title: "Fix or Refund? — Οδηγός καταναλωτή (Ελληνικά)", section: "Consumer desk" },
    ...TRUST_PAGES.map((p) => ({ path: `/en/${p}`, title: `${p[0]!.toUpperCase()}${p.slice(1)}`, section: "English pages" })),
    ...TRUST_PAGES.map((p) => ({ path: `/el/${p}`, title: `${p[0]!.toUpperCase()}${p.slice(1)} (Ελληνικά)`, section: "Greek pages" })),
  ];
}
