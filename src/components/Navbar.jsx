"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useThemeToggle } from "@/client/hooks/useThemeToggle";
import { AnimationStyles } from "./theme-animations";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { NAV_LINKS } from "@/data/siteLinks";
import { useAuth } from "@/client/context/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  // 1. Get theme and setTheme from the useTheme() hook
  const { theme, setTheme } = useTheme();

  // 2. Pass theme and setTheme to useThemeToggle
  const { isDark, animationConfig, handleThemeToggle } = useThemeToggle(
    theme,
    setTheme
  );

  return (
    <ResizableNavbar>
      {/* Desktop Navbar */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={NAV_LINKS} onItemClick={closeMobileMenu} />
        <AnimationStyles variant={animationConfig.variant} start={animationConfig.start} />
        <button
          onClick={handleThemeToggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`flex items-end mr-5 cursor-pointer relative z-50 transition-transform duration-1000 bg-transparent border-none ${isDark ? "rotate-180" : "rotate-0"
            }`}
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500" />
          )}
        </button>
        <NavbarButton as={Link} href={isAuthenticated && user ? `/dashboard/${user.id}` : "/signup"}>
          {isAuthenticated ? "Dashboard" : "Sign Up"}
        </NavbarButton>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />

          <button
            onClick={handleThemeToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-end mr-5 cursor-pointer relative z-50 transition-transform duration-1000 bg-transparent border-none ${isDark ? "rotate-180" : "rotate-0"
              }`}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500" />
            ) : (
              <Moon className="h-6 w-6 text-gray-500" />
            )}
          </button>

          <MobileNavToggle isOpen={mobileOpen} onClick={toggleMobileMenu} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileOpen} onClose={closeMobileMenu}>
          {NAV_LINKS.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={closeMobileMenu}
              className="w-full px-4 py-2 text-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
            >
              {item.name}
            </Link>
          ))}
          <NavbarButton as={Link} href={isAuthenticated && user ? `/dashboard/${user.id}` : "/signup"} className="w-full mt-4">
            {isAuthenticated ? "Dashboard" : "Sign Up"}
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;
