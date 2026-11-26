import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, Moon, Scale, Sun, X } from "lucide-react";
import { useLang } from "./lang";

const PAGES = ["coverage", "methodology", "guides", "privacy", "ownership"] as const;
// The desktop bar has room for the three most-used pages; the menu button and footer list all of them.
const PRIMARY: readonly string[] = ["coverage", "methodology", "guides"];
// Same key the homepage design (design/home.html) writes, so the choice carries across the site.
const THEME_KEY = "for_theme_v2";

function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.classList.contains("light")); }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try { localStorage.setItem(THEME_KEY, next ? "light" : "dark"); } catch { /* private mode: theme just won't persist */ }
    setLight(next);
  };
  return { light, toggle };
}

/** Site header for every app page; mirrors the homepage design's header (logo mark, serif wordmark, pills). */
export function DeskHeader() {
  const { lang, t } = useLang();
  const { light, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const other = lang === "el" ? "en" : "el";
  const links = (pages: readonly string[]) => <>
    <Link to="/$locale" params={{ locale: lang }} activeOptions={{ exact: true }} className="nav-link" onClick={() => setOpen(false)}>{t("navChecker")}</Link>
    {pages.map(page => <Link key={page} to="/$locale/$page" params={{ locale: lang, page }} className="nav-link" onClick={() => setOpen(false)}>{t(page)}</Link>)}
  </>;
  return <header className="desk-header">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
      <a href={lang === "el" ? "/el" : "/"} className="group flex shrink-0 items-center gap-3">
        <span className="brand-mark transition-transform group-hover:scale-105"><Scale className="size-5" aria-hidden="true" /></span>
        <span>
          <span className="flex items-center gap-2">
            <span className="font-display text-2xl leading-none whitespace-nowrap">{t("deskTitle")}</span>
            <span className="hidden rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-signal uppercase sm:inline-block">EU-27</span>
          </span>
          <span className="mt-1 hidden text-[10px] font-semibold tracking-widest whitespace-nowrap text-muted-foreground uppercase sm:block">{t("brandSub")}</span>
        </span>
      </a>
      <nav aria-label={t("navLabel")} className="hidden items-center gap-6 whitespace-nowrap xl:flex">{links(PRIMARY)}</nav>
      <div className="flex shrink-0 items-center gap-2">
        <Link to="/$locale" params={{ locale: other }} lang={other} aria-label={other === "el" ? "Ελληνικά" : "English"} className="pill-btn"><Globe className="size-3.5 text-signal" aria-hidden="true" /><span className="sm:hidden">{other.toUpperCase()}</span><span className="hidden sm:inline">{other === "el" ? "Ελληνικά" : "English"}</span></Link>
        <button type="button" onClick={toggle} aria-label={t("themeToggle")} className="pill-btn !min-h-9 !w-9 justify-center !p-0">{light ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4 text-warn" aria-hidden="true" />}</button>
        <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="desk-menu" aria-label={t("menuToggle")} className="pill-btn !min-h-9 !w-9 justify-center !p-0">{open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}</button>
      </div>
    </div>
    <nav id="desk-menu" aria-label={t("navLabel")} hidden={!open} className="border-t px-4 py-4 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">{links(PAGES)}</div></nav>
  </header>;
}

/** Shared footer: disclaimer, page links and the same sign-off line as the homepage. */
export function DeskFooter() {
  const { lang, t } = useLang();
  return <footer className="mt-16 border-t bg-background/70 py-10 text-sm text-muted-foreground">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
      <div>
        <p className="font-display text-2xl text-foreground">{t("deskTitle")}</p>
        <p className="mt-3 max-w-xl leading-relaxed">{t("footerDisclaimer")}</p>
        <p className="mt-2 max-w-xl leading-relaxed">{t("reviewPending")}</p>
      </div>
      <nav aria-label={t("footerNavLabel")} className="grid grid-cols-2 content-start gap-x-6 gap-y-3">
        <Link to="/$locale" params={{ locale: lang }} className="hover:text-signal">{t("navChecker")}</Link>
        {PAGES.map(page => <Link key={page} to="/$locale/$page" params={{ locale: lang, page }} className="hover:text-signal">{t(page)}</Link>)}
      </nav>
    </div>
    <p className="mx-auto mt-8 max-w-7xl border-t px-4 pt-6 text-xs sm:px-6 lg:px-8">{t("footerLine")}</p>
  </footer>;
}
