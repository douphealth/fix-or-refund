import { describe, it, expect } from "vitest";
import { safeRemedy } from "@/lib/engine/letter";
import { evaluate as run } from "@/lib/engine/rules";
const evaluate = (input: Parameters<typeof run>[0], clock: Date): any => run(input, clock);
const clock=new Date("2026-11-17T12:00:00Z");
const form={country:"GR",product:"phone",sellerType:"business",condition:"new",shortenedUsed:"unsure",purchaseDate:"2026-08-01",deliveryDate:"2026-08-01",failureDate:"2026-10-01",issue:"accidental",sellerResponse:"none",serious:"unsure",promptNotice:"unsure",priorRepair:"no"};
describe("bounded letters and case packs",()=>{
  it("unconfirmed accidental refund becomes a review request",()=>expect(safeRemedy(evaluate(form,clock),"refund")).toBe("review"));
  it("unconfirmed free repair becomes a review request",()=>expect(safeRemedy(evaluate(form,clock),"repair")).toBe("review"));
  it("a conditional refund remains a conditional request",()=>expect(safeRemedy(evaluate({...form,issue:"fault",sellerResponse:"rejected"},clock),"refund")).toBe("refund"));
  it("private seller cannot receive an established statutory replacement request",()=>expect(safeRemedy(evaluate({...form,sellerType:"private",issue:"fault"},clock),"replacement")).toBe("review"));
});