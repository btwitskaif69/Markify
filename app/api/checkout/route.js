import { handleApiRequest } from "@/server/http/adapter";
import { createCheckoutSession } from "@/server/controllers/payment.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, createCheckoutSession, { requireAuth: true });
}
