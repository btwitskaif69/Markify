import { getCanonicalUrl } from "@/lib/seo";
import {
  buildSitemapXml,
  getStaticSitemapEntries,
  SITEMAP_CHUNK_SIZE,
} from "@/lib/seo/sitemap";
import prisma from "@/server/db/prismaClient";

export const runtime = "nodejs";

const toEntry = (path, { lastModified, changefreq, priority } = {}) => ({
  url: getCanonicalUrl(path),
  lastModified,
  changefreq,
  priority,
});

const getBlogEntries = async () => {
  try {
    const pageSize = 12;
    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));

    const postEntries = posts.map((post) =>
      toEntry(`/blog/${post.slug}`, {
        lastModified: post.updatedAt?.toISOString?.() || undefined,
        changefreq: "monthly",
        priority: 0.6,
      })
    );

    const archiveEntries = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) =>
      toEntry(`/blog/page/${index + 2}`, {
        changefreq: "weekly",
        priority: 0.4,
      })
    );

    return postEntries.concat(archiveEntries);
  } catch (error) {
    console.warn("Sitemap blog fetch failed:", error?.message || error);
    return [];
  }
};

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const pageIndex = Number(resolvedParams?.page);
  if (!Number.isFinite(pageIndex) || pageIndex < 0) {
    return new Response("Not found", { status: 404 });
  }

  const staticEntries = getStaticSitemapEntries();
  const blogEntries = await getBlogEntries();
  const staticList = [...staticEntries, ...blogEntries];
  const staticCount = staticList.length;

  const start = pageIndex * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;

  if (start >= staticCount) {
    return new Response("Not found", { status: 404 });
  }

  const entries = staticList.slice(start, Math.min(end, staticCount));

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
