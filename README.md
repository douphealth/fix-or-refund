# Fix or Refund? — The Consumer Desk

A free, local-first consumer desk with **EU-baseline information** and an explicit country coverage matrix. Greece's national provisions are **review-pending**, not certified; the other 26 countries are not separate national-law assessments.

> Informational guidance only — not legal advice. **30 October 2026** is the original release's historical review record, not a new qualified review. See `docs/LEGAL_REVIEW_QUEUE.md` and `docs/UPGRADE_VERIFICATION.md` for current boundaries.

## Features
- Two-step rights check: 15 product types, 27 EU countries, seller type, new/used, dates, cause, optional special-case questions
- Accessible timing references (delivery, 1 / 2 years, fault and today), explicitly not a warranty guarantee
- Remedy cards: seller repair, replacement, conditional refund, manufacturer repair
- Next step, contact, uncertainties and reasons; primary law, official guidance and secondary references are labelled separately
- Live letter studio in Greek or English: copy, email, TXT, print, full case-pack export
- Evidence checklist, complaint-route finder (domestic / cross-border / ADR)
- Privacy-first: answers never leave the browser; saving is opt-in and erasable
- Stable `/en` and `/el` checkers and bilingual coverage, methodology, privacy, ownership/corrections and guide pages
- Versioned rule governance, safe saved-case validation, regression tests and prepared source-availability workflows

## Tech
TanStack Start (React 19, Vite 7), Tailwind CSS v4. The decision engine (`src/lib/engine/rules.ts`) is pure, deterministic and covered by tests in `src/test/rules.test.ts`.

```bash
bun install
bun run dev
bunx vitest run
bun audit
python3 scripts/verify-consumer-desk.py # running app + Python Playwright required
```

## Project layout
- `src/lib/engine/` — rules engine, Greek/English copy, letter builder
- `src/components/desk/` — checker UI, results, letter studio, escalation
- `src/routes/` — checker and bilingual supporting pages
- `docs/` — legal sources, release notes, original v5 static release notes

## Launch dependencies
Qualified legal approval, confirmed owner/corrections contact, production domain and hosting access, GitHub workflow activation, real-device/screen-reader checks and deployed performance/monitoring/rollback evidence remain outstanding. No app publishing or GitHub account connection was performed by this upgrade.
