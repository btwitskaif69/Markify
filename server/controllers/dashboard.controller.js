import prisma from "../db/prismaClient";
import {
  bookmarkArchiveSummarySelect,
} from "../services/bookmark-archive.service";
import { normalizeBookmarkRecord } from "@/lib/bookmarkCategories";
import { runWithPrismaRetry } from "../db/prismaRetry";

const bookmarkInclude = {
  archive: {
    select: bookmarkArchiveSummarySelect,
  },
};

export const getDashboardBootstrap = async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookmarks, collections] = await Promise.all([
      runWithPrismaRetry(
        () =>
          prisma.bookmark.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: bookmarkInclude,
          }),
        { label: "Dashboard bookmark bootstrap" }
      ),
      runWithPrismaRetry(
        () =>
          prisma.collection.findMany({
            where: { userId },
            orderBy: { name: "asc" },
            include: {
              _count: {
                select: { bookmarks: true },
              },
            },
          }),
        { label: "Dashboard collection bootstrap" }
      ),
    ]);

    res.set("Cache-Control", "no-store, max-age=0");
    res.status(200).json({
      bookmarks: bookmarks.map(normalizeBookmarkRecord),
      collections,
    });
  } catch (error) {
    console.error("Dashboard bootstrap failed:", error);
    res.status(500).json({ message: "Failed to load dashboard data." });
  }
};
