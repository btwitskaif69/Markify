import { handleApiRequest } from "@/server/http/adapter";
import { fetchLinkPreview } from "@/server/controllers/preview.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, fetchLinkPreview);
}
