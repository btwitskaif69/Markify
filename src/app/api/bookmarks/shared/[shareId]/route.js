import { handleApiRequest } from "@/server/http/adapter";
import { getSharedBookmark } from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getSharedBookmark);
}
