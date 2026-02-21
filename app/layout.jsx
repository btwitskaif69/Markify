import { Suspense } from "react";
import "./globals.css";
import "@/font.css";
import Providers from "./providers";
import { SITE_CONFIG } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import TrackingProvider from "@/components/analytics/TrackingProvider";

const ENV = globalThis?.process?.env || {};
const gscVerificationToken =
  ENV.NEXT_PUBLIC_GSC_VERIFICATION ||
  ENV.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN ||
  ENV.GSC_VERIFICATION_TOKEN ||
  undefined;

export const metadata = {
  ...buildMetadata({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.defaultDescription,
    path: "/",
  }),
  applicationName: SITE_CONFIG.name,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: gscVerificationToken
    ? {
      google: gscVerificationToken,
    }
    : undefined,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <TrackingProvider />
        </Suspense>
      </body>
    </html>
  );
}
