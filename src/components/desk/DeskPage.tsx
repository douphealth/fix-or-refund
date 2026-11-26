import { useState } from "react";
import { Laptop, Microwave, Package, Smartphone } from "lucide-react";
import { Checker } from "./Checker";
import { DeskFooter, DeskHeader } from "./DeskHeader";
import { useLang, useReveal } from "./lang";

const PRESETS = [["phone", "v5Phone", Smartphone], ["washer", "v5Appliance", Microwave], ["laptop", "v5Laptop", Laptop], ["other", "v5Other", Package]] as const;

export function DeskPage() {
  const { t } = useLang();
  const [preset, setPreset] = useState<{product: string; n: number} | null>(null);
  useReveal();
  return <><a href="#checker" className="sr-only focus:not-sr-only">{t("skip")}</a><DeskHeader />
    <main><section className="border-b"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      <p className="kicker">{t("v5HeroKicker")}</p>
      <h1 className="mt-4 text-5xl sm:text-6xl lg:text-7xl"><span className="text-gradient italic">{t("deskTitle")}</span></h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t("deskIntro")}</p>
      <div className="mt-7 flex flex-wrap gap-2.5">{PRESETS.map(([id, key, Icon]) => <button key={id} type="button" className="chip hover-card" onClick={() => { setPreset({ product: id, n: Date.now() }); document.getElementById("checker")?.scrollIntoView({ behavior: "smooth" }); }}><Icon className="size-4 text-signal" aria-hidden="true" />{t(key)}</button>)}</div>
      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-sm text-muted-foreground"><span>{t("coverageNational")}</span><span>{t("coverageBaseline")}</span><span>{t("privacyInline")}</span></div>
    </div></section><Checker preset={preset} /></main>
    <DeskFooter />
  </>;
}
