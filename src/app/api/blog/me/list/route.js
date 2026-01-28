import { handleApiRequest } from "@/server/http/adapter";
import { getMyPosts } from "@/server/controllers/blog.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getMyPosts, { requireAuth: true });
}
