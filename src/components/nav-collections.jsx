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
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function NavCollections({ collections = [], onCreate, onRename, onDelete }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <div className="flex items-center justify-between">
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
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
          // Use a simple div as the wrapper to avoid click conflicts
          <div key={collection.id} className="flex items-center group">
            <SidebarMenuButton className="flex-1">
              <Folder className="h-4 w-4" />
              <span>{collection.name}</span>
            </SidebarMenuButton>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg z-50"
                side="right"
                align="start"
                sideOffset={8}
              >
                <DropdownMenuItem
                  onSelect={() => onRename(collection)} // Use onSelect for better event handling
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => onDelete(collection.id)} // Use onSelect for better event handling
                  className="cursor-pointer text-red-500 focus:text-red-500"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}