import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { llmsResponse, robotsResponse, sitemapResponse, utilityNoindex } from "./lib/seo";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

const SEO_FILES: Record<string, () => Response> = {
  "/sitemap.xml": sitemapResponse,
  "/robots.txt": robotsResponse,
  "/llms.txt": llmsResponse,
};

function cleanPathRedirect(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  if (url.pathname.length <= 1 || !url.pathname.endsWith("/")) return null;
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  return new Response(null, {
    status: 301,
    headers: { Location: `${pathname}${url.search}` },
  });
}

function applyUtilityRobots(request: Request, response: Response): Response {
  if (!utilityNoindex(new URL(request.url), response.status)) return response;
  if (response.headers.has("X-Robots-Tag")) return response;
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Hosting compresses every response at the edge. Never compress a body (gzip, brotli,
// CompressionStream) or set content-encoding here or in a server route: the body gets encoded
// twice and renders garbled.
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = cleanPathRedirect(request);
    if (redirect) return redirect;
    const url = new URL(request.url);
    const seoFile = SEO_FILES[url.pathname];
    if (seoFile && url.search.length === 0 && (request.method === "GET" || request.method === "HEAD")) {
      const response = seoFile();
      if (request.method === "HEAD") return new Response(null, { status: response.status, headers: response.headers });
      return response;
    }
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applyUtilityRobots(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applyUtilityRobots(
        request,
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
