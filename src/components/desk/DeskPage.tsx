import { useState } from "react";
import { Laptop, Microwave, Package, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checker } from "./Checker";
import { DeskHeader } from "./DeskHeader";
import { useLang, useReveal } from "./lang";
export function DeskPage() {
  const { t } = useLang();
  const [preset, setPreset] = useState<{product: string; n: number} | null>(null);
  useReveal();
  return <><a href="#checker" className="sr-only focus:not-sr-only">{t("skip")}</a><DeskHeader />
    <main><section className="border-b"><div className="mx-auto max-w-6xl px-5 py-8 md:py-10">
      <p className="kicker">{t("v5HeroKicker")}</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{t("deskTitle")}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("deskIntro")}</p>
      <div className="mt-5 flex flex-wrap gap-2">{[["phone","v5Phone",Smartphone],["washer","v5Appliance",Microwave],["laptop","v5Laptop",Laptop],["other","v5Other",Package]].map(([id,key,Icon]) => { const I = Icon as typeof Smartphone; return <Button key={id as string} variant="outline" onClick={() => {setPreset({product:id as string,n:Date.now()});document.getElementById("checker")?.scrollIntoView({behavior:"smooth"});}}><I className="size-4" />{t(key as string)}</Button>; })}</div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm text-muted-foreground"><span>{t("coverageNational")}</span><span>{t("coverageBaseline")}</span><span>{t("privacyInline")}</span></div>
    </div></section><Checker preset={preset} /></main>
    <footer className="border-t py-8"><div className="mx-auto max-w-6xl px-5 text-sm text-muted-foreground">{t("footerDisclaimer")}<p className="mt-2">{t("reviewPending")}</p></div></footer>
  </>;
}