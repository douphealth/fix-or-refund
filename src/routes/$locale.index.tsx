import { createFileRoute, notFound } from "@tanstack/react-router";
import { LangProvider } from "@/components/desk/lang";
import { DeskPage } from "@/components/desk/DeskPage";
import { pageHead } from "@/lib/engine/page-head";
export const Route = createFileRoute("/$locale/")({
  loader: ({params}) => { if(params.locale !== "en" && params.locale !== "el") throw notFound(); return { lang: params.locale }; },
  head: ({loaderData}) => pageHead(loaderData?.lang === "el" ? "el" : "en", "checker"),
  component: LocaleChecker,
});
function LocaleChecker() { const {lang}=Route.useLoaderData(); return <LangProvider key={lang} initialLang={lang === "el" ? "el" : "en"}><DeskPage /></LangProvider>; }