import { Link, useParams, useLocation } from 'react-router-dom';
import { Folder, MoreHorizontal, Trash2, Edit, Plus, FolderOpen, Folders, Share2, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function NavCollections({ collections = [], onCreate, onRename, onDelete, onShare }) {
  const { userId, collectionId: activeCollectionId } = useParams();
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to={`/dashboard/${userId}/shared`}>
            <SidebarMenuButton
              tooltip="Shared"
              isActive={location.pathname === `/dashboard/${userId}/shared`}
              className="data-[active=true]:bg-primary data-[active=true]:text-white mb-2"
            >
              <Globe className="h-4 w-4" />
              <span>Shared</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
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
        {(Array.isArray(collections) ? collections : []).map((collection) => (
          <div key={collection.id} className="flex items-center group">
            <Link to={`/dashboard/${userId}/collections/${collection.id}`} className="flex-1">
              <SidebarMenuButton
                className="w-full data-[active=true]:bg-primary"
                tooltip={collection.name}
                isActive={collection.id === activeCollectionId}
              >
                {/* Conditionally render the icon based on the active state */}
                {collection.id === activeCollectionId ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}

                <span className="group-data-[collapsible=icon]:hidden">{collection.name}</span>
                {collection._count?.bookmarks > 0 && (
                  <span className="ml-auto text-xs font-medium group-data-[active=true]:text-white group-data-[collapsible=icon]:hidden">
                    {collection._count.bookmarks}
                  </span>
                )}
              </SidebarMenuButton>
            </Link>

            {/* This dropdown will be hidden when collapsed */}
            <div className="group-data-[collapsible=icon]:hidden">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg z-50 bg-background"
                  side="right"
                  align="start"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="">
                    Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="text-accent-foreground" />
                  <DropdownMenuItem onSelect={() => onRename(collection)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onShare?.(collection)} className="cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onDelete(collection.id)} className="cursor-pointer text-red-500 focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
