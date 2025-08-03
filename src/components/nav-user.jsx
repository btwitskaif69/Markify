import React from "react";
import PropTypes from 'prop-types';
import {
  ChevronsUpDown,
  LogOut,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export function NavUser({ user }) {
  const { logout } = useAuth();

  if (!user) {
    return (
      <div className="p-2">
        <div className="w-full h-[52px] bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    // The outer padding has been removed to fix alignment
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="w-full group">
          <div className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent group-data-[collapsible=icon]:hover:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-primary">
                {user.name
                  ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
          </div>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg z-50"
          align="end"
          side="right"
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary">
                  {user.name
                    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Upgrade to Pro</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

NavUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
};