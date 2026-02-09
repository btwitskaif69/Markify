import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/client/lib/apiConfig";

// Individual review card component
function ReviewCard({ name, avatar, rating, content }) {
    return (
        <motion.figure
            className={cn(
                "relative cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transition-colors duration-200"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: false }}
        >
            <div className="flex flex-row items-center gap-3">
                <img
                    className="rounded-full h-10 w-10 object-cover"
                    alt={name}
                    src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=40`}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
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
            <blockquote className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                "{content}"
            </blockquote>
        </motion.figure>
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
            const response = await fetch(`${API_BASE_URL}/reviews`);
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

    // Split reviews into three columns
    const columns = [[], [], []];
    reviews.forEach((review, index) => {
        columns[index % 3].push(review);
    });

    return (
        <section className="py-16">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        What Our <span className="italic">Users</span> Say
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real reviews from real users who love organizing with Markify.
                    </p>
                </motion.div>

                {/* 3 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {columns.map((column, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-4 md:gap-6">
                            {column.map((review, index) => (
                                <ReviewCard
                                    key={review.id}
                                    name={review.user?.name || "Anonymous"}
                                    avatar={review.user?.avatar}
                                    rating={review.rating}
                                    content={review.content}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
