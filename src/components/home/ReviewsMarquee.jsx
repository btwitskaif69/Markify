import React, { useEffect, useState } from "react";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Individual review card component
function ReviewCard({ name, avatar, rating, content }) {
    return (
        <figure
            className={cn(
                "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img
                    className="rounded-full h-10 w-10 object-cover"
                    alt={name}
                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
                />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-3 w-3",
                                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                "{content}"
            </blockquote>
        </figure>
    );
}

export default function ReviewsMarquee() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/reviews`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if no reviews
    if (isLoading || reviews.length === 0) {
        return null;
    }

    // Split reviews into two rows for visual effect
    const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
    const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

    return (
        <section className="py-16 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">What Our Users Say</h2>
                <p className="text-muted-foreground">Real reviews from real users</p>
            </div>

            <div className="relative flex flex-col gap-4">
                <Marquee pauseOnHover className="[--duration:30s]">
                    {firstRow.map((review) => (
                        <ReviewCard
                            key={review.id}
                            name={review.user?.name || "Anonymous"}
                            avatar={review.user?.avatar}
                            rating={review.rating}
                            content={review.content}
                        />
                    ))}
                </Marquee>

                {secondRow.length > 0 && (
                    <Marquee reverse pauseOnHover className="[--duration:30s]">
                        {secondRow.map((review) => (
                            <ReviewCard
                                key={review.id}
                                name={review.user?.name || "Anonymous"}
                                avatar={review.user?.avatar}
                                rating={review.rating}
                                content={review.content}
                            />
                        ))}
                    </Marquee>
                )}

                {/* Gradient overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            </div>
        </section>
    );
}
