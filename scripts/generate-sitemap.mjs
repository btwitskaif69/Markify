import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_CONFIG, getCanonicalUrl } from "../src/lib/seo.js";
import { FEATURES, getFeaturePath } from "../src/data/features.js";
import { SOLUTIONS, getSolutionPath } from "../src/data/solutions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_PATH = path.join(ROOT_DIR, "public", "sitemap.xml");

const today = new Date().toISOString().split("T")[0];

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/about", changefreq: "monthly", priority: 0.8 },
  { path: "/solutions", changefreq: "weekly", priority: 0.8 },
  { path: "/features", changefreq: "monthly", priority: 0.8 },
  { path: "/pricing", changefreq: "monthly", priority: 0.8 },
  { path: "/blog", changefreq: "weekly", priority: 0.8 },
  { path: "/contact", changefreq: "monthly", priority: 0.7 },
  { path: "/what-is-markify", changefreq: "monthly", priority: 0.8 },
  { path: "/privacy", changefreq: "yearly", priority: 0.5 },
  { path: "/terms", changefreq: "yearly", priority: 0.5 },
  { path: "/cookies", changefreq: "yearly", priority: 0.5 },
  { path: "/refund-policy", changefreq: "yearly", priority: 0.5 },
  { path: "/cookie-settings", changefreq: "yearly", priority: 0.4 },
];

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

const generateSitemap = async () => {
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
  const blogRoutes = await fetchBlogPosts();

  const allRoutes = [
    ...STATIC_ROUTES,
    ...solutionRoutes,
    ...featureRoutes,
    ...blogRoutes,
  ];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map(buildUrlEntry),
    "</urlset>",
    "",
  ].join("\n");

  await fs.writeFile(OUTPUT_PATH, xml, "utf-8");
  console.log(`Sitemap written to ${OUTPUT_PATH} for ${SITE_CONFIG.url}`);
};

generateSitemap();
