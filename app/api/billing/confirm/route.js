import { handleApiRequest } from "@/server/http/adapter";
import { confirmSubscriptionPurchase } from "@/server/controllers/payment.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, confirmSubscriptionPurchase, {
    requireAuth: true,
  });
}
