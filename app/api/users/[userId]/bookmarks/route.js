import { handleApiRequest } from "@/server/http/adapter";
import {
  addBookmark,
  getBookmarksForUser,
} from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getBookmarksForUser, {
    requireAuth: true,
  });
}

export async function POST(request, context) {
  return handleApiRequest(request, context, addBookmark, { requireAuth: true });
}
