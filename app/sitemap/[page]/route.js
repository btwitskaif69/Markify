import { getPseoRouteCount, getPseoRoutes } from "@/lib/pseo";
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

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getAuthorEntries = async () => {
  try {
    const authorGroups = await prisma.blogPost.groupBy({
      by: ["authorId"],
      where: { published: true },
      _max: {
        updatedAt: true,
      },
    });
    if (!authorGroups.length) return [];
    const users = await prisma.user.findMany({
      where: {
        id: { in: authorGroups.map((group) => group.authorId) },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const userNameById = new Map(users.map((user) => [user.id, user.name]));

    return authorGroups
      .map((entry) => {
        const slug = slugify(userNameById.get(entry.authorId) || "");
        if (!slug) return null;
        return toEntry(`/authors/${slug}`, {
          lastModified: entry._max?.updatedAt?.toISOString?.() || undefined,
          changefreq: "weekly",
          priority: 0.5,
        });
      })
      .filter(Boolean);
  } catch (error) {
    console.warn("Sitemap author fetch failed:", error?.message || error);
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
  const authorEntries = await getAuthorEntries();
  const staticList = [...staticEntries, ...blogEntries, ...authorEntries];
  const staticCount = staticList.length;

  const start = pageIndex * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;

  const pseoCount = getPseoRouteCount();
  if (start >= staticCount + pseoCount) {
    return new Response("Not found", { status: 404 });
  }

  let entries = [];
  if (start < staticCount) {
    entries = staticList.slice(start, Math.min(end, staticCount));
  }

  if (end > staticCount) {
    const offset = Math.max(0, start - staticCount);
    const limit = end - Math.max(start, staticCount);
    const pseoRoutes = getPseoRoutes({ offset, limit });
    const pseoEntries = pseoRoutes.map((route) =>
      toEntry(route.path, {
        changefreq: "weekly",
        priority: 0.6,
      })
    );
    entries = entries.concat(pseoEntries);
  }

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
