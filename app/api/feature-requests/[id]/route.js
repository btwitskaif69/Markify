import { handleApiRequest } from "@/server/http/adapter";
import { updateFeatureRequestStatus } from "@/server/controllers/feature-request.controller";

export const runtime = "nodejs";

export async function PATCH(request, context) {
  return handleApiRequest(request, context, updateFeatureRequestStatus, {
    requireAuth: true,
    requireAdmin: true,
  });
}
