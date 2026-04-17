import {
  buildSitemapIndexXml,
  buildSitemapPageUrl,
  getSitemapPageCount,
} from "@/lib/seo/sitemap";
import { getAllSitemapEntries } from "@/lib/seo/sitemap-data";

export const runtime = "nodejs";

export async function GET() {
  const entries = await getAllSitemapEntries();
  const totalPages = getSitemapPageCount(entries.length);

  const sitemapUrls = Array.from({ length: totalPages }, (_, index) =>
    buildSitemapPageUrl(index)
  );

  return new Response(buildSitemapIndexXml(sitemapUrls), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
