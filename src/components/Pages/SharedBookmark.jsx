"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Calendar, Tag, ArrowLeft, Share2, Link2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/lib/apiConfig";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SEO from "@/components/SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { formatDateUTC } from "@/lib/date";

const API_URL = API_BASE_URL;

export default function SharedBookmark() {
    const params = useParams();
    const shareId = Array.isArray(params.shareId) ? params.shareId[0] : params.shareId;
    const [bookmark, setBookmark] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const canonical = getCanonicalUrl(`/shared/bookmark/${shareId}`);

    useEffect(() => {
        const fetchBookmark = async () => {
            try {
                const response = await fetch(`${API_URL}/bookmarks/shared/${shareId}`);
                if (!response.ok) {
                    throw new Error("Bookmark not found");
                }
                const data = await response.json();
                setBookmark(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookmark();
    }, [shareId]);

    const structuredData = useMemo(() => {
        if (!bookmark) return null;
        const breadcrumb = buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shared Bookmark", path: `/shared/bookmark/${shareId}` },
        ]);
        const webPage = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: bookmark.title,
            description:
                bookmark.description ||
                `Shared bookmark from ${bookmark.sharedBy?.name || "a Markify user"}.`,
            url: canonical,
        };
        return [webPage, breadcrumb].filter(Boolean);
    }, [bookmark, canonical, shareId, buildBreadcrumbSchema]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !bookmark) {
        return (
            <>
                <SEO
                    title="Bookmark not found"
                    description="This shared bookmark is no longer available."
                    canonical={canonical}
                    noindex
                />
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                    <Card className="max-w-md w-full text-center p-8 py-0! border-destructive/20">
                        <CardContent className="pt-8 pb-8">
                            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Share2 className="h-8 w-8 text-destructive" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Bookmark Not Found</h1>
                            <p className="text-muted-foreground mb-6">
                                This bookmark may have been removed or the link is no longer valid.
                            </p>
                            <Link href="/">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                <Footer />
            </>
        );
    }

    const tagsArray = typeof bookmark.tags === 'string'
        ? bookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`;

    return (
        <>
            <Navbar />
            <SEO
                title={bookmark.title}
                description={
                    bookmark.description ||
                    `Shared bookmark from ${bookmark.sharedBy?.name || "a Markify user"}.`
                }
                canonical={canonical}
                image={bookmark.previewImage}
                imageAlt={bookmark.title}
                structuredData={structuredData}
                noindex
            />
            <main className="min-h-screen py-16 md:py-24 px-4 md:px-8 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-8 relative">
                    {/* LEFT COLUMN: Back Link */}
                    <div className="hidden lg:block w-48 sticky top-24 shrink-0">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card hover:bg-primary/5 text-sm font-medium text-muted-foreground hover:text-primary transition-all group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    {/* CENTER COLUMN: Main Card */}
                    <div className="w-full max-w-2xl flex-1">
                        {/* Mobile Back Link */}
                        <Link
                            href="/"
                            className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>

                        <Card className="py-0! overflow-hidden border-border/50 shadow-2xl bg-card/50 backdrop-blur-sm ring-1 ring-white/5">
                            {/* Preview Image */}
                            {bookmark.previewImage ? (
                                <div className="w-full h-48 md:h-72 overflow-hidden bg-muted group">
                                    <img
                                        src={bookmark.previewImage}
                                        alt={bookmark.title}
                                        width={1200}
                                        height={675}
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                    <img
                                        src={faviconUrl}
                                        alt={`${bookmark.title} favicon`}
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                            )}

                            <CardHeader className="pb-4">
                                {/* Shared By */}
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                        <AvatarImage src={bookmark.sharedBy?.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {bookmark.sharedBy?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{bookmark.sharedBy?.name || "Unknown User"}</p>
                                        <p className="text-xs text-muted-foreground">Shared this bookmark</p>
                                    </div>
                                </div>

                                {/* Title */}
                                <CardTitle className="text-xl md:text-3xl font-bold leading-tight">
                                    {bookmark.title}
                                </CardTitle>

                                {/* Description */}
                                {bookmark.description && (
                                    <CardDescription className="text-base md:text-lg mt-4 text-muted-foreground leading-relaxed">
                                        {bookmark.description}
                                    </CardDescription>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-6 pt-0 pb-8">
                                {/* URL */}
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-sm text-primary hover:underline break-all p-4 rounded-xl bg-primary/5 border border-primary/10 transition-colors hover:bg-primary/10"
                                >
                                    <Link2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span className="line-clamp-2 font-medium">{bookmark.url}</span>
                                </a>

                                {/* Category and Date */}
                                <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-border/40">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                                        <Badge variant="secondary" className="font-medium px-3">
                                            {bookmark.category}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{formatDateUTC(bookmark.createdAt, { dateStyle: "medium" })}</span>
                                    </div>
                                </div>

                                {/* Tags */}
                                {tagsArray.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</span>
                                        <div className="flex flex-wrap gap-2">
                                            {tagsArray.map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="px-3 py-1 font-normal bg-background/50"
                                                >
                                                    <Tag className="h-3 w-3 mr-1.5 opacity-70" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Visit Button */}
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block pt-4"
                                >
                                    <Button className="w-full gap-2 h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow" size="lg">
                                        <ExternalLink className="h-5 w-5" />
                                        Visit Website
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>

                        {/* Mobile CTA */}
                        <div className="lg:hidden mt-12 p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background text-center">
                            <h3 className="text-lg font-bold mb-2">Save links like this?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Join Markify to organize your digital life.
                            </p>
                            <Link href="/signup">
                                <Button className="w-full">Get Started Free</Button>
                            </Link>
                        </div>

                        {/* Powered by footer */}
                        <p className="text-center text-xs text-muted-foreground mt-8 opacity-60 hover:opacity-100 transition-opacity">
                            Shared via <span className="font-semibold text-primary">Markify</span> - The smart bookmark manager
                        </p>
                    </div>

                    {/* RIGHT COLUMN: SEO CTA - Sticky */}
                    <div className="hidden lg:block w-72 sticky top-24 shrink-0 space-y-6">
                        <div className="p-6 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                <Share2 className="h-6 w-6 text-white" />
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-foreground">Never lose a link again</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Join thousands of users who use <strong>Markify</strong> to organize, share, and collaborate on their favorite web content.
                            </p>

                            <div className="w-full space-y-3">
                                <Link href="/signup">
                                    <Button className="w-full font-semibold shadow-md">
                                        Join Markify for Free
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Features List Mini */}
                        <div className="p-5 rounded-xl border border-border/40 bg-muted/20">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Why Markify?</p>
                            <ul className="text-sm space-y-2.5">
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Smart Categorization
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Beautiful Previews
                                </li>
                                <li className="flex items-center gap-2 text-muted-foreground">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                                    Share & Collaborate
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
