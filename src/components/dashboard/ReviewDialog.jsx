import * as React from "react";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
            const response = await authFetch(`${API_URL}/reviews/me`);
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
            const response = await authFetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, content: content.trim() }),
            });

            if (response.ok) {
                toast.success(existingReview ? "Review updated!" : "Review submitted! Thank you!");
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
