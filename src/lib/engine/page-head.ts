import { get } from "./i18n";
export function pageHead(lang: "en" | "el", page: string) {
  const title = `${get(lang, page === "checker" ? "deskTitle" : page+"Title")} — ${lang === "el" ? "Οδηγός καταναλωτή" : "Consumer Desk"}`;
  const description = get(lang, page === "checker" ? "deskIntro" : page+"Intro") as string;
  return { meta: [{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}], links: [{rel:"alternate",hrefLang:"en",href:`/en/${page === "checker" ? "" : page}`},{rel:"alternate",hrefLang:"el",href:`/el/${page === "checker" ? "" : page}`} ] };
}