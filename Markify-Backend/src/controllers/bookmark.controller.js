const prisma = require('../db/prismaClient');

/**
 * Creates a new bookmark for a specific user.
 */
exports.addBookmark = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, url, description, category, tags, isFavorite } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required.' });
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
      },
    });

    res.status(201).json({ message: 'Bookmark added successfully', bookmark: newBookmark });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Conflict: A bookmark with this title already exists.' });
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

    // This response format is crucial for the frontend to work
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