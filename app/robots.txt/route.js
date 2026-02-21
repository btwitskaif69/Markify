import { SITE_CONFIG } from "@/lib/seo";

export const runtime = "nodejs";

const DISALLOW_PATHS = [
  "/dashboard/",
  "/admin",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
];

const SEARCH_BOTS = ["Googlebot", "GoogleOther", "Bingbot"];

const buildRules = (userAgent) => {
  const lines = [`User-agent: ${userAgent}`, "Allow: /"];
  DISALLOW_PATHS.forEach((path) => lines.push(`Disallow: ${path}`));
  return lines.join("\n");
};

export async function GET() {
  const sitemapUrl = `${SITE_CONFIG.url}/sitemap.xml`;

  const sections = [
    ...AI_BOTS.map((bot) => buildRules(bot)),
    ...SEARCH_BOTS.map((bot) => buildRules(bot)),
    buildRules("*"),
    `Host: ${SITE_CONFIG.url.replace(/^https?:\/\//, "")}`,
    `Sitemap: ${sitemapUrl}`,
  ];

  return new Response(`${sections.join("\n\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
