import { handleApiRequest } from "@/server/http/adapter";
import { createBillingPortalSession } from "@/server/controllers/payment.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, createBillingPortalSession, {
    requireAuth: true,
  });
}
