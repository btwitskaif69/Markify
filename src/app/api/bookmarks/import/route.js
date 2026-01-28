import { handleApiRequest } from "@/server/http/adapter";
import { importBookmarks } from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, importBookmarks, {
    requireAuth: true,
  });
}
