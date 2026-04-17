import prisma from "../../server/db/prismaClient.js";
import {
  createSitemapEntry,
  dedupeSitemapEntries,
  filterSitemapEntries,
  getStaticSitemapEntries,
  routePatternExists,
} from "./sitemap.js";

const BLOG_PAGE_SIZE = 12;

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getBlogSitemapEntries = async () => {
  try {
    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalPosts / BLOG_PAGE_SIZE));
    const postEntries = posts.map((post) =>
      createSitemapEntry({
        path: `/blog/${post.slug}`,
        lastModified: post.updatedAt?.toISOString?.() || undefined,
        changefreq: "monthly",
        priority: 0.6,
      })
    );
    const archiveEntries = Array.from(
      { length: Math.max(0, totalPages - 1) },
      (_, index) =>
        createSitemapEntry({
          path: `/blog/page/${index + 2}`,
          changefreq: "weekly",
          priority: 0.4,
        })
    );

    return dedupeSitemapEntries(
      filterSitemapEntries(postEntries.concat(archiveEntries))
    );
  } catch (error) {
    console.warn("Sitemap blog fetch failed:", error?.message || error);
    return [];
  }
};

export const getAuthorSitemapEntries = async () => {
  if (!routePatternExists("/authors/[slug]")) {
    return [];
  }

  try {
    const authorGroups = await prisma.blogPost.groupBy({
      by: ["authorId"],
      where: { published: true },
      _max: { updatedAt: true },
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

    return dedupeSitemapEntries(
      filterSitemapEntries(
        authorGroups
          .map((group) => {
            const slug = slugify(userNameById.get(group.authorId) || "");
            if (!slug) return null;

            return createSitemapEntry({
              path: `/authors/${slug}`,
              lastModified: group._max?.updatedAt?.toISOString?.() || undefined,
              changefreq: "weekly",
              priority: 0.5,
            });
          })
          .filter(Boolean)
      )
    );
  } catch (error) {
    console.warn("Sitemap author fetch failed:", error?.message || error);
    return [];
  }
};

export const getAllSitemapEntries = async () => {
  const [blogEntries, authorEntries] = await Promise.all([
    getBlogSitemapEntries(),
    getAuthorSitemapEntries(),
  ]);

  return dedupeSitemapEntries([
    ...getStaticSitemapEntries(),
    ...blogEntries,
    ...authorEntries,
  ]);
};
