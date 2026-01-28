import { handleApiRequest } from "@/server/http/adapter";
import { submitContactForm } from "@/server/controllers/contact.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, submitContactForm);
}
