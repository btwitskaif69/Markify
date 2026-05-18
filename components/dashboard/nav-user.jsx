import Link from "next/link";
import { useState } from "react";
import PropTypes from 'prop-types';
import {
  ChevronsUpDown,
  LogOut,
  Sparkles,
  BadgeCheck,
  CreditCard,
  MessageSquarePlus,
  Star,
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
import { useAuth } from "@/client/context/AuthContext";
import AccountDialog from "./AccountDialog";
import { FeatureRequestDialog } from "./FeatureRequestDialog";
import { ReviewDialog } from "./ReviewDialog";

export function NavUser({ user }) {
  const { logout, authFetch, updateProfile, hasProAccess, token } = useAuth();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [featureRequestDialogOpen, setFeatureRequestDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!token) {
      window.location.href = "/login?redirect=/dashboard";
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to create checkout session");
      const data = await response.json();
      if (data.url) {
        localStorage.setItem(
          "markify_pending_subscription",
          JSON.stringify({
            startedAt: Date.now(),
            source: "dashboard-user-menu",
          })
        );
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the checkout process.");
    } finally {
      setIsCheckingOut(false);
    }
  };

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
          <div className="flex w-full justify-center items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-accent  group-data-[collapsible=icon]:hover:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
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
          className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg z-50 bg-background"
          align="start"
          side={window.innerWidth < 640 ? "bottom" : "right"}
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
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
          {!hasProAccess && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>{isCheckingOut ? "Redirecting..." : "Upgrade to Pro"}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setAccountDialogOpen(true)}>
              <BadgeCheck className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={user ? `/dashboard/${user.id}/billing` : "/login"}
                className="cursor-pointer"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setFeatureRequestDialogOpen(true)}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              <span>Request a Feature</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setReviewDialogOpen(true)}>
              <Star className="mr-2 h-4 w-4" />
              <span>Leave a Review</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AccountDialog
        open={accountDialogOpen}
        setOpen={setAccountDialogOpen}
        user={user}
        authFetch={authFetch}
        onProfileUpdate={updateProfile}
      />

      <ReviewDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen} />
      <FeatureRequestDialog
        open={featureRequestDialogOpen}
        onOpenChange={setFeatureRequestDialogOpen}
      />
    </div>
  );
}

NavUser.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
  }),
};
