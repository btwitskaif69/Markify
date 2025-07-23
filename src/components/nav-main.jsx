// 'use client' – only relevant in Next.js App Router setups

import * as React from "react"
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={item.isActive}
              className="data-[active=true]:bg-primary data-[active=true]:text-white"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              {item.count != null && (
                <span className="ml-auto text-xs text-slate-400">
                  {item.count}
                </span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
