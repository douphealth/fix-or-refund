import { get } from "./i18n";
export function pageHead(lang: "en" | "el", page: string) {
  const title = `${get(lang, page === "checker" ? "deskTitle" : page+"Title")} — ${lang === "el" ? "Οδηγός καταναλωτή" : "Consumer Desk"}`;
  const description = get(lang, page === "checker" ? "deskIntro" : page+"Intro") as string;
  return { meta: [{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}], links: (() => { const O = "https://fixorrefund.shop"; const tail = page === "checker" ? "" : `/${page}`; return [{rel:"canonical",href:`${O}/${lang}${tail}`},{rel:"alternate",hrefLang:"en",href:`${O}/en${tail}`},{rel:"alternate",hrefLang:"el",href:`${O}/el${tail}`},{rel:"alternate",hrefLang:"x-default",href:`${O}/en${tail}`}]; })() };
}