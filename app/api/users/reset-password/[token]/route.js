import { handleApiRequest } from "@/server/http/adapter";
import { resetPassword } from "@/server/controllers/user.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, resetPassword);
}
