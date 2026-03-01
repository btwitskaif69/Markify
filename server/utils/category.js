const GENERIC_CATEGORY_VALUES = new Set([
  "",
  "other",
  "others",
  "misc",
  "miscellaneous",
  "general",
  "uncategorized",
  "unknown",
]);

const KEYWORD_RULES = [
  {
    category: "AI",
    keywords: [" ai ", "gpt", "llm", "prompt", "machine learning", "neural", "copilot", "agentic", "automation"],
  },
  {
    category: "Development",
    keywords: ["react", "next.js", "nextjs", "javascript", "typescript", "node", "github", "api", "tailwind", "css", "html", "framework", "library", "developer", "programming", "code"],
  },
  {
    category: "Design",
    keywords: ["ui", "ux", "figma", "design", "dribbble", "behance", "prototype", "typography", "component"],
  },
  {
    category: "Marketing",
    keywords: ["marketing", "seo", "growth", "campaign", "brand", "conversion", "saas", "copywriting", "funnel"],
  },
  {
    category: "Learning",
    keywords: ["tutorial", "course", "docs", "documentation", "guide", "learn", "academy", "lesson"],
  },
  {
    category: "News",
    keywords: ["news", "article", "report", "breaking", "update", "journal", "press"],
  },
  {
    category: "Tools",
    keywords: ["tool", "software", "app", "extension", "platform", "dashboard", "generator", "utility"],
  },
  {
    category: "Business",
    keywords: ["business", "startup", "strategy", "management", "sales", "operations", "enterprise"],
  },
  {
    category: "Finance",
    keywords: ["finance", "invest", "stock", "crypto", "trading", "money", "market"],
  },
  {
    category: "Entertainment",
    keywords: ["video", "movie", "music", "game", "streaming", "entertainment"],
  },
];

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const toTitleCase = (value) =>
  normalizeText(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const tagsToArray = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => normalizeText(tag)).filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags.split(",").map((tag) => normalizeText(tag)).filter(Boolean);
  }
  return [];
};

const extractHostLabel = (url) => {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./i, "");
    if (!hostname) return "";
    const parts = hostname.split(".").filter(Boolean);
    if (parts.length === 0) return "";

    if (
      parts.length >= 3 &&
      ["co", "com", "org", "net", "gov", "edu", "ac"].includes(parts[parts.length - 2])
    ) {
      return parts[parts.length - 3];
    }

    return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
  } catch {
    return "";
  }
};

const scoreKeywords = (content) => {
  let bestCategory = "";
  let bestScore = 0;

  for (const rule of KEYWORD_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (content.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > bestScore) {
      bestCategory = rule.category;
      bestScore = score;
    }
  }

  return bestCategory;
};

export const inferBookmarkCategory = ({ title, description, url, tags }) => {
  const safeTitle = normalizeText(title);
  const safeDescription = normalizeText(description);
  const safeTags = tagsToArray(tags);
  const hostLabel = extractHostLabel(url);

  const searchableText = ` ${safeTitle} ${safeDescription} ${safeTags.join(" ")} ${hostLabel} `.toLowerCase();
  const keywordCategory = scoreKeywords(searchableText);
  if (keywordCategory) return keywordCategory;

  const firstTag = safeTags.find((tag) => !GENERIC_CATEGORY_VALUES.has(tag.toLowerCase()));
  if (firstTag) return toTitleCase(firstTag);

  if (hostLabel && !GENERIC_CATEGORY_VALUES.has(hostLabel.toLowerCase())) {
    return toTitleCase(hostLabel);
  }

  return "Other";
};

export const resolveBookmarkCategory = ({ category, title, description, url, tags }) => {
  const manualCategory = normalizeText(category);
  if (manualCategory && !GENERIC_CATEGORY_VALUES.has(manualCategory.toLowerCase())) {
    return toTitleCase(manualCategory);
  }

  return inferBookmarkCategory({ title, description, url, tags });
};
