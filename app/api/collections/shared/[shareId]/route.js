import { handleApiRequest } from "@/server/http/adapter";
import { getSharedCollection } from "@/server/controllers/collection.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getSharedCollection);
}
