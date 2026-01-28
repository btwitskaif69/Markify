import { handleApiRequest } from "@/server/http/adapter";
import { toggleShareCollection } from "@/server/controllers/collection.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, toggleShareCollection, {
    requireAuth: true,
  });
}
