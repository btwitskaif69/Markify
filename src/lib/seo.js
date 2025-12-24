export const SITE_CONFIG = {
  name: "Markify",
  url: "https://www.markify.tech",
  defaultTitle: "Markify",
  defaultDescription:
    "Markify is a smart bookmark manager for collections, fast search, and shareable knowledge.",
  defaultImage: "https://assets.markify.tech/assets/markify%20og%20image.png",
  twitterHandle: "@markify",
  locale: "en_US",
  themeColor: "#0f172a",
};

const normalizePath = (path = "/") => {
  const trimmed = (path || "").trim();
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const getCanonicalUrl = (path = "/") =>
  new URL(normalizePath(path), SITE_CONFIG.url).toString();

export const toAbsoluteUrl = (value) => {
  if (!value) return SITE_CONFIG.defaultImage;
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value, SITE_CONFIG.url).toString();
};

export const getFullTitle = (title, siteName = SITE_CONFIG.name) => {
  if (!title) return SITE_CONFIG.defaultTitle;
  const trimmed = title.trim();
  if (trimmed === siteName) return siteName;
  return `${trimmed} | ${siteName}`;
};

export const buildBreadcrumbSchema = (items = []) => {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path || item.url || "/"),
    })),
  };
};

export const buildItemListSchema = (items = [], options = {}) => {
  if (!items.length) return null;
  const { name = "ItemList" } = options;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: getCanonicalUrl(item.path || item.url || "/"),
    })),
  };
};

export const buildFaqSchema = (items = []) => {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
};
