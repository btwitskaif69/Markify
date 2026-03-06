import { handleApiRequest } from "@/server/http/adapter";
import {
  getBookmarkArchive,
  refreshBookmarkArchive,
} from "@/server/controllers/bookmark.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getBookmarkArchive, {
    requireAuth: true,
  });
}

export async function POST(request, context) {
  return handleApiRequest(request, context, refreshBookmarkArchive, {
    requireAuth: true,
  });
}
