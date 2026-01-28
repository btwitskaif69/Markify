import { getPseoRouteCount } from "@/lib/pseo";
import {
  buildSitemapIndexXml,
  buildSitemapPageUrl,
  getStaticSitemapEntries,
  SITEMAP_CHUNK_SIZE,
} from "@/lib/seo/sitemap";
import prisma from "@/server/db/prismaClient";

export const runtime = "nodejs";

const getBlogCount = async () => {
  try {
    return await prisma.blogPost.count({ where: { published: true } });
  } catch (error) {
    console.warn("Sitemap blog count failed:", error?.message || error);
    return 0;
  }
};

export async function GET() {
  const staticCount = getStaticSitemapEntries().length;
  const blogCount = await getBlogCount();
  const pseoCount = getPseoRouteCount();
  const totalUrls = staticCount + blogCount + pseoCount;
  const totalPages = Math.max(1, Math.ceil(totalUrls / SITEMAP_CHUNK_SIZE));

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
