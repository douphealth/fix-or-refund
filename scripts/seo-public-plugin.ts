import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv, type Plugin } from "vite";
import { renderLlms, renderRobots, renderSitemap, resolveSiteUrl } from "../src/lib/seo";

/** Refresh the static copies during production build so they match SITE_URL. */
export function seoPublicPlugin(): Plugin {
  let mode = "production";
  let command: "build" | "serve" = "serve";
  return {
    name: "seo-public-files",
    config(_config, env) {
      mode = env.mode;
      command = env.command;
      const loaded = loadEnv(env.mode, process.cwd(), ["VITE_", "SITE_"]);
      const site = loaded["VITE_SITE_URL"] || loaded["SITE_URL"];
      if (!site) return {};
      return {
        define: {
          "import.meta.env.SITE_URL": JSON.stringify(site),
          "import.meta.env.VITE_SITE_URL": JSON.stringify(loaded["VITE_SITE_URL"] || site),
        },
      };
    },
    buildStart() {
      if (command !== "build") return;
      const loaded = loadEnv(mode, process.cwd(), ["VITE_", "SITE_"]);
      const site = resolveSiteUrl(loaded["VITE_SITE_URL"] || loaded["SITE_URL"]);
      const directory = resolve(process.cwd(), "public");
      writeFileSync(resolve(directory, "sitemap.xml"), renderSitemap(site));
      writeFileSync(resolve(directory, "robots.txt"), renderRobots(site));
      writeFileSync(resolve(directory, "llms.txt"), renderLlms(site));
    },
  };
}
