import { handleApiRequest } from "@/server/http/adapter";
import { getDashboardBootstrap } from "@/server/controllers/dashboard.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getDashboardBootstrap, {
    requireAuth: true,
  });
}
