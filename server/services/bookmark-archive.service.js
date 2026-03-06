import prisma from "../db/prismaClient";
import { extractMetadataFromHtml } from "../utils/metadata";

const ARCHIVE_TIMEOUT_MS = 12000;
const MAX_TEXT_LENGTH = 120000;
const MAX_EXCERPT_LENGTH = 280;
const PARAGRAPH_BREAK = "\n\n";
const HTML_CONTENT_TYPES = ["text/html", "application/xhtml+xml", "text/plain"];
const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
};

export const bookmarkArchiveSummarySelect = {
  status: true,
  archivedAt: true,
  contentType: true,
  canonicalUrl: true,
  siteName: true,
  author: true,
  publishedAt: true,
  excerpt: true,
  wordCount: true,
  readTimeMinutes: true,
  failureReason: true,
  updatedAt: true,
};

export const bookmarkArchiveDetailSelect = {
  ...bookmarkArchiveSummarySelect,
  textContent: true,
  contentHtml: true,
};

const stripTagContent = (value = "", tagName) =>
  value.replace(new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, "gi"), " ");

const decodeHtmlEntities = (value = "") =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)));

const normalizeWhitespace = (value = "") =>
  decodeHtmlEntities(value)
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, PARAGRAPH_BREAK)
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const extractDocumentSection = (html = "") => {
  const patterns = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
    /<body\b[^>]*>([\s\S]*?)<\/body>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return html;
};

const htmlToPlainText = (html = "") => {
  let value = html.replace(/<!--[\s\S]*?-->/g, " ");

  [
    "script",
    "style",
    "noscript",
    "svg",
    "canvas",
    "iframe",
    "form",
    "nav",
    "aside",
    "footer",
    "header",
    "picture",
    "source",
  ].forEach((tag) => {
    value = stripTagContent(value, tag);
  });

  value = value
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|main|li|ul|ol|blockquote|pre|figure|figcaption|h[1-6]|tr)>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ");

  return normalizeWhitespace(value);
};

const buildSafeArchiveHtml = (textContent = "") => {
  const paragraphs = textContent
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
};

const truncateText = (value = "", maxLength) => {
  if (!value || value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const parsePublishedAt = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildFailurePayload = (message, statusCode, contentType) => ({
  status: "FAILED",
  archivedAt: null,
  sourceStatusCode: typeof statusCode === "number" ? statusCode : null,
  contentType: contentType || null,
  canonicalUrl: null,
  siteName: null,
  author: null,
  publishedAt: null,
  excerpt: null,
  textContent: null,
  contentHtml: null,
  wordCount: null,
  readTimeMinutes: null,
  failureReason: message,
});

const buildArchivePayload = ({ bookmark, html, contentType, statusCode }) => {
  const metadata = extractMetadataFromHtml(html, bookmark.url);
  const candidateHtml = extractDocumentSection(html);
  const extractedText = htmlToPlainText(candidateHtml);
  const fallbackText = normalizeWhitespace(metadata.description || "");
  const textContent = truncateText(extractedText || fallbackText, MAX_TEXT_LENGTH);

  if (!textContent) {
    return buildFailurePayload("No readable page content was found.", statusCode, contentType);
  }

  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const excerpt = truncateText(metadata.description || textContent, MAX_EXCERPT_LENGTH);

  return {
    status: "READY",
    archivedAt: new Date(),
    sourceStatusCode: statusCode,
    contentType,
    canonicalUrl: metadata.url || bookmark.url,
    siteName: metadata.siteName || null,
    author: metadata.author || null,
    publishedAt: parsePublishedAt(metadata.publishedTime),
    excerpt,
    textContent,
    contentHtml: buildSafeArchiveHtml(textContent),
    wordCount,
    readTimeMinutes,
    failureReason: null,
    metadata,
  };
};

const fetchArchiveSource = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ARCHIVE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: REQUEST_HEADERS,
      redirect: "follow",
    });

    const contentTypeHeader = response.headers.get("content-type") || "";
    const contentType = contentTypeHeader.split(";")[0].trim().toLowerCase();

    if (!response.ok) {
      throw Object.assign(new Error(`HTTP ${response.status}`), {
        statusCode: response.status,
        contentType,
      });
    }

    if (contentType && !HTML_CONTENT_TYPES.some((type) => contentType.includes(type))) {
      throw Object.assign(new Error(`Unsupported content type: ${contentType}`), {
        statusCode: response.status,
        contentType,
      });
    }

    return {
      statusCode: response.status,
      contentType: contentType || "text/html",
      html: await response.text(),
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw Object.assign(new Error("Archive request timed out."), {
        statusCode: null,
        contentType: null,
      });
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const buildArchiveUpsert = (bookmarkId, payload) => ({
  where: { bookmarkId },
  update: payload,
  create: {
    bookmarkId,
    ...payload,
  },
  select: bookmarkArchiveSummarySelect,
});

export const getBookmarkArchivePayload = async (bookmarkId, userId) => {
  return prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
    select: {
      id: true,
      title: true,
      url: true,
      description: true,
      previewImage: true,
      archive: {
        select: bookmarkArchiveDetailSelect,
      },
    },
  });
};

export const refreshBookmarkArchiveForBookmark = async (bookmark) => {
  if (!bookmark?.id || !bookmark?.url) {
    throw new Error("Bookmark id and URL are required for archiving.");
  }

  await prisma.bookmarkArchive.upsert({
    where: { bookmarkId: bookmark.id },
    update: {
      status: "PENDING",
      failureReason: null,
      sourceStatusCode: null,
    },
    create: {
      bookmarkId: bookmark.id,
      status: "PENDING",
    },
  });

  try {
    const source = await fetchArchiveSource(bookmark.url);
    const archivePayload = buildArchivePayload({
      bookmark,
      html: source.html,
      contentType: source.contentType,
      statusCode: source.statusCode,
    });

    const archive = await prisma.bookmarkArchive.upsert(
      buildArchiveUpsert(bookmark.id, {
        status: archivePayload.status,
        archivedAt: archivePayload.archivedAt,
        sourceStatusCode: archivePayload.sourceStatusCode,
        contentType: archivePayload.contentType,
        canonicalUrl: archivePayload.canonicalUrl,
        siteName: archivePayload.siteName,
        author: archivePayload.author,
        publishedAt: archivePayload.publishedAt,
        excerpt: archivePayload.excerpt,
        textContent: archivePayload.textContent,
        contentHtml: archivePayload.contentHtml,
        wordCount: archivePayload.wordCount,
        readTimeMinutes: archivePayload.readTimeMinutes,
        failureReason: archivePayload.failureReason,
      })
    );

    const bookmarkUpdates = {};
    if (!bookmark.previewImage && archivePayload.metadata?.image) {
      bookmarkUpdates.previewImage = archivePayload.metadata.image;
    }
    if (!bookmark.description && archivePayload.metadata?.description) {
      bookmarkUpdates.description = archivePayload.metadata.description;
    }

    if (Object.keys(bookmarkUpdates).length > 0) {
      await prisma.bookmark.update({
        where: { id: bookmark.id },
        data: bookmarkUpdates,
      });
    }

    return {
      archive,
      bookmarkUpdates,
    };
  } catch (error) {
    const archive = await prisma.bookmarkArchive.upsert(
      buildArchiveUpsert(
        bookmark.id,
        buildFailurePayload(
          error?.message || "Failed to archive bookmark.",
          error?.statusCode,
          error?.contentType
        )
      )
    );

    return {
      archive,
      bookmarkUpdates: null,
      error,
    };
  }
};
