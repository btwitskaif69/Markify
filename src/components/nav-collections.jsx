import { Folder, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// 1. Accept the handler functions as props from the Dashboard
export function NavCollections({ collections = [], onCreate, onRename, onDelete }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        {/* 2. "Create Collection" button that calls the onCreate handler */}
        <Button
          onClick={onCreate}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Create Collection</span>
        </Button>
      </div>
      <SidebarMenu>
        {collections.map((collection) => (
          <SidebarMenuItem key={collection.id}>
            <SidebarMenuButton className="group">
              <Folder className="h-4 w-4" />
              <span>{collection.name}</span>
            </SidebarMenuButton>

            {/* 3. Dropdown menu for Rename and Delete actions */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg z-50"
                side="right"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onClick={() => onRename(collection)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(collection.id)}
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}