import { handleApiRequest } from "@/server/http/adapter";
import {
  createPost,
  getPublishedPosts,
} from "@/server/controllers/blog.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getPublishedPosts);
}

export async function POST(request, context) {
  return handleApiRequest(request, context, createPost, {
    requireAuth: true,
    requireAdmin: true,
  });
}
