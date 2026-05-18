"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { useAuth } from "@/client/context/AuthContext";
import { toast } from "sonner";

const logo = "/assets/logo.svg";

export function FeatureRequestDialog({ open, onOpenChange }) {
  const { authFetch } = useAuth();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDetails("");
    }
  }, [open]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (trimmedTitle.length < 3) {
      toast.error("Please add a short feature title.");
      return;
    }

    if (trimmedDetails.length < 10) {
      toast.error("Please describe the feature in a bit more detail.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authFetch(`${API_BASE_URL}/feature-requests`, {
        method: "POST",
        body: JSON.stringify({
          title: trimmedTitle,
          details: trimmedDetails,
          source: "dashboard dropdown",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feature request sent.");
        onOpenChange(false);
        return;
      }

      toast.error(data?.message || data?.error || "Failed to send feature request.");
    } catch (error) {
      console.error("Error submitting feature request:", error);
      toast.error("Failed to send feature request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Request a Feature</DialogTitle>
          <DialogDescription>
            Tell us what Markify should do next. You can send up to 2 requests per month, and the team decides what gets implemented.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feature-title">Feature title</Label>
            <Input
              id="feature-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Folder reminders"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feature-details">What do you want?</Label>
            <Textarea
              id="feature-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain the workflow, problem, or improvement you want in Markify."
              rows={5}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Feature requests are suggestions, not a guarantee of implementation.
            </p>
          </div>
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
                <img src={logo} alt="" className="h-4 w-4 mr-2 animate-spin filter brightness-0 invert" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

FeatureRequestDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
};
