import { Link } from "@tanstack/react-router";
import { EU_COUNTRIES, SOURCES } from "@/lib/engine/rules";
import { RULE_REGISTER, RULESET_VERSION, HISTORICAL_REVIEW_DATE, sourceCategory } from "@/lib/engine/governance";
import { GUIDE_SECTIONS, TRUST_PAGE_IDS } from "@/lib/seo";
import { DeskHeader } from "./DeskHeader";
import { useLang } from "./lang";

export const TRUST_PAGES = TRUST_PAGE_IDS;

export function TrustPage({ page }: { page: string }) {
  const { lang, t } = useLang();
  return (
    <>
      <DeskHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/$locale" params={{ locale: lang }} className="underline">
                {t("deskTitle")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{t(page + "Title")}</li>
          </ol>
        </nav>
        <p className="kicker mt-6">{t("deskTitle")}</p>
        <h1 className="mt-3 text-4xl font-semibold">{t(page + "Title")}</h1>
        <p className="mt-5 max-w-3xl text-lg text-muted-foreground">{t(page + "Intro")}</p>
        {page !== "coverage" && page !== "guides" && (
          <p className="mt-6 max-w-3xl leading-relaxed">{t(page + "Body")}</p>
        )}
        {page === "coverage" && (
          <>
            <p className="mt-6 max-w-3xl">{t("coveragePending")}</p>
            <div className="mt-8 divide-y border-y">
              {EU_COUNTRIES.map(([code, en, el]) => (
                <div key={code} className="grid gap-2 py-3 sm:grid-cols-2">
                  <strong>{lang === "el" ? el : en}</strong>
                  <span className="text-sm text-muted-foreground">
                    {t(code === "GR" ? "coverageNational" : "coverageBaseline")}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5">{t("coverageUnsupported")}</p>
            <a
              href={SOURCES.eccNetwork.url}
              rel="noopener noreferrer"
              target="_blank"
              className="mt-3 inline-block underline"
            >
              {t("eccNetTitle")}
            </a>
          </>
        )}
        {page === "guides" && (
          <>
            <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              {GUIDE_SECTIONS.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="underline">
                  {t(section.titleKey)}
                </a>
              ))}
            </nav>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {GUIDE_SECTIONS.map((section) => {
                const source = SOURCES[section.id === "escalation" ? "eccNetwork" : "euSales"];
                return (
                  <article key={section.id} id={section.id} className="border-t pt-5">
                    <h2 className="text-2xl font-semibold">{t(section.titleKey)}</h2>
                    <p className="mt-3 leading-relaxed">{t(section.bodyKey)}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block underline"
                    >
                      {t("basedOn")} {source[lang]}
                    </a>
                  </article>
                );
              })}
            </div>
          </>
        )}
        {page === "methodology" && (
          <>
            <p className="mt-6 text-sm">
              {t("sourceStatus")}: {HISTORICAL_REVIEW_DATE} · {t("ruleVersion")}: {RULESET_VERSION}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{t("reviewPending")}</p>
            {["primary", "guidance", "secondary"].map((cat) => {
              const entries = Object.entries(SOURCES).filter(([, s]) => sourceCategory(s.kind) === cat);
              return (
                <section key={cat} className="mt-10">
                  <h2 className="text-2xl font-semibold">
                    {t("source" + cat.charAt(0).toUpperCase() + cat.slice(1))}{" "}
                    <span className="font-sans text-sm text-muted-foreground">
                      {entries.length} {t("sourceCount")}
                    </span>
                  </h2>
                  <div className="mt-4 divide-y border-y">
                    {entries.map(([id, s]) => (
                      <a
                        key={id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block py-3 underline underline-offset-4"
                      >
                        {s[lang]}
                      </a>
                    ))}
                  </div>
                </section>
              );
            })}
            <section className="mt-10">
              <h2 className="text-2xl font-semibold">{t("rulesTitle")}</h2>
              <div className="mt-4 divide-y border-y">
                {RULE_REGISTER.map((r) => (
                  <article key={r.id} className="py-4">
                    <h3 className="text-lg font-semibold">
                      {r.id} · {r.jurisdiction}
                    </h3>
                    <p className="mt-2 text-sm">
                      {t("ruleStatus")}: {t(r.status === "review-pending" ? "rulePending" : "ruleBaseline")} ·{" "}
                      {t("ruleEffective")}: {r.effectiveFrom ?? t("ruleNoDate")}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("ruleConditions")}: {r.conditions.join(" · ")}
                      <br />
                      {t("ruleExceptions")}: {r.exceptions.join(" · ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {r.sources.map((id) => {
                        const s = SOURCES[id as keyof typeof SOURCES];
                        return s ? (
                          <a key={id} href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                            {s[lang]}
                          </a>
                        ) : null;
                      })}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
        <nav className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t pt-6 text-sm font-semibold">
          <Link to="/$locale" params={{ locale: lang }} className="underline">
            {t("headerAction")}
          </Link>
          {TRUST_PAGES.filter((item) => item !== page).map((item) => (
            <Link key={item} to="/$locale/$page" params={{ locale: lang, page: item }} className="underline">
              {t(item)}
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
