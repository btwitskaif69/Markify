import { handleApiRequest } from "@/server/http/adapter";
import { refactorDescription } from "@/server/controllers/gemini.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, refactorDescription, {
    requireAuth: true,
  });
}
