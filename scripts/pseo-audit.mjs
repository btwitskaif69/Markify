import {
  buildPseoPage,
  getPseoQualitySignals,
  getPseoRoutes,
  validatePseoData,
} from "../lib/pseo.js";

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");
const minWords = Number(process.env.PSEO_MIN_WORDS || 450);

const toKey = (value) => (value || "").trim().toLowerCase();

const summarizeDuplicates = (map) => {
  const duplicates = [];
  for (const [key, items] of map.entries()) {
    if (items.length > 1) {
      duplicates.push({ key, items });
    }
  }
  return duplicates.sort((a, b) => b.items.length - a.items.length);
};

const main = () => {
  const validation = validatePseoData();
  if (!validation.isValid) {
    console.log("pSEO Data Validation Errors");
    console.log("===========================");
    validation.errors.forEach((error) => console.log(`- ${error}`));
    if (strict) {
      process.exit(1);
    }
  }

  const routes = getPseoRoutes();
  const stats = {
    total: routes.length,
    thin: [],
    missing: [],
  };
  const titleMap = new Map();
  const descriptionMap = new Map();
  const h1Map = new Map();

  for (const route of routes) {
    const page = buildPseoPage(route);
    if (!page) {
      stats.missing.push(route.path);
      continue;
    }

    const quality = getPseoQualitySignals(page);
    if (quality.wordCount < minWords) {
      stats.thin.push({ path: route.path, wordCount: quality.wordCount });
    }

    const titleKey = toKey(page.seo?.title || page.title);
    const descriptionKey = toKey(page.seo?.description || page.description);
    const h1Key = toKey(page.hero?.heading);
    if (titleKey) {
      if (!titleMap.has(titleKey)) titleMap.set(titleKey, []);
      titleMap.get(titleKey).push(route.path);
    }
    if (descriptionKey) {
      if (!descriptionMap.has(descriptionKey)) descriptionMap.set(descriptionKey, []);
      descriptionMap.get(descriptionKey).push(route.path);
    }
    if (h1Key) {
      if (!h1Map.has(h1Key)) h1Map.set(h1Key, []);
      h1Map.get(h1Key).push(route.path);
    }
  }

  const duplicateTitles = summarizeDuplicates(titleMap);
  const duplicateDescriptions = summarizeDuplicates(descriptionMap);
  const duplicateH1s = summarizeDuplicates(h1Map);

  console.log("pSEO Audit Report");
  console.log("=================");
  console.log(`Total pages: ${stats.total}`);
  console.log(`Thin pages (<${minWords} words): ${stats.thin.length}`);
  console.log(`Missing pages: ${stats.missing.length}`);
  console.log(`Duplicate titles: ${duplicateTitles.length}`);
  console.log(`Duplicate descriptions: ${duplicateDescriptions.length}`);
  console.log(`Duplicate H1s: ${duplicateH1s.length}`);

  if (stats.thin.length) {
    console.log("\nThin pages:");
    stats.thin.slice(0, 20).forEach((item) => {
      console.log(`- ${item.path} (${item.wordCount} words)`);
    });
    if (stats.thin.length > 20) {
      console.log(`...and ${stats.thin.length - 20} more`);
    }
  }

  if (duplicateTitles.length) {
    console.log("\nDuplicate titles:");
    duplicateTitles.slice(0, 10).forEach((dup) => {
      console.log(`- "${dup.key}" (${dup.items.length} pages)`);
      console.log(`  ${dup.items.slice(0, 5).join(", ")}`);
    });
  }

  if (duplicateDescriptions.length) {
    console.log("\nDuplicate descriptions:");
    duplicateDescriptions.slice(0, 10).forEach((dup) => {
      console.log(`- "${dup.key}" (${dup.items.length} pages)`);
      console.log(`  ${dup.items.slice(0, 5).join(", ")}`);
    });
  }

  if (duplicateH1s.length) {
    console.log("\nDuplicate H1s:");
    duplicateH1s.slice(0, 10).forEach((dup) => {
      console.log(`- "${dup.key}" (${dup.items.length} pages)`);
      console.log(`  ${dup.items.slice(0, 5).join(", ")}`);
    });
  }

  if (
    strict &&
    (stats.thin.length ||
      duplicateTitles.length ||
      duplicateDescriptions.length ||
      duplicateH1s.length)
  ) {
    process.exit(1);
  }
};

main();
