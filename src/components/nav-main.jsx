import * as React from "react"
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

// 1. Accept the logout prop
export function NavMain({ items, logout }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={item.isActive}
              className="data-[active=true]:bg-primary data-[active=true]:text-white mb-2"
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
        {/* 2. Attach the logout function to the onClick handler */}
        <div className="">
            <Button className='w-full' variant="secondary" onClick={logout}>Logout</Button>
        </div>
      </SidebarMenu>
    </SidebarGroup>
  )
}