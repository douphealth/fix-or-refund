export const RULESET_VERSION = "6.0.0-review.1";
export const HISTORICAL_REVIEW_DATE = "2026-10-30";
export type CoverageStatus = "national-pending" | "eu-baseline" | "unsupported";
export function coverageFor(country: string, euCodes: readonly string[]): CoverageStatus {
  return country === "GR" ? "national-pending" : euCodes.includes(country) ? "eu-baseline" : "unsupported";
}
export type RuleRecord = {
  id: string; jurisdiction: "EU" | "GR"; conditions: string[]; exceptions: string[];
  sources: string[]; effectiveFrom: string | null; status: "baseline-information" | "review-pending";
  reviewer: null; approvalHistory: string[];
};
export const RULE_REGISTER: readonly RuleRecord[] = [
  { id: "seller-conformity", jurisdiction: "EU", conditions: ["business", "fault-or-uncertain", "within-two-year-baseline"], exceptions: ["private-sale", "buyer-damage", "national-periods", "used-terms"], sources: ["euSales", "euGuarantee"], effectiveFrom: "2022-01-01", status: "baseline-information", reviewer: null, approvalHistory: [] },
  { id: "refund-conditions", jurisdiction: "EU", conditions: ["seller-remedy-route", "refused-failed-delayed-or-serious"], exceptions: ["minor-defect", "evidence-required"], sources: ["euSales"], effectiveFrom: "2022-01-01", status: "baseline-information", reviewer: null, approvalHistory: [] },
  { id: "manufacturer-repair", jurisdiction: "EU", conditions: ["listed-category", "verify-model-part-regulation-support-period"], exceptions: ["category-alone-insufficient", "reasonable-fee-possible", "national-implementation-unverified"], sources: ["euRepairLaw", "euRepair"], effectiveFrom: "2026-07-31", status: "review-pending", reviewer: null, approvalHistory: [] },
  { id: "gr-repair-transition", jurisdiction: "GR", conditions: ["purchase-from-2026-07-31", "statutory-repair-selected"], exceptions: ["earlier-contract", "not-automatic-warranty-extension", "amended-commencement-needs-primary-review"], sources: ["grLaw", "grEffective", "grThreeYear", "grAmendment"], effectiveFrom: "2026-07-31", status: "review-pending", reviewer: null, approvalHistory: [] },
  { id: "gr-early-refund", jurisdiction: "GR", conditions: ["fault-within-30-days", "prompt-notice"], exceptions: ["minor-defect", "national-text-review-pending"], sources: ["grLaw", "grEffective"], effectiveFrom: null, status: "review-pending", reviewer: null, approvalHistory: [] },
  { id: "proof", jurisdiction: "EU", conditions: ["fault-in-first-year"], exceptions: ["rebuttable-presumption", "nature-of-goods-or-defect", "national-longer-period"], sources: ["euSales"], effectiveFrom: "2022-01-01", status: "baseline-information", reviewer: null, approvalHistory: [] },
];
export const SOURCE_CHECKS = { linkCheckedAt: null, qualifiedReviewAt: null, reviewer: null };
export function sourceCategory(kind: string): "primary" | "guidance" | "secondary" {
  return kind === "Legal reference" ? "secondary" : kind.includes("primary law") ? "primary" : "guidance";
}