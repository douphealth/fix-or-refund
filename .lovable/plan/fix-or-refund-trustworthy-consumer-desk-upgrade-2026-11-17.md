# Fix or Refund? — Trustworthy Consumer Desk Upgrade

## Goal
Make the existing checker trustworthy, understandable and easy to complete on a phone before expanding its content. Preserve Greek/English, no accounts, local-only case processing and the existing not-legal-advice boundaries. This is an implementation plan, not a legal certification or approval to launch.

## Starting point and evidence limits
- The current app already has a separate deterministic rules engine, two-step checker, cautious remedy states, evidence checklist, editable letter, exports, opt-in saving and complaint guidance. Improve these rather than replace them.
- The registry contains **16 references**, while the homepage displays **10** and labels the headline count “official sources.” Some references are secondary legal commentary. Counts and classifications need to match what is actually published.
- The homepage claims “0 data sent anywhere”; the root page loads Google Fonts and includes error reporting. The audit must distinguish local case processing from ordinary hosting requests, external assets, preview telemetry and email handoff.
- The current engine test file contains **5 tests**. The original static-release documentation reports 53; those are not evidence of equivalent coverage in this app.
- The recorded legal-review date is 30 October 2026, but no qualified reviewer is identified. The uploaded audit's possible amendment to Article 143 is a **review lead**, not a verified legal change.
- Source inspection grounds this plan; fresh visual, performance, network, accessibility and end-to-end checks remain to be performed.

## Phase 1 — Legal reliability and honest coverage
**First deliverable: transparent coverage, sources and review status.**

1. Create a country coverage matrix with national rules verified, EU baseline only and unsupported states. Greece starts as “national provisions included; current review pending,” not “verified.” Other EU countries remain EU-baseline guidance until a documented national review is approved. Out-of-scope input receives a safe explanation and useful referral.
2. Display coverage beside country selection, in results and in letters/case packs. A dropdown must not imply 27 equivalent national assessments. A selected country alone must not settle governing law for a cross-border contract.
3. Classify references as primary legislation, official guidance/assistance and secondary commentary. Generate counts from the published registry; show all referenced entries on the sources page, without calling secondary material official.
4. Create a versioned rule register covering jurisdiction, effective/transition dates, triggering conditions, exceptions, article references, review scope/status, reviewer and approval history. Separate “link checked,” “editorially reviewed” and “qualified legal review.”
5. Verify original and amended Greek texts, including the reported Law 5326/2026 amendment to Article 143, against primary sources. Review the purchase cutoff, statutory repair/limitation provisions, notification/refund conditions and product-specific manufacturer obligations. Do not change conclusions merely because a search result or secondary site says so.
6. Until a disputed provision is resolved, downgrade only affected conclusions to review/referral; preserve sourced, bounded baseline information. Never replace uncertainty with an automatic denial.
7. Publish a methodology and corrections policy. Reviewer qualifications, owner identity and a working corrections contact must be supplied and confirmed, not invented. Keep the existing review date labelled as a historical record until a new review actually occurs.

**Acceptance:** every output points to a coverage state and rule/source record; unverified national rules cannot produce national-specific conclusions; all source counts are generated; unresolved legal dependencies are visible.

## Phase 2 — Results as the main experience
**Deliverable: an actionable, auditable result and matching letter.**

Arrange each result in this order:
1. One likely next step, expressed cautiously.
2. Who to contact: seller, manufacturer or assistance body.
3. Why: the specific answers and rule conditions that triggered it.
4. Uncertainties: evidence gaps, causation, exclusions, governing law and unverified provisions.
5. Evidence checklist.
6. Editable letter with preview before copying, printing or opening email.
7. Article-level basis, jurisdiction, version and actual review status.
8. Relevant escalation route with prerequisites and separately labelled deadlines.

- Keep repair, replacement, conditional refund and paid/conditional manufacturer repair distinct. Manufacturer support must be product/model/part/date-dependent, not an Annex-category guarantee.
- Explain the timeline as timing guidance, not a universal three-year warranty. Provide a text equivalent and prevent colliding date markers on small screens.
- Ensure a letter never asserts a stronger entitlement than the result supports, including when users choose another request type. Requests may remain editable but must retain factual and legal caveats.
- When answers change, invalidate stale results and regenerate the matching letter; back navigation preserves entered answers. Checklist ticks are user assertions, not verified evidence.

**Acceptance:** all supported and uncertain outcomes provide an appropriate next step; edits update result and letter together; letters and exported case packs preserve coverage and uncertainty.

## Phase 3 — Mobile, accessibility and visual subtraction
**Deliverable: a shorter path to the checker in both languages.**

- Replace the repeated ribbon, large promotional cover and headline statistics with a compact introduction, one main action and a trust row linking coverage, methodology and privacy. Put the checker in the first-screen flow; retain product shortcuts only where useful.
- Preserve the established forest-green, warm-paper and orange identity and existing font family roles. Reduce decorative movement and illustration prominence rather than introduce another visual system.
- Use full-width/unframed sections, clear rules, consistent spacing and restrained individual cards. Results and letter get priority over sharing or promotional content.
- Improve progress, field-level validation, announced errors, focus on step changes, keyboard selection and touch targets. Preserve answers on back navigation and give clear save/erase feedback.
- Complete Greek and English coverage for errors, explanations, letters, print/export labels, accessibility text and not-found/error states. Respect reduced motion.

**Acceptance:** complete and revise a case at 320, 390, 768, 1440 and the current wide desktop size without overflow or overlapping controls; test keyboard-only completion and zoom; supplement automated accessibility checks with screen-reader and real-device checks where available.

## Phase 4 — Privacy, testing and operational resilience
**Deliverable: evidence supporting privacy and release claims.**

### Privacy and security
- Trace case values through URLs, error reporting, storage, downloads, sharing and all outgoing requests using distinctive test values. Never send case answers or letters to a server.
- Audit Google Fonts, hosting metadata, preview-only telemetry and production scripts separately. Prefer self-hosted font assets if external font requests are unnecessary. Do not remove platform infrastructure blindly.
- Replace broad slogans with verified local-processing wording and a privacy notice explaining normal hosting requests, explicit browser saving, retention/erase, generic sharing and the user's email-app handoff.
- Validate saved-data structure, dates and enums before restoration; recover safely from corrupt, old or blocked storage. No automatic write without an explicit save.
- Verify escaping, email handoff construction, external link handling and deployment-specific security/cache headers. Do not reuse static Pages header assumptions for the current app without testing.

### Automated and manual tests
- Expand engine regression tests for each legal branch and exception: private sellers, accidental damage/wear, uncertain cause, used-goods terms, refund triggers/minor defects, manufacturer eligibility and national coverage.
- Add concrete boundary tests for effective dates, day 30/31, year anniversaries, leap days, expired timing and invalid/future/inconsistent dates. Approved law determines expected outcomes; tests do not establish legal correctness by themselves.
- Add end-to-end tests in Greek and English for complete → edit → recompute → letter → export, opt-in save/reload/restore, erase/clear and safe failure states. Exercise realistic populated cases, not only empty pages.
- Inspect downloaded letter and case-pack contents; test print rendering and generic share contents. Verify email URI handoff without sending mail; actual email-app delivery is a separate manual check.
- Measure initial load, bundle size and mobile performance before and after; report measured results, not “100×” or unsupported scores.

### Operations
- Configure dependency/security checks, deployment preview checks and release evidence in repository workflows once the GitHub repository connection is confirmed.
- Keep a legal-change queue with source availability checks and human approval before modifying conclusions. Link availability is not legal verification; distinguish amended, redirected and inaccessible sources.
- Set up uptime monitoring for public pages only, without case payloads. Record and test rollback on the actual hosting platform; retain a previous known-good deployment.

**Acceptance:** deterministic regression and populated-case checks pass; network inspection finds no case values in requests; failures are safe; security, monitoring and rollback checks have documented evidence or explicit outstanding blockers.

## Phase 5 — Useful bilingual content and discoverability
**Deliverable: substantive supporting pages, not a country/product directory.**

- Provide stable `/en/` and `/el/` checker URLs and language-matched pages for coverage, sources/methodology, privacy, ownership/contact and corrections.
- Add reviewed guides for seller liability, commercial warranties, second-hand purchases and escalation. Publish only meaningful verified guidance; do not generate thin product-country combinations.
- Give every content page unique titles, descriptions and social metadata; add reciprocal language links, sitemap and canonical URLs only against the confirmed production domain.
- Separate preview indexing controls from production indexing. Configure absolute social images only when there is a real hosted image URL.
- Preserve existing language-query links with an appropriate redirect strategy, and keep case answers out of navigation URLs.

**Acceptance:** both language experiences are crawlable and complete; supporting pages clearly disclose limits; no invented domain, reviewer, ownership or contact details appear.

## Technical approach
- Keep TanStack Start routing and the existing pure engine under `src/lib/engine/`; all Greek/English legal copy remains accessed through `t(key)`.
- Introduce typed coverage/source/rule metadata beside the engine, with pure validation and decision helpers. Replace ported `@ts-nocheck`/unchecked result assumptions incrementally as tests cover them.
- Split the large checker into focused form, result, letter and escalation pieces without changing legal logic during presentation work. Use existing design-system controls and semantic tokens.
- Keep case processing and opt-in persistence browser-only. No database, account system, chatbot or case-data API is needed.
- Use Vitest for rule regression and Playwright for populated user flows, accessibility/network evidence and viewport checks. Read the hosting/runtime rules before implementation involving server rendering, redirects or monitoring endpoints.
- Keep the current application target; the original static Cloudflare Pages ZIP is not automatically a deployable output of this framework. A new static ZIP/export would be a separate agreed delivery.

## Release gates and dependencies
Implement in phase order; review Phase 1 before relying on affected legal outcomes. Cosmetic polish cannot override a legal or privacy failure.

Public launch requires:
- Approved sources and passing tests for every supported conclusion.
- Explicitly bounded national coverage and disputed cases.
- Privacy wording matched to observed production behavior.
- Successful mobile/keyboard journey through the letter and exports.
- Confirmed owner, corrections contact and named reviewer/review scope; qualified legal approval where claiming qualified review.
- Tested production monitoring and rollback.

**Information/services still needed:** owner and corrections contact, reviewer identity/qualifications and approved legal review, confirmed production domain, GitHub account/repository connection and actual hosting/monitoring access. These block their specific deliverables or launch, not the initial local improvements. Do not fabricate them or claim that uploading this audit verifies its findings.

## Out of scope
No new accounts, database, AI legal advice, large directory, automatic legal updates, manufactured reviewer credentials or unmeasured performance claims. This plan does not publish the app, create a GitHub repository in the user's account or certify the law.