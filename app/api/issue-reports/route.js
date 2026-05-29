import { handleApiRequest } from "@/server/http/adapter";
import { submitIssueReport } from "@/server/controllers/issue-report.controller";

export const runtime = "nodejs";

export async function POST(request, context) {
  return handleApiRequest(request, context, submitIssueReport, {
    requireAuth: true,
  });
}
