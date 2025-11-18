import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Shield } from "lucide-react";

export function NavMain() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Determine if the "All Bookmarks" link should be active.
  // It's active if the path is exactly the user's dashboard URL.
  const isAllBookmarksActive = location.pathname === `/dashboard/${user?.id}`;
  const isAdminActive =
    isAdmin && location.pathname === `/dashboard/${user?.id}/admin`;

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to={user ? `/dashboard/${user.id}` : "/login"}>
            <SidebarMenuButton
              tooltip="All Bookmarks"
              isActive={isAllBookmarksActive}
              className="data-[active=true]:bg-primary data-[active=true]:text-white mb-2"
            >
              <Bookmark className="h-4 w-4" />
              <span>All Bookmarks</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        {isAdmin && user && (
          <SidebarMenuItem>
            <Link to={`/dashboard/${user.id}/admin`}>
              <SidebarMenuButton
                tooltip="Admin"
                isActive={isAdminActive}
                className="data-[active=true]:bg-primary data-[active=true]:text-white mb-2"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
