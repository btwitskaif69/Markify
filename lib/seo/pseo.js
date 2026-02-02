import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoHubPath,
  getPseoIntentPath,
} from "@/lib/pseo";

const ENV = globalThis?.process?.env || {};
const PSEO_NOINDEX_THIN = ENV.PSEO_NOINDEX_THIN === "true";

export const buildPseoMetadata = ({ page, quality, noindex, ...overrides }) => {
  if (!page) {
    return buildMetadata({ noindex, ...overrides });
  }
  const resolvedNoindex =
    typeof noindex === "boolean"
      ? noindex
      : PSEO_NOINDEX_THIN && Boolean(quality?.isThin);
  return buildMetadata({
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description,
    path: page.path,
    keywords: page.keywords,
    noindex: resolvedNoindex,
    ...overrides,
  });
};

export const buildPseoStructuredData = (page) => {
  if (!page) return [];

  const howToSchema = page.checklist?.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `${page.intent.title} workflow checklist for ${page.industry.name} teams`,
        description: page.seo?.description || page.description,
        step: page.checklist.map((step) => ({
          "@type": "HowToStep",
          name: step,
          text: step,
        })),
      }
    : null;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
    { name: page.intent.title, path: getPseoIntentPath(page.intent.slug) },
    { name: page.industry.name, path: page.path },
  ]);

  const faqSchema = buildFaqSchema(page.faqs);
  const relatedItems = [
    ...page.related.intents.map((intent) => ({
      name: `${intent.title} for ${page.industry.name}`,
      path: `/use-cases/${intent.slug}/${page.industry.slug}`,
    })),
    ...page.related.industries.map((industry) => ({
      name: `${page.intent.title} for ${industry.name}`,
      path: `/use-cases/${page.intent.slug}/${industry.slug}`,
    })),
  ];
  const relatedSchema = buildItemListSchema(relatedItems, {
    name: `${page.intent.title} related pages`,
  });
  const webPageSchema = buildWebPageSchema({
    title: page.title,
    description: page.description,
    path: page.path,
    type: "CollectionPage",
  });
  const appSchema = buildWebApplicationSchema({
    description: page.description,
    url: getCanonicalUrl(page.path),
  });

  return [
    webPageSchema,
    appSchema,
    breadcrumbs,
    faqSchema,
    relatedSchema,
    howToSchema,
  ].filter(Boolean);
};
