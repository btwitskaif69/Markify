import fs from "node:fs";
import path from "node:path";
import { SITE_CONFIG, getCanonicalUrl } from "../seo.js";

const ENV = globalThis?.process?.env || {};
export const SITEMAP_CHUNK_SIZE = Number(ENV.SITEMAP_CHUNK_SIZE || 10000);
const APP_DIR = path.join(globalThis?.process?.cwd?.() || ".", "app");
const PAGE_FILE_PATTERN = /^page\.(js|jsx|ts|tsx)$/;
const ROUTE_GROUP_PATTERN = /^\(.*\)$/;
const DYNAMIC_SEGMENT_PATTERN = /^\[.+\]$/;
const CATCH_ALL_SEGMENT_PATTERN = /^\[\.\.\..+\]$/;
const OPTIONAL_CATCH_ALL_SEGMENT_PATTERN = /^\[\[\.\.\..+\]\]$/;

const todayIso = () => new Date().toISOString();

const normalizePathname = (value = "/") => {
  let pathname = String(value || "/").trim();

  if (!pathname) return "/";

  if (/^https?:\/\//i.test(pathname)) {
    pathname = new URL(pathname).pathname;
  }

  pathname = pathname.split(/[?#]/, 1)[0] || "/";
  pathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
  }

  return pathname || "/";
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const walkPageFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkPageFiles(absolutePath);
    }

    return PAGE_FILE_PATTERN.test(entry.name) ? [absolutePath] : [];
  });
};

let cachedRoutePatterns = null;
let cachedRouteMatchers = null;

const getRoutePatterns = () => {
  if (cachedRoutePatterns) return cachedRoutePatterns;

  cachedRoutePatterns = walkPageFiles(APP_DIR).map((filePath) => {
    const relativeDir = path.relative(APP_DIR, path.dirname(filePath));
    const segments = relativeDir
      .split(path.sep)
      .filter(Boolean)
      .filter((segment) => !ROUTE_GROUP_PATTERN.test(segment));

    return segments.length ? `/${segments.join("/")}` : "/";
  });

  return cachedRoutePatterns;
};

const buildRouteMatcher = (routePattern) => {
  const normalizedPattern = normalizePathname(routePattern);
  if (normalizedPattern === "/") return /^\/$/;

  const segments = normalizedPattern.split("/").filter(Boolean);
  const regex = segments
    .map((segment) => {
      if (OPTIONAL_CATCH_ALL_SEGMENT_PATTERN.test(segment)) {
        return "(?:/.*)?";
      }

      if (CATCH_ALL_SEGMENT_PATTERN.test(segment)) {
        return "/.+";
      }

      if (DYNAMIC_SEGMENT_PATTERN.test(segment)) {
        return "/[^/]+";
      }

      return `/${escapeRegex(segment)}`;
    })
    .join("");

  return new RegExp(`^${regex}$`);
};

const getRouteMatchers = () => {
  if (cachedRouteMatchers) return cachedRouteMatchers;

  cachedRouteMatchers = getRoutePatterns().map((routePattern) => ({
    matcher: buildRouteMatcher(routePattern),
  }));

  return cachedRouteMatchers;
};

export const routePatternExists = (routePattern) =>
  getRoutePatterns().includes(normalizePathname(routePattern));

export const routeExists = (pathname) => {
  const normalizedPath = normalizePathname(pathname);
  return getRouteMatchers().some(({ matcher }) => matcher.test(normalizedPath));
};

export const createSitemapEntry = ({
  path: entryPath,
  lastModified,
  changefreq,
  priority,
}) => {
  const pathname = normalizePathname(entryPath);

  return {
    path: pathname,
    url: getCanonicalUrl(pathname),
    lastModified: lastModified || todayIso(),
    changefreq,
    priority,
  };
};

export const filterSitemapEntries = (entries = []) =>
  entries.filter((entry) =>
    routeExists(entry?.path || entry?.url || "/")
  );

export const dedupeSitemapEntries = (entries = []) => {
  const seenPaths = new Set();

  return entries.filter((entry) => {
    const pathname = normalizePathname(entry?.path || entry?.url || "/");
    if (seenPaths.has(pathname)) return false;
    seenPaths.add(pathname);
    return true;
  });
};

export const getSitemapPageCount = (entryCount) =>
  Math.max(1, Math.ceil(entryCount / SITEMAP_CHUNK_SIZE));

export const getSitemapEntriesForPage = (entries = [], pageIndex = 0) => {
  const start = pageIndex * SITEMAP_CHUNK_SIZE;
  const end = start + SITEMAP_CHUNK_SIZE;
  return entries.slice(start, end);
};

export const getStaticSitemapEntries = () => {
  const coreRoutes = [
    { path: "/", changefreq: "daily", priority: 1 },
    { path: "/about", changefreq: "monthly", priority: 0.8 },
    { path: "/pricing", changefreq: "monthly", priority: 0.8 },
    { path: "/blog", changefreq: "weekly", priority: 0.8 },
    { path: "/contact", changefreq: "monthly", priority: 0.7 },
  ];

  return dedupeSitemapEntries(
    filterSitemapEntries(
      coreRoutes.map(createSitemapEntry)
    )
  );
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
