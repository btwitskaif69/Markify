import { BLOG_SEO_OVERRIDES } from "@/data/content/blog-seo-overrides";
import { safeParseFrontmatter } from "@/lib/content/frontmatter";

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "to",
  "for",
  "in",
  "on",
  "with",
  "of",
  "your",
  "my",
  "is",
  "are",
  "how",
  "what",
  "why",
  "best",
  "vs",
]);

const normalizeText = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (value = "") => normalizeText(value).split(" ").filter(Boolean);

const clampWords = (value, { min = 40, max = 80 } = {}) => {
  const tokens = words(value);
  if (!tokens.length) return "";
  if (tokens.length > max) return tokens.slice(0, max).join(" ");
  if (tokens.length >= min) return tokens.join(" ");

  const filler =
    "It also explains the tradeoffs, when alternatives make more sense, and the practical steps to implement this approach without adding unnecessary complexity.";
  const output = tokens.concat(words(filler));
  return output.slice(0, max).join(" ");
};

const slugToKeyword = (slug = "") =>
  slug
    .split("-")
    .filter((token) => token && !STOP_WORDS.has(token) && !/^\d{4}$/.test(token))
    .slice(0, 5)
    .join(" ");

const titleToKeywords = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token))
    .slice(0, 8);

const detectIntent = (title = "", slug = "") => {
  const normalized = `${title} ${slug}`.toLowerCase();
  if (/\b(vs|versus|comparison|alternative|alternatives|compare)\b/.test(normalized)) {
    return "comparison";
  }
  if (/^(how|what|why|where|when|who)\b/.test(normalized) || normalized.includes("?")) {
    return "question";
  }
  return "problem";
};

const inferQuestion = (title = "", intent = "problem") => {
  if (!title) return "How can you organize bookmarks without losing context?";
  if (title.endsWith("?")) return title;
  if (intent === "comparison") return `Which option is better: ${title}?`;
  if (/^(how|what|why|where|when|who)\b/i.test(title)) return `${title}?`;
  return `How do you solve ${title.toLowerCase()} effectively?`;
};

const inferTldr = (excerpt = "", title = "") => {
  const normalized = normalizeText(excerpt);
  if (!normalized) {
    return [
      `This guide explains ${title.toLowerCase()} with practical, implementation-first advice.`,
      "Use the checklist and internal links to choose the best next action for your workflow.",
      "Compare alternatives based on effort, speed, and long-term maintainability.",
    ];
  }
  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (sentences.length >= 3) return sentences.slice(0, 3);
  return [
    ...sentences,
    "Use the linked alternatives to compare tradeoffs before committing.",
  ].slice(0, 3);
};

const inferAlternatives = () => [
  {
    name: "Bookmark Workflows by Use Case",
    href: "/use-cases",
    summary: "Explore intent-led workflows and industry-specific templates.",
  },
  {
    name: "Feature Deep Dive",
    href: "/features",
    summary: "See the Markify capabilities referenced across this page.",
  },
  {
    name: "Solutions Library",
    href: "/solutions",
    summary: "Compare solutions for researchers, students, teams, and marketers.",
  },
];

const toIsoDate = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const buildPrimaryKeyword = ({ slug, title }) => {
  const fromSlug = slugToKeyword(slug || "");
  if (fromSlug) return fromSlug;
  const keyword = titleToKeywords(title).slice(0, 4).join(" ");
  return keyword || "bookmark manager guide";
};

export const getBlogContentModel = (post) => {
  if (!post) return null;
  const override = BLOG_SEO_OVERRIDES[post.slug] || {};
  const intent = override.intent || detectIntent(post.title, post.slug);
  const excerpt = normalizeText(post.excerpt || "");
  const question = override.question || inferQuestion(post.title, intent);
  const shortAnswer = clampWords(override.shortAnswer || excerpt || post.title);
  const secondaryKeywords =
    override.secondaryKeywords ||
    titleToKeywords(post.title).slice(0, 5).map((value) => value.replace(/\s+/g, " "));

  const payload = {
    title: post.title,
    description: excerpt || `Read ${post.title} on the Markify blog.`,
    slug: post.slug,
    primaryKeyword: override.primaryKeyword || buildPrimaryKeyword(post),
    secondaryKeywords,
    intent,
    cluster: override.cluster || "bookmark-management",
    hubSlug: override.hubSlug || "/blog",
    lastUpdated: override.lastUpdated || toIsoDate(post.updatedAt || post.createdAt),
    reviewedBy: override.reviewedBy || post.author?.name || "Markify Editorial Team",
    citations: override.citations || [],
    question,
    shortAnswer,
    tldr: override.tldr || inferTldr(excerpt, post.title),
    keyStats: override.keyStats || [],
    alternatives: override.alternatives || inferAlternatives(),
    minWordCount: override.minWordCount || 900,
    uniqueValue:
      override.uniqueValue || [
        "Problem-first summary at the top of the page",
        "Context-aware internal links to product pages and use-case hubs",
        "Citation-ready block and share snippets for distribution",
      ],
  };

  const result = safeParseFrontmatter(payload);
  if (!result.success) {
    console.warn("Invalid blog frontmatter payload:", result.error?.flatten?.());
    return null;
  }
  return result.data;
};

export const getBlogFaqs = (contentModel) => {
  if (!contentModel) return [];
  const question = contentModel.question || "What problem does this page solve?";
  const answer =
    contentModel.shortAnswer ||
    "This page provides a practical answer, implementation details, and links to alternatives.";
  return [
    { question, answer },
    {
      question: "How often is this page reviewed?",
      answer: `This page is reviewed regularly, with the latest update noted as ${contentModel.lastUpdated}.`,
    },
  ];
};

export const getBlogHowToSteps = (post, contentModel) => {
  if (!post || !contentModel) return [];
  if (!/^how\b/i.test(post.title || "")) return [];
  return [
    "Define the outcome and create a dedicated collection for the topic.",
    "Capture, tag, and annotate links with enough context for future retrieval.",
    "Review weekly, remove stale links, and share the best resources with your team.",
  ];
};
