const prisma = require('../db/prismaClient');

// GET all collections for the logged-in user
exports.getCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });
    res.status(200).json(collections);
  } catch (error) {
    res.status(500).json({ message: "Failed to get collections." });
  }
};

// POST a new collection
exports.createCollection = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Collection name is required." });
  }
  try {
    const newCollection = await prisma.collection.create({
      data: { name, userId: req.user.id },
    });
    res.status(201).json({ message: 'Collection created', collection: newCollection });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A collection with this name already exists.' });
    }
    res.status(500).json({ message: 'Failed to create collection.' });
  }
};

/**
 * Deletes a collection by its ID.
 */
exports.deleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;

    // Optional: Check if the collection belongs to the user making the request
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.userId !== req.user.id) {
      return res.status(404).json({ message: "Collection not found or you don't have permission." });
    }
    
    // This transaction first unlinks all bookmarks from the collection, then deletes it.
    await prisma.$transaction([
      prisma.bookmark.updateMany({
        where: { collectionId: collectionId },
        data: { collectionId: null },
      }),
      prisma.collection.delete({
        where: { id: collectionId },
      }),
    ]);

    res.status(204).send(); // Success with no content
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ message: "Failed to delete collection." });
  }
};

exports.renameCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { name } = req.body;

    // Optional: Check if the collection belongs to the user
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
    if (!collection || collection.userId !== req.user.id) {
      return res.status(404).json({ message: "Collection not found." });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: { name },
    });

    res.status(200).json({ message: 'Collection renamed', collection: updatedCollection });
  } catch (error) {
    if (error.code === 'P2002') { // Handle if the new name is a duplicate
      return res.status(409).json({ message: 'A collection with this name already exists.' });
    }
    console.error("Error renaming collection:", error);
    res.status(500).json({ message: 'Failed to rename collection.' });
  }
};