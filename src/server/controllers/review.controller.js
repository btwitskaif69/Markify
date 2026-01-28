import prisma from "../db/prismaClient";

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

        // Check if user already has a review
        const existingReview = await prisma.review.findUnique({
            where: { userId }
        });

        let review;
        if (existingReview) {
            // Update existing review - reset to PENDING for re-approval
            review = await prisma.review.update({
                where: { userId },
                data: {
                    rating,
                    content: content.trim(),
                    status: 'PENDING'  // Reset to pending when updated
                },
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            });
        } else {
            // Create new review with PENDING status
            review = await prisma.review.create({
                data: {
                    rating,
                    content: content.trim(),
                    userId,
                    status: 'PENDING'
                },
                include: {
                    user: {
                        select: { id: true, name: true, avatar: true }
                    }
                }
            });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
};

// Get all APPROVED reviews (public)
const getReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { status: 'APPROVED' },
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

// Get current user's review (includes status)
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

// Get all pending reviews (admin only)
const getPendingReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, avatar: true }
                }
            }
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching pending reviews:', error);
        res.status(500).json({ error: 'Failed to fetch pending reviews' });
    }
};

// Approve a review (admin only)
const approveReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await prisma.review.update({
            where: { id },
            data: { status: 'APPROVED' },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });

        res.status(200).json(review);
    } catch (error) {
        console.error('Error approving review:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(500).json({ error: 'Failed to approve review' });
    }
};

// Reject a review (admin only)
const rejectReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await prisma.review.update({
            where: { id },
            data: { status: 'REJECTED' },
            include: {
                user: {
                    select: { id: true, name: true, avatar: true }
                }
            }
        });

        res.status(200).json(review);
    } catch (error) {
        console.error('Error rejecting review:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(500).json({ error: 'Failed to reject review' });
    }
};

// Get pending reviews count (admin only)
const getPendingCount = async (req, res) => {
    try {
        const count = await prisma.review.count({
            where: { status: 'PENDING' }
        });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching pending count:', error);
        res.status(500).json({ error: 'Failed to fetch pending count' });
    }
};

export {
    createReview,
    getReviews,
    getMyReview,
    getPendingReviews,
    approveReview,
    rejectReview,
    getPendingCount,
};
