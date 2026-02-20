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
                "relative w-full cursor-pointer overflow-hidden rounded-xl border border-border p-4",
                "transition-all duration-200"
            )}
        >
            {/* Copper Forge Background with Top Left & Bottom Right Glows */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at top left, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%),
                        radial-gradient(circle at bottom right, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%)
                    `,
                    backgroundColor: "var(--background)",
                }}
            />

            <div className="relative z-10 flex flex-row items-center gap-3">
                <img
                    className="rounded-full h-10 w-10 object-cover"
                    src={
                        avatar ||
                        `https://avatar.vercel.sh/${encodeURIComponent(name)}`
                    }
                    alt={name}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-foreground">
                        {name}
                    </figcaption>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "h-3 w-3",
                                    star <= rating
                                        ? "fill-primary text-primary"
                                        : "text-muted/20"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <blockquote className="relative z-10 mt-3 text-sm text-muted-foreground">
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
                    <h2 className="text-2xl md:text-6xl font-medium bg-clip-text text-transparent leading-normal" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        What Our <span className="instrument-serif-regular-italic">Users</span> Say
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
