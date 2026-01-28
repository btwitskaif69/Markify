"use client";

import * as React from "react"
import Link from "next/link";
import { NavMain } from "@/components/dashboard/nav-main"

import { NavCollections } from "@/components/dashboard/nav-collections"
import { NavUser } from "@/components/dashboard/nav-user"
import { useAuth } from "@/client/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import ImportExport from "./ImportExport";
const logo = "/assets/logo.svg";

export function AppSidebar({ collections, onCreateCollection, onRenameCollection, onDeleteCollection, onShareCollection, totalBookmarks, ...props }) {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={user ? `/dashboard/${user.id}` : '/login'}>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-transparent hover:text-inherit"
          >
            <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <img src={logo} alt="Markify" width={20} height={20} className="h-5 w-5" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-lg font-semibold">Markify</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain totalBookmarks={totalBookmarks} />

        <NavCollections
          collections={collections}
          onCreate={onCreateCollection}
          onRename={onRenameCollection}
          onDelete={onDeleteCollection}
          onShare={onShareCollection}
        />
        <ImportExport />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={logout} />
      </SidebarFooter>
    </Sidebar>
  );
}
