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