import { ArrowUpRight } from "lucide-react";
import { EU_COUNTRIES, SOURCES } from "@/lib/engine/rules";
import { RULE_REGISTER, RULESET_VERSION, HISTORICAL_REVIEW_DATE, sourceCategory } from "@/lib/engine/governance";
import { DeskFooter, DeskHeader } from "./DeskHeader";
import { useLang } from "./lang";
export const TRUST_PAGES = ["coverage", "methodology", "privacy", "ownership", "guides"] as const;

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export function TrustPage({ page }: {page: string}) {
  const { lang, t } = useLang();
  return <><DeskHeader /><main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
    <p className="kicker">{t("deskTitle")}</p>
    <h1 className="mt-4 text-5xl sm:text-6xl">{t(page+"Title")}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{t(page+"Intro")}</p>
    {page !== "coverage" && page !== "guides" && <div className="card-paper mt-8 max-w-3xl p-6 md:p-8"><p className="leading-relaxed">{t(page+"Body")}</p></div>}

    {page === "coverage" && <>
      <p className="mt-6 max-w-3xl border-l-2 border-signal pl-4 leading-relaxed">{t("coveragePending")}</p>
      <div className="card-paper mt-8 divide-y overflow-hidden">{EU_COUNTRIES.map(([code,en,el]) => <div key={code} className="grid gap-1 px-5 py-3.5 sm:grid-cols-2 sm:gap-4">
        <strong className="flex items-center gap-3 font-semibold"><span className="w-7 font-mono text-xs text-muted-foreground">{code}</span>{lang === "el" ? el : en}</strong>
        <span className={`text-sm ${code === "GR" ? "text-warn" : "text-muted-foreground"}`}>{t(code === "GR" ? "coverageNational" : "coverageBaseline")}</span>
      </div>)}</div>
      <p className="mt-6 max-w-3xl">{t("coverageUnsupported")}</p>
      <a href={SOURCES.eccNetwork.url} {...ext} className="prose-link mt-3 inline-flex items-center gap-1">{t("eccNetTitle")}<ArrowUpRight className="size-4" aria-hidden="true" /></a>
    </>}

    {page === "guides" && <div className="mt-10 grid gap-5 md:grid-cols-2">{["Seller","Warranty","Used","Escalation"].map((key, i) => { const source = SOURCES[key === "Escalation" ? "eccNetwork" : "euSales"]; return <article key={key} className="card-paper hover-card flex flex-col p-6 md:p-7">
      <p className="font-mono text-xs font-semibold text-signal">{String(i + 1).padStart(2, "0")}</p>
      <h2 className="mt-3 text-3xl">{t("guide"+key+"Title")}</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{t("guide"+key+"Body")}</p>
      <a href={source.url} {...ext} className="prose-link mt-auto inline-flex items-start gap-1 pt-5 text-sm"><span>{t("basedOn")} {source[lang]}</span><ArrowUpRight className="mt-0.5 size-4 shrink-0" aria-hidden="true" /></a>
    </article>; })}</div>}

    {page === "methodology" && <>
      <div className="mt-8 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full border bg-muted px-3 py-1.5">{t("sourceStatus")}: <strong>{HISTORICAL_REVIEW_DATE}</strong></span>
        <span className="rounded-full border bg-muted px-3 py-1.5">{t("ruleVersion")}: <strong className="font-mono">{RULESET_VERSION}</strong></span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{t("reviewPending")}</p>
      {["primary","guidance","secondary"].map(cat => { const entries = Object.entries(SOURCES).filter(([,s]) => sourceCategory(s.kind) === cat); return <section key={cat} className="mt-12">
        <h2 className="text-3xl">{t("source"+cat.charAt(0).toUpperCase()+cat.slice(1))} <span className="ml-1 font-sans text-sm text-muted-foreground">{entries.length} {t("sourceCount")}</span></h2>
        <div className="card-paper mt-4 divide-y overflow-hidden">{entries.map(([id,s]) => <a key={id} href={s.url} {...ext} className="flex items-start justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-accent"><span>{s[lang]}</span><ArrowUpRight className="mt-1 size-4 shrink-0 text-signal" aria-hidden="true" /></a>)}</div>
      </section>; })}
      <section className="mt-12"><h2 className="text-3xl">{t("rulesTitle")}</h2>
        <div className="mt-4 grid gap-4">{RULE_REGISTER.map(r => <article key={r.id} className="card-paper p-5 md:p-6">
          <h3 className="text-xl"><span className="font-mono text-sm text-signal">{r.id}</span> · {r.jurisdiction}</h3>
          <p className="mt-2 text-sm">{t("ruleStatus")}: <span className={r.status === "review-pending" ? "text-warn" : "text-ok"}>{t(r.status === "review-pending" ? "rulePending" : "ruleBaseline")}</span> · {t("ruleEffective")}: {r.effectiveFrom ?? t("ruleNoDate")}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("ruleConditions")}: {r.conditions.join(" · ")}<br />{t("ruleExceptions")}: {r.exceptions.join(" · ")}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">{r.sources.map(id => { const s = SOURCES[id as keyof typeof SOURCES]; return s ? <a key={id} href={s.url} {...ext} className="prose-link text-sm">{s[lang]}</a> : null; })}</div>
        </article>)}</div>
      </section>
    </>}
  </main><DeskFooter /></>;
}
