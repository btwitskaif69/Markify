"use client";

import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import {
  GET_STARTED_LINKS,
  PRODUCT_LINKS,
  RESOURCE_LINKS,
} from "@/data/siteLinks";

const logo = "/assets/logo.svg";

function Footer() {
  return (
    <footer className="relative bg-background text-foreground overflow-hidden pb-8 pt-24 border-t border-border/40">
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-32">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="bg-primary p-2 rounded-xl">
                <img
                  src={logo}
                  alt="Markify"
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 brightness-0 invert transition-transform duration-500 ease-out group-hover:rotate-[360deg]"
                />
              </div>
              <span className="text-3xl font-bold tracking-tight text-foreground">
                Markify
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 w-full lg:w-auto">
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Product
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Resources
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {RESOURCE_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Get Started
              </h3>
              <div className="bg-muted p-2 rounded-xl w-fit mb-4 border border-border">
                <img
                  src="/images/markify-qr.svg"
                  alt="Markify quick start QR"
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 mix-blend-multiply dark:mix-blend-screen dark:invert"
                />
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {GET_STARTED_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Social
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://linkedin.com/company/markifytech"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com/@markifytech"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Youtube className="h-4 w-4" /> YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/markifytech"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Twitter className="h-4 w-4" /> X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/markifytech"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground font-medium pt-8 border-t border-border/40">
          <p>(c) 2026 Markify Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/" className="hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors duration-200">
              About
            </Link>
            <Link href="/pricing" className="hover:text-primary transition-colors duration-200">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-primary transition-colors duration-200">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none flex justify-center items-end"
        aria-hidden="true"
      >
        <p className="text-[25vw] leading-[0.75] font-semibold text-foreground/5 tracking-tight whitespace-nowrap transform translate-y-[20%]">
          Markify
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </footer>
  );
}

export default Footer;
