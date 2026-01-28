import { handleApiRequest } from "@/server/http/adapter";
import { getPendingReviews } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getPendingReviews, {
    requireAuth: true,
    requireAdmin: true,
  });
}
