export const SITE_CONFIG = {
  name: "Markify",
  tagline: "Your Saved Links, Organized",
  url: "https://www.markify.tech",
  defaultTitle: "Your Saved Links, Organized With a Smarter Bookmark Manager | Markify",
  defaultDescription:
    "Keep every link organized in collections, instantly searchable, and always in sync with Markify's clean bookmark manager and one-click browser extension.",
  defaultImage: "https://assets.markify.tech/assets/markify%20og%20image.jpg",
  logo: "https://www.markify.tech/android-chrome-512x512.png",
  twitterHandle: "@markifytech",
  locale: "en_US",
  themeColor: "#0f172a",
  contactEmail: "hello@markify.tech",
  supportEmail: "support@markify.tech",
  socialProfiles: [
    "https://twitter.com/markifytech",
    "https://github.com/btwitskaif69/Markify",
    "https://linkedin.com/company/markifytech",
    "https://instagram.com/markifytech",
    "https://youtube.com/@markifytech",
  ],
  // SEO Keywords for differentiation
  keywords: [
    "bookmark manager",
    "online bookmark organizer",
    "save bookmarks online",
    "bookmark sync",
    "link organizer",
    "browser bookmark manager",
    "bookmark collections",
    "share bookmarks",
  ],
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

export const buildOrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.contactEmail,
    logo: {
      "@type": "ImageObject",
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512,
    },
    image: [SITE_CONFIG.logo],
    sameAs: SITE_CONFIG.socialProfiles,
  };
  const contactEmail = SITE_CONFIG.supportEmail || SITE_CONFIG.contactEmail;
  if (contactEmail) {
    schema.contactPoint = [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contactEmail,
        availableLanguage: ["English"],
        url: SITE_CONFIG.url,
      },
    ];
  }
  return schema;
};

export const buildWebsiteSchema = ({
  includeSearchAction = true,
  searchPath = "/search",
} = {}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  };

  if (includeSearchAction) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}${searchPath}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
};

export const buildWebApplicationSchema = ({
  name = SITE_CONFIG.name,
  description = SITE_CONFIG.defaultDescription,
  url = SITE_CONFIG.url,
  image = SITE_CONFIG.defaultImage,
  applicationCategory = "ProductivityApplication",
  operatingSystem = "All",
  offers,
} = {}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    image: toAbsoluteUrl(image),
    applicationCategory,
    operatingSystem,
  };
  if (offers) {
    schema.offers = offers;
  }
  return schema;
};

export const buildProductSchema = ({
  name,
  description,
  image,
  url,
  price,
  currency = "USD",
  offers,
} = {}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    image: image ? [toAbsoluteUrl(image)] : [SITE_CONFIG.defaultImage],
    brand: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
  };
  if (offers) {
    schema.offers = offers;
  } else if (price !== undefined && price !== null) {
    schema.offers = {
      "@type": "Offer",
      price: String(price),
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      url,
    };
  }
  return schema;
};

export const buildWebPageSchema = ({
  title,
  description,
  path,
  url,
  type = "WebPage",
} = {}) => {
  const resolvedUrl = url || getCanonicalUrl(path || "/");
  return {
    "@context": "https://schema.org",
    "@type": type,
    name: title || SITE_CONFIG.defaultTitle,
    description: description || SITE_CONFIG.defaultDescription,
    url: resolvedUrl,
    isPartOf: {
      "@type": "WebSite",
      url: SITE_CONFIG.url,
    },
  };
};

export const buildArticleSchema = ({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  authorName,
} = {}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: title,
  description,
  image: image ? [image] : undefined,
  datePublished,
  dateModified,
  author: authorName
    ? [
      {
        "@type": "Person",
        name: authorName,
      },
    ]
    : undefined,
  mainEntityOfPage: url
    ? {
      "@type": "WebPage",
      "@id": url,
    }
    : undefined,
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    logo: {
      "@type": "ImageObject",
      url: SITE_CONFIG.logo,
    },
  },
});

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
