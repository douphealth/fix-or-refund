import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowRight, ExternalLink, Laptop, Lock, Microwave, Package, Scale, ShieldCheck, Smartphone } from "lucide-react";
import { Checker } from "@/components/desk/Checker";
import { LangProvider, useLang, useReveal } from "@/components/desk/lang";
import { LAW_REVIEW_DATE, SOURCES } from "@/lib/engine/rules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fix or Refund? — Repair & refund rights in Greece and the EU" },
      { name: "description", content: "Free, private checker for repair, replacement and refund rights in Greece and all 27 EU countries, with official sources and a ready-to-send letter." },
      { property: "og:title", content: "Fix or Refund? — The Consumer Desk" },
      { property: "og:description", content: "It broke. You have options. Check your rights in minutes and get a tailored seller letter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LangProvider>
      <Page />
    </LangProvider>
  ),
});

function Page() {
  const { t, lang, setLang } = useLang();
  const [preset, setPreset] = useState<{ product: string; n: number } | null>(null);
  useReveal();
  const pick = (product: string) => {
    setPreset({ product, n: Date.now() });
    document.getElementById("checker")?.scrollIntoView({ behavior: "smooth" });
  };
  const quick = [
    ["phone", "v5Phone", Smartphone],
    ["washer", "v5Appliance", Microwave],
    ["laptop", "v5Laptop", Laptop],
    ["other", "v5Other", Package],
  ] as const;

  return (
    <div className="min-h-screen">
      <a href="#checker" className="sr-only focus:not-sr-only">{t("skip")}</a>
      <div className="surface-ink overflow-hidden py-2 text-[11px]">
        <div className="marquee font-mono uppercase tracking-[0.2em] text-ink-muted">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex gap-12"><span>{t("utilityLeft")}</span><span className="text-signal">✦</span><span>{t("utilityRight")}</span><span className="text-signal">✦</span></span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#" className="flex items-center gap-2 font-display text-xl font-semibold">
            <img src="/favicon.svg" alt="" className="size-7" />Fix or Refund?
          </a>
          <nav className="hidden gap-6 text-sm font-semibold md:flex">
            <a href="#how" className="hover:text-signal">{t("navHow")}</a>
            <a href="#sources" className="hover:text-signal">{t("navSources")}</a>
            <a href="#faq" className="hover:text-signal">{t("navFaq")}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "el" ? "en" : "el")} className="btn-ghost px-3 py-1.5 text-sm" aria-label={lang === "el" ? "Switch to English" : "Αλλαγή στα Ελληνικά"}>
              {lang === "el" ? "🇬🇷 EL" : "🇬🇧 EN"}
            </button>
            <a href="#checker" className="btn-signal hidden px-4 py-2 text-sm sm:inline-flex">{t("headerAction")}</a>
          </div>
        </div>
      </header>

      <main>
        <section className="surface-ink grain relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
            <div className="animate-pop">
              <p className="kicker text-ink-muted">{t("v5HeroKicker")}</p>
              <h1 className="mt-5 text-6xl font-semibold leading-[0.95] md:text-8xl" dangerouslySetInnerHTML={{ __html: t("heroHeading") }} />
              <p className="mt-6 max-w-xl text-lg text-ink-muted">{t("heroIntro")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#checker" className="btn-signal">{t("heroCta")}<ArrowRight className="size-4" /></a>
                <a href="#how" className="btn-ghost border-ink-muted/40 hover:bg-ink-foreground/10">{t("heroLearn")}<ArrowDown className="size-4" /></a>
              </div>
              <div className="mt-10 rounded-2xl border border-ink-muted/25 bg-ink-foreground/5 p-5">
                <p className="font-display text-xl">{t("v5QuickHeading")}</p>
                <p className="text-sm text-ink-muted">{t("v5QuickText")}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {quick.map(([id, k, Icon]) => (
                    <button key={id} onClick={() => pick(id)} className="group flex flex-col items-start gap-3 rounded-xl border border-ink-muted/25 p-3 text-left text-sm font-semibold transition-all hover:-translate-y-1 hover:border-signal hover:bg-signal hover:text-signal-foreground">
                      <Icon className="size-5" />{t(k)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-signal/20 blur-3xl" />
              <img src="/assets/hero-v5.svg" alt={t("v5Figure")} className="float-slow relative mx-auto w-full max-w-md drop-shadow-2xl" />
              <p className="relative mt-4 text-center font-mono text-xs uppercase tracking-widest text-ink-muted">{t("v5ArtFooter")}</p>
            </div>
          </div>
          <div className="border-t border-ink-muted/20">
            <div className="mx-auto grid max-w-6xl gap-4 px-5 py-5 text-sm md:grid-cols-4">
              <p className="font-display text-lg">{t("v5TrustLead")}</p>
              {[[ShieldCheck, "trustOne"], [Scale, "trustTwo"], [Lock, "trustThree"]].map(([Icon, k]) => {
                const I = Icon as typeof ShieldCheck;
                return <p key={k as string} className="flex items-center gap-2 text-ink-muted"><I className="size-4 text-signal" />{t(k as string)}</p>;
              })}
            </div>
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x px-5 md:grid-cols-4">
            {[["27", lang === "el" ? "χώρες ΕΕ" : "EU countries"], ["15", lang === "el" ? "κατηγορίες προϊόντων" : "product types"], ["16", lang === "el" ? "επίσημες πηγές" : "official sources"], ["0", lang === "el" ? "δεδομένα στέλνονται" : "data sent anywhere"]].map(([n, l]) => (
              <div key={l} className="reveal py-8 text-center">
                <p className="font-display text-5xl font-semibold text-signal">{n}</p>
                <p className="kicker mt-1">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <Checker preset={preset} />

        <section id="how" className="surface-ink grain scroll-mt-16 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <p className="kicker reveal text-ink-muted">{t("howKicker")}</p>
            <h2 className="reveal mt-3 max-w-3xl text-4xl font-semibold md:text-6xl">{t("howTitle")}</h2>
            <p className="reveal mt-4 max-w-2xl text-ink-muted">{t("howIntro")}</p>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {["One", "Two", "Three"].map((n, i) => (
                <div key={n} className="reveal rounded-2xl border border-ink-muted/25 p-7 transition-colors hover:border-signal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <p className="font-display text-6xl font-semibold text-signal">0{i + 1}</p>
                  <h3 className="mt-6 text-2xl font-semibold">{t(`how${n}Title`)}</h3>
                  <p className="mt-2 text-ink-muted">{t(`how${n}Body`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sources" className="scroll-mt-16 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-end">
              <div>
                <p className="kicker reveal">{t("sourcesKicker")}</p>
                <h2 className="reveal mt-3 text-4xl font-semibold md:text-6xl">{t("sourcesTitle")}</h2>
              </div>
              <div className="reveal">
                <p className="text-muted-foreground">{t("sourcesDesc")}</p>
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 font-mono text-xs text-accent-foreground"><span className="pulse-dot size-2 rounded-full bg-signal" />{t("reviewed")} {LAW_REVIEW_DATE}</p>
              </div>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(["grGuarantee", "euGuarantee", "euSales", "euRepairLaw", "grLaw", "grEffective", "grThreeYear", "grOmbudsman", "eccGreece", "euADR"] as const).map((id) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const s = (SOURCES as any)[id];
                return (
                  <a key={id} href={s.url} target="_blank" rel="noopener noreferrer" className="reveal group card-paper flex flex-col justify-between gap-6 p-5 transition-all hover:-translate-y-1 hover:border-foreground">
                    <div className="flex justify-between"><span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">{s.kind}</span><ExternalLink className="size-4 opacity-40 group-hover:text-signal group-hover:opacity-100" /></div>
                    <strong className="font-display text-lg leading-snug">{s[lang]}</strong>
                  </a>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{t("v5SourceCaveat")} {t("sourceNote")}</p>
          </div>
        </section>

        <section id="faq" className="scroll-mt-16 border-t bg-secondary py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1fr_1.6fr]">
            <div>
              <p className="kicker">{t("faqKicker")}</p>
              <h2 className="mt-3 text-4xl font-semibold md:text-5xl">{t("faqHeading")}</h2>
              <p className="mt-4 text-muted-foreground">{t("faqIntro")}</p>
            </div>
            <div className="grid gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <details key={i} className="reveal group card-paper p-5 open:shadow-[var(--shadow-lift)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                    {t(`faq${i}q`)}<span className="grid size-8 shrink-0 place-items-center rounded-full border transition-transform group-open:rotate-45 group-open:bg-signal group-open:text-signal-foreground">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground">{t(`faq${i}a`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="surface-ink py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[2fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl"><img src="/favicon.svg" alt="" className="size-7" />Fix or Refund?</p>
            <p className="mt-3 max-w-xl text-sm text-ink-muted">{t("footerSummary")}</p>
            <p className="mt-6 max-w-2xl text-xs text-ink-muted">{t("footerDisclaimer")}</p>
          </div>
          <div className="grid content-start gap-2 text-sm">
            <a href="#checker" className="hover:text-signal">{t("footerCheck")}</a>
            <a href="#sources" className="hover:text-signal">{t("footerSources")}</a>
            <a href="#faq" className="hover:text-signal">{t("footerFaq")}</a>
            <p className="mt-4 font-mono text-xs text-ink-muted">{t("footerReview")}: {LAW_REVIEW_DATE} · {t("footerRights")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
