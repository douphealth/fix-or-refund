import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { get } from "@/lib/engine/i18n";
import { EU_COUNTRIES, PRODUCTS, parseDate } from "@/lib/engine/rules";

export type Lang = "el" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k?: string) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? "en");
  useEffect(() => {
    if (initialLang) return;
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    if (q === "el" || q === "en") {
      window.location.replace(`/${q}`);
      return;
    }
    else if (navigator.language?.toLowerCase().startsWith("el")) setLangState("el");
  }, [initialLang]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  };
  return (
    <LangCtx.Provider value={{ lang, setLang, t: (k) => get(lang, k ?? "") as string }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}

export const fmtDate = (lang: Lang, date: string) => {
  const d = parseDate(date);
  return d
    ? new Intl.DateTimeFormat(lang === "el" ? "el-GR" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(d)
    : date;
};
export const countryName = (lang: Lang, code: string) =>
  (EU_COUNTRIES as unknown as string[][]).find((c) => c[0] === code)?.[lang === "el" ? 2 : 1] ?? code;
export const productName = (lang: Lang, id: string) =>
  ((PRODUCTS as unknown as Record<string, string>[]).find((p) => p["id"] === id)?.[lang] ?? id);
export const orderedCountries = () => {
  const all = EU_COUNTRIES as unknown as string[][];
  const greece = all.find((c) => c[0] === "GR");
  return greece ? [greece, ...all.filter((c) => c[0] !== "GR")] : all;
};

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.setAttribute("data-in", "true")),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}
