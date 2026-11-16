import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Check, ClipboardCopy, Download, ExternalLink, FileText, Mail,
  Printer, RotateCcw, Save, Share2, ShieldCheck, Sparkles, Trash2, Wrench, Repeat, Euro, Factory,
} from "lucide-react";
import { PRODUCTS, SOURCES, evaluate, parseDate, daysBetween, addYears } from "@/lib/engine/rules";
import {
  createCasePack, createLetter, downloadText, emptyDetails, recommendedRemedy,
  type Details, type Remedy,
} from "@/lib/engine/letter";
import { countryName, fmtDate, orderedCountries, productName, useLang } from "./lang";

/* eslint-disable @typescript-eslint/no-explicit-any */
type FormKey = "country" | "product" | "sellerType" | "condition" | "shortenedUsed" | "purchaseDate" | "deliveryDate" | "issue" | "failureDate" | "sellerResponse" | "serious" | "promptNotice" | "priorRepair";
type Form = Record<FormKey, string>;
const SAVED_KEY = "fix-or-refund-saved-case-v1";
const todayISO = () => new Date().toISOString().slice(0, 10);
const initialForm = (): Form => ({
  country: "GR", product: "phone", sellerType: "business", condition: "new", shortenedUsed: "unsure",
  purchaseDate: "", deliveryDate: "", issue: "fault", failureDate: "", sellerResponse: "none",
  serious: "unsure", promptNotice: "unsure", priorRepair: "no",
});
const EVIDENCE = ["receipt", "photo", "dates", "contact"] as const;
const EVIDENCE_KEY: Record<string, string> = {
  receipt: "evidenceReceipt", photo: "evidencePhoto", dates: "evidenceDates", contact: "evidenceContact",
};
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Checker({ preset }: { preset: { product: string; n: number } | null }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState<Form>(initialForm);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [remedy, setRemedy] = useState<Remedy>("repair");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [residence, setResidence] = useState("");
  const [trader, setTrader] = useState("");
  const [advanced, setAdvanced] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const max = todayISO();

  useEffect(() => {
    if (!preset) return;
    setForm((f) => ({ ...f, product: preset.product }));
    setResult(null);
    setStep(0);
  }, [preset]);

  // Restore an explicitly saved case (opt-in local storage only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d?.v !== 1) return;
      const f = { ...initialForm(), ...d.form };
      setForm(f);
      setDetails({ ...emptyDetails, ...d.details });
      if (d.remedy) setRemedy(d.remedy);
      setResidence(d.residenceCountry || "");
      setTrader(d.traderCountry || "");
      setEvidence(Array.isArray(d.evidence) ? d.evidence : []);
      const out: any = evaluate(f);
      if (out.valid) { setResult(out); setStep(2); }
      toast(get("restored"));
    } catch { /* storage may be blocked */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const get = (k: string) => t(k);

  const update = (k: FormKey, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (result) setResult(null); // stale guidance must not linger
    if (step === 2) setStep(1);
    setError("");
  };

  const goto = (n: number) => {
    setStep(n);
    setError("");
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validatePurchase = () => {
    const p = parseDate(form.purchaseDate), d = parseDate(form.deliveryDate || form.purchaseDate);
    const today = parseDate(max)!;
    if (!p || !d) return setError(t("errDate")), false;
    if (p > today || d > today) return setError(t("errFuture")), false;
    if (d < p) return setError(t("errOrder")), false;
    return true;
  };

  const submit = () => {
    if (step === 0) { if (validatePurchase()) goto(1); return; }
    const out: any = evaluate(form);
    if (!out.valid) {
      const e: string[] = out.errors ?? [];
      const parts = [t("errorHeading")];
      if (e.some((x) => /Future/.test(x))) parts.push(t("errFuture"));
      else if (e.some((x) => /Before/.test(x))) parts.push(t("errOrder"));
      if (e.some((x) => ["purchaseDate", "failureDate", "deliveryDate"].includes(x))) parts.push(t("errDate"));
      setError(parts.join(" "));
      return;
    }
    setResult(out);
    setRemedy(recommendedRemedy(out));
    setStep(2);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const reset = () => {
    setForm(initialForm()); setResult(null); setStep(0); setDetails(emptyDetails); setEvidence([]);
    setResidence(""); setTrader(""); setRemedy("repair"); setError("");
    try { localStorage.removeItem(SAVED_KEY); } catch { /* ignore */ }
    toast(t("resetDone"));
  };

  const earlyHint = useMemo(() => {
    const d = parseDate(form.deliveryDate || form.purchaseDate), f = parseDate(form.failureDate);
    if (!(form.country === "GR" && form.sellerType === "business" && ["fault", "unsure"].includes(form.issue) && d && f)) return false;
    const n = daysBetween(d as any, f as any);
    return n >= 0 && n <= 30;
  }, [form]);

  const fmt = (iso: string) => fmtDate(lang, iso);
  const letter = result ? createLetter(lang, result, details, remedy, fmt, productName(lang, result.facts.product)) : "";
  const evidenceLines = EVIDENCE.map((k) => `${evidence.includes(k) ? "[x]" : "[ ]"} ${t(EVIDENCE_KEY[k])}`);

  const copy = async (text: string, ok: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(t(ok)); }
    catch { toast.error(t("copyFailed")); }
  };

  return (
    <section id="checker" className="relative scroll-mt-20 py-20 md:py-28">
      <div ref={top} className="mx-auto max-w-6xl scroll-mt-24 px-5">
        <div className="reveal mb-10 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="kicker">{t("toolKicker")}</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-6xl">{t("toolHeading")}</h2>
          </div>
          <p className="text-lg text-muted-foreground">{t("toolSubtitle")} <span className="font-semibold text-foreground">· {t("toolTime")}</span></p>
        </div>

        <Stepper step={step} />

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            className="card-paper p-6 md:p-10"
            onSubmit={(e) => { e.preventDefault(); submit(); }}
            noValidate
          >
            {step === 0 && (
              <div key="s0" className="animate-pop grid gap-7">
                <Head title={t("fieldOneTitle")} desc={t("fieldOneDesc")} n="01" />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field"><span>{t("country")}</span>
                    <select className="input" value={form.country} onChange={(e) => update("country", e.target.value)}>
                      {orderedCountries().map((c) => <option key={c[0]} value={c[0]}>{lang === "el" ? c[2] : c[1]}</option>)}
                    </select>
                  </label>
                  <label className="field"><span>{t("product")}</span>
                    <select className="input" value={form.product} onChange={(e) => update("product", e.target.value)}>
                      {[["electronic", "groupElectronic"], ["appliance", "groupAppliance"], ["other", "groupOther"]].map(([g, l]) => (
                        <optgroup key={g} label={t(l)}>
                          {(PRODUCTS as any[]).filter((p) => p.group === g).map((p) => <option key={p.id} value={p.id}>{p[lang]}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>
                <Choice label={t("sellerType")} value={form.sellerType} onChange={(v) => update("sellerType", v)}
                  options={[["business", t("sellerBusiness")], ["private", t("sellerPrivate")]]} />
                <Choice label={t("condition")} value={form.condition} onChange={(v) => update("condition", v)}
                  options={[["new", t("new")], ["used", t("used")]]} />
                {form.condition === "used" && (
                  <label className="field animate-pop"><span>{t("usedContract")}</span>
                    <YesNo value={form.shortenedUsed} onChange={(v) => update("shortenedUsed", v)} />
                    <small className="text-muted-foreground">{t("usedHint")}</small>
                  </label>
                )}
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field"><span>{t("purchaseDate")}</span>
                    <input type="date" className="input" max={max} value={form.purchaseDate} onChange={(e) => update("purchaseDate", e.target.value)} />
                  </label>
                  <label className="field"><span>{t("deliveryDate")}</span>
                    <input type="date" className="input" max={max} value={form.deliveryDate} onChange={(e) => update("deliveryDate", e.target.value)} />
                    <small className="text-muted-foreground">{t("deliveryHint")}</small>
                  </label>
                </div>
              </div>
            )}

            {step >= 1 && (
              <div key="s1" className="animate-pop grid gap-7">
                <Head title={t("fieldTwoTitle")} desc={t("fieldTwoDesc")} n="02" />
                <Choice label={t("issueLabel")} value={form.issue} onChange={(v) => update("issue", v)} cols
                  options={[["fault", t("issueFault")], ["accidental", t("issueAccident")], ["wear", t("issueWear")], ["unsure", t("issueUnsure")]]} />
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="field"><span>{t("failureDate")}</span>
                    <div className="flex gap-2">
                      <input type="date" className="input" max={max} value={form.failureDate} onChange={(e) => update("failureDate", e.target.value)} />
                      <button type="button" className="btn-ghost shrink-0 text-sm" onClick={() => update("failureDate", max)}>{t("todayButton")}</button>
                    </div>
                    <small className="text-muted-foreground">{t("failureHint")}</small>
                  </label>
                  <label className="field"><span>{t("sellerResponse")}</span>
                    <select className="input" value={form.sellerResponse} onChange={(e) => update("sellerResponse", e.target.value)}>
                      <option value="none">{t("responseNone")}</option>
                      <option value="rejected">{t("responseRejected")}</option>
                      <option value="attempted">{t("responseAttempted")}</option>
                      <option value="delayed">{t("responseDelayed")}</option>
                    </select>
                  </label>
                </div>
                {earlyHint && (
                  <p className="animate-pop rounded-xl border border-signal/40 bg-accent p-4 text-sm text-accent-foreground">
                    <Sparkles className="mr-2 inline size-4" />{t("earlyHint")}
                  </p>
                )}
                <div className="rounded-xl border border-dashed p-5">
                  <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setAdvanced(!advanced)} aria-expanded={advanced}>
                    <span><strong className="block">{t("advancedTitle")}</strong><small className="text-muted-foreground">{t("advancedDesc")}</small></span>
                    <span className={`text-2xl transition-transform ${advanced ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {advanced && (
                    <div className="animate-pop mt-5 grid gap-5 md:grid-cols-3">
                      {(["serious", "promptNotice", "priorRepair"] as const).map((k) => (
                        <label key={k} className="field"><span>{t(k)}</span>
                          <YesNo value={form[k]} onChange={(v) => update(k, v)} />
                        </label>
                      ))}
                      <small className="text-muted-foreground md:col-span-3">{t("priorRepairHint")}</small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && <p role="alert" className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">{error}</p>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-ok" />{t("privacyInline")}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-ghost text-sm" onClick={reset}><RotateCcw className="size-4" />{t("clearForm")}</button>
                {step >= 1 && <button type="button" className="btn-ghost" onClick={() => goto(0)}><ArrowLeft className="size-4" />{t("goBack")}</button>}
                <button type="submit" className="btn-signal">
                  {step === 0 ? t("goNext") : t("checkRights")}<ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </form>

          <aside className="surface-ink grain hidden overflow-hidden rounded-2xl p-7 lg:block">
            <p className="kicker text-ink-muted">{t("asideEyebrow")}</p>
            <p className="mt-4 font-display text-8xl font-semibold leading-none text-signal">2<span className="ml-2 text-2xl text-ink-foreground">{t("yrsShort")}</span></p>
            <p className="mt-4 text-ink-muted">{t("asideText")}</p>
            <ul className="mt-6 grid gap-3 text-sm">
              <li className="flex gap-2"><Check className="size-4 shrink-0 text-signal" />{t("asideFactOne")}</li>
              <li className="flex gap-2"><Check className="size-4 shrink-0 text-signal" />{t("asideFactTwo")}</li>
            </ul>
            <p className="mt-8 border-t border-ink-muted/30 pt-4 text-xs text-ink-muted">{t("asideBottom")}</p>
          </aside>
        </div>

        {result && (
          <div ref={resultRef} className="scroll-mt-20">
            <Results result={result} onEdit={() => goto(0)} onDraft={(r) => { setRemedy(r); letterRef.current?.scrollIntoView({ behavior: "smooth" }); }} />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="card-paper p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{t("evidenceTitle")}</h3>
                  <span className={`rounded-full px-3 py-1 font-mono text-sm ${evidence.length === 4 ? "bg-ok text-primary-foreground" : "bg-muted"}`}>{evidence.length} / 4</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-ok transition-all duration-500" style={{ width: `${evidence.length * 25}%` }} />
                </div>
                <div className="mt-5 grid gap-2">
                  {EVIDENCE.map((k) => {
                    const on = evidence.includes(k);
                    return (
                      <button key={k} type="button" data-on={on} className="chip text-left"
                        onClick={() => setEvidence(on ? evidence.filter((x) => x !== k) : [...evidence, k])}>
                        <span className={`grid size-5 place-items-center rounded border ${on ? "border-primary-foreground" : ""}`}>{on && <Check className="size-3.5" />}</span>
                        {t(EVIDENCE_KEY[k])}
                      </button>
                    );
                  })}
                </div>
                <button className="btn-ghost mt-4 text-sm" onClick={() => copy(evidenceLines.join("\n"), "evidenceCopied")}><ClipboardCopy className="size-4" />{t("copyEvidence")}</button>
              </div>
              <div className="surface-ink grain flex flex-col justify-between rounded-2xl p-6">
                <div>
                  <p className="kicker text-ink-muted">{t("shareEyebrow")}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{t("shareTitle")}</h3>
                  <p className="mt-2 text-ink-muted">{t("shareText")}</p>
                </div>
                <button className="btn-signal mt-6 self-start" onClick={async () => {
                  const url = new URL(window.location.href); url.search = ""; url.hash = ""; url.searchParams.set("lang", lang);
                  try { if (navigator.share) await navigator.share({ title: "Fix or Refund?", url: url.toString() }); else { await navigator.clipboard.writeText(url.toString()); toast(t("shareFallback")); } }
                  catch { /* user cancelled */ }
                }}><Share2 className="size-4" />{t("shareButton")}</button>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">{t("resultDisclaimer")}</p>

            <div ref={letterRef} id="letter" className="mt-16 scroll-mt-20">
              <p className="kicker">{t("letterKicker")}</p>
              <h2 className="mt-2 text-4xl font-semibold md:text-5xl">{t("letterTitle")}</h2>
              <p className="mt-3 max-w-2xl text-muted-foreground">{t("letterIntro")}</p>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="card-paper grid gap-4 p-6">
                  <label className="field"><span>{t("letterRequest")}</span>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(["repair", "replacement", "refund", "manufacturer", "review"] as Remedy[]).map((r) => (
                        <button key={r} type="button" data-on={remedy === r} className="chip justify-center text-sm" onClick={() => setRemedy(r)}>{t("request" + cap(r))}</button>
                      ))}
                    </div>
                  </label>
                  {(["merchantName", "productName", "orderRef", "yourName"] as const).map((k) => (
                    <label key={k} className="field"><span>{t(k)}</span>
                      <input className="input" maxLength={100} placeholder={t({ merchantName: "merchantPlaceholder", productName: "productPlaceholder", orderRef: "orderPlaceholder", yourName: "namePlaceholder" }[k])}
                        value={details[k]} onChange={(e) => setDetails({ ...details, [k]: e.target.value })} />
                    </label>
                  ))}
                  <label className="field"><span>{t("issueDetails")}</span>
                    <textarea className="input" rows={4} maxLength={1400} placeholder={t("detailsPlaceholder")} value={details.issueDetails} onChange={(e) => setDetails({ ...details, issueDetails: e.target.value })} />
                  </label>
                  <label className="field"><span>{t("recipientEmail")}</span>
                    <input type="email" className="input" maxLength={160} placeholder={t("emailPlaceholder")} value={details.recipientEmail} onChange={(e) => setDetails({ ...details, recipientEmail: e.target.value })} />
                    <small className="text-muted-foreground">{t("emailHint")}</small>
                  </label>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="relative flex-1 overflow-hidden rounded-2xl border bg-paper shadow-[var(--shadow-lift)]">
                    <div className="flex items-center justify-between border-b px-5 py-3">
                      <span className="kicker flex items-center gap-2"><FileText className="size-4" />{t("preview")}</span>
                      <span className="flex items-center gap-2 text-xs text-ok"><span className="pulse-dot size-2 rounded-full bg-ok" />{t("previewLive")}</span>
                    </div>
                    <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap p-6 font-sans text-sm leading-relaxed">{letter}</pre>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-signal" onClick={() => copy(letter, "copyDone")}><ClipboardCopy className="size-4" />{t("copy")}</button>
                    <button className="btn-ghost" onClick={() => {
                      const a = details.recipientEmail.trim();
                      if (a && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)) { toast.error(t("emailMissing")); return; }
                      const subject = remedy === "manufacturer" ? t("letterSubjectManufacturer") : t("letterSubjectSeller");
                      window.location.href = `mailto:${encodeURIComponent(a)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(letter)}`;
                    }}><Mail className="size-4" />{t("openEmail")}</button>
                    <button className="btn-ghost" onClick={() => { downloadText(letter, "fix-or-refund-letter.txt"); toast(t("downloadDone")); }}><Download className="size-4" />{t("download")}</button>
                    <button className="btn-ghost" onClick={() => window.print()}><Printer className="size-4" />{t("print")}</button>
                  </div>
                  <div className="card-paper p-5">
                    <strong>{t("casePackTitle")}</strong>
                    <p className="mt-1 text-sm text-muted-foreground">{t("casePackText")}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="btn-ghost text-sm" onClick={() => {
                        const f = result.facts;
                        const header = [`${t("factNow")}: ${fmt(f.referenceDate)}`, `${t("factCountry")}: ${countryName(lang, f.country)}`, `${t("product")}: ${details.productName || productName(lang, f.product)}`, `${t("factAge")}: ${fmt(f.deliveryDate)}`, `${t("factFailure")}: ${fmt(f.failureDate)}`];
                        downloadText(createCasePack(lang, result, letter, evidenceLines, header), "fix-or-refund-case-pack.txt"); toast(t("packDone"));
                      }}><Download className="size-4" />{t("downloadCasePack")}</button>
                      <button className="btn-ghost text-sm" onClick={() => {
                        try { localStorage.setItem(SAVED_KEY, JSON.stringify({ v: 1, savedAt: new Date().toISOString(), form, details, remedy, residenceCountry: residence, traderCountry: trader, evidence })); toast.success(t("saved")); }
                        catch { toast.error(t("saveFailed")); }
                      }}><Save className="size-4" />{t("saveCase")}</button>
                      <button className="btn-ghost text-sm" onClick={() => { try { localStorage.removeItem(SAVED_KEY); } catch { /* */ } toast(t("erased")); }}><Trash2 className="size-4" />{t("eraseCase")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="print-area" className="hidden print:block">{letter}</div>

            <Escalation business={result.facts.business} residence={residence} trader={trader} setResidence={setResidence} setTrader={setTrader} />
          </div>
        )}
      </div>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  const { t } = useLang();
  const items = [t("progressPurchase"), t("progressProblem"), t("progressAnswer")];
  return (
    <ol className="mb-6 grid grid-cols-3 gap-2" aria-label={t(["wizardFirst", "wizardSecond", "wizardComplete"][step])}>
      {items.map((l, i) => (
        <li key={l} aria-current={i === step ? "step" : undefined} className="grid gap-2">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-signal transition-all duration-700" style={{ width: i <= step ? "100%" : "0%" }} />
          </div>
          <span className={`font-mono text-xs uppercase tracking-wider ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>0{i + 1} · {l}</span>
        </li>
      ))}
    </ol>
  );
}

function Head({ title, desc, n }: { title: string; desc: string; n: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-display text-5xl font-semibold text-signal">{n}</span>
      <div><h3 className="text-3xl font-semibold">{title}</h3><p className="text-muted-foreground">{desc}</p></div>
    </div>
  );
}

function Choice({ label, value, onChange, options, cols }: { label: string; value: string; onChange: (v: string) => void; options: string[][]; cols?: boolean }) {
  return (
    <fieldset className="field">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className={`grid gap-2 ${cols ? "sm:grid-cols-2" : "grid-cols-2"}`} role="radiogroup">
        {options.map(([v, l]) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} data-on={value === v} className="chip" onClick={() => onChange(v ?? "")}>
            <span className={`size-3 rounded-full border-2 ${value === v ? "border-primary-foreground bg-signal" : ""}`} />{l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function YesNo({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useLang();
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[["yes", "yesOption"], ["no", "noOption"], ["unsure", "unsureOption"]].map(([v, k]) => (
        <button key={v} type="button" data-on={value === v} aria-pressed={value === v} className="chip justify-center px-2 py-2 text-sm" onClick={() => onChange(v ?? "")}>{t(k)}</button>
      ))}
    </div>
  );
}

const REMEDIES: [string, string, string, Remedy, typeof Wrench][] = [
  ["sellerRepair", "remedyRepair", "remedyRepairDesc", "repair", Wrench],
  ["replacement", "remedyReplacement", "remedyReplacementDesc", "replacement", Repeat],
  ["refund", "remedyRefund", "remedyRefundDesc", "refund", Euro],
  ["manufacturer", "remedyManufacturer", "remedyManufacturerDesc", "manufacturer", Factory],
];
const STATE_STYLE: Record<string, string> = {
  potential: "border-ok bg-ok/10",
  conditional: "border-warn bg-warn/10",
  review: "border-signal/50 bg-accent/50",
  unconfirmed: "opacity-60",
};

function Results({ result, onEdit, onDraft }: { result: any; onEdit: () => void; onDraft: (r: Remedy) => void }) {
  const { t, lang } = useLang();
  const s = cap(result.status), f = result.facts;
  const fmt = (iso: string) => fmtDate(lang, iso);
  return (
    <div className="mt-16">
      <div className="surface-ink grain animate-pop overflow-hidden rounded-3xl p-7 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-signal px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-signal-foreground">{t("status" + s)}</span>
          <button onClick={onEdit} className="text-sm text-ink-muted underline-offset-4 hover:underline">{t("editAnswers")}</button>
        </div>
        <p className="kicker mt-6 text-ink-muted">{t("yourResult")}</p>
        <h2 className="mt-2 max-w-3xl text-4xl font-semibold md:text-6xl">{t("heading" + s)}</h2>
        <p className="mt-4 max-w-3xl text-lg text-ink-muted">{t("intro" + s)}{f.isGreece ? "" : " " + t("euQualifier")}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs">
          {[`${t("factCountry")}: ${countryName(lang, f.country)}`, `${t("factAge")}: ${fmt(f.deliveryDate)}`, `${t("factFailure")}: ${fmt(f.failureDate)}`, `${t("factNow")}: ${fmt(f.referenceDate)}`].map((x) => (
            <span key={x} className="rounded-full border border-ink-muted/30 px-3 py-1">{x}</span>
          ))}
        </div>
        <Timeline facts={f} />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            [t("snapshotScope"), t(f.isGreece ? "snapshotScopeGR" : "snapshotScopeEU")],
            [t("snapshotClock"), t(f.in2Now && f.in2AtFailure ? "snapshotClockOK" : "snapshotClockLater")],
            [t("snapshotProof"), t(!f.business ? "snapshotProofPrivate" : f.in1AtFailure ? "snapshotProofYear" : "snapshotProofAfter")],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-ink-muted/25 bg-ink-foreground/5 p-4"><small className="text-ink-muted">{l}</small><strong className="mt-1 block">{v}</strong></div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-muted">{t("snapshotCaveat")}</p>
      </div>

      <div className="mt-10">
        <p className="kicker">{t("remediesEyebrow")}</p>
        <h3 className="mt-2 text-3xl font-semibold">{t("remediesHeading")}</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REMEDIES.map(([key, title, desc, r, Icon], i) => {
            const state = result.remedies[key];
            return (
              <div key={key} style={{ animationDelay: `${i * 90}ms` }} className={`animate-pop group flex flex-col rounded-2xl border-2 p-5 transition-transform hover:-translate-y-1 ${STATE_STYLE[state]}`}>
                <div className="flex items-center justify-between">
                  <Icon className="size-6" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">{t("state" + cap(state))}</span>
                </div>
                <h4 className="mt-4 font-display text-xl font-semibold">{t(title)}</h4>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{t(desc)}</p>
                {state !== "unconfirmed" && (
                  <button onClick={() => onDraft(r)} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-signal">{t("remedyDraft")}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card-paper p-6">
          <p className="kicker">{t("reasonEyebrow")}</p>
          <h3 className="mt-2 text-2xl font-semibold">{t("reasonHeading")}</h3>
          <ul className="mt-5 grid gap-3">
            {result.reasons.map((k: string) => (
              <li key={k} className="flex gap-3"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span><span className="text-sm leading-relaxed">{t("reason_" + k)}</span></li>
            ))}
          </ul>
        </div>
        <div className="card-paper p-6">
          <p className="kicker">{t("basedOn")}</p>
          <div className="mt-4 grid gap-2">
            {result.sourceIds.slice(0, 12).map((id: string) => {
              const src = (SOURCES as any)[id];
              return (
                <a key={id} href={src.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-2 rounded-lg p-2 text-sm hover:bg-muted">
                  <span>{src[lang]}</span><ExternalLink className="size-4 shrink-0 opacity-50 group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Visual guarantee clock: delivery → 1y → 2y → 3y with fault and today markers. */
function Timeline({ facts }: { facts: any }) {
  const { lang } = useLang();
  const d = parseDate(facts.deliveryDate), fail = parseDate(facts.failureDate), now = parseDate(facts.referenceDate);
  if (!d || !fail || !now) return null;
  const end = addYears(d, 3), span = end.getTime() - d.getTime();
  const pos = (x: Date) => Math.max(0, Math.min(100, ((x.getTime() - d.getTime()) / span) * 100));
  const L = lang === "el" ? { y: "έτ.", f: "Βλάβη", n: "Σήμερα", d: "Παράδοση" } : { y: "yr", f: "Fault", n: "Today", d: "Delivery" };
  return (
    <div className="mt-10" aria-hidden>
      <div className="relative h-3 rounded-full bg-ink-foreground/10">
        <div className="absolute inset-y-0 left-0 rounded-l-full bg-ok/70" style={{ width: `${pos(addYears(d, 1))}%` }} />
        <div className="absolute inset-y-0 bg-ok/40" style={{ left: `${pos(addYears(d, 1))}%`, width: `${pos(addYears(d, 2)) - pos(addYears(d, 1))}%` }} />
        {[1, 2].map((y) => <span key={y} className="absolute top-full mt-2 -translate-x-1/2 font-mono text-[10px] text-ink-muted" style={{ left: `${pos(addYears(d, y))}%` }}>{y} {L.y}</span>)}
        <span className="absolute top-full mt-2 font-mono text-[10px] text-ink-muted">{L.d}</span>
        <Marker left={pos(fail)} label={L.f} cls="bg-signal" up />
        <Marker left={pos(now)} label={L.n} cls="bg-ink-foreground" />
      </div>
      <div className="h-8" />
    </div>
  );
}
function Marker({ left, label, cls, up }: { left: number; label: string; cls: string; up?: boolean }) {
  return (
    <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" style={{ left: `${left}%` }}>
      <span className={`block size-5 rounded-full border-4 border-ink ${cls}`} />
      <span className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-bold uppercase ${up ? "-top-6 text-signal" : "top-7"}`}>{label}</span>
    </span>
  );
}

function Escalation({ business, residence, trader, setResidence, setTrader }: { business: boolean; residence: string; trader: string; setResidence: (v: string) => void; setTrader: (v: string) => void }) {
  const { t, lang } = useLang();
  type C = [string, string, string, string];
  const info: C = ["euGuarantee", "escalateDomestic", "euInfoTitle", "euInfoText"];
  const adr: C = ["euADR", "escalateADR", "adrTitle", "adrText"];
  const ecc: C = ["eccNetwork", "escalateCross", "eccNetTitle", "eccNetText"];
  let msg: string, cards: [string, string, string, string][];
  if (!business) { msg = "routePrivate"; cards = [info]; }
  else if (!residence || !trader) { msg = "routeMissing"; cards = [adr, info]; }
  else if (residence === "OUTSIDE") { msg = "routeOutsideResidence"; cards = [info]; }
  else if (trader === "OUTSIDE") { msg = "routeOutsideEU"; cards = [adr, info]; }
  else if (residence === "GR" && trader === "GR") { msg = "routeGR"; cards = [["grOmbudsman", "escalateDomestic", "ombTitle", "ombText"], ["grComplaint", "escalateEnforcement", "stateTitle", "stateText"]]; }
  else if (residence === "GR") { msg = "routeCrossGR"; cards = [["eccGreece", "escalateCross", "eccTitle", "eccText"], adr]; }
  else if (residence !== trader) { msg = "routeCrossEU"; cards = [ecc, adr]; }
  else { msg = "routeSameEU"; cards = [adr, info]; }
  const extra = business && residence === "GR" && trader === "GR" ? t("v5GreekComplaintDeadline")
    : business && residence === "GR" && trader && trader !== "GR" && trader !== "OUTSIDE" ? t("v5EccComplaintPrep") : "";
  const sel = (v: string, set: (v: string) => void, label: string) => (
    <label className="field"><span>{label}</span>
      <select className="input" value={v} onChange={(e) => set(e.target.value)}>
        <option value="">{t("chooseCountry")}</option>
        {orderedCountries().map((c) => <option key={c[0]} value={c[0]}>{lang === "el" ? c[2] : c[1]}</option>)}
        <option value="OUTSIDE">{t("outsideEU")}</option>
      </select>
    </label>
  );
  return (
    <div className="mt-20">
      <p className="kicker">{t("escalationKicker")}</p>
      <h2 className="mt-2 text-4xl font-semibold md:text-5xl">{t("escalationHeading")}</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("escalationDesc")}</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="card-paper grid content-start gap-4 p-6">
          <strong>{t("routeTitle")}</strong>
          <small className="text-muted-foreground">{t("routeIntro")}</small>
          {sel(residence, setResidence, t("residenceCountry"))}
          {sel(trader, setTrader, t("traderCountry"))}
          <p className="rounded-xl bg-muted p-4 text-sm">{t(msg)}{extra ? " " + extra : ""}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map(([src, type, title, desc]) => (
            <a key={src} href={(SOURCES as any)[src].url} target="_blank" rel="noopener noreferrer" className="animate-pop group card-paper flex flex-col p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <div className="flex justify-between"><ShieldCheck className="size-7 text-signal" /><ExternalLink className="size-4 opacity-40 group-hover:opacity-100" /></div>
              <p className="kicker mt-6">{t(type)}</p>
              <h3 className="mt-1 text-xl font-semibold">{t(title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(desc)}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
