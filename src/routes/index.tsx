import { createFileRoute } from "@tanstack/react-router";
import { DeskPage } from "@/components/desk/DeskPage";
import { LangProvider } from "@/components/desk/lang";
import { pageHead } from "@/lib/engine/page-head";
export const Route = createFileRoute("/")({
  head: () => pageHead("en", "checker", "/"),
  component: () => (
    <LangProvider>
      <DeskPage />
    </LangProvider>
  ),
});
