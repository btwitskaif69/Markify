import { handleApiRequest } from "@/server/http/adapter";
import { getPendingCount } from "@/server/controllers/review.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getPendingCount, {
    requireAuth: true,
    requireAdmin: true,
  });
}
