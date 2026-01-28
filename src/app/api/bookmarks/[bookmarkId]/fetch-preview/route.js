import { handleApiRequest } from "@/server/http/adapter";
import { fetchBookmarkPreview } from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, fetchBookmarkPreview, {
    requireAuth: true,
  });
}
