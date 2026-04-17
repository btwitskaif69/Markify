import {
  buildSitemapXml,
  getSitemapEntriesForPage,
} from "@/lib/seo/sitemap";
import { getAllSitemapEntries } from "@/lib/seo/sitemap-data";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const pageIndex = Number(resolvedParams?.page);
  if (!Number.isFinite(pageIndex) || pageIndex < 0) {
    return new Response("Not found", { status: 404 });
  }

  const allEntries = await getAllSitemapEntries();
  const entries = getSitemapEntriesForPage(allEntries, pageIndex);

  if (!entries.length) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
