"use client";

import Link from "next/link";
import PropTypes from "prop-types";
import { NavMain } from "@/components/dashboard/nav-main"

import { NavCollections } from "@/components/dashboard/nav-collections"
import { NavUser } from "@/components/dashboard/nav-user"
import { useAuth } from "@/client/context/AuthContext"
import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { SparklesIcon } from "@/components/ui/sparkles-icon";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import ImportExport from "./ImportExport";
const logo = "/assets/logo.svg";

export function AppSidebar({ collections, onCreateCollection, onRenameCollection, onDeleteCollection, onShareCollection, totalBookmarks, onRefetchBookmarks, ...props }) {
  const { user, token, hasProAccess } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const sparklesRef = useRef(null);

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
            source: "dashboard-sidebar",
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
            <div className="flex flex-1 min-w-0 items-center gap-2 text-left leading-tight">
              <span className="truncate text-lg font-semibold">Markify</span>
              {hasProAccess && (
                <LiquidMetalButton
                  label="PRO"
                  badge
                  className="shrink-0"
                  labelColor="#ff6900"
                />
              )}
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain totalBookmarks={totalBookmarks} />

        <NavCollections
          collections={collections}
          onCreate={onCreateCollection}
          onRename={onRenameCollection}
          onDelete={onDeleteCollection}
          onShare={onShareCollection}
        />
        <ImportExport onRefetch={onRefetchBookmarks} />
      </SidebarContent>
      <SidebarFooter>
        {!hasProAccess && (
          <div
            className="p-4 mx-2 mb-2 rounded-xl border border-zinc-200 dark:border-white/10 relative overflow-hidden group/promo text-center flex flex-col justify-between min-h-[280px] group-data-[collapsible=icon]:hidden bg-zinc-950 text-white"
            onMouseEnter={() => sparklesRef.current?.startAnimation()}
            onMouseLeave={() => sparklesRef.current?.stopAnimation()}
          >
            {/* Flames video background */}
            <video
              src="/flames.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ opacity: "var(--var-opacity)" }}
              className="absolute inset-0 h-full w-full rotate-45 scale-[1.8] object-cover"
            />

            <div className="flex justify-center relative z-10 opacity-50 group-hover/promo:opacity-100 group-hover/promo:text-white transition-all duration-300 mb-2">
              <SparklesIcon ref={sparklesRef} size={25} />
            </div>

            <div className="relative z-10">
              <h3 className="tracking-tight opacity-50 group-hover/promo:opacity-100 group-hover/promo:text-white group-hover/promo:scale-105 font-medium text-xl scale-100 transition-[transform,opacity,color] duration-[850ms] ease-[cubic-bezier(0.34,1.3,0.64,1)]">Unlock Unlimited Bookmarks & Advanced Organization with PRO</h3>
            </div>

            <div className="w-full relative z-10 mt-2">
              <div className={isCheckingOut ? "pointer-events-none w-full" : "w-full"}>
                <LiquidMetalButton
                  label={
                    isCheckingOut ? (
                      <span className="flex items-center justify-center gap-1.5 font-medium">
                        Getting Pro
                        <span
                          className="h-5 w-5 animate-spin bg-primary block"
                          style={{
                            maskImage: `url(${logo})`,
                            WebkitMaskImage: `url(${logo})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center',
                          }}
                        />
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 font-medium">
                        Get Pro
                        <Sparkles size={13} />
                      </span>
                    )
                  }
                  onClick={handleCheckout}
                  fullWidth={true}
                  labelColor="#ff6900"
                />
              </div>
            </div>
          </div>
        )}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

AppSidebar.propTypes = {
  collections: PropTypes.array,
  onCreateCollection: PropTypes.func,
  onRenameCollection: PropTypes.func,
  onDeleteCollection: PropTypes.func,
  onShareCollection: PropTypes.func,
  totalBookmarks: PropTypes.number,
  onRefetchBookmarks: PropTypes.func,
};
