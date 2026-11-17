import { createFileRoute, notFound } from "@tanstack/react-router";
import { LangProvider } from "@/components/desk/lang";
import { TrustPage, TRUST_PAGES } from "@/components/desk/TrustPage";
import { pageHead } from "@/lib/engine/page-head";
export const Route = createFileRoute("/$locale/$page")({
  loader: ({params}) => {if((params.locale !== "en" && params.locale !== "el") || !TRUST_PAGES.some(p=>p===params.page)) throw notFound(); return {lang:params.locale,page:params.page};},
  head: ({loaderData}) => pageHead(loaderData?.lang === "el" ? "el" : "en",loaderData?.page ?? "ownership"),
  component: LocalizedTrust,
});
function LocalizedTrust() { const {lang,page}=Route.useLoaderData();return <LangProvider key={lang} initialLang={lang === "el" ? "el" : "en"}><TrustPage page={page} /></LangProvider>; }