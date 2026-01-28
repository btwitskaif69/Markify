"use client";

import Link from 'next/link';
import { Folder, MoreHorizontal, Share2, Globe, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CollectionCard({
    collection,
    userId,
    onRename,
    onDelete,
    onShare
}) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md">
            <Link href={`/dashboard/${userId}/collections/${collection.id}`} className="block p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Folder className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold line-clamp-1">{collection.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {collection.shareId ? (
                                    <span className="flex items-center gap-1 text-green-600">
                                        <Globe className="h-3 w-3" />
                                        Shared
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Lock className="h-3 w-3" />
                                        Private
                                    </span>
                                )}
                                <span>•</span>
                                <span>{collection.itemCount || 0} items</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onRename(collection)}>
                            Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(collection)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(collection.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
