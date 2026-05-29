import { getCachedDashboardBootstrap } from "../cache/dashboardCache";

const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

export const getDashboardBootstrap = async (req, res) => {
  try {
    const userId = req.user.id;
    const startedAt = Date.now();

    if (IS_DEVELOPMENT) {
      console.debug("[dashboard/bootstrap] request", {
        userId,
        path: req.originalUrl,
      });
    }

    const snapshot = await getCachedDashboardBootstrap(userId);

    res.set("Cache-Control", "private, max-age=600, stale-while-revalidate=300");
    res.set("Vary", "Authorization");
    res.status(200).json(snapshot);

    if (IS_DEVELOPMENT) {
      console.debug("[dashboard/bootstrap] response", {
        userId,
        bookmarks: snapshot.bookmarks.length,
        collections: snapshot.collections.length,
        durationMs: Date.now() - startedAt,
      });
    }
  } catch (error) {
    console.error("Dashboard bootstrap failed:", error);
    res.status(500).json({ message: "Failed to load dashboard data." });
  }
};
