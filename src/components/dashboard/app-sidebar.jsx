import * as React from "react"
import { Link } from "react-router-dom"; // 1. Import the Link component
import { Bookmark, BookMarked } from "lucide-react"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavCollections } from "@/components/dashboard/nav-collections"
import { NavUser } from "@/components/dashboard/nav-user"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import ImportExport from "./ImportExport";
import logo from "@/assets/logo.svg"

export function AppSidebar({ collections, onCreateCollection, onRenameCollection, onDeleteCollection, ...props }) {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* 2. Wrap the button with a Link to the user's main dashboard */}
        <Link to={user ? `/dashboard/${user.id}` : '/login'}>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-transparent hover:text-inherit"
          >
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              {/* <BookMarked className="size-4" /> */}
              <img src={logo} alt="Markify" className="h-5 w-5" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-lg font-semibold">Markify</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavCollections
          collections={collections}
          onCreate={onCreateCollection}
          onRename={onRenameCollection}
          onDelete={onDeleteCollection}
        />
        <ImportExport />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}