import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Smartphone,
  Tablet,
  Chrome
} from "lucide-react"
import logo from "@/assets/logo-light.svg"

function Footer() {
  return (
    <footer className="relative bg-[#000000] text-white overflow-hidden pb-20 pt-24 border-t border-white/5">
      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">

        {/* Top Section: Logo & Links */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-32">

          {/* Brand / Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="bg-white/5 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-colors border border-white/5">
                <img src={logo} alt="Markify" className="h-10 w-10 brightness-0 invert opacity-100" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">Markify</span>
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-20 w-full lg:w-auto">

            {/* Column 1: Product */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Product</h3>
              <ul className="space-y-4 text-sm text-white">
                <li><Link to="/what-is-markify" className="hover:text-primary transition-colors duration-200">What is Markify?</Link></li>
                <li><Link to="/features" className="hover:text-primary transition-colors duration-200">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors duration-200">Pricing</Link></li>
                <li><Link to="/enterprise" className="hover:text-primary transition-colors duration-200">Enterprise</Link></li>
                <li><Link to="/changelog" className="hover:text-primary transition-colors duration-200">Changelog</Link></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Resources</h3>
              <ul className="space-y-4 text-sm text-white">
                <li><Link to="/blog" className="hover:text-primary transition-colors duration-200">Blog</Link></li>
                <li><Link to="/docs" className="hover:text-primary transition-colors duration-200">Documentation</Link></li>
                <li><Link to="/help" className="hover:text-primary transition-colors duration-200">Help Center</Link></li>
                <li><Link to="/community" className="hover:text-primary transition-colors duration-200">Community</Link></li>
              </ul>
            </div>

            {/* Column 3: Download */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Download</h3>
              <div className="bg-white p-2 rounded-xl w-fit mb-4 border border-white/5">
                {/* QR Code Placeholder */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent("https://markify.tech")}&bgcolor=ffffff&color=000000&format=svg`}
                  alt="Download App"
                  className="h-20 w-20"
                />
              </div>
              <ul className="space-y-4 text-sm text-white">
                <li>
                  <Link to="/extension" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Chrome className="h-4 w-4" /> Chrome Extension
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Social</h3>
              <ul className="space-y-4 text-sm text-white">
                <li>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Youtube className="h-4 w-4" /> YouTube
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Twitter className="h-4 w-4" /> X (Twitter)
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors duration-200">
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-zinc-500 font-medium pt-8 border-t border-white/10">
          <p>© 2025 Markify Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-200">Privacy policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-200">Terms of service</Link>
            <Link to="/security" className="hover:text-primary transition-colors duration-200">Security</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors duration-200">Cookie settings</Link>
          </div>
        </div>
      </div>

      {/* Massive Background Watermark */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none flex justify-center items-end" aria-hidden="true">
        <h1 className="text-[25vw] leading-[0.75] font-semibold text-white/[0.04] tracking-tighter whitespace-nowrap transform translate-y-[20%]">
          Markify
        </h1>
      </div>

      {/* Overlay Gradient for Fade effect */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </footer>
  );
}

export default Footer;
