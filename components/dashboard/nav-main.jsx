"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { usePathname } from "next/navigation";
import { ChevronRight, Bookmark, Shield } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { useAuth } from "@/client/context/AuthContext";

export function NavMain({ totalBookmarks }) {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const dashboardPath = user ? `/dashboard/${user.id}` : "/login";
  const sharedPath = user ? `/dashboard/${user.id}/shared` : "/login";
  const isAllBookmarksActive = pathname === dashboardPath;
  const isSharedActive = pathname === sharedPath;
  const isAdminActive = Boolean(isAdmin && pathname?.startsWith("/admin"));

  const navSections = [
    {
      title: "Workspace",
      icon: Bookmark,
      defaultOpen: isAllBookmarksActive || isSharedActive,
      items: [
        {
          title: "All Bookmarks",
          href: dashboardPath,
          isActive: isAllBookmarksActive,
          badge: totalBookmarks > 0 ? totalBookmarks : null,
        },
        {
          title: "Shared",
          href: sharedPath,
          isActive: isSharedActive,
          badge: null,
        },
      ],
    },
    ...(isAdmin && user
      ? [
          {
            title: "Admin",
            icon: Shield,
            defaultOpen: isAdminActive,
            items: [
              {
                title: "Admin Panel",
                href: "/admin",
                isActive: isAdminActive,
                badge: null,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navSections.map((section) => (
          <Collapsible
            key={section.title}
            asChild
            defaultOpen={section.defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={section.title}>
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={item.isActive}>
                        <Link href={item.href} className="flex w-full items-center gap-2">
                          <span>{item.title}</span>
                          {item.badge ? (
                            <span className="ml-auto text-xs font-medium">{item.badge}</span>
                          ) : null}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

NavMain.propTypes = {
  totalBookmarks: PropTypes.number,
};
