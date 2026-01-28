import { handleApiRequest } from "@/server/http/adapter";
import { approveReview } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  return handleApiRequest(request, context, approveReview, {
    requireAuth: true,
    requireAdmin: true,
  });
}
