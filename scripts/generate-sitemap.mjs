import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_CONFIG, getCanonicalUrl } from "../src/lib/seo.js";
import { FEATURES, getFeaturePath } from "../src/data/features.js";
import { SOLUTIONS, getSolutionPath } from "../src/data/solutions.js";
import {
  getPseoIntentIndex,
  getPseoIntentPath,
  getPseoRoutes,
} from "../src/lib/pseo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");
const SITEMAP_INDEX_PATH = path.join(PUBLIC_DIR, "sitemap-index.xml");
const MAX_URLS_PER_SITEMAP = Number(process.env.SITEMAP_MAX_URLS || 45000);

const d = new Date();
d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
const today = d.toISOString().split("T")[0];

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/solutions", changefreq: "weekly", priority: 0.8 },
  { path: "/features", changefreq: "monthly", priority: 0.8 },
  { path: "/pricing", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.7 },
  { path: "/what-is-markify", changefreq: "monthly", priority: 0.8 },
  { path: "/use-cases", changefreq: "weekly", priority: 0.8 },
  { path: "/privacy", changefreq: "yearly", priority: 0.5 },
  { path: "/terms", changefreq: "yearly", priority: 0.5 },
  { path: "/cookies", changefreq: "yearly", priority: 0.5 },
  { path: "/refund-policy", changefreq: "yearly", priority: 0.5 },
  { path: "/cookie-settings", changefreq: "yearly", priority: 0.4 },
];

const parseNumber = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const buildUrlEntry = ({ path: routePath, changefreq, priority, lastmod }) => {
  const loc = getCanonicalUrl(routePath);
  const date = lastmod || today;
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${date}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    "  </url>",
  ].join("\n");
};

const buildSitemapXml = (routes) => [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(buildUrlEntry),
  "</urlset>",
  "",
].join("\n");

const buildSitemapIndexXml = (files) => {
  const entries = files.map((fileName) => {
    const loc = getCanonicalUrl(`/${fileName}`);
    return [
      "  <sitemap>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      "  </sitemap>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</sitemapindex>",
    "",
  ].join("\n");
};

const normalizeDate = (value) => {
  if (!value) return today;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return today;
  return parsed.toISOString().split("T")[0];
};

const fetchBlogPosts = async () => {
  if (process.env.SKIP_BLOG_SITEMAP === "true") return [];
  const blogApi =
    process.env.SITEMAP_BLOG_API || "https://markify-api.vercel.app/api/blog";
  try {
    const response = await fetch(blogApi);
    if (!response.ok) throw new Error(`Blog fetch failed: ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts)) return [];
    return posts
      .filter((post) => post?.slug && post?.published !== false)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        changefreq: "monthly",
        priority: 0.6,
        lastmod: normalizeDate(post.updatedAt || post.createdAt),
      }));
  } catch (error) {
    console.warn("Sitemap blog fetch skipped:", error.message);
    return [];
  }
};

const cleanupSitemapFiles = async () => {
  let entries = [];
  try {
    entries = await fs.readdir(PUBLIC_DIR);
  } catch (error) {
    return;
  }
  await Promise.all(
    entries
      .filter((file) => file.startsWith("sitemap-") && file.endsWith(".xml"))
      .map((file) => fs.unlink(path.join(PUBLIC_DIR, file)))
  );
};

const writeSitemaps = async (routes) => {
  await cleanupSitemapFiles();
  if (!routes.length) {
    await fs.writeFile(SITEMAP_PATH, buildSitemapXml([]), "utf-8");
    await fs.writeFile(
      SITEMAP_INDEX_PATH,
      buildSitemapIndexXml(["sitemap.xml"]),
      "utf-8"
    );
    return ["sitemap.xml"];
  }

  if (routes.length <= MAX_URLS_PER_SITEMAP) {
    await fs.writeFile(SITEMAP_PATH, buildSitemapXml(routes), "utf-8");
    await fs.writeFile(
      SITEMAP_INDEX_PATH,
      buildSitemapIndexXml(["sitemap.xml"]),
      "utf-8"
    );
    return ["sitemap.xml"];
  }

  const files = [];
  let chunkIndex = 1;
  for (let i = 0; i < routes.length; i += MAX_URLS_PER_SITEMAP) {
    const chunk = routes.slice(i, i + MAX_URLS_PER_SITEMAP);
    const fileName = `sitemap-${chunkIndex}.xml`;
    const filePath = path.join(PUBLIC_DIR, fileName);
    await fs.writeFile(filePath, buildSitemapXml(chunk), "utf-8");
    files.push(fileName);
    chunkIndex += 1;
  }

  await fs.writeFile(
    SITEMAP_INDEX_PATH,
    buildSitemapIndexXml(files),
    "utf-8"
  );
  return files;
};

const generateSitemap = async () => {
  console.log("Starting sitemap generation...");
  const solutionRoutes = SOLUTIONS.map((solution) => ({
    path: getSolutionPath(solution.slug),
    changefreq: "weekly",
    priority: 0.7,
  }));
  const featureRoutes = FEATURES.map((feature) => ({
    path: getFeaturePath(feature.slug),
    changefreq: "monthly",
    priority: 0.6,
  }));
  const pseoIntentRoutes = getPseoIntentIndex().map((intent) => ({
    path: getPseoIntentPath(intent.slug),
    changefreq: "weekly",
    priority: 0.7,
  }));
  const pseoLimit = parseNumber(process.env.PSEO_SITEMAP_LIMIT, null);
  const pseoOffset = parseNumber(process.env.PSEO_SITEMAP_OFFSET, 0);
  const pseoDetailRoutes = getPseoRoutes({
    limit: pseoLimit,
    offset: pseoOffset,
  }).map((route) => ({
    path: route.path,
    changefreq: "monthly",
    priority: 0.6,
  }));
  const blogRoutes = await fetchBlogPosts();

  const allRoutes = [
    ...STATIC_ROUTES,
    ...solutionRoutes,
    ...featureRoutes,
    ...pseoIntentRoutes,
    ...pseoDetailRoutes,
    ...blogRoutes,
  ];

  const files = await writeSitemaps(allRoutes);
  console.log(
    `Sitemap written with ${allRoutes.length} URLs across ${files.length} file(s) for ${SITE_CONFIG.url}`
  );
};

generateSitemap();
