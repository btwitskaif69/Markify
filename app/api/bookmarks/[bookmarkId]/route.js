import { handleApiRequest } from "@/server/http/adapter";
import {
  deleteBookmark,
  updateBookmark,
} from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  return handleApiRequest(request, context, updateBookmark, { requireAuth: true });
}

export async function DELETE(request, context) {
  return handleApiRequest(request, context, deleteBookmark, { requireAuth: true });
}
