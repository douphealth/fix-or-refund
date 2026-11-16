import { get } from "./i18n";
import { LAW_REVIEW_DATE, SOURCES } from "./rules";

export type Remedy = "repair" | "replacement" | "refund" | "manufacturer" | "review";
export type Details = {
  merchantName: string;
  productName: string;
  orderRef: string;
  yourName: string;
  issueDetails: string;
  recipientEmail: string;
};
export const emptyDetails: Details = {
  merchantName: "",
  productName: "",
  orderRef: "",
  yourName: "",
  issueDetails: "",
  recipientEmail: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Assessment = any;

export function recommendedRemedy(a: Assessment | null): Remedy {
  if (!a) return "review";
  if (a.route === "manufacturer") return "manufacturer";
  if (a.route === "seller") return "repair";
  return "review";
}

const REQUEST_KEY: Record<Remedy, string> = {
  repair: "letterRequestSellerRepair",
  replacement: "letterRequestReplacement",
  refund: "letterRequestRefund",
  manufacturer: "letterRequestMfg",
  review: "letterRequestReview",
};

/** Builds the plain-text request letter. Pure: same input, same text. */
export function createLetter(
  lang: "el" | "en",
  a: Assessment,
  d: Details,
  choice: Remedy,
  fmt: (iso: string) => string,
  productLabel: string,
): string {
  const t = (k: string) => get(lang, k) as string;
  const f = a.facts;
  const product = d.productName.trim() || productLabel;
  const lines = [
    choice === "manufacturer" ? t("letterSubjectManufacturer") : t("letterSubjectSeller"),
    "",
    t("letterSalutation"),
    "",
    ...(d.merchantName.trim() ? [`${t("letterSentTo")} ${d.merchantName.trim()}`, ""] : []),
    [t("letterPurchase"), product, t("letterBought"), fmt(f.purchaseDate), t("letterReceived"), fmt(f.deliveryDate) + "."].join(" "),
    `${t("letterFailure")} ${fmt(f.failureDate)}.`,
    ...(d.orderRef.trim() ? [`${t("letterOrder")} ${d.orderRef.trim()}`] : []),
    "",
    t("letterProblem"),
    d.issueDetails.trim() || t("letterProblemDefault"),
    "",
    t(REQUEST_KEY[choice]),
    "",
    choice === "manufacturer" ? t("letterMfgLaw") : f.isGreece ? t("letterGreekLaw") : t("letterEULaw"),
    "",
    t("letterClosing"),
    "",
    t("letterRegards"),
    d.yourName.trim() || t("letterSignature"),
    "",
    t("letterNotLegal"),
  ];
  return lines.join("\n");
}

export function createCasePack(
  lang: "el" | "en",
  a: Assessment,
  letter: string,
  evidence: string[],
  header: string[],
): string {
  const t = (k: string) => get(lang, k) as string;
  const cap = a.status[0].toUpperCase() + a.status.slice(1);
  return [
    t("packHeadline"),
    ...header,
    "",
    t("packResult"),
    `${t("status" + cap)} — ${t("heading" + cap)}`,
    t("intro" + cap) + (a.facts.isGreece ? "" : " " + t("euQualifier")),
    "",
    t("packReasons"),
    ...a.reasons.map((k: string) => "- " + t("reason_" + k)),
    "",
    t("packEvidence"),
    ...evidence,
    "",
    t("packSources"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...a.sourceIds.map((id: string) => `${(SOURCES as any)[id][lang]}: ${(SOURCES as any)[id].url}`),
    "",
    t("packDraft"),
    letter,
    "",
    t("packDisclaimer"),
    t("packLocalOnly"),
    `Legal-source review: ${LAW_REVIEW_DATE}`,
  ].join("\n");
}

export function downloadText(text: string, name: string) {
  const blob = new Blob(["\ufeff", text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
