# Upgrade verification — 17 November 2026

## Observed in the local running app
- English populated case: purchase/problem/result, name and fault entry, explicit local save, reload/restore, edit/recompute, case-pack download and saved-copy erase.
- Greek populated case: purchase/problem/result and clear, with translated next-step guidance.
- Downloaded case pack contained entered example details and the current rule version; it was created locally.
- No distinctive example case values appeared in observed request URLs or request bodies during these flows. This is local evidence, not a production telemetry audit.
- No Google Fonts requests remained: font packages are served with the app.
- Checker widths 320, 390, 768, 1440 and 2602 had no document-width overflow. Screenshot inspection confirmed readable mobile purchase fields and the result next-step heading.
- All ten bilingual supporting pages returned content; the checker has stable English/Greek URLs.
- No browser page errors were observed in the tested flow.
- Clipboard copy and letter TXT download preserved the entered example details. Print-mode text contained the draft. A stubbed native-share handoff contained only a generic public URL/language; no physical share or printer was used.
- Keyboard arrow selection changed seller type correctly; legacy `?lang=el` navigated to `/el`. Populated results also had no width overflow at all five tested widths.
- Current automated suite: **46 tests passed**. Compatible security upgrades plus patched test/validation packages and a patched glob override produced **no reported dependency vulnerabilities** in `bun audit` (544 packages checked).
- Source availability check: **17 references** checked; **11 returned 200, 2 returned 202, 4 returned 403**. Blocked references were the Greek government guarantee, Parliament law, government amendment PDF and gov.gr complaint. No content/legality approval was inferred from HTTP responses.
- Automated rule, coverage, date, storage and safe-remedy tests run with Vitest. Historical static-release counts are not reused as current verification.

## Boundaries and required follow-up
- This is not qualified legal review. National-specific Greek extension and special early-refund triggers are held pending review; source metadata is not certification.
- Direct access to the government amendment PDF returned 403; secondary text was not used to approve a change.
- Owner, corrections contact and qualified reviewer credentials must be provided before launch.
- No production domain exists. Production sitemap/canonical tags, preview indexing controls, uptime monitoring, security/cache headers and actual hosting rollback are deferred until deployment details/access exist.
- No GitHub account/repository connection was verified; workflow files are prepared, not evidence of successful hosted runs.
- Native share, actual email delivery, print on a physical printer, mobile Safari, screen-reader behavior and production performance/telemetry remain unverified.
- No performance improvement ratio is claimed: no comparable pre-upgrade measurement exists. A local Vite dev response is not a production benchmark.
- Source availability workflows detect availability only and never approve law. Every affected rule needs documented reviewer approval.

## Repeatable checks
Run `bunx vitest run` and `bun audit`. With the app running at localhost:8080 and Python Playwright installed, run `python3 scripts/verify-consumer-desk.py`; its temporary evidence remains under `/tmp/browser/consumer-desk/`.

## Rollback runbook (not yet exercised)
Record the production provider, previous known-good deployment ID, current commit and smoke-test evidence. Use that provider's deployment rollback mechanism. Repeat bilingual checker/letter checks on HTTPS and verify headers and network behavior. Do not assume the old static Pages ZIP or `_headers` config deploys the current framework app.