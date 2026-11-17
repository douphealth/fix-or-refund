import { SOURCES } from "../src/lib/engine/rules";
const results = await Promise.all(Object.entries(SOURCES).map(async ([id, source]) => {
  try {
    const response = await fetch(source.url, { signal: AbortSignal.timeout(15000), redirect: "follow" });
    await response.body?.cancel();
    return { id, requested: source.url, final: response.url, status: response.status, redirected: response.redirected, checkedAt: new Date().toISOString(), legalApproval: false };
  } catch { return { id, requested: source.url, status: "unavailable", checkedAt: new Date().toISOString(), legalApproval: false }; }
}));
console.log(JSON.stringify({ warning: "Availability evidence only. Human legal review required; no rules changed.", results }, null, 2));
if(results.some(r=>typeof r.status !== "number" || r.status >= 400)) process.exitCode=1;