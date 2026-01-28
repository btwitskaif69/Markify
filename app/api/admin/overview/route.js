import { handleApiRequest } from "@/server/http/adapter";
import { getAdminOverview } from "@/server/controllers/admin.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getAdminOverview, {
    requireAuth: true,
    requireAdmin: true,
  });
}
