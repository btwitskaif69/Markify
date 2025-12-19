import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, ArrowLeft, Folder, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

export default function SharedCollection() {
    const { shareId } = useParams();
    const [collection, setCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (error || !collection) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Collection Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            This collection may have been removed or the link is no longer valid.
                        </p>
                        <Link to="/">
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
            <main className="min-h-screen py-12 px-4 md:px-8 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    {/* Collection Header */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={collection.sharedBy?.avatar} />
                                    <AvatarFallback>
                                        {collection.sharedBy?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{collection.sharedBy?.name || "Unknown User"}</p>
                                    <p className="text-xs text-muted-foreground">Shared this collection</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Folder className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-2xl">{collection.name}</CardTitle>
                                    <p className="text-muted-foreground">
                                        {collection.bookmarks?.length || 0} bookmarks
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Bookmarks Grid */}
                    {collection.bookmarks?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {collection.bookmarks.map((bookmark) => (
                                <BookmarkPreviewCard key={bookmark.id} bookmark={bookmark} />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">This collection is empty.</p>
                        </Card>
                    )}
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
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <img
                            src={faviconUrl}
                            alt={`${bookmark.title} favicon`}
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
                    <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
}
