/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { API_BASE_URL } from "@/client/lib/apiConfig";

function ReviewCard({ name, avatar, rating, content }) {
    return (
        <figure
            className={cn(
                "relative w-full cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-background hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-background dark:hover:bg-gray-50/[.15]",
                "shadow-[inset_25px_25px_40px_-20px_rgba(234,137,58,0.25),inset_-25px_-25px_40px_-20px_rgba(234,137,58,0.25)]",
                "dark:shadow-[inset_25px_25px_40px_-20px_rgba(234,137,58,0.35),inset_-25px_-25px_40px_-20px_rgba(234,137,58,0.35)]",
                "transition-all duration-200"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img
                    className="rounded-full h-10 w-10 object-cover"
                    alt={name}
                    src={
                        avatar ||
                        `https://avatar.vercel.sh/${encodeURIComponent(name)}`
                    }
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
                                    star <= rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                &ldquo;{content}&rdquo;
            </blockquote>
        </figure>
    );
}

export default function ReviewsMarquee() {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/reviews`);
                if (res.ok) setReviews(await res.json());
            } catch (e) {
                console.error("Error fetching reviews:", e);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading || reviews.length === 0) return null;

    // Split into 3 columns for vertical marquee
    const columns = [[], [], []];
    reviews.forEach((r, i) => columns[i % 3].push(r));

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
                        Real reviews from real users who love organizing with
                        Markify.
                    </p>
                </motion.div>

                {/* Vertical Marquee Columns */}
                <div className="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden">
                    {columns.map((col, colIdx) => (
                        <Marquee
                            key={colIdx}
                            pauseOnHover
                            vertical
                            reverse={colIdx % 2 === 1}
                            className={cn(
                                "[--duration:25s] flex-1",
                                colIdx === 2 && "hidden lg:flex"
                            )}
                        >
                            {col.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    name={review.user?.name || "Anonymous"}
                                    avatar={review.user?.avatar}
                                    rating={review.rating}
                                    content={review.content}
                                />
                            ))}
                        </Marquee>
                    ))}

                    {/* Gradient fade edges */}
                    <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b" />
                    <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t" />
                </div>
            </div>
        </section>
    );
}
