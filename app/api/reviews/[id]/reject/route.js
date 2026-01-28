import { handleApiRequest } from "@/server/http/adapter";
import { rejectReview } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  return handleApiRequest(request, context, rejectReview, {
    requireAuth: true,
    requireAdmin: true,
  });
}
