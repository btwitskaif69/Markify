import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Prerenderer from "@prerenderer/prerenderer";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";
import { FEATURES, getFeaturePath } from "../src/data/features.js";
import { SOLUTIONS, getSolutionPath } from "../src/data/solutions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");

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
  "/privacy",
  "/terms",
  "/cookies",
  "/refund-policy",
  "/cookie-settings",
];

const normalizeRoute = (route) => {
  if (!route) return null;
  return route.startsWith("/") ? route : `/${route}`;
};

const fetchBlogRoutes = async () => {
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
    return posts
      .filter((post) => post?.slug)
      .map((post) => normalizeRoute(`/blog/${post.slug}`))
      .filter(Boolean);
  } catch (error) {
    console.warn("Prerender blog fetch skipped:", error.message);
    return [];
  }
};

const buildRoutes = async () => {
  const solutionRoutes = SOLUTIONS.map((solution) =>
    normalizeRoute(getSolutionPath(solution.slug))
  ).filter(Boolean);
  const featureRoutes = FEATURES.map((feature) =>
    normalizeRoute(getFeaturePath(feature.slug))
  ).filter(Boolean);
  const blogRoutes = await fetchBlogRoutes();

  return Array.from(
    new Set([
      ...STATIC_ROUTES.map(normalizeRoute),
      ...solutionRoutes,
      ...featureRoutes,
      ...blogRoutes,
    ])
  ).filter(Boolean);
};

const ensureDist = async () => {
  try {
    await fs.access(DIST_DIR);
  } catch (error) {
    throw new Error("dist/ not found. Run the Vite build before prerendering.");
  }
};

const ensureChromiumDeps = () => {
  if (process.platform !== "linux") return;
  if (!process.env.VERCEL && !process.env.CI) return;
  if (process.env.SKIP_CHROMIUM_DEPS === "true") return;
  try {
    execSync("command -v apt-get", { stdio: "ignore" });
  } catch (error) {
    console.warn("apt-get not available; skipping Chromium dependency install.");
    return;
  }

  console.log("Installing Chromium system dependencies...");
  execSync("apt-get update", { stdio: "inherit" });
  execSync(
    `apt-get install -y --no-install-recommends ${CHROMIUM_LINUX_DEPS.join(" ")}`,
    { stdio: "inherit" }
  );
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
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

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

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

  ensureChromiumDeps();
  await ensureDist();
  const routes = await buildRoutes();

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
  const serverlessChromium = await resolveServerlessChromium();
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
      maxConcurrentRoutes,
      timeout,
      args,
      launchOptions: Object.keys(launchOptions).length ? launchOptions : undefined,
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
