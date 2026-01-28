import { handleApiRequest } from "@/server/http/adapter";
import {
  deletePost,
  getPostBySlug,
  updatePost,
} from "@/server/controllers/blog.controller";

export const runtime = "nodejs";

const withPostId = (handler) => (req, res) => {
  req.params = { ...req.params, postId: req.params.slug };
  return handler(req, res);
};

export async function GET(request, context) {
  return handleApiRequest(request, context, getPostBySlug);
}

export async function PATCH(request, context) {
  return handleApiRequest(request, context, withPostId(updatePost), {
    requireAuth: true,
  });
}

export async function DELETE(request, context) {
  return handleApiRequest(request, context, withPostId(deletePost), {
    requireAuth: true,
  });
}
