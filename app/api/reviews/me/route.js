import { handleApiRequest } from "@/server/http/adapter";
import { getMyReview } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getMyReview, { requireAuth: true });
}
