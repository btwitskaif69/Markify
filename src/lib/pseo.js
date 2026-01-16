import { PSEO_INDUSTRIES, PSEO_INTENTS } from "../data/pseo-data.js";

const DEFAULT_FAQ_COUNT = 4;
const DEFAULT_RELATED_COUNT = 3;
const USE_CASES_BASE_PATH = "/use-cases";

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

export const getPseoIntentBySlug = (slug) =>
  PSEO_INTENTS.find((intent) => intent.slug === normalizeSlug(slug));

export const getPseoIndustryBySlug = (slug) =>
  PSEO_INDUSTRIES.find((industry) => industry.slug === normalizeSlug(slug));

export const getPseoHubPath = () => USE_CASES_BASE_PATH;

export const getPseoIntentPath = (intentSlug) =>
  `${USE_CASES_BASE_PATH}/${intentSlug}`;

export const getPseoDetailPath = (intentSlug, industrySlug) =>
  `${USE_CASES_BASE_PATH}/${intentSlug}/${industrySlug}`;

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

export const getPseoRoutes = ({ limit, offset } = {}) => {
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const parsedLimit = Number(limit);
  const safeLimit = Number.isFinite(parsedLimit) ? parsedLimit : null;
  if (safeLimit !== null && safeLimit <= 0) return [];
  const routes = [];
  let skipped = 0;

  for (const intent of PSEO_INTENTS) {
    for (const industry of PSEO_INDUSTRIES) {
      if (!isCombinationAllowed(intent, industry)) continue;
      if (safeOffset && skipped < safeOffset) {
        skipped += 1;
        continue;
      }
      routes.push({
        intent,
        industry,
        path: getPseoDetailPath(intent.slug, industry.slug),
      });
      if (safeLimit && routes.length >= safeLimit) return routes;
    }
  }

  return routes;
};

const buildKeywords = (intent, industry) => {
  const industryLower = industry.name.toLowerCase();
  const intentLower = intent.title.toLowerCase();
  const combined = [
    `${intent.primaryKeyword} for ${industryLower}`,
    `${industryLower} ${intentLower}`,
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
  ];
  return templates.map((template, index) =>
    formatTemplate(template, {
      industry: industry.name,
      intent: intent.title.toLowerCase(),
      index: seed + index,
    })
  );
};

const buildHero = (intent, industry) => ({
  eyebrow: `${industry.name} use case`,
  heading: `${intent.title} for ${industry.name} teams`,
  subheading: `${intent.description} Built for ${industry.name.toLowerCase()} workflows that need speed, clarity, and shareable context.`,
});

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
  const summary = buildSummary(intent, industry, seed);
  const benefits = buildBenefits(intent, industry, seed);
  const workflow = buildWorkflow(intent, industry, seed);
  const useCases = buildUseCaseExamples(intent, industry);
  const faqs = buildFaqs(intent, industry, seed);
  const keywords = buildKeywords(intent, industry);

  return {
    intent,
    industry,
    path: getPseoDetailPath(intent.slug, industry.slug),
    title: `${intent.title} for ${industry.name} teams`,
    description: `${intent.description} Built for ${industry.name.toLowerCase()} teams that need a clear, searchable source of truth.`,
    hero: buildHero(intent, industry),
    summary,
    benefits,
    workflow,
    useCases,
    faqs,
    keywords,
    related: {
      intents: getRelatedIntents(intent.slug, seed),
      industries: getRelatedIndustries(industry.slug, seed),
    },
    cta: intent.cta || { label: "Start free", href: "/signup" },
  };
};

export const getPseoPageBySlugs = (intentSlug, industrySlug) => {
  const intent = getPseoIntentBySlug(intentSlug);
  const industry = getPseoIndustryBySlug(industrySlug);
  if (!intent || !industry) return null;
  return buildPseoPage({ intent, industry });
};
