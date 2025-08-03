import * as React from "react"
import { Bookmark, BookMarked } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavCollections } from "@/components/nav-collections"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/context/AuthContext" // 1. Import useAuth
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"

const navMainData = [
  {
    title: "All Bookmarks",
    url: "/dashboard",
    icon: Bookmark,
    isActive: true,
  },
];

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

export function AppSidebar({ ...props }) {
  const { user, logout } = useAuth(); // 2. Get the user and logout function

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
         <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* 3. Pass the logout function as a prop */}
        <NavMain items={navMainData}/>
        <NavCollections collections={[]} />
      </SidebarContent>
      <SidebarFooter>
       <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}