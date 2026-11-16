# Fix or Refund? — The Consumer Desk / Studio 5

**Release:** 5.0.0 · 30 October 2026  
**Platform:** Cloudflare Pages Direct Upload, entirely static.  
**Languages:** Greek and English (client-switchable).  
**Scope:** Greece-first consumer-rights guidance, conservative EU minimum for the other 26 EU Member States.

## Deploy in 4 steps

1. Open Cloudflare Dashboard → **Workers & Pages** → **Pages** → create a Direct Upload project (or deploy a new version to an existing Direct Upload project).
2. Upload the packaged `fix-or-refund-consumer-desk-v5-cloudflare-pages.zip` **as a ZIP**. `index.html` is at the ZIP root. Do not upload the enclosing project folder.
3. Visit the assigned HTTPS `.pages.dev` address and complete the manual smoke test below on a real phone and desktop browser.
4. Connect your final domain when ready. Replace the **relative** `og:image` meta URL (`./assets/og-card.png`) with a fully qualified `https://your-final-domain/...` image URL and add your actual canonical URL and `hreflang` strategy before promoting social previews and indexing. The domain is unknown at build time; we have deliberately not invented it.

**No build command. No environment variables. No API credentials. No database, account service, payment service, analytics tracker or worker required.**

## What's in the deployment ZIP

- `index.html`: SEO-readable landing page and real application form, accessible semantic HTML, FAQ and source links.
- `app.css`: consolidated responsive CSS, from five legacy style layers to **one stylesheet request**.
- `js/main.mjs`: multilingual interface, progressive assessment, live remedy view, evidence checklist, claim letters, complaint routes, local save (opt-in), private sharing and exports.
- `js/rules.mjs`: deterministic, conservative EU/Greek decision rules with source URLs and a fixed review date.
- `js/i18n.mjs`: Greek/English interface, explanation and claim templates.
- `assets/hero-v5.svg`: original editorial SVG artwork (not an external image hotlink).
- `assets/og-card.png`: static, privacy-safe social artwork (1200 × 630 px).
- `assets/favicon.svg`, `assets/broken-device.svg`: own static assets.
- `_headers`: response security and caching policy, including content security policy.
- `robots.txt`: public crawling allowed.
- `LEGAL_SOURCES.md` and `RELEASE_NOTES.md`: audit trail and scope limits.

## Real functions

- Two-stage 15-product / 27-EU-country rights assessment with dates, seller status, suspected cause, used-goods terms and optional special-case questions.
- Results explicitly separate **potential seller repair**, **replacement**, **conditional refund**, and **product-specific manufacturer repair**. Results are assessments, not binding rulings.
- Date-sensitive Greek 31 July 2026 rule, conditional three-year limitation when statutory repair was selected, and conditional first-year burden-of-proof reasoning.
- Explainable result summary and official/legal-source links.
- Greek / English ready-to-send request letter, email app handoff, clipboard, TXT export, print, and text case-pack export.
- Evidence collection checklist and Greece-domestic vs cross-border complaint guidance.
- Privacy-safe native sharing, generic branded image export (personal case answers excluded), and optional local browser storage/erase.

## Legal boundaries — do not remove

1. This is **not legal advice** or an official government service. A real determination depends on original documents, the contract, causation, dates, jurisdiction, and fact disputes. No external legal practitioner has certified the release.
2. New Greek Law 5317/2026 rules from 31 July 2026 **do not automatically give every buyer three years of warranty**. The special limitation provision concerns an eligible statutory repair choice, and the new rule does not apply to contracts made before the cutoff.
3. EU Directive 2024/1799 manufacturer repair obligations apply only where relevant Annex II category- and product-specific repairability rules apply and for the relevant period. Repair outside the statutory seller remedy may have a **reasonable charge**.
4. For **other EU countries**, the engine provides minimum EU information, **not** 26 separate national-law assessments. For second-hand goods and cross-border transactions the law and validity of alleged terms must be checked. The engine does **not** auto-deny used-goods rights based on an unverified one-year term.
5. A seller refund is **not guaranteed** merely because a defect happened. Minor/accidental/normal-wear situations do not receive automatic positive refund results. Check legal exceptions and evidence.
6. The Greek Consumer Ombudsman has its **own one-year complaint submission window** running from knowledge of the harmful action or omission. ECC Greece normally requires previous written contact, transaction proof, and signed authorization. This is **separate** from sale-remedy limitation periods.
7. Legal links and content were **reviewed as of 30 October 2026**. There is no live official-data feed or automated change detection. Re-review legislation and official processes before each public maintenance release.

## Privacy and limitations

The checker runs locally in the browser. It does not send user form answers, letters or case-pack data to an API. A case is written to browser localStorage only after an explicit save action; a separate erase action deletes it. Native share sends a **generic public URL** and the image exporter uses generic artwork, never case details. Choosing email makes the user's own email app handle the message.

The hosting provider (Cloudflare) may process ordinary HTTP request metadata such as IP addresses, regardless of the absence of in-app analytics. This app has no cookie banner because it does not use tracking cookies; verify your own deployment configuration for any Cloudflare analytics you may add externally.

## Validation performed on release source

- 30 existing law-engine regression tests: PASS.
- 23 additional source/edge-path tests: PASS.
- 18 static HTML/CSS/SVG/security/dependency checks: PASS.
- Chromium in-memory functional checks at **390px and 1440px**: PASS (27-country population; 15-product population; prefill; wizard transition; result generation; nonempty letter; domestic Greek escalation). No JS runtime exceptions.
- Chromium HTML/CSS-only visual checks at 320, 390, 768 and 1440px: PASS after fixing narrow-width overflow.
- JavaScript syntax: PASS for all three modules.
- ZIP CRC and file inventory: checked during packaging.

**Validation boundary:** Chromium did run the UI and interactions against an in-memory equivalent of the built HTML/CSS and bundled first-party modules. The environment blocked actual file/server navigation, so a **real Cloudflare HTTPS deployment** was not tested. Device-specific sharing, print, mobile Safari, assistive technology, Cloudflare response headers and mail-app behavior still require the manual launch checks below. Do not claim performance uplift, conversion uplift or viral results without measurement.

## Manual launch smoke test (required)

On a real mobile Chrome/Safari device and desktop Chrome/Firefox:

1. Load in Greek and English. Check layout at 320/390/768/1440px; ensure no lateral scrolling, readable buttons, working language switch.
2. Tap each product shortcut; verify the actual form preselects the correct product.
3. Enter a recent Greek consumer/business purchase, `fault`, within 2 years: potential seller repair/replacement, **not** automatic refund.
4. Select `accidental damage`: confirm the app does not claim free seller repair.
5. Select `private seller`: confirm the two-year trader warranty is not asserted.
6. Select Greek pre-cutoff purchase + previous repair: confirm **no** new three-year implication.
7. Complete a realistic case; verify Greek/English letter wording, clipboard, TXT export, case pack, print, and email handoff.
8. Choose residence GR / trader GR: Ombudsman deadline appears. Choose residence GR / different EU trader: ECC documentation appears.
9. Test local save, reload, restore, erase; confirm browser network requests don't include case answers.
10. Download share card; inspect Greek and English text and confirm **no personal details**. Test browser native share or URL copy.
11. Check source links open the actual official legal pages and are still current.
12. Verify Cloudflare response `_headers` are active and HTTPS deployment serves JS modules with correct MIME types.

## Rollback

In Cloudflare Pages, open the project → Deployments and roll back/promote the previous known-good deployment. Keep your previous Studio 4 ZIP until the Studio 5 manual checks pass. No external data migration or schema migration is needed.

## Editing

The page has no build tooling. HTML layout: `index.html`. Design: `app.css`. Rules: `js/rules.mjs` (re-run tests and legal verification when changing). UI: `js/main.mjs`. Localizations: `js/i18n.mjs`. The source images are SVG and PNG under `assets/`. Avoid adding external tracking or silently changing legal requirements.
