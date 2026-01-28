import { handleApiRequest } from "@/server/http/adapter";
import {
  getUserProfile,
  updateUserProfile,
} from "@/server/controllers/user.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getUserProfile, { requireAuth: true });
}

export async function PATCH(request, context) {
  return handleApiRequest(request, context, updateUserProfile, {
    requireAuth: true,
  });
}
