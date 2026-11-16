# Fix or Refund? — The Consumer Desk

A free, private web app that helps people in **Greece and all 27 EU countries** understand whether they may ask a seller or manufacturer for **repair, replacement or a refund** when a product breaks — with official legal sources and a ready-to-send request letter.

> Informational guidance only — not legal advice. Legal sources last reviewed **30 October 2026** (see `docs/LEGAL_SOURCES.md`).

## Features
- Two-step rights check: 15 product types, 27 EU countries, seller type, new/used, dates, cause, optional special-case questions
- Result with a visual **guarantee timeline** (delivery → 1 / 2 / 3 years, fault and today markers)
- Remedy cards: seller repair, replacement, conditional refund, manufacturer repair
- "Why you see this" reasons and linked official sources (EUR-Lex, gov.gr, Your Europe, ECC Greece, Ombudsman)
- Live letter studio in Greek or English: copy, email, TXT, print, full case-pack export
- Evidence checklist, complaint-route finder (domestic / cross-border / ADR)
- Privacy-first: answers never leave the browser; saving is opt-in and erasable

## Tech
TanStack Start (React 19, Vite 7), Tailwind CSS v4. The decision engine (`src/lib/engine/rules.ts`) is pure, deterministic and covered by tests in `src/test/rules.test.ts`.

```bash
bun install
bun run dev
bunx vitest run
```

## Project layout
- `src/lib/engine/` — rules engine, Greek/English copy, letter builder
- `src/components/desk/` — checker UI, results, letter studio, escalation
- `src/routes/index.tsx` — landing page
- `docs/` — legal sources, release notes, original v5 static release notes
