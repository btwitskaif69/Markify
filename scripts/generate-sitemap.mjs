import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildSitemapIndexXml,
  buildSitemapPageUrl,
  buildSitemapXml,
  getSitemapEntriesForPage,
  getSitemapPageCount,
} from "../lib/seo/sitemap.js";
import { getAllSitemapEntries } from "../lib/seo/sitemap-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const sitemapDir = path.join(publicDir, "generated-sitemaps");

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const writeFile = async (filePath, contents) => {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, contents, "utf8");
};

const main = async () => {
  const entries = await getAllSitemapEntries();
  const totalUrls = entries.length;
  const totalPages = getSitemapPageCount(totalUrls);

  await ensureDir(sitemapDir);

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const pageEntries = getSitemapEntriesForPage(entries, pageIndex);
    const xml = buildSitemapXml(pageEntries);
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
