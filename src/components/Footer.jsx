import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.svg";
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";

function Footer() {
  const productLinks = [
    { label: "Solutions", to: "/solutions" },
    { label: "Pricing", to: "/pricing" },
    { label: "What is Markify?", to: "/what-is-markify" },
    { label: "Blog", to: "/blog" },
  ];

  const resourceLinks = [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
    { label: "Refund Policy", to: "/refund-policy" },
  ];

  const getStartedLinks = [
    { label: "Sign Up Free", to: "/signup" },
    { label: "Log In", to: "/login" },
    { label: "Pricing Plans", to: "/pricing" },
  ];

  const solutionLinks = SOLUTIONS.slice(0, 4).map((solution) => ({
    label: solution.title,
    to: getSolutionPath(solution.slug),
  }));

  return (
    <footer className="relative bg-background text-foreground overflow-hidden pb-20 pt-24 border-t border-border/40">
      {/* Content Container */}
      <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-8">
        {/* Top Section: Logo & Links */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-32">
          {/* Brand / Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="bg-primary p-2 rounded-xl">
                <img
                  src={logo}
                  alt="Markify"
                  className="h-10 w-10 brightness-0 invert dark:invert-0 opacity-100 hover:animate-spin"
                />
              </div>
              <span className="text-3xl font-bold tracking-tight text-foreground">
                Markify
              </span>
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16 w-full lg:w-auto">
            {/* Column 1: Product */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Product
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Solutions
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {solutionLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Resources
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {resourceLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Get Started */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Get Started
              </h3>
              <div className="bg-muted p-2 rounded-xl w-fit mb-4 border border-border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    "https://markify.tech"
                  )}&bgcolor=ffffff&color=000000&format=svg`}
                  alt="Markify quick start QR"
                  className="h-20 w-20 mix-blend-multiply dark:mix-blend-screen dark:invert"
                />
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                {getStartedLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Social */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Social
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Youtube className="h-4 w-4" /> YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
                  >
                    <Twitter className="h-4 w-4" /> X (Twitter)
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
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

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground font-medium pt-8 border-t border-border/40">
          <p>Ac 2025 Markify Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-200">
              Privacy policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-200">
              Terms of service
            </Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors duration-200">
              Refund policy
            </Link>
            <Link to="/cookies" className="hover:text-primary transition-colors duration-200">
              Cookie settings
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Background Watermark */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none flex justify-center items-end"
        aria-hidden="true"
      >
        <h1 className="text-[25vw] leading-[0.75] font-semibold text-foreground/5 tracking-tighter whitespace-nowrap transform translate-y-[20%]">
          Markify
        </h1>
      </div>

      {/* Overlay Gradient for Fade effect */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </footer>
  );
}

export default Footer;
