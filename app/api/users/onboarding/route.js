import { handleApiRequest } from "@/server/http/adapter";
import { completeOnboarding } from "@/server/controllers/user.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  return handleApiRequest(request, context, completeOnboarding, {
    requireAuth: true,
  });
}
