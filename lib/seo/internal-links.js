import { FEATURES, getFeaturePath } from "@/data/features";
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";
import { getPseoIntentIndex, getPseoIntentPath } from "@/lib/pseo";

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenize = (value) => normalizeText(value).split(" ").filter(Boolean);

const buildKeywordSet = (values = []) =>
  new Set(values.flatMap((value) => tokenize(value)));

const collectKeywords = (item, extra = []) =>
  buildKeywordSet([
    item?.title,
    item?.slug,
    item?.description,
    ...(item?.keywords || []),
    ...extra,
  ]);

const scoreKeywordOverlap = (item, targetSet, extra = []) => {
  if (!targetSet.size) return 0;
  const itemSet = collectKeywords(item, extra);
  let score = 0;
  itemSet.forEach((token) => {
    if (targetSet.has(token)) score += 1;
  });
  return score;
};

const rankByKeywords = (items, keywords, options = {}) => {
  const { excludeSlugs = [], limit = 3, extra = [] } = options;
  const excludeSet = new Set(excludeSlugs.filter(Boolean));
  const targetSet = buildKeywordSet(keywords);

  const scored = items
    .filter((item) => item?.slug && !excludeSet.has(item.slug))
    .map((item) => ({
      item,
      score: scoreKeywordOverlap(item, targetSet, extra),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item.title.localeCompare(b.item.title);
    });

  const picked = scored.filter((entry) => entry.score > 0).map((entry) => entry.item);
  if (picked.length >= limit) return picked.slice(0, limit);

  const fallback = scored
    .filter((entry) => entry.score === 0)
    .map((entry) => entry.item);

  return picked.concat(fallback).slice(0, limit);
};

const toLink = (item, href) => ({
  label: item.title,
  description: item.description,
  href,
});

export const getRelatedFeatureLinks = (keywords, options = {}) =>
  rankByKeywords(FEATURES, keywords, options).map((feature) =>
    toLink(feature, getFeaturePath(feature.slug))
  );

export const getRelatedSolutionLinks = (keywords, options = {}) =>
  rankByKeywords(SOLUTIONS, keywords, options).map((solution) =>
    toLink(solution, getSolutionPath(solution.slug))
  );

export const getRelatedIntentLinks = (keywords, options = {}) =>
  rankByKeywords(getPseoIntentIndex(), keywords, options).map((intent) =>
    toLink(intent, getPseoIntentPath(intent.slug))
  );

export const buildKeywordContext = (...collections) =>
  collections.flatMap((collection) => (collection ? collection : []));
