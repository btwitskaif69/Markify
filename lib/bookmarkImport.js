import { FREE_BOOKMARK_LIMIT } from "@/lib/subscription";

const toTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const pluralize = (count, singular, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

const wasWere = (count) => (count === 1 ? "was" : "were");

export const analyzeBookmarkImportBatch = ({
  bookmarks = [],
  existingBookmarks = [],
  remainingSlots = null,
} = {}) => {
  const existingTitles = new Set();
  const existingUrls = new Set();

  for (const bookmark of existingBookmarks) {
    const title = toTrimmedString(bookmark?.title);
    const url = toTrimmedString(bookmark?.url);

    if (title) existingTitles.add(title.toLowerCase());
    if (url) existingUrls.add(url);
  }

  const validBookmarks = [];
  let duplicateCount = 0;
  let invalidCount = 0;

  for (const bookmark of bookmarks) {
    const title = toTrimmedString(bookmark?.title);
    const url = toTrimmedString(bookmark?.url);

    if (!title || !url) {
      invalidCount++;
      continue;
    }

    const titleKey = title.toLowerCase();
    if (existingTitles.has(titleKey) || existingUrls.has(url)) {
      duplicateCount++;
      continue;
    }

    validBookmarks.push({
      ...bookmark,
      title,
      url,
    });

    existingTitles.add(titleKey);
    existingUrls.add(url);
  }

  const hasLimit = remainingSlots !== null && remainingSlots !== undefined;
  const bookmarksToCreate = hasLimit
    ? validBookmarks.slice(0, Math.max(0, remainingSlots))
    : validBookmarks;
  const limitSkippedCount = hasLimit
    ? Math.max(0, validBookmarks.length - bookmarksToCreate.length)
    : 0;

  return {
    bookmarksToCreate,
    createdCount: bookmarksToCreate.length,
    duplicateCount,
    invalidCount,
    limitSkippedCount,
    skippedCount: duplicateCount + invalidCount + limitSkippedCount,
  };
};

export const buildBookmarkImportToastMessage = (
  result = {},
  { freeLimit = FREE_BOOKMARK_LIMIT } = {}
) => {
  const createdCount = Number(result.createdCount) || 0;
  const duplicateCount = Number(result.duplicateCount) || 0;
  const invalidCount = Number(result.invalidCount) || 0;
  const limitSkippedCount = Number(result.limitSkippedCount) || 0;
  const fallbackSkippedCount = Number(result.skippedCount) || 0;
  const resolvedFreeLimit = Number(result.freeLimit) || freeLimit;

  const intro = createdCount > 0
    ? `${pluralize(createdCount, "new bookmark")} imported`
    : "No new bookmarks imported";

  const detailParts = [];

  if (duplicateCount > 0) {
    detailParts.push(`${pluralize(duplicateCount, "duplicate")} ${wasWere(duplicateCount)} skipped`);
  } else if (duplicateCount === 0 && limitSkippedCount === 0 && invalidCount === 0 && fallbackSkippedCount > 0) {
    detailParts.push(`${pluralize(fallbackSkippedCount, "bookmark")} ${wasWere(fallbackSkippedCount)} skipped`);
  }

  if (limitSkippedCount > 0) {
    detailParts.push(
      `${pluralize(limitSkippedCount, "bookmark")} ${wasWere(limitSkippedCount)} not imported because the free plan only allows ${resolvedFreeLimit} bookmarks`
    );
  }

  if (invalidCount > 0) {
    detailParts.push(`${pluralize(invalidCount, "invalid bookmark")} ${wasWere(invalidCount)} ignored`);
  }

  if (detailParts.length === 0) {
    return `${intro}.`;
  }

  return `${intro}. ${detailParts.join(". ")}.`;
};
