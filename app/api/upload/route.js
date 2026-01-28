import { handleApiRequest } from "@/server/http/adapter";
import { uploadFile } from "@/server/controllers/upload.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, uploadFile, { requireAuth: true });
}
