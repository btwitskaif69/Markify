"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { useThemeToggle } from "../hooks/useThemeToggle";
import { AnimationStyles } from "./theme-animations";
import { useTheme } from "./theme-provider"; // Import the useTheme hook

import { Sun, Moon } from "lucide-react";

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <NavItems items={navItems} onItemClick={closeMobileMenu} />
        <AnimationStyles variant={animationConfig.variant} start={animationConfig.start} />
        <div
          onClick={handleThemeToggle}
          className={`flex items-end mr-5 cursor-pointer relative z-50 transition-transform duration-1000 ${
            isDark ? "rotate-180" : "rotate-0"
          }`}
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500" />
          )}
        </div>
        <NavbarButton as={Link} to="/signup">
          Sign Up
        </NavbarButton>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          
          <div
          onClick={handleThemeToggle}
          className={`flex items-end mr-5 cursor-pointer relative z-50 transition-transform duration-1000 ${
            isDark ? "rotate-180" : "rotate-0"
          }`}
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500" />
          )}
        </div>
        
          <MobileNavToggle isOpen={mobileOpen} onClick={toggleMobileMenu} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={mobileOpen} onClose={closeMobileMenu}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              to={item.link}
              onClick={closeMobileMenu}
              className="w-full px-4 py-2 text-lg text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded"
            >
              {item.name}
            </Link>
          ))}
          <NavbarButton as={Link} to="/subscribe" className="w-full mt-4">
            Subscribe
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;