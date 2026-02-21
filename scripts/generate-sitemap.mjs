import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getCanonicalUrl } from "../lib/seo.js";
import { getPseoRouteCount, getPseoRoutes } from "../lib/pseo.js";
import {
  buildSitemapIndexXml,
  buildSitemapPageUrl,
  buildSitemapXml,
  getStaticSitemapEntries,
  SITEMAP_CHUNK_SIZE,
} from "../lib/seo/sitemap.js";
import prisma from "../server/db/prismaClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sitemapDir = path.join(publicDir, "generated-sitemaps");

const toEntry = (pathValue, { lastModified, changefreq, priority } = {}) => ({
  url: getCanonicalUrl(pathValue),
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

    return authorGroups
      .map((group) => {
        const slug = slugify(userNameById.get(group.authorId) || "");
        if (!slug) return null;
        return toEntry(`/authors/${slug}`, {
          lastModified: group._max?.updatedAt?.toISOString?.() || undefined,
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

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const writeFile = async (filePath, contents) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contents, "utf8");
};

const buildPageEntries = ({ staticEntries, blogEntries, pageIndex }) => {
  const staticList = [...staticEntries, ...blogEntries];
  const staticCount = staticList.length;
  const start = pageIndex * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;

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

  return entries;
};

const main = async () => {
  const staticEntries = getStaticSitemapEntries();
  const blogEntries = await getBlogEntries();
  const authorEntries = await getAuthorEntries();
  const pseoCount = getPseoRouteCount();
  const totalUrls =
    staticEntries.length + blogEntries.length + authorEntries.length + pseoCount;
  const totalPages = Math.max(1, Math.ceil(totalUrls / SITEMAP_CHUNK_SIZE));

  await ensureDir(sitemapDir);

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const entries = buildPageEntries({
      staticEntries,
      blogEntries: blogEntries.concat(authorEntries),
      pageIndex,
    });
    const xml = buildSitemapXml(entries);
    await writeFile(path.join(sitemapDir, String(pageIndex)), xml);
  }

  const sitemapUrls = Array.from({ length: totalPages }, (_, index) =>
    buildSitemapPageUrl(index)
  );
  const indexXml = buildSitemapIndexXml(sitemapUrls);
  await writeFile(path.join(publicDir, "generated-sitemap.xml"), indexXml);

  console.log("Sitemap generated:");
  console.log(`- ${path.join("public", "generated-sitemap.xml")}`);
  console.log(`- ${path.join("public", "generated-sitemaps", "0")}..${totalPages - 1}`);
  console.log(`Total URLs: ${totalUrls}`);
};

main().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exit(1);
});
