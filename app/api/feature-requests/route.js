import { handleApiRequest } from "@/server/http/adapter";
import {
  getFeatureRequests,
  submitFeatureRequest,
} from "@/server/controllers/feature-request.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getFeatureRequests, {
    requireAuth: true,
    requireAdmin: true,
  });
}

export async function POST(request, context) {
  return handleApiRequest(request, context, submitFeatureRequest, { requireAuth: true });
}
