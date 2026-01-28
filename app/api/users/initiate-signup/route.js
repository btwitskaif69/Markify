import { handleApiRequest } from "@/server/http/adapter";
import { initiateSignup } from "@/server/controllers/user.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, initiateSignup);
}
