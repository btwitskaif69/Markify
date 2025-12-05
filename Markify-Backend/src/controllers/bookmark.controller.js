const prisma = require('../db/prismaClient');
const fs = require('fs');
const path = require('path');
const os = require('os');
const metascraper = require('metascraper')([
  require('metascraper-image')(),
  require('metascraper-description')(),
  require('metascraper-title')(),
]);
const fetch = require('node-fetch');
const keyword_extractor = require('keyword-extractor');

/**
 * Creates a new bookmark for a specific user.
 */
exports.addBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, url, description, category, tags, isFavorite, previewImage, collectionId } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required.' });
    }

    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        OR: [
          { title: { equals: title, mode: 'insensitive' } },
          { url: url }
        ],
      },
    });

    if (existingBookmark) {
      return res.status(409).json({ message: `A bookmark with this ${existingBookmark.title.toLowerCase() === title.toLowerCase() ? 'title' : 'URL'} already exists.` });
    }

    const newBookmark = await prisma.bookmark.create({
      data: {
        title,
        url,
        description,
        category,
        tags,
        isFavorite,
        userId: userId,
        previewImage,
        collectionId,
      },
    });

    res.status(201).json({ message: 'Bookmark added successfully', bookmark: newBookmark });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A bookmark with this title already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Gets all bookmarks for a specific user.
 */
exports.getBookmarksForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Updates an existing bookmark.
 */
exports.updateBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const updates = req.body;

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: updates,
    });

    res.status(200).json({ message: 'Bookmark updated', bookmark: updatedBookmark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * Deletes a bookmark by its ID.
 */
exports.deleteBookmark = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.exportBookmarks = async (req, res) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      select: {
        title: true,
        previewImage: true,
        url: true,
        description: true,
        category: true,
        tags: true,
        isFavorite: true,
      }
    });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Failed to export bookmarks." });
  }
};

exports.importBookmarks = async (req, res) => {
  try {
    const bookmarksToImport = req.body;

    if (!Array.isArray(bookmarksToImport)) {
      return res.status(400).json({ message: "Invalid file format. An array of bookmarks is expected." });
    }

    const existingBookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      select: { title: true, url: true },
    });
    const existingTitles = new Set(existingBookmarks.map(b => b.title.toLowerCase()));
    const existingUrls = new Set(existingBookmarks.map(b => b.url));

    const newBookmarks = [];

    for (const bookmark of bookmarksToImport) {
      if (
        bookmark.title &&
        bookmark.url &&
        !existingTitles.has(bookmark.title.toLowerCase()) &&
        !existingUrls.has(bookmark.url)
      ) {
        newBookmarks.push(bookmark);
        existingTitles.add(bookmark.title.toLowerCase());
        existingUrls.add(bookmark.url);
      }
    }

    const skippedCount = bookmarksToImport.length - newBookmarks.length;

    if (newBookmarks.length > 0) {
      const dataToCreate = newBookmarks.map(bookmark => ({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description || "",
        category: bookmark.category || "Other",
        tags: bookmark.tags || "",
        isFavorite: bookmark.isFavorite || false,
        userId: req.user.id,
      }));

      await prisma.bookmark.createMany({
        data: dataToCreate,
      });
    }

    res.status(201).json({
      message: `Import complete.`,
      createdCount: newBookmarks.length,
      skippedCount: skippedCount,
    });

  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ message: "Failed to import bookmarks." });
  }
};

/**
 * Syncs bookmarks from local browser - creates bookmarks WITHOUT fetching previews.
 * Returns the list of created bookmark IDs so the frontend can fetch previews one by one.
 */
exports.syncLocalBookmarks = async (req, res) => {
  try {
    const homeDir = os.homedir();
    const edgePath = path.join(homeDir, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Bookmarks');
    const chromePath = path.join(homeDir, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Bookmarks');
    const bravePath = path.join(homeDir, 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Bookmarks');

    let bookmarksFilePath = null;

    if (fs.existsSync(bravePath)) {
      bookmarksFilePath = bravePath;
    } else if (fs.existsSync(edgePath)) {
      bookmarksFilePath = edgePath;
    } else if (fs.existsSync(chromePath)) {
      bookmarksFilePath = chromePath;
    }

    if (!bookmarksFilePath) {
      return res.status(404).json({ message: "No browser bookmarks file found (checked Brave, Edge, and Chrome)." });
    }

    const fileContent = fs.readFileSync(bookmarksFilePath, 'utf8');
    const bookmarksData = JSON.parse(fileContent);

    const bookmarks = [];

    function traverse(node) {
      if (node.type === 'url') {
        bookmarks.push({
          title: node.name,
          url: node.url,
          addDate: node.date_added ? new Date(parseInt(node.date_added) / 10000 - 11644473600000).toISOString() : null,
        });
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    }

    if (bookmarksData.roots) {
      if (bookmarksData.roots.bookmark_bar) traverse(bookmarksData.roots.bookmark_bar);
      if (bookmarksData.roots.other) traverse(bookmarksData.roots.other);
      if (bookmarksData.roots.synced) traverse(bookmarksData.roots.synced);
    }

    if (bookmarks.length === 0) {
      return res.status(200).json({ message: "No bookmarks found in the file.", createdCount: 0, skippedCount: 0, createdIds: [] });
    }

    const existingBookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      select: { title: true, url: true },
    });
    const existingTitles = new Set(existingBookmarks.map(b => b.title.toLowerCase()));
    const existingUrls = new Set(existingBookmarks.map(b => b.url));

    const newBookmarks = [];

    for (const bookmark of bookmarks) {
      if (
        bookmark.title &&
        bookmark.url &&
        !existingTitles.has(bookmark.title.toLowerCase()) &&
        !existingUrls.has(bookmark.url)
      ) {
        newBookmarks.push(bookmark);
        existingTitles.add(bookmark.title.toLowerCase());
        existingUrls.add(bookmark.url);
      }
    }

    const skippedCount = bookmarks.length - newBookmarks.length;
    let createdIds = [];

    if (newBookmarks.length > 0) {
      // Create bookmarks WITHOUT previews (fast)
      const dataToCreate = newBookmarks.map(bookmark => ({
        title: bookmark.title,
        url: bookmark.url,
        description: "",
        category: "Other",
        tags: "imported-browser",
        isFavorite: false,
        userId: req.user.id,
        previewImage: null,
      }));

      // Use createMany and then fetch the created IDs
      await prisma.bookmark.createMany({
        data: dataToCreate,
      });

      // Get the IDs of newly created bookmarks (those without preview images and tagged as imported-browser)
      const createdBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: req.user.id,
          tags: "imported-browser",
          previewImage: null,
        },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: newBookmarks.length,
      });

      createdIds = createdBookmarks.map(b => b.id);
    }

    res.status(201).json({
      message: `Sync complete.`,
      createdCount: newBookmarks.length,
      skippedCount: skippedCount,
      source: bookmarksFilePath.includes('Brave') ? 'Brave' : (bookmarksFilePath.includes('Edge') ? 'Edge' : 'Chrome'),
      createdIds: createdIds, // Frontend will use these to fetch previews one by one
    });

  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Failed to sync local bookmarks." });
  }
};

/**
 * Fetches and updates preview for a single bookmark.
 * Called by the frontend one bookmark at a time after sync.
 */
exports.fetchBookmarkPreview = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const TIMEOUT_MS = 8000;

    // Get the bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found." });
    }

    // Check if user owns this bookmark
    if (bookmark.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized." });
    }

    // Fetch preview
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(bookmark.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const html = await response.text();
        const metadata = await metascraper({ html, url: bookmark.url });

        // Extract keywords/tags from title and description
        const textToAnalyze = `${metadata.title || bookmark.title} ${metadata.description || ''}`;
        const extractedKeywords = keyword_extractor.extract(textToAnalyze, {
          language: "english",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: true,
        });
        // Take top 5 keywords as tags
        const tags = extractedKeywords.slice(0, 5).join(', ');

        // Update the bookmark with preview data and tags
        const updatedBookmark = await prisma.bookmark.update({
          where: { id: bookmarkId },
          data: {
            previewImage: metadata.image || null,
            description: metadata.description || bookmark.description || "",
            tags: tags || "imported",
          },
        });

        return res.status(200).json({
          success: true,
          bookmark: updatedBookmark
        });
      } else {
        return res.status(200).json({
          success: false,
          message: `HTTP ${response.status}`
        });
      }
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      const reason = fetchErr.name === 'AbortError' ? 'timeout' : fetchErr.code || fetchErr.name;
      return res.status(200).json({
        success: false,
        message: reason
      });
    }

  } catch (error) {
    console.error("Preview fetch error:", error);
    res.status(500).json({ message: "Failed to fetch preview." });
  }
};