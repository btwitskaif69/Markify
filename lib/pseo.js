import ReactPkg from "react";
const cache = typeof ReactPkg.cache === "function" ? ReactPkg.cache : (fn) => fn;
import { PSEO_INDUSTRIES, PSEO_INTENTS } from "../data/pseo-data.js";

const ENV = globalThis?.process?.env || {};
const PSEO_CONFIG = {
  minWords: Number(ENV.PSEO_MIN_WORDS || 450),
  defaultFaqCount: 5,
  relatedCount: 3,
  seoDescriptionMax: 158,
};

const DEFAULT_FAQ_COUNT = PSEO_CONFIG.defaultFaqCount;
const DEFAULT_RELATED_COUNT = PSEO_CONFIG.relatedCount;
const USE_CASES_BASE_PATH = "/use-cases";
const INDUSTRIES_BASE_PATH = "/industries";
const MARKIFY_CAPABILITIES = [
  "smart collections",
  "AI-assisted tagging",
  "instant search",
  "shared workspaces",
  "saved views",
  "exportable libraries",
  "role-based sharing",
  "browser extensions",
];
const DEFAULT_TOOL_STACK = [
  "Browser extension capture",
  "Team collections",
  "Tags and filters",
  "Search shortcuts",
  "Shareable links",
  "Exports and backups",
];

const normalizeSlug = (value) => (value || "").toLowerCase().trim();

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const uniqueList = (items) =>
  Array.from(new Set(items.filter((item) => item && item.trim())));

const pickFrom = (items = [], index = 0, fallback = "") => {
  if (!items.length) return fallback;
  return items[index % items.length];
};

const rotateList = (items, offset) => {
  if (!items.length) return [];
  const safeOffset = offset % items.length;
  return items.slice(safeOffset).concat(items.slice(0, safeOffset));
};

const formatTemplate = (template, tokens) =>
  template.replace(/\{(\w+)\}/g, (_, key) => tokens[key] ?? "");

const buildIndex = (items = []) =>
  new Map(items.map((item) => [normalizeSlug(item.slug), item]));

const INTENT_INDEX = buildIndex(PSEO_INTENTS);
const INDUSTRY_INDEX = buildIndex(PSEO_INDUSTRIES);

export const getPseoIntentBySlug = (slug) =>
  INTENT_INDEX.get(normalizeSlug(slug)) || null;

export const getPseoIndustryBySlug = (slug) =>
  INDUSTRY_INDEX.get(normalizeSlug(slug)) || null;

export const getPseoHubPath = () => USE_CASES_BASE_PATH;

export const getPseoIntentPath = (intentSlug) =>
  `${USE_CASES_BASE_PATH}/${intentSlug}`;

export const getPseoDetailPath = (intentSlug, industrySlug) =>
  `${USE_CASES_BASE_PATH}/${intentSlug}/${industrySlug}`;

export const getPseoIndustryHubPath = () => INDUSTRIES_BASE_PATH;

export const getPseoIndustryPath = (industrySlug) =>
  `${INDUSTRIES_BASE_PATH}/${industrySlug}`;

const isCombinationAllowed = (intent, industry) => {
  const excludedIndustries = intent?.excludedIndustries || [];
  const excludedIntents = industry?.excludedIntents || [];
  if (excludedIndustries.includes(industry.slug)) return false;
  if (excludedIntents.includes(intent.slug)) return false;
  return true;
};

export const getPseoIntentIndex = () => PSEO_INTENTS.slice();

export const getPseoIndustryIndex = () => PSEO_INDUSTRIES.slice();

export const getPseoIndustriesForIntent = (intentSlug) => {
  const intent = getPseoIntentBySlug(intentSlug);
  if (!intent) return [];
  return PSEO_INDUSTRIES.filter((industry) =>
    isCombinationAllowed(intent, industry)
  );
};

export const getPseoIntentsForIndustry = (industrySlug) => {
  const industry = getPseoIndustryBySlug(industrySlug);
  if (!industry) return [];
  return PSEO_INTENTS.filter((intent) =>
    isCombinationAllowed(intent, industry)
  );
};

const getPseoPairs = cache(() => {
  const pairs = [];
  for (const intent of PSEO_INTENTS) {
    for (const industry of PSEO_INDUSTRIES) {
      if (!isCombinationAllowed(intent, industry)) continue;
      pairs.push([intent.slug, industry.slug]);
    }
  }
  return pairs;
});

export const getPseoRoutes = ({ limit, offset } = {}) => {
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const parsedLimit = Number(limit);
  const safeLimit = Number.isFinite(parsedLimit) ? parsedLimit : null;
  if (safeLimit !== null && safeLimit <= 0) return [];

  const pairs = getPseoPairs();
  const end = safeLimit ? safeOffset + safeLimit : pairs.length;

  return pairs.slice(safeOffset, end).map(([intentSlug, industrySlug]) => ({
    intent: getPseoIntentBySlug(intentSlug),
    industry: getPseoIndustryBySlug(industrySlug),
    path: getPseoDetailPath(intentSlug, industrySlug),
  }));
};

export const getPseoRouteCount = () => getPseoPairs().length;

export const getPseoStaticParams = ({ limit, offset } = {}) =>
  getPseoRoutes({ limit, offset }).map(({ intent, industry }) => ({
    intent: intent.slug,
    industry: industry.slug,
  }));

const buildKeywords = (intent, industry) => {
  const industryLower = industry.name.toLowerCase();
  const intentLower = intent.title.toLowerCase();
  const combined = [
    `${intent.primaryKeyword} for ${industryLower}`,
    `${industryLower} ${intentLower}`,
    `${intentLower} workflows`,
    `${industryLower} knowledge hub`,
    ...intent.keywords,
    ...industry.keywords,
  ];
  return uniqueList(combined).slice(0, 10);
};

const buildBenefits = (intent, industry, seed) => {
  const benefits = [];
  for (let i = 0; i < 3; i += 1) {
    const outcome = pickFrom(intent.outcomes, seed + i, "Stay organized");
    const painPoint = pickFrom(
      industry.painPoints,
      seed + i,
      "scattered resources"
    );
    benefits.push({
      title: outcome,
      description: `Reduce ${painPoint.toLowerCase()} while keeping ${industry.name} teams focused on ${intent.title.toLowerCase()}.`,
    });
  }
  return benefits;
};

const buildWorkflow = (intent, industry, seed) => {
  const steps = [];
  for (let i = 0; i < intent.workflow.length; i += 1) {
    const step = intent.workflow[i];
    const persona = pickFrom(industry.personas, seed + i, "your team");
    steps.push(`${step} so ${persona} stay aligned.`);
  }
  return steps;
};

const buildUseCaseExamples = (intent, industry) => {
  const combined = uniqueList([
    ...intent.contentTypes,
    ...industry.contentTypes,
  ]);
  return combined.slice(0, 6).map((item) => ({
    title: item,
    description: `Organize ${item} in shared collections built for ${industry.name.toLowerCase()} teams.`,
  }));
};

const buildFaqs = (intent, industry, seed) => {
  const templates = [
    {
      question: "How does Markify help {industry} teams with {intent}?",
      answer:
        "Markify gives {industry} teams a single place to organize {contentType}, tag insights, and share updates for {intent}.",
    },
    {
      question: "Can we share {intent} collections with {persona}?",
      answer:
        "Yes. Create shareable collections so {persona} can access the latest {contentType} without digging through inboxes.",
    },
    {
      question: "What keeps {intent} content from getting outdated?",
      answer:
        "Collections stay easy to update, so {industry} teams can refresh {contentType} and keep workflows current.",
    },
    {
      question: "How does Markify improve {metric} for {industry} teams?",
      answer:
        "Faster search and clear tagging shorten handoffs and help improve {metric} across the team.",
    },
    {
      question: "Is Markify flexible enough for {industry} workflows?",
      answer:
        "Yes. Build collections for every project, tag by goal, and adapt Markify to your {intent} process.",
    },
    {
      question: "How quickly can {industry} teams get started?",
      answer:
        "Most teams set up collections and tags for {intent} in minutes, then scale as new {contentType} and projects arrive.",
    },
  ];

  const faqs = [];
  const tokens = {
    industry: industry.name,
    intent: intent.title.toLowerCase(),
    persona: pickFrom(industry.personas, seed, "your team"),
    contentType: pickFrom(
      [...intent.contentTypes, ...industry.contentTypes],
      seed,
      "key resources"
    ),
    metric: pickFrom(industry.metrics, seed, "team alignment"),
  };

  for (let i = 0; i < DEFAULT_FAQ_COUNT; i += 1) {
    const template = templates[(seed + i) % templates.length];
    faqs.push({
      question: formatTemplate(template.question, tokens),
      answer: formatTemplate(template.answer, tokens),
    });
  }

  return faqs;
};

const buildSummary = (intent, industry, seed) => {
  const templates = [
    "{industry} teams use Markify to keep {intent} resources in one searchable hub so nothing gets lost across tools.",
    "With shared collections and fast search, {industry} organizations keep {intent} work consistent from kickoff to delivery.",
    "Markify keeps {intent} context attached to every link, helping {industry} teams move faster and stay aligned.",
    "From {contentType} to stakeholder updates, Markify gives {industry} teams a reliable system for {intent} that scales with every project.",
  ];
  return templates.map((template, index) =>
    formatTemplate(template, {
      industry: industry.name,
      intent: intent.title.toLowerCase(),
      contentType: pickFrom(
        [...intent.contentTypes, ...industry.contentTypes],
        seed + index,
        "key resources"
      ),
      index: seed + index,
    })
  );
};

const buildHero = (intent, industry) => ({
  eyebrow: `${industry.name} use case`,
  heading: `${intent.title} for ${industry.name} teams`,
  subheading: `${intent.description} Built for ${industry.name.toLowerCase()} workflows that need speed, clarity, and shareable context.`,
});

const truncateToLength = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 80 ? lastSpace : maxLength).trimEnd()}...`;
};

const buildSeoTitle = (intent, industry, seed) => {
  const templates = [
    "{intent} for {industry} teams",
    "{industry} {intent} workflows",
    "{intent} playbook for {industry}",
  ];
  return formatTemplate(templates[seed % templates.length], {
    intent: intent.title,
    industry: industry.name,
  });
};

const buildSeoDescription = (intent, industry, seed) => {
  const templates = [
    "Organize {intent} resources for {industry} teams with fast search, smart collections, and shareable hubs that stay current.",
    "Give {industry} teams a searchable {intent} library with shared collections, tagging, and quick access to the latest {contentType}.",
    "Build a {intent} knowledge hub for {industry} teams with Markify, combining fast search, structured collections, and easy sharing.",
  ];
  const description = formatTemplate(templates[seed % templates.length], {
    intent: intent.title.toLowerCase(),
    industry: industry.name,
    contentType: pickFrom(
      [...intent.contentTypes, ...industry.contentTypes],
      seed,
      "key resources"
    ),
  });
  return truncateToLength(description, PSEO_CONFIG.seoDescriptionMax);
};

const buildOverview = (intent, industry, seed) => {
  const templates = [
    "{industry} teams manage {intent} materials across {contentType} and {contentTypeAlt}. Markify centralizes this work in a searchable workspace so {persona} can move faster without losing context.",
    "Instead of scattered tabs and inboxes, Markify organizes {intent} resources into collections that stay current. {industry} leaders rely on tags, notes, and sharing to keep {metric} on track.",
    "Use Markify to capture {contentType}, align {persona}, and monitor {metric}. Every collection can be shared, updated, and revisited as {intent} priorities evolve.",
  ];
  const tokens = {
    industry: industry.name,
    intent: intent.title.toLowerCase(),
    contentType: pickFrom(
      [...intent.contentTypes, ...industry.contentTypes],
      seed,
      "key resources"
    ),
    contentTypeAlt: pickFrom(
      [...industry.contentTypes, ...intent.contentTypes],
      seed + 1,
      "critical references"
    ),
    persona: pickFrom(industry.personas, seed, "team leads"),
    metric: pickFrom(industry.metrics, seed, "team alignment"),
  };

  return templates.map((template, index) =>
    formatTemplate(template, { ...tokens, index: seed + index })
  );
};

const buildPainPoints = (intent, industry, seed) =>
  rotateList(industry.painPoints, seed).slice(0, 4).map((pain) =>
    `${pain}. Markify keeps ${intent.title.toLowerCase()} resources centralized for ${industry.name.toLowerCase()} teams.`
  );

const buildSuccessSignals = (intent, industry, seed) => {
  const signals = [];
  const metrics = rotateList(industry.metrics, seed).slice(0, 3);
  const outcomes = rotateList(intent.outcomes, seed).slice(0, 3);
  for (let i = 0; i < metrics.length; i += 1) {
    signals.push({
      title: `Improve ${metrics[i]}`,
      description: `${outcomes[i] || outcomes[0]} while keeping ${industry.name} teams focused on ${intent.title.toLowerCase()}.`,
    });
  }
  return signals;
};

const buildChecklist = (intent, industry, seed) => {
  const steps = [
    "Create a dedicated collection for {intent} workstreams.",
    "Save {contentType} with tags for topic, stage, and owner.",
    "Share updates with {persona} on a recurring cadence.",
    "Review collections monthly to refresh {contentTypeAlt}.",
    "Archive outdated links and keep a single source of truth.",
    "Track impact against {metric} goals.",
  ];
  const tokens = {
    intent: intent.title.toLowerCase(),
    contentType: pickFrom(
      [...intent.contentTypes, ...industry.contentTypes],
      seed,
      "critical resources"
    ),
    contentTypeAlt: pickFrom(
      [...industry.contentTypes, ...intent.contentTypes],
      seed + 1,
      "supporting materials"
    ),
    persona: pickFrom(industry.personas, seed, "stakeholders"),
    metric: pickFrom(industry.metrics, seed, "team alignment"),
  };
  return steps.map((step, index) =>
    formatTemplate(step, { ...tokens, index: seed + index })
  );
};

const buildGovernance = (intent, industry, seed) => {
  const templates = [
    "Markify keeps {industry} teams aligned by turning {intent} links into living collections. Assign owners, set tags, and keep notes attached so updates stay discoverable when priorities shift.",
    "Use shared collections and fast search to prevent duplicate research and missed updates. {industry} leaders can monitor {metric} and keep handoffs smooth across teams.",
  ];
  return templates.map((template, index) =>
    formatTemplate(template, {
      industry: industry.name,
      intent: intent.title.toLowerCase(),
      metric: pickFrom(industry.metrics, seed + index, "response time"),
    })
  );
};

const buildToolStack = (intent, industry, seed) => {
  const blended = uniqueList([
    ...DEFAULT_TOOL_STACK,
    ...MARKIFY_CAPABILITIES.map(
      (capability) =>
        `${capability} for ${intent.title.toLowerCase()}`
    ),
  ]);
  return rotateList(blended, seed).slice(0, 6);
};

const getRelatedIntents = (currentSlug, seed) =>
  rotateList(
    PSEO_INTENTS.filter((intent) => intent.slug !== currentSlug),
    seed
  ).slice(0, DEFAULT_RELATED_COUNT);

const getRelatedIndustries = (currentSlug, seed) =>
  rotateList(
    PSEO_INDUSTRIES.filter((industry) => industry.slug !== currentSlug),
    seed
  ).slice(0, DEFAULT_RELATED_COUNT);

export const buildPseoPage = ({ intent, industry }) => {
  if (!intent || !industry) return null;
  if (!isCombinationAllowed(intent, industry)) return null;

  const seed = hashString(`${intent.slug}:${industry.slug}`);
  const seo = {
    title: buildSeoTitle(intent, industry, seed),
    description: buildSeoDescription(intent, industry, seed),
  };
  const summary = buildSummary(intent, industry, seed);
  const overview = buildOverview(intent, industry, seed);
  const benefits = buildBenefits(intent, industry, seed);
  const workflow = buildWorkflow(intent, industry, seed);
  const useCases = buildUseCaseExamples(intent, industry);
  const faqs = buildFaqs(intent, industry, seed);
  const keywords = buildKeywords(intent, industry);
  const painPoints = buildPainPoints(intent, industry, seed);
  const checklist = buildChecklist(intent, industry, seed);
  const governance = buildGovernance(intent, industry, seed);
  const toolStack = buildToolStack(intent, industry, seed);
  const successSignals = buildSuccessSignals(intent, industry, seed);

  return {
    intent,
    industry,
    path: getPseoDetailPath(intent.slug, industry.slug),
    lastUpdated: new Date().toISOString().slice(0, 10),
    title: `${intent.title} for ${industry.name} teams`,
    description: `${intent.description} Built for ${industry.name.toLowerCase()} teams that need a clear, searchable source of truth.`,
    seo,
    hero: buildHero(intent, industry),
    summary,
    overview,
    benefits,
    workflow,
    useCases,
    faqs,
    keywords,
    painPoints,
    checklist,
    governance,
    toolStack,
    successSignals,
    related: {
      intents: getRelatedIntents(intent.slug, seed),
      industries: getRelatedIndustries(industry.slug, seed),
    },
    cta: intent.cta || { label: "Start free", href: "/signup" },
  };
};

export const getPseoPageBySlugs = cache((intentSlug, industrySlug) => {
  const intent = getPseoIntentBySlug(intentSlug);
  const industry = getPseoIndustryBySlug(industrySlug);
  if (!intent || !industry) return null;
  return buildPseoPage({ intent, industry });
});

const collectText = (value, collector) => {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, collector));
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectText(item, collector));
    return;
  }
  collector.push(String(value));
};

const countWords = (text) =>
  text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

export const getPseoQualitySignals = (page) => {
  if (!page) {
    return {
      wordCount: 0,
      isThin: true,
      faqCount: 0,
      checklistCount: 0,
      hasRelatedIntents: false,
      hasRelatedIndustries: false,
      hasUniqueValue: false,
      isLowQuality: true,
    };
  }
  const chunks = [];
  collectText(
    [
      page.title,
      page.description,
      page.hero,
      page.summary,
      page.overview,
      page.benefits,
      page.workflow,
      page.useCases,
      page.faqs,
      page.painPoints,
      page.checklist,
      page.governance,
      page.toolStack,
      page.successSignals,
    ],
    chunks
  );
  const wordCount = countWords(chunks.join(" "));
  const faqCount = page.faqs?.length || 0;
  const checklistCount = page.checklist?.length || 0;
  const hasRelatedIntents = (page.related?.intents?.length || 0) > 0;
  const hasRelatedIndustries = (page.related?.industries?.length || 0) > 0;
  const hasUniqueValue =
    (page.summary?.length || 0) > 1 &&
    (page.overview?.length || 0) > 1 &&
    (page.benefits?.length || 0) > 1;
  const isThin = wordCount < PSEO_CONFIG.minWords;
  const isLowQuality =
    isThin || faqCount < 3 || checklistCount < 3 || !hasRelatedIntents || !hasRelatedIndustries;

  return {
    wordCount,
    isThin,
    faqCount,
    checklistCount,
    hasRelatedIntents,
    hasRelatedIndustries,
    hasUniqueValue,
    isLowQuality,
  };
};

const validateSlugUniqueness = (items = [], label = "items") => {
  const seen = new Map();
  const duplicates = [];
  items.forEach((item) => {
    const key = normalizeSlug(item?.slug);
    if (!key) return;
    if (seen.has(key)) {
      duplicates.push({ slug: key, items: [seen.get(key), item] });
    } else {
      seen.set(key, item);
    }
  });
  return duplicates.length
    ? [`Duplicate ${label} slugs: ${duplicates.map((dup) => dup.slug).join(", ")}`]
    : [];
};

const requireFields = (item, fields = [], label = "item") =>
  fields
    .filter((field) => item?.[field] === undefined || item?.[field] === null)
    .map((field) => `${label} is missing required field: ${field}`);

export const validatePseoData = () => {
  const errors = [];

  errors.push(...validateSlugUniqueness(PSEO_INTENTS, "intent"));
  errors.push(...validateSlugUniqueness(PSEO_INDUSTRIES, "industry"));

  PSEO_INTENTS.forEach((intent) => {
    errors.push(
      ...requireFields(intent, [
        "slug",
        "title",
        "description",
        "primaryKeyword",
        "keywords",
        "outcomes",
        "workflow",
        "contentTypes",
      ], `Intent "${intent?.slug || intent?.title || "unknown"}"`)
    );
  });

  PSEO_INDUSTRIES.forEach((industry) => {
    errors.push(
      ...requireFields(industry, [
        "slug",
        "name",
        "description",
        "personas",
        "painPoints",
        "contentTypes",
        "metrics",
        "keywords",
      ], `Industry "${industry?.slug || industry?.name || "unknown"}"`)
    );
  });

  return {
    errors: errors.filter(Boolean),
    isValid: errors.length === 0,
  };
};
