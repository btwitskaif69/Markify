"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, ArrowLeft, Folder, Share2, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SEO from "@/components/SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { formatDateUTC } from "@/lib/date";

const API_URL = API_BASE_URL;

export default function SharedCollection() {
    const params = useParams();
    const shareId = Array.isArray(params.shareId) ? params.shareId[0] : params.shareId;
    const [collection, setCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const canonical = getCanonicalUrl(`/shared/collection/${shareId}`);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch(`${API_URL}/collections/shared/${shareId}`);
                if (!response.ok) {
                    throw new Error("Collection not found");
                }
                const data = await response.json();
                setCollection(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollection();
    }, [shareId]);

    const structuredData = useMemo(() => {
        if (!collection) return null;
        const breadcrumb = buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shared Collection", path: `/shared/collection/${shareId}` },
        ]);
        const webPage = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collection.name,
            description:
                collection.description ||
                `Shared collection from ${collection.sharedBy?.name || "a Markify user"}.`,
            url: canonical,
        };
        return [webPage, breadcrumb].filter(Boolean);
    }, [collection, canonical, shareId, buildBreadcrumbSchema]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error || !collection) {
        return (
            <>
                <SEO
                    title="Collection not found"
                    description="This shared collection is no longer available."
                    canonical={canonical}
                    noindex
                />
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            This collection may have been removed or the link is no longer valid.
                        </p>
                        <Link href="/">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                    </Card>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <SEO
                title={collection.name}
                description={
                    collection.description ||
                    `Shared collection from ${collection.sharedBy?.name || "a Markify user"}.`
                }
                canonical={canonical}
                structuredData={structuredData}
                noindex
            />
            <main className="min-h-screen py-16 md:py-24 px-4 md:px-8 bg-background">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start justify-center gap-8 relative">
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

                    {/* CENTER COLUMN: Main Content */}
                    <div className="w-full flex-1 min-w-0">
                        {/* Mobile Back Link */}
                        <Link
                            href="/"
                            className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>

                        {/* Collection Header */}
                        <Card className="mb-8 border-border/50 shadow-md bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-6">
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                        <AvatarImage src={collection.sharedBy?.avatar} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {collection.sharedBy?.name?.charAt(0)?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{collection.sharedBy?.name || "Unknown User"}</p>
                                        <p className="text-xs text-muted-foreground">Shared this collection</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <Folder className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{collection.name}</CardTitle>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <Badge variant="outline" className="px-2 py-0.5 h-6">
                                                {collection.bookmarks?.length || 0} bookmarks
                                            </Badge>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Created {formatDateUTC(collection.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Bookmarks Grid */}
                        {collection.bookmarks?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {collection.bookmarks.map((bookmark) => (
                                    <BookmarkPreviewCard key={bookmark.id} bookmark={bookmark} />
                                ))}
                            </div>
                        ) : (
                            <Card className="p-12 text-center border-dashed border-2">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                    <Folder className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium mb-1">Empty Collection</h3>
                                <p className="text-muted-foreground">This collection doesn't have any bookmarks yet.</p>
                            </Card>
                        )}

                        {/* Mobile CTA */}
                        <div className="lg:hidden mt-12 p-6 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-background to-background text-center">
                            <h3 className="text-lg font-bold mb-2">Build your own collections</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Join Markify to organize your digital life.
                            </p>
                            <Link href="/signup">
                                <Button className="w-full">Get Started Free</Button>
                            </Link>
                        </div>

                        {/* Powered by footer */}
                        <p className="text-center text-xs text-muted-foreground mt-12 mb-8 opacity-60 hover:opacity-100 transition-opacity">
                            Shared via <span className="font-semibold text-primary">Markify</span> - The smart bookmark manager
                        </p>
                    </div>

                    {/* RIGHT COLUMN: SEO CTA - Sticky */}
                    <div className="hidden lg:block w-72 sticky top-24 shrink-0 space-y-6">
                        <div className="p-6 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-colors">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                                <Folder className="h-6 w-6 text-white" />
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-foreground">Save your collections</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Join thousands of users who use <strong>Markify</strong> to organize, share, and collaborate on their favorite web content.
                            </p>

                            <div className="w-full space-y-3">
                                <Link href="/signup">
                                    <Button className="w-full font-semibold shadow-md">
                                        Start Curating for Free
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

function BookmarkPreviewCard({ bookmark }) {
    const tagsArray = typeof bookmark.tags === 'string'
        ? bookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`;

    return (
        <Card className="p-2 flex flex-col gap-2 hover:shadow-lg transition-shadow">
            {/* Preview Image */}
            <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                <div className="w-full h-40 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                    {bookmark.previewImage ? (
                        <img
                            src={bookmark.previewImage}
                            alt={bookmark.title}
                            width={640}
                            height={360}
                            loading="lazy"
                            decoding="async"
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <img
                            src={faviconUrl}
                            alt={`${bookmark.title} favicon`}
                            width={48}
                            height={48}
                            loading="lazy"
                            decoding="async"
                            className="w-12 h-12 object-contain"
                        />
                    )}
                </div>
            </a>

            <CardContent className="p-2 flex flex-col flex-grow">
                <h3 className="font-semibold text-primary truncate mb-1">{bookmark.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {bookmark.description || "No description"}
                </p>

                {/* URL */}
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate flex items-center gap-1 mb-2"
                >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    {bookmark.url}
                </a>

                {/* Tags */}
                {tagsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {tagsArray.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Category */}
                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                    <span>{bookmark.category}</span>
                    <span>{formatDateUTC(bookmark.createdAt)}</span>
                </div>
            </CardContent>
        </Card>
    );
}
