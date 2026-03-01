/**
 * Parses a Netscape Bookmark HTML string and returns an array of bookmark objects.
 * @param {string} htmlContent - The HTML content of the bookmarks file.
 * @returns {Array<{title: string, url: string, addDate: string, icon: string}>}
 */
export const parseBookmarksHtml = (htmlContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const links = doc.querySelectorAll("a");
  const bookmarks = [];

  links.forEach((link) => {
    const title = link.textContent || "Untitled";
    const url = link.getAttribute("href");
    const addDate = link.getAttribute("add_date");
    const icon = link.getAttribute("icon");

    if (url && url.startsWith("http")) {
      bookmarks.push({
        title,
        url,
        addDate: addDate ? new Date(parseInt(addDate) * 1000).toISOString() : null,
        icon,
        // Default values for Markify
        description: "",
        category: "Other",
        tags: "",
        isFavorite: false,
      });
    }
  });

  return bookmarks;
};

const chromiumDateToIso = (dateAdded) => {
  const raw = Number(dateAdded);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  const unixMs = raw / 1000 - 11644473600000;
  const parsed = new Date(unixMs);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

/**
 * Parses Chromium "Bookmarks" JSON file content (Chrome/Edge/Brave) and returns bookmark objects.
 * @param {string} jsonContent
 * @returns {Array<{title: string, url: string, addDate: string | null, icon: null, description: string, category: string, tags: string, isFavorite: boolean}>}
 */
export const parseChromiumBookmarksJson = (jsonContent) => {
  let parsed;
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    return [];
  }

  if (!parsed?.roots || typeof parsed.roots !== "object") {
    return [];
  }

  const bookmarks = [];

  const traverse = (node, folderPath = []) => {
    if (!node || typeof node !== "object") return;

    if (node.type === "url" && typeof node.url === "string" && node.url.startsWith("http")) {
      const safeTitle = typeof node.name === "string" && node.name.trim() ? node.name.trim() : "Untitled";
      const normalizedPath = folderPath.filter(Boolean);

      bookmarks.push({
        title: safeTitle,
        url: node.url,
        addDate: chromiumDateToIso(node.date_added),
        icon: null,
        description: "",
        category: normalizedPath[0] || "Other",
        tags: normalizedPath.join(", "),
        isFavorite: false,
      });
      return;
    }

    if (!Array.isArray(node.children)) {
      return;
    }

    const isNamedFolder = node.type === "folder" && typeof node.name === "string" && node.name.trim();
    const nextPath = isNamedFolder ? [...folderPath, node.name.trim()] : folderPath;

    for (const child of node.children) {
      traverse(child, nextPath);
    }
  };

  for (const rootNode of Object.values(parsed.roots)) {
    traverse(rootNode, []);
  }

  return bookmarks;
};
