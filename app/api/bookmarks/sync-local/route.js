import { handleApiRequest } from "@/server/http/adapter";
import { syncLocalBookmarks } from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, syncLocalBookmarks, {
    requireAuth: true,
  });
}
