import React from "react";
import { Share2, Globe } from "lucide-react";
import CollectionCard from "../Collections/CollectionCard";
import BookmarkCard from "../Bookmarks/BookmarkCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SharedItems({
    bookmarks = [],
    collections = [],
    isLoading = false,
    error = null,
    onEdit,
    onDelete,
    onToggleFavorite,
    onMove,
    onBulkDelete,
    onShare,
    onRenameCollection,
    onDeleteCollection,
    onShareCollection
}) {
    // Filter for shared items
    const sharedBookmarks = bookmarks.filter(b => b.shareId);
    const sharedCollections = collections.filter(c => c.shareId);

    // If no shared items
    if (!isLoading && sharedBookmarks.length === 0 && sharedCollections.length === 0) {
        return (
            <div className="w-full px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Globe className="h-8 w-8 text-primary" />
                        Shared Items
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your public bookmarks and collections</p>
                </div>
                <Card className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2">
                    <div className="bg-primary/10 p-6 rounded-full mb-6">
                        <Share2 className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">Nothing Shared Yet</h3>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
                        Items you share publicly will appear here. You can share bookmarks and collections from their respective menus.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full px-8 py-8 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Globe className="h-8 w-8 text-primary" />
                    Shared Items
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Manage your public bookmarks and collections</p>
            </div>

            <Tabs defaultValue="all" className="space-y-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="all">All Shared</TabsTrigger>
                    <TabsTrigger value="collections">Collections ({sharedCollections.length})</TabsTrigger>
                    <TabsTrigger value="bookmarks">Bookmarks ({sharedBookmarks.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-12">
                    {sharedCollections.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                Shared Collections
                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                                    {sharedCollections.length}
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sharedCollections.map(collection => (
                                    <CollectionCard
                                        key={collection.id}
                                        collection={collection}
                                        userId={collection.userId}
                                        onRename={onRenameCollection}
                                        onDelete={onDeleteCollection}
                                        onShare={onShareCollection}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {sharedBookmarks.length > 0 && (
                        <section>
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                                Shared Bookmarks
                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                                    {sharedBookmarks.length}
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sharedBookmarks.map(bookmark => (
                                    <BookmarkCard
                                        key={bookmark.id}
                                        bookmark={bookmark}
                                        collections={collections}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleFavorite={onToggleFavorite}
                                        onMove={onMove}
                                        onShare={onShare}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </TabsContent>

                <TabsContent value="collections">
                    {sharedCollections.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground text-lg">No shared collections found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sharedCollections.map(collection => (
                                <CollectionCard
                                    key={collection.id}
                                    collection={collection}
                                    userId={collection.userId}
                                    onRename={onRenameCollection}
                                    onDelete={onDeleteCollection}
                                    onShare={onShareCollection}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="bookmarks">
                    {sharedBookmarks.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground text-lg">No shared bookmarks found</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sharedBookmarks.map(bookmark => (
                                <BookmarkCard
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    collections={collections}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggleFavorite={onToggleFavorite}
                                    onMove={onMove}
                                    onShare={onShare}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
