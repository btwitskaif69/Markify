import * as React from "react"
import { Frame, Bookmark, Map, PieChart, BookMarked} from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavCollections } from "@/components/nav-collections"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Markify",
      logo: BookMarked,
    }
  ],
  navMain: [
    {
      title: "All Bookmarks",
      url: "#",
      icon: Bookmark,
      isActive: true,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCollections collections={data.collections} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}