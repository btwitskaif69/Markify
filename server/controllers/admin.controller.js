import prisma from "../db/prismaClient";

const hoursToMs = (hours) => hours * 60 * 60 * 1000;
const daysToMs = (days) => days * 24 * 60 * 60 * 1000;

export const getAdminOverview = async (req, res) => {
  try {
    const now = new Date();
    const since24h = new Date(now.getTime() - hoursToMs(24));
    const since7d = new Date(now.getTime() - daysToMs(7));

    const [
      totalUsers,
      newUsers24h,
      newUsers7d,
      logins24h,
      logins7d,
      pendingReviews,
      totalPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: since24h } } }),
      prisma.user.count({ where: { createdAt: { gte: since7d } } }),
      prisma.user.count({ where: { lastLoginAt: { gte: since24h } } }),
      prisma.user.count({ where: { lastLoginAt: { gte: since7d } } }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.blogPost.count(),
    ]);

    res.status(200).json({
      totals: {
        users: totalUsers,
        posts: totalPosts,
      },
      activity: {
        newUsers24h,
        newUsers7d,
        logins24h,
        logins7d,
      },
      moderation: {
        pendingReviews,
      },
      timeframe: {
        since24h: since24h.toISOString(),
        since7d: since7d.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    res.status(500).json({ message: "Failed to load admin overview." });
  }
};
