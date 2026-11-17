import { Link } from "@tanstack/react-router";
import { useLang } from "./lang";
export function DeskHeader() {
  const { lang, t } = useLang();
  return <header className="border-b bg-background"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
    <Link to="/$locale" params={{ locale: lang }} className="flex items-center gap-2 font-display text-xl font-semibold"><img src="/favicon.svg" width={28} height={28} className="size-7" alt="" />{t("deskTitle")}</Link>
    <nav className="flex flex-wrap gap-4 text-sm font-semibold">
      {["coverage", "methodology", "privacy", "guides", "ownership"].map(page => <Link key={page} to="/$locale/$page" params={{ locale: lang, page }} className="hover:text-signal">{t(page)}</Link>)}
      <Link to="/$locale" params={{ locale: lang === "el" ? "en" : "el" }} lang={lang === "el" ? "en" : "el"}>{lang === "el" ? "English" : "Ελληνικά"}</Link>
    </nav>
  </div></header>;
}