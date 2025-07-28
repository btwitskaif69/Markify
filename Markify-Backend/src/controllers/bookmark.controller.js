// src/controllers/bookmark.controller.js
const prisma = require('../db/prismaClient');

// The function MUST be exported with the name "addBookmark"
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