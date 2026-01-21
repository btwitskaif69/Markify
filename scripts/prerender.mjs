import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Prerenderer from "@prerenderer/prerenderer";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";
import { FEATURES, getFeaturePath } from "../src/data/features.js";
import { SOLUTIONS, getSolutionPath } from "../src/data/solutions.js";
import {
  getPseoIntentIndex,
  getPseoIntentPath,
  getPseoRoutes,
} from "../src/lib/pseo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const IS_VERCEL = Boolean(process.env.VERCEL);
const ALLOW_MISSING_CHROMIUM_DEPS =
  process.env.PRERENDER_ALLOW_MISSING_DEPS === "true";

const CHROMIUM_LINUX_DEPS = [
  "libasound2",
  "libatk-bridge2.0-0",
  "libatk1.0-0",
  "libcairo2",
  "libcups2",
  "libdbus-1-3",
  "libdrm2",
  "libexpat1",
  "libfontconfig1",
  "libgbm1",
  "libglib2.0-0",
  "libgtk-3-0",
  "libatspi2.0-0",
  "libnspr4",
  "libnss3",
  "libpango-1.0-0",
  "libpangocairo-1.0-0",
  "libx11-6",
  "libx11-xcb1",
  "libxcb1",
  "libxkbcommon0",
  "libxcomposite1",
  "libxcursor1",
  "libxdamage1",
  "libxext6",
  "libxfixes3",
  "libxshmfence1",
  "libxi6",
  "libxrandr2",
  "libxrender1",
  "libxss1",
  "libxtst6",
];

const STATIC_ROUTES = [
  "/",
  "/about",
  "/solutions",
  "/features",
  "/pricing",
  "/blog",
  "/contact",
  "/what-is-markify",
  "/use-cases",
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
  "/cookie-settings",
];
const PRERENDER_READY_EVENT = "markify:prerender-ready";

const normalizeRoute = (route) => {
  if (!route) return null;
  return route.startsWith("/") ? route : `/${route}`;
};

const fetchBlogPosts = async () => {
  if (process.env.SKIP_BLOG_PRERENDER === "true") return [];
  const blogApi =
    process.env.PRERENDER_BLOG_API ||
    process.env.SITEMAP_BLOG_API ||
    "https://markify-api.vercel.app/api/blog";
  try {
    const response = await fetch(blogApi);
    if (!response.ok) {
      throw new Error(`Blog fetch failed: ${response.status}`);
    }
    const posts = await response.json();
    if (!Array.isArray(posts)) return [];
    return posts.filter((post) => post?.slug && post?.published !== false);
  } catch (error) {
    console.warn("Prerender blog fetch skipped:", error.message);
    return [];
  }
};

const buildRoutes = async (blogPosts = []) => {
  const solutionRoutes = SOLUTIONS.map((solution) =>
    normalizeRoute(getSolutionPath(solution.slug))
  ).filter(Boolean);
  const featureRoutes = FEATURES.map((feature) =>
    normalizeRoute(getFeaturePath(feature.slug))
  ).filter(Boolean);
  const pseoIntentRoutes = getPseoIntentIndex()
    .map((intent) => normalizeRoute(getPseoIntentPath(intent.slug)))
    .filter(Boolean);
  const pseoLimit = parseNumber(process.env.PSEO_PRERENDER_LIMIT, 250);
  const pseoOffset = parseNumber(process.env.PSEO_PRERENDER_OFFSET, 0);
  const pseoDetailRoutes = getPseoRoutes({
    limit: pseoLimit,
    offset: pseoOffset,
  })
    .map((route) => normalizeRoute(route.path))
    .filter(Boolean);
  const blogRoutes = blogPosts
    .map((post) => normalizeRoute(`/blog/${post.slug}`))
    .filter(Boolean);

  return Array.from(
    new Set([
      ...STATIC_ROUTES.map(normalizeRoute),
      ...solutionRoutes,
      ...featureRoutes,
      ...pseoIntentRoutes,
      ...pseoDetailRoutes,
      ...blogRoutes,
    ])
  ).filter(Boolean);
};

const getBlogSlug = (route) => {
  const path = (route || "").split("?")[0].split("#")[0];
  const parts = path.split("/").filter(Boolean);
  if (parts[0] !== "blog" || parts.length < 2) return null;
  return parts[1];
};

const buildLatestPosts = (posts, currentId) =>
  posts.filter((post) => post?.id !== currentId).slice(0, 3);

const ensureDist = async () => {
  try {
    await fs.access(DIST_DIR);
  } catch (error) {
    throw new Error("dist/ not found. Run the Vite build before prerendering.");
  }
};

const resolveAptGetPath = async () => {
  const candidates = [
    process.env.APT_GET_PATH,
    "/usr/bin/apt-get",
    "/bin/apt-get",
    "/usr/local/bin/apt-get",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }

  try {
    execSync("apt-get --version", { stdio: "ignore" });
    return "apt-get";
  } catch (error) {
    return null;
  }
};

const ensureChromiumDeps = async ({ allowWithoutDeps = false } = {}) => {
  if (process.platform !== "linux") return true;
  if (!IS_VERCEL && !process.env.CI) return true;
  if (process.env.SKIP_CHROMIUM_DEPS === "true") return true;
  if (allowWithoutDeps) {
    console.log(
      "Skipping Chromium system dependency install (PRERENDER_ALLOW_MISSING_DEPS=true)."
    );
    return true;
  }

  const aptGetPath = await resolveAptGetPath();
  if (!aptGetPath) {
    console.warn("apt-get not available; skipping Chromium dependency install.");
    if (ALLOW_MISSING_CHROMIUM_DEPS) return true;
    return !IS_VERCEL;
  }

  console.log("Installing Chromium system dependencies...");
  const env = { ...process.env, DEBIAN_FRONTEND: "noninteractive" };
  try {
    execSync(`${aptGetPath} update`, { stdio: "inherit", env });
    execSync(
      `${aptGetPath} install -y --no-install-recommends ${CHROMIUM_LINUX_DEPS.join(" ")}`,
      { stdio: "inherit", env }
    );
    return true;
  } catch (error) {
    console.warn("Chromium dependency install failed:", error.message);
    if (ALLOW_MISSING_CHROMIUM_DEPS) return true;
    return !IS_VERCEL;
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

const resolvePuppeteerExecutablePath = async () => {
  try {
    const puppeteerModule = await import("puppeteer");
    const puppeteer = puppeteerModule.default || puppeteerModule;
    if (typeof puppeteer.executablePath !== "function") return null;
    const candidate = puppeteer.executablePath();
    if (candidate && (await fileExists(candidate))) return candidate;
    return null;
  } catch (error) {
    return null;
  }
};

const getChromeExecutableCandidates = (baseDir) => {
  if (process.platform === "win32") {
    return [
      path.join(baseDir, "chrome-win64", "chrome.exe"),
      path.join(baseDir, "chrome-win32", "chrome.exe"),
    ];
  }
  if (process.platform === "darwin") {
    return [
      path.join(
        baseDir,
        "chrome-mac",
        "Chromium.app",
        "Contents",
        "MacOS",
        "Chromium"
      ),
      path.join(
        baseDir,
        "chrome-mac",
        "Google Chrome for Testing.app",
        "Contents",
        "MacOS",
        "Google Chrome for Testing"
      ),
      path.join(baseDir, "chrome-mac", "Chrome.app", "Contents", "MacOS", "Chrome"),
    ];
  }
  return [
    path.join(baseDir, "chrome-linux", "chrome"),
    path.join(baseDir, "chrome-linux64", "chrome"),
  ];
};

const resolveChromeExecutablePath = async () => {
  const explicitPath =
    process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (explicitPath && (await fileExists(explicitPath))) {
    return explicitPath;
  }

  const puppeteerPath = await resolvePuppeteerExecutablePath();
  if (puppeteerPath) return puppeteerPath;

  const cacheDir =
    process.env.PUPPETEER_CACHE_DIR ||
    path.join(os.homedir(), ".cache", "puppeteer");
  const chromeCacheDir = path.join(cacheDir, "chrome");

  let entries = [];
  try {
    entries = await fs.readdir(chromeCacheDir, { withFileTypes: true });
  } catch (error) {
    return null;
  }

  const collator = new Intl.Collator("en", { numeric: true });
  const versions = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(collator.compare)
    .reverse();

  for (const versionDir of versions) {
    const baseDir = path.join(chromeCacheDir, versionDir);
    const candidates = getChromeExecutableCandidates(baseDir);
    for (const candidate of candidates) {
      if (await fileExists(candidate)) {
        return candidate;
      }
    }
  }

  return null;
};

const resolveServerlessChromium = async () => {
  const isServerless =
    process.env.VERCEL ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (!isServerless) return null;

  try {
    const chromiumModule = await import("@sparticuz/chromium");
    const chromium = chromiumModule.default || chromiumModule;
    const executablePath = await chromium.executablePath();
    if (!executablePath) return null;
    return {
      executablePath,
      args: chromium.args || [],
      headless: chromium.headless ?? true,
    };
  } catch (error) {
    console.warn("Serverless Chromium unavailable:", error.message);
    return null;
  }
};

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const resolveHeadlessMode = (value) => {
  if (typeof value === "boolean") return { rendererHeadless: value };
  if (typeof value === "string" && value.length) {
    return { rendererHeadless: true, launchHeadless: value };
  }
  return { rendererHeadless: true };
};

const prerender = async () => {
  if (process.env.SKIP_PRERENDER === "true") {
    console.log("Prerender skipped (SKIP_PRERENDER=true).");
    return;
  }

  const serverlessChromium = await resolveServerlessChromium();
  const depsReady = await ensureChromiumDeps({
    allowWithoutDeps: ALLOW_MISSING_CHROMIUM_DEPS,
  });
  if (!depsReady) {
    console.warn(
      "Skipping prerender because Chromium dependencies are unavailable in this environment."
    );
    return;
  }
  await ensureDist();
  const blogPosts = await fetchBlogPosts();
  const blogPostMap = new Map(
    blogPosts.map((post) => [post.slug, post]).filter(([slug]) => slug)
  );
  const routes = await buildRoutes(blogPosts);

  if (!routes.length) {
    console.log("No routes to prerender.");
    return;
  }

  const renderAfterTime = parseNumber(
    process.env.PRERENDER_RENDER_AFTER_TIME_MS,
    5000
  );
  const maxConcurrentRoutes = parseNumber(
    process.env.PRERENDER_MAX_CONCURRENCY,
    4
  );
  const timeout = parseNumber(process.env.PRERENDER_TIMEOUT_MS, 60000);
  const executablePath = await resolveChromeExecutablePath();
  const fallbackArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
  const args = serverlessChromium?.args?.length
    ? Array.from(new Set([...serverlessChromium.args, ...fallbackArgs]))
    : fallbackArgs;
  const headlessConfig = resolveHeadlessMode(serverlessChromium?.headless);
  const launchOptions = {};
  if (serverlessChromium?.executablePath) {
    launchOptions.executablePath = serverlessChromium.executablePath;
  } else if (executablePath) {
    launchOptions.executablePath = executablePath;
  }
  if (headlessConfig.launchHeadless) {
    launchOptions.headless = headlessConfig.launchHeadless;
  }

  const prerenderer = new Prerenderer({
    staticDir: DIST_DIR,
    renderer: new PuppeteerRenderer({
      headless: headlessConfig.rendererHeadless,
      renderAfterTime,
      renderAfterDocumentEvent: PRERENDER_READY_EVENT,
      maxConcurrentRoutes,
      timeout,
      args,
      launchOptions: Object.keys(launchOptions).length ? launchOptions : undefined,
      pageSetup: async (page, route) => {
        await page.evaluateOnNewDocument(() => {
          window.__PRERENDER_STATUS = true;
        });
        if (!blogPosts.length) return;
        const normalizedRoute = (route || "").split("?")[0].split("#")[0];
        if (normalizedRoute === "/blog") {
          await page.evaluateOnNewDocument((payload) => {
            window.__PRERENDER_BLOG_LIST__ = payload;
          }, blogPosts);
          return;
        }
        const slug = getBlogSlug(normalizedRoute);
        if (!slug) return;
        const post = blogPostMap.get(slug);
        if (!post) return;
        const latestPosts = buildLatestPosts(blogPosts, post.id);
        await page.evaluateOnNewDocument((payload) => {
          window.__PRERENDER_BLOG_POST__ = payload.post;
          window.__PRERENDER_BLOG_LATEST__ = payload.latest;
        }, { post, latest: latestPosts });
      },
    }),
  });

  await prerenderer.initialize();
  const renderedRoutes = await prerenderer.renderRoutes(routes);

  const written = await Promise.all(
    renderedRoutes.map(async (rendered) => {
      if (!rendered || !rendered.html) return false;
      const routePath = rendered.route || rendered.originalRoute || "/";
      const normalizedRoute = routePath.split("?")[0].split("#")[0];
      const outputPath = path.join(
        DIST_DIR,
        normalizedRoute.replace(/^\/+/, ""),
        "index.html"
      );
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, rendered.html, "utf-8");
      return true;
    })
  );
  await prerenderer.destroy();

  const writtenCount = written.filter(Boolean).length;
  console.log(
    `Prerendered ${renderedRoutes.length} routes and wrote ${writtenCount} HTML files.`
  );
};

prerender().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
