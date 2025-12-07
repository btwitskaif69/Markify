const prisma = require('../db/prismaClient');

// Create or update a review for the logged-in user
const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, content } = req.body;

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Review content is required' });
        }

        // Upsert - create or update user's single review
        const review = await prisma.review.upsert({
            where: { userId },
            update: { rating, content: content.trim() },
            create: {
                rating,
                content: content.trim(),
                userId
            },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });

        res.status(200).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get all reviews (public)
const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

// Get current user's review
const getMyReview = async (req, res) => {
    try {
        const userId = req.user.id;

        const review = await prisma.review.findUnique({
            where: { userId }
        });

        res.status(200).json(review);
    } catch (error) {
        console.error('Error fetching user review:', error);
        res.status(500).json({ error: 'Failed to fetch review' });
    }
};

module.exports = {
    createReview,
    getReviews,
    getMyReview
};
