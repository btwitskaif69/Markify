"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { useParams, usePathname } from "next/navigation";
import { ChevronRight, Folder, MoreHorizontal, Trash2, Edit, Plus, FolderOpen, Folders, Share2, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function NavCollections({ collections = [], onCreate, onRename, onDelete, onShare }) {
  const params = useParams();
  const pathname = usePathname();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const activeCollectionId = Array.isArray(params.collectionId)
    ? params.collectionId[0]
    : params.collectionId;
  const safeCollections = Array.isArray(collections) ? collections : [];
  const sharedPath = `/dashboard/${userId}/shared`;
  const isSharedActive = pathname === sharedPath;
  const hasActiveCollection = safeCollections.some((collection) => collection.id === activeCollectionId);

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Folders className="h-4 w-4" />
            <span className="font-semibold">Collections</span>
          </div>
        </SidebarGroupLabel>
        <Button onClick={onCreate} variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create Collection</span>
        </Button>
      </div>

      <SidebarMenu>
        <Collapsible asChild defaultOpen={hasActiveCollection || isSharedActive} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Collections">
                <Folders className="h-4 w-4" />
                <span>Browse Collections</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild isActive={isSharedActive}>
                    <Link href={sharedPath} className="flex w-full items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Shared</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>

                {safeCollections.map((collection) => (
                  <SidebarMenuSubItem key={collection.id}>
                    <div className="group flex items-center gap-1">
                      <SidebarMenuSubButton
                        asChild
                        isActive={collection.id === activeCollectionId}
                        className="pr-8"
                      >
                        <Link href={`/dashboard/${userId}/collections/${collection.id}`} className="flex w-full items-center gap-2">
                          {collection.id === activeCollectionId ? (
                            <FolderOpen className="h-4 w-4" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )}
                          <span>{collection.name}</span>
                          {collection._count?.bookmarks > 0 ? (
                            <span className="ml-auto text-xs font-medium">
                              {collection._count.bookmarks}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuSubButton>

                      <div className="group-data-[collapsible=icon]:hidden">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="z-50 w-48 rounded-lg bg-background"
                            side="right"
                            align="start"
                            sideOffset={8}
                          >
                            <DropdownMenuLabel>Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => onRename?.(collection)} className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onShare?.(collection)} className="cursor-pointer">
                              <Share2 className="mr-2 h-4 w-4" />
                              <span>Share</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => onDelete?.(collection.id)}
                              className="cursor-pointer text-red-500 focus:text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}

NavCollections.propTypes = {
  collections: PropTypes.array,
  onCreate: PropTypes.func,
  onRename: PropTypes.func,
  onDelete: PropTypes.func,
  onShare: PropTypes.func,
};
