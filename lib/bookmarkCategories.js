const CATEGORY_RULES = [
  {
    category: "AI",
    keywords: [
      "ai",
      "gpt",
      "llm",
      "prompt",
      "machine learning",
      "neural",
      "copilot",
      "agent",
      "automation",
      "openai",
      "anthropic",
      "claude",
      "gemini",
      "chatgpt",
      "midjourney",
      "perplexity",
    ],
  },
  {
    category: "Development",
    keywords: [
      "developer",
      "dev",
      "code",
      "coding",
      "programming",
      "software",
      "engineer",
      "engineering",
      "react",
      "next js",
      "javascript",
      "typescript",
      "node",
      "node js",
      "github",
      "gitlab",
      "npm",
      "api",
      "prisma",
      "vercel",
      "tailwind",
      "css",
      "html",
      "framework",
      "library",
    ],
  },
  {
    category: "Design",
    keywords: [
      "ui",
      "ux",
      "figma",
      "design",
      "dribbble",
      "behance",
      "prototype",
      "typography",
      "component",
      "mockup",
      "branding",
      "illustration",
    ],
  },
  {
    category: "Productivity",
    keywords: [
      "productivity",
      "notion",
      "todo",
      "tasks",
      "calendar",
      "planner",
      "organizer",
      "workflow",
      "workspace",
      "slack",
      "teams",
      "zoom",
      "gmail",
      "drive",
      "meet",
      "notes",
    ],
  },
  {
    category: "Business",
    keywords: [
      "business",
      "startup",
      "strategy",
      "management",
      "sales",
      "operations",
      "enterprise",
      "founder",
      "entrepreneur",
      "leadership",
    ],
  },
  {
    category: "Marketing",
    keywords: [
      "marketing",
      "seo",
      "growth",
      "campaign",
      "brand",
      "conversion",
      "funnel",
      "copywriting",
      "ads",
      "advertising",
      "acquisition",
    ],
  },
  {
    category: "Learning",
    keywords: [
      "tutorial",
      "course",
      "docs",
      "documentation",
      "guide",
      "learn",
      "academy",
      "lesson",
      "reference",
      "handbook",
      "training",
      "education",
    ],
  },
  {
    category: "News",
    keywords: [
      "news",
      "article",
      "report",
      "breaking",
      "update",
      "journal",
      "press",
      "blog",
      "media",
    ],
  },
  {
    category: "Tools",
    keywords: [
      "tool",
      "tools",
      "utility",
      "utilities",
      "generator",
      "dashboard",
      "extension",
      "platform",
      "service",
    ],
  },
  {
    category: "Finance",
    keywords: [
      "finance",
      "invest",
      "investing",
      "stock",
      "stocks",
      "crypto",
      "trading",
      "money",
      "banking",
      "wallet",
      "portfolio",
    ],
  },
  {
    category: "Entertainment",
    keywords: [
      "video",
      "movie",
      "movies",
      "music",
      "game",
      "games",
      "streaming",
      "entertainment",
      "twitch",
      "youtube",
      "netflix",
      "spotify",
      "podcast",
      "anime",
    ],
  },
];

export const BOOKMARK_CATEGORY_OPTIONS = [...CATEGORY_RULES.map((rule) => rule.category), "Other"];

const AUTO_INPUT_VALUES = new Set(["", "__auto__", "auto", "automatic"]);
const GENERIC_OTHER_VALUES = new Set([
  "other",
  "others",
  "misc",
  "miscellaneous",
  "general",
  "uncategorized",
  "unknown",
  "unclassified",
]);

const normalizeText = (value = "") => (typeof value === "string" ? value.trim() : "");

const normalizeSearchText = (value = "") =>
  normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const keywordMatches = (content, keyword) => {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) return false;

  if (normalizedKeyword.includes(" ")) {
    return content.includes(normalizedKeyword);
  }

  return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`, "i").test(content);
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

const getBestCategory = (text) => {
  let bestCategory = "";
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (keywordMatches(text, keyword)) {
        score += keyword.includes(" ") ? 2 : 1;
      }
    }

    if (score > bestScore) {
      bestCategory = rule.category;
      bestScore = score;
    }
  }

  return bestCategory;
};

export const normalizeBookmarkCategoryValue = (value, { allowOther = true } = {}) => {
  const normalized = normalizeSearchText(value);
  if (!normalized) return "";

  if (AUTO_INPUT_VALUES.has(normalized)) {
    return "";
  }

  if (GENERIC_OTHER_VALUES.has(normalized)) {
    return allowOther ? "Other" : "";
  }

  const exactMatch = BOOKMARK_CATEGORY_OPTIONS.find(
    (option) => normalizeSearchText(option) === normalized
  );
  if (exactMatch) {
    return exactMatch;
  }

  return getBestCategory(normalized);
};

export const inferBookmarkCategory = ({ title, description, url, tags }) => {
  const searchableText = normalizeSearchText(
    `${normalizeText(title)} ${normalizeText(description)} ${
      Array.isArray(tags) ? tags.join(" ") : normalizeText(tags)
    } ${extractHostLabel(url)}`
  );

  return getBestCategory(searchableText) || "Other";
};

export const resolveBookmarkCategory = ({
  category,
  title,
  description,
  url,
  tags,
  allowOther = true,
}) => {
  const manualCategory = normalizeBookmarkCategoryValue(category, { allowOther });
  if (manualCategory) {
    return manualCategory;
  }

  return inferBookmarkCategory({ title, description, url, tags });
};

export const normalizeBookmarkRecord = (bookmark) => {
  if (!bookmark || typeof bookmark !== "object") {
    return bookmark;
  }

  return {
    ...bookmark,
    category: resolveBookmarkCategory({
      category: bookmark.category,
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url,
      tags: bookmark.tags,
      allowOther: true,
    }),
  };
};
