import { SITE_CONFIG, getCanonicalUrl } from "../seo.js";
import { FEATURES } from "../../data/features.js";
import { SOLUTIONS } from "../../data/solutions.js";
import { getPseoIntentIndex, getPseoIntentPath } from "../pseo.js";

export const SITEMAP_CHUNK_SIZE = Number(
  process.env.SITEMAP_CHUNK_SIZE || 10000
);

const todayIso = () => new Date().toISOString();

const normalizeEntry = ({ path, lastModified, changefreq, priority }) => ({
  url: getCanonicalUrl(path),
  lastModified: lastModified || todayIso(),
  changefreq,
  priority,
});

export const getStaticSitemapEntries = () => {
  const coreRoutes = [
    { path: "/", changefreq: "daily", priority: 1 },
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

  const featureRoutes = FEATURES.map((feature) => ({
    path: `/features/${feature.slug}`,
    changefreq: "monthly",
    priority: 0.6,
  }));

  const solutionRoutes = SOLUTIONS.map((solution) => ({
    path: `/solutions/${solution.slug}`,
    changefreq: "weekly",
    priority: 0.7,
  }));

  const intentRoutes = getPseoIntentIndex().map((intent) => ({
    path: getPseoIntentPath(intent.slug),
    changefreq: "weekly",
    priority: 0.7,
  }));

  return [
    ...coreRoutes,
    ...featureRoutes,
    ...solutionRoutes,
    ...intentRoutes,
  ].map(normalizeEntry);
};

export const buildSitemapXml = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((entry) => {
    const parts = [
      `<loc>${entry.url}</loc>`,
      entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : "",
      entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : "",
      entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : "",
    ]
      .filter(Boolean)
      .join("");
    return `  <url>${parts}</url>`;
  })
  .join("\n")}
</urlset>`;

export const buildSitemapIndexXml = (sitemapUrls) => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (url) =>
      `  <sitemap><loc>${url}</loc><lastmod>${todayIso()}</lastmod></sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

export const buildSitemapPageUrl = (page) =>
  `${SITE_CONFIG.url}/sitemap/${page}`;
