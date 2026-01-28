import { handleApiRequest } from "@/server/http/adapter";
import {
  deleteCollection,
  renameCollection,
} from "@/server/controllers/collection.controller";

export const runtime = "nodejs";

export async function DELETE(request, context) {
  return handleApiRequest(request, context, deleteCollection, {
    requireAuth: true,
  });
}

export async function PATCH(request, context) {
  return handleApiRequest(request, context, renameCollection, {
    requireAuth: true,
  });
}
