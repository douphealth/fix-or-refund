# Fix or Refund? — Studio 5 Release Notes

**Date:** 30 October 2026 · **Version:** 5.0.0  
**Build:** Static Cloudflare Pages Direct Upload ZIP

## Critical changes made

| Priority | Audited bottleneck | Implemented fix | Verification |
|---|---|---|---|
| P0 | Overclaiming eligibility or glossing over Greek effective-date cutoff | Kept a conservative rules engine; primary EU legal sources; 31 July 2026 cutoff plus *conditional* statutory repair/3-year limitation; clear non-automatic result states | 53 tests |
| P0 | Used-goods one-year clause could improperly shut out a claim | Downgrade to **review** pending governing national law, instead of automatically denying statutory remedies | Added edge-case tests |
| P0 | Early-refund and minor-defect ambiguity | Conditional refund only, minor-defect exclusion, clearer 30-day notification wording | Added edge-case tests |
| P0 | Complaint guides missing practical deadline/preparation | Greek Ombudsman **one-year** notification window and Taxisnet; ECC Greece receipt, prior written contact, authorization | Cross-checked official authority pages |
| P1 | Artificial dashboard appearance, template-like visual system | Editorial consumer desk identity, typography, restrained parchment/forest/coral palette, bespoke broken-phone illustration, stronger hero and explicit legal trust cues | Visual browser checks 320/390/768/1440; interactive Chromium checks at 390/1440; deployed HTTPS test outstanding |
| P1 | Landing page lacked fast, product-specific entry | Four genuine one-tap shortcuts prefill the working checker (phone/washer/laptop/other) | Code and ID checks |
| P1 | Results appeared definitive without evidence context | Visible snapshot differentiates jurisdiction, rough timing, possible proof requirements, and unverified evidence | Static/translation checks |
| P1 | Social sharing risked privacy | Generic branded share art and original native-sharing flow without case fields | Code inspection |
| P2 | Accumulated CSS cascade across five files | Consolidated into **one** stylesheet; fewer independent HTTP requests | Asset/reference integrity |
| P2 | Privacy language implied no server metadata | Explicit distinction between no case-data API and normal host-request logging | Copy review |

## Visual architecture

- Distinctive serif/extra-bold editorial wordmark, original designed artwork, fine-rule typography, controlled iconography, high-contrast call to action, redesigned selected states.
- Product-entry navigation and two-step app are integrated into a single coherent page.
- Reworked result/reasoning, checklist, source references, claim-letter editor and escalation selection.
- Responsive breakpoints, keyboard focus, mobile touch targets and reduced-motion preferences.

## What's intentionally not claimed

- The app does **not** claim automated access to an authoritative EU or Greek legal-data API.
- The app does **not** claim legal certainty or endorsement by a lawyer, regulator or government.
- The app does **not** claim live country-specific determination in all 27 EU Member States.
- The app does **not** claim a measured increase in traffic, conversion or social sharing.
- Visual and form-function checks passed in an in-memory Chromium environment, but an actual Cloudflare HTTPS deployment and mobile device still require validation.
- Social OG image URL is relative because no final domain was provided; set an absolute URL at launch.

## Post-deployment release gate

Review legal interpretation with a qualified Greek/EU consumer-law professional, execute manual smoke test in README, inspect responsive interaction on real devices, check official link validity and configure absolute OG image and canonical URL for the deployed domain. Preserve previous deployment for rollback.
