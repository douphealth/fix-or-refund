import { describe, expect, it } from "vitest";
import { coverageFor, RULE_REGISTER, sourceCategory } from "@/lib/engine/governance";
import { EU_COUNTRIES, evaluate as run, SOURCES, todayUTC } from "@/lib/engine/rules";
import { parseSavedCase } from "@/lib/engine/saved-case";
const evaluate = (input: Parameters<typeof run>[0], clock: Date): any => run(input, clock);
const clock = new Date("2026-11-17T08:00:00Z");
const base = {country:"GR",product:"phone",sellerType:"business",condition:"new",shortenedUsed:"unsure",purchaseDate:"2026-08-01",deliveryDate:"2026-08-02",failureDate:"2026-08-10",issue:"fault",sellerResponse:"none",serious:"unsure",promptNotice:"yes",priorRepair:"yes"};
describe("coverage and approved-rule boundaries",()=>{
  it("does not mark Greece as nationally verified",()=>expect(coverageFor("GR",EU_COUNTRIES.flatMap(c=>c[0] ? [c[0]] : []))).toBe("national-pending"));
  it("provides baseline status for all other 26 EU countries",()=>{
    const others=EU_COUNTRIES.filter(c=>c[0]!=="GR");expect(others).toHaveLength(26);
    for(const [code] of others) { if (!code) throw new Error("Missing country code"); expect(coverageFor(code,EU_COUNTRIES.flatMap(c=>c[0] ? [c[0]] : []))).toBe("eu-baseline"); }
  });
  it("does not invent a result for unsupported countries",()=>expect(evaluate({...base,country:"US"},clock)).toMatchObject({valid:false,errors:["country"]}));
  it("does not use the unapproved Greek repair extension",()=>expect(evaluate(base,clock).facts.repairExtensionPossible).toBe(false));
  it("does not elevate an early Greek fault into a refund",()=>expect(evaluate(base,clock).remedies.refund).toBe("unconfirmed"));
  it("includes a rule record for every result rule id",()=>{
    const result=evaluate(base,clock);expect(result.ruleIds.length).toBeGreaterThan(0);
    for(const id of result.ruleIds) expect(RULE_REGISTER.some(r=>r.id===id)).toBe(true);
  });
  it("does not make a manufacturer category a confirmed right",()=>expect(evaluate(base,clock).remedies.manufacturer).toBe("review"));
  it("classifies secondary commentary separately",()=>expect(sourceCategory(SOURCES.grEffective.kind)).toBe("secondary"));
  it("register references resolve to real registry entries",()=>{ for(const rule of RULE_REGISTER) for(const id of rule.sources) expect(Object.hasOwn(SOURCES,id)).toBe(true); });
  it("uses the UTC calendar date",()=>expect(todayUTC(new Date("2026-11-17T00:15:00Z")).toISOString()).toBe("2026-11-17T00:00:00.000Z"));
});
describe("saved case recovery",()=>{
  const saved={v:1,form:base,details:{merchantName:"",productName:"",orderRef:"",yourName:"",issueDetails:"",recipientEmail:""},remedy:"repair",residenceCountry:"GR",traderCountry:"GR",evidence:["receipt"]};
  it("accepts an explicitly saved complete case",()=>expect(parseSavedCase(JSON.stringify(saved)).success).toBe(true));
  it("rejects malformed storage",()=>expect(parseSavedCase("{broken").success).toBe(false));
  it("rejects a non-enumerated remedy",()=>expect(parseSavedCase(JSON.stringify({...saved,remedy:"guaranteed-refund"})).success).toBe(false));
  it("rejects overlong personal fields",()=>expect(parseSavedCase(JSON.stringify({...saved,details:{...saved.details,yourName:"x".repeat(101)}})).success).toBe(false));
  it("rejects incompatible saved versions",()=>expect(parseSavedCase(JSON.stringify({...saved,v:99})).success).toBe(false));
});