import { z } from "zod";
const answer = z.enum(["yes", "no", "unsure"]);
export const savedCaseSchema = z.object({
  v: z.literal(1), savedAt: z.string().optional(),
  form: z.object({ country: z.string().length(2), product: z.string().max(30), sellerType: z.enum(["business", "private"]), condition: z.enum(["new", "used"]), shortenedUsed: answer, purchaseDate: z.string().max(10), deliveryDate: z.string().max(10), failureDate: z.string().max(10), issue: z.enum(["fault", "accidental", "wear", "unsure"]), sellerResponse: z.enum(["none", "rejected", "attempted", "delayed"]), serious: answer, promptNotice: answer, priorRepair: answer }),
  details: z.object({ merchantName: z.string().max(100), productName: z.string().max(100), orderRef: z.string().max(100), yourName: z.string().max(100), issueDetails: z.string().max(1400), recipientEmail: z.string().max(160) }),
  remedy: z.enum(["repair", "replacement", "refund", "manufacturer", "review"]),
  residenceCountry: z.string().max(7), traderCountry: z.string().max(7), evidence: z.array(z.enum(["receipt", "photo", "dates", "contact"])).max(4),
});
export function parseSavedCase(raw: string) {
  try { return savedCaseSchema.safeParse(JSON.parse(raw)); }
  catch { return { success: false as const }; }
}