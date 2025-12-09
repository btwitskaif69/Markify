import * as React from "react";
import { useState, useEffect } from "react";
import { Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

// Status badge component
function StatusBadge({ status }) {
    const statusConfig = {
        PENDING: {
            icon: Clock,
            text: "Pending Approval",
            className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        },
        APPROVED: {
            icon: CheckCircle,
            text: "Approved",
            className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        },
        REJECTED: {
            icon: XCircle,
            text: "Rejected",
            className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        }
    };

    const config = statusConfig[status];
    if (!config) return null;

    const Icon = config.icon;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
            <Icon className="h-3 w-3" />
            {config.text}
        </div>
    );
}

export function ReviewDialog({ open, onOpenChange }) {
    const { authFetch } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState(null);

    // Fetch existing review when dialog opens
    useEffect(() => {
        if (open) {
            fetchMyReview();
        }
    }, [open]);

    const fetchMyReview = async () => {
        try {
            const response = await authFetch(`${API_BASE_URL}/reviews/me`);
            if (response.ok) {
                const review = await response.json();
                if (review) {
                    setExistingReview(review);
                    setRating(review.rating);
                    setContent(review.content);
                }
            }
        } catch (error) {
            console.error("Error fetching review:", error);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!content.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authFetch(`${API_BASE_URL}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, content: content.trim() }),
            });

            if (response.ok) {
                const message = existingReview
                    ? "Review updated! It will be visible after admin approval."
                    : "Review submitted! It will be visible after admin approval.";
                toast.success(message);
                onOpenChange(false);
            } else {
                const data = await response.json();
                toast.error(data.error || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{existingReview ? "Update Your Review" : "Leave a Review"}</DialogTitle>
                    <DialogDescription>
                        Share your experience with Markify. Your feedback helps us improve!
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Status Badge */}
                    {existingReview && existingReview.status && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Current status:</span>
                            <StatusBadge status={existingReview.status} />
                        </div>
                    )}

                    {/* Star Rating */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="p-1 transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Content */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Your Review</label>
                        <Textarea
                            placeholder="What do you love about Markify? Any suggestions?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Info about approval */}
                    <p className="text-xs text-muted-foreground">
                        Reviews are subject to admin approval before appearing publicly.
                    </p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

