"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/client/context/AuthContext";
import { toast } from "sonner";

const ISSUE_REPORTS_PER_MONTH = 3;

export function IssueReportDialog({ open, onOpenChange }) {
  const { authFetch, user } = useAuth();
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [steps, setSteps] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSummary("");
      setDetails("");
      setSteps("");
    }
  }, [open]);

  const handleSubmit = async () => {
    const trimmedSummary = summary.trim();
    const trimmedDetails = details.trim();
    const trimmedSteps = steps.trim();

    if (trimmedSummary.length < 3) {
      toast.error("Please add a short issue summary.");
      return;
    }

    if (trimmedDetails.length < 10) {
      toast.error("Please describe what happened in a bit more detail.");
      return;
    }

    if (!user?.id) {
      toast.error("Please sign in again to send an issue report.");
      return;
    }

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const pagePath = typeof window !== "undefined" ? window.location.pathname : "";
    const browserInfo = typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

    setIsSubmitting(true);

    try {
      const response = await authFetch("/api/issue-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedSummary,
          details: trimmedDetails,
          steps: trimmedSteps,
          pagePath,
          pageUrl,
          browser: browserInfo,
          source: "dashboard dropdown",
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        toast.success("Issue reported successfully.", {
          description:
            "Our support team will review your report and work to resolve it as soon as possible.",
        });
        onOpenChange(false);
        return;
      }

      if (response.status === 429) {
        toast.error(
          `You can send up to ${ISSUE_REPORTS_PER_MONTH} issue reports per month.`
        );
        return;
      }

      toast.error(data?.message || data?.error || "Failed to send issue report.");
    } catch (error) {
      console.error("Error submitting issue report:", error);
      toast.error("Failed to send issue report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>
            Tell us what went wrong. You can send up to {ISSUE_REPORTS_PER_MONTH} issue
            reports per month.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="issue-summary">Issue summary</Label>
            <Input
              id="issue-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Example: Bookmark import failed"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-details">What happened?</Label>
            <Textarea
              id="issue-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the problem, error message, or unexpected behavior."
              rows={4}
              maxLength={2000}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-steps">
              Steps to reproduce <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="issue-steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="1. Open dashboard\n2. Click import\n3. ..."
              rows={4}
              maxLength={1500}
              className="resize-none"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Include the error message or the action that failed if you can.
          </p>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 mt-2 sm:space-x-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full border dark:border-white/10 hover:bg-muted/50"
            type="button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#ff6900] hover:bg-[#e55f00] text-white border-0"
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Issue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

IssueReportDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};
