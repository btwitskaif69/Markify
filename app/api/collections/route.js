import { handleApiRequest } from "@/server/http/adapter";
import {
  createCollection,
  getCollections,
} from "@/server/controllers/collection.controller";

export const runtime = "nodejs";

export async function GET(request, context) {
  return handleApiRequest(request, context, getCollections, {
    requireAuth: true,
  });
}

export async function POST(request, context) {
  return handleApiRequest(request, context, createCollection, {
    requireAuth: true,
  });
}
