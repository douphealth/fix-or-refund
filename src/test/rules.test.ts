import { describe, expect, it } from "vitest";
import { evaluate as run, addYears, parseDate } from "@/lib/engine/rules";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const evaluate = (f: any, c: Date): any => run(f, c);

const clock = new Date("2026-10-30T12:00:00Z");
const base = {
  country: "GR", product: "phone", sellerType: "business", condition: "new", shortenedUsed: "unsure",
  purchaseDate: "2026-01-10", deliveryDate: "2026-01-12", issue: "fault", failureDate: "2026-09-01",
  sellerResponse: "none", serious: "unsure", promptNotice: "unsure", priorRepair: "no",
};

describe("rights engine", () => {
  it("rejects a fault date in the future", () => {
    const out = evaluate({ ...base, failureDate: "2027-01-01" }, clock);
    expect(out.valid).toBe(false);
    expect(out.errors).toContain("failureFuture");
  });
  it("rejects delivery before purchase", () => {
    expect(evaluate({ ...base, deliveryDate: "2026-01-01" }, clock).errors).toContain("deliveryBeforePurchase");
  });
  it("a genuine fault within year one from a business seller is a seller claim", () => {
    const out = evaluate(base, clock);
    expect(out.valid).toBe(true);
    expect(out.route).toBe("seller");
    expect(out.facts.in1AtFailure).toBe(true);
  });
  it("accidental damage never yields an automatic refund", () => {
    expect(evaluate({ ...base, issue: "accidental" }, clock).remedies.refund).toBe("unconfirmed");
  });
  it("caps Feb 29 anniversaries to Feb 28", () => {
    const date = parseDate("2024-02-29");
    if (!date) throw new Error("Expected valid leap date");
    expect(addYears(date, 1).toISOString().slice(0, 10)).toBe("2025-02-28");
  });
});
