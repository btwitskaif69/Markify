import { unstable_cache, revalidateTag } from "next/cache";
import prisma from "../db/prismaClient";
import {
  bookmarkArchiveSummarySelect,
} from "../services/bookmark-archive.service";
import { normalizeBookmarkRecord } from "@/lib/bookmarkCategories";
import { runWithPrismaRetry } from "../db/prismaRetry";

const DASHBOARD_CACHE_PREFIX = "markify-dashboard-bootstrap";
const DASHBOARD_CACHE_REVALIDATE_SECONDS = 10 * 60;
const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

const bookmarkInclude = {
  archive: {
    select: bookmarkArchiveSummarySelect,
  },
};

export const dashboardBootstrapCacheTag = (userId) =>
  `${DASHBOARD_CACHE_PREFIX}:${userId}`;

const loadDashboardBootstrapFromDatabase = async (userId) => {
  if (IS_DEVELOPMENT) {
    console.debug("[dashboard/bootstrap] cache miss compute", { userId });
  }

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

  return {
    bookmarks: bookmarks.map(normalizeBookmarkRecord),
    collections,
  };
};

export const getCachedDashboardBootstrap = async (userId) => {
  if (!userId) {
    return {
      bookmarks: [],
      collections: [],
    };
  }

  const cachedBootstrap = unstable_cache(
    async () => loadDashboardBootstrapFromDatabase(userId),
    [DASHBOARD_CACHE_PREFIX, userId],
    {
      revalidate: DASHBOARD_CACHE_REVALIDATE_SECONDS,
      tags: [dashboardBootstrapCacheTag(userId)],
    }
  );

  return cachedBootstrap();
};

export const invalidateDashboardBootstrapCache = async (userId) => {
  if (!userId) {
    return;
  }

  revalidateTag(dashboardBootstrapCacheTag(userId));
};
