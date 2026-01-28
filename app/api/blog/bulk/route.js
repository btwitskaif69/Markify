import { handleApiRequest } from "@/server/http/adapter";
import { bulkUpdatePosts } from "@/server/controllers/blog.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
    return handleApiRequest(request, context, bulkUpdatePosts, {
        requireAuth: true,
        requireAdmin: true,
    });
}
