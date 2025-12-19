import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

export default function SharedBookmark() {
    const { shareId } = useParams();
    const [bookmark, setBookmark] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (error || !bookmark) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center p-8">
                        <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Bookmark Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            This bookmark may have been removed or the link is no longer valid.
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

    const tagsArray = typeof bookmark.tags === 'string'
        ? bookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

    return (
        <>
            <Navbar />
            <main className="min-h-screen py-12 px-4 md:px-8 bg-muted/30">
                <div className="max-w-3xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>

                    <Card className="overflow-hidden">
                        {bookmark.previewImage && (
                            <div className="w-full h-64 overflow-hidden">
                                <img
                                    src={bookmark.previewImage}
                                    alt={bookmark.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <CardHeader>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={bookmark.sharedBy?.avatar} />
                                    <AvatarFallback>
                                        {bookmark.sharedBy?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{bookmark.sharedBy?.name || "Unknown User"}</p>
                                    <p className="text-xs text-muted-foreground">Shared this bookmark</p>
                                </div>
                            </div>

                            <CardTitle className="text-2xl">{bookmark.title}</CardTitle>
                            {bookmark.description && (
                                <CardDescription className="text-base mt-2">
                                    {bookmark.description}
                                </CardDescription>
                            )}
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* URL */}
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {bookmark.url}
                            </a>

                            {/* Category and Date */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <Badge variant="secondary">{bookmark.category}</Badge>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {tagsArray.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tagsArray.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Visit Button */}
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="w-full" size="lg">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Bookmark
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}
