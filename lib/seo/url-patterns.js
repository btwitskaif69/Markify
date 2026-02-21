const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const URL_PATTERNS = {
  problem: "/problems/[problem-slug]",
  comparison: "/compare/[topic]-vs-[alternative]",
  question: "/questions/[question-slug]",
  programmatic: "/use-cases/[intent]/[industry]",
};

export const buildProblemPath = (problem) => `/problems/${slugify(problem)}`;

export const buildComparisonPath = ({ topic, alternative }) =>
  `/compare/${slugify(topic)}-vs-${slugify(alternative)}`;

export const buildQuestionPath = (question) => `/questions/${slugify(question)}`;

export const buildProgrammaticPath = ({ intent, industry }) =>
  `/use-cases/${slugify(intent)}/${slugify(industry)}`;
