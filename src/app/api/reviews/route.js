import { handleApiRequest } from "@/server/http/adapter";
import { createReview, getReviews } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getReviews);
}

export async function POST(request, context) {
  return handleApiRequest(request, context, createReview, { requireAuth: true });
}
