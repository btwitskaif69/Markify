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
const sitemapDir = path.join(publicDir, "sitemap");

const toEntry = (pathValue, { lastModified, changefreq, priority } = {}) => ({
  url: getCanonicalUrl(pathValue),
  lastModified,
  changefreq,
  priority,
});

const getBlogEntries = async () => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
    return posts.map((post) =>
      toEntry(`/blog/${post.slug}`, {
        lastModified: post.updatedAt?.toISOString?.() || undefined,
        changefreq: "monthly",
        priority: 0.6,
      })
    );
  } catch (error) {
    console.warn("Sitemap blog fetch failed:", error?.message || error);
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
  const pseoCount = getPseoRouteCount();
  const totalUrls = staticEntries.length + blogEntries.length + pseoCount;
  const totalPages = Math.max(1, Math.ceil(totalUrls / SITEMAP_CHUNK_SIZE));

  await ensureDir(sitemapDir);

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const entries = buildPageEntries({
      staticEntries,
      blogEntries,
      pageIndex,
    });
    const xml = buildSitemapXml(entries);
    await writeFile(path.join(sitemapDir, String(pageIndex)), xml);
  }

  const sitemapUrls = Array.from({ length: totalPages }, (_, index) =>
    buildSitemapPageUrl(index)
  );
  const indexXml = buildSitemapIndexXml(sitemapUrls);
  await writeFile(path.join(publicDir, "sitemap.xml"), indexXml);

  console.log("Sitemap generated:");
  console.log(`- ${path.join("public", "sitemap.xml")}`);
  console.log(`- ${path.join("public", "sitemap", "0")}..${totalPages - 1}`);
  console.log(`Total URLs: ${totalUrls}`);
};

main().catch((error) => {
  console.error("Sitemap generation failed:", error);
  process.exit(1);
});
