const prisma = require('../db/prismaClient');

/**
 * Creates a new bookmark for a specific user.
 */
exports.addBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    // --- THIS IS THE FIX: Added `collectionId` to the list ---
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
        collectionId, // This now works correctly
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
    const updates = req.body; // This will now include collectionId if it's sent

    const updatedBookmark = await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: updates,
    });
    
    res.status(200).json({ message: 'Bookmark updated', bookmark: updatedBookmark });
  } catch (error) {
    // ... (error handling)
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
      // Exclude user-specific IDs to make the file shareable
      select: {
        title: true,
        previewImage : true,
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

    // 1. Get all existing bookmark titles and URLs for the current user to check for duplicates
    const existingBookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      select: { title: true, url: true },
    });
    const existingTitles = new Set(existingBookmarks.map(b => b.title.toLowerCase()));
    const existingUrls = new Set(existingBookmarks.map(b => b.url));

    // 2. Filter out bookmarks that are duplicates based on title or URL
    const newBookmarks = bookmarksToImport.filter(bookmark => 
      bookmark.title && bookmark.url && // Ensure the bookmark has a title and url
      !existingTitles.has(bookmark.title.toLowerCase()) && 
      !existingUrls.has(bookmark.url)
    );

    const skippedCount = bookmarksToImport.length - newBookmarks.length;

    // 3. Only try to create bookmarks if there are new ones to add
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

    // 4. Send a detailed response back to the frontend
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