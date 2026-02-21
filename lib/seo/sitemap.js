import { SITE_CONFIG, getCanonicalUrl } from "../seo.js";

const ENV = globalThis?.process?.env || {};
export const SITEMAP_CHUNK_SIZE = Number(ENV.SITEMAP_CHUNK_SIZE || 10000);

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
    { path: "/pricing", changefreq: "monthly", priority: 0.8 },
    { path: "/blog", changefreq: "weekly", priority: 0.8 },
    { path: "/contact", changefreq: "monthly", priority: 0.7 },
  ];
  return coreRoutes.map(normalizeEntry);
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
