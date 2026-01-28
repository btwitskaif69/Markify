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
