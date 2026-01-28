"use client";

import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/client/context/AuthContext";

export default function Providers({ children }) {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" richColors closeButton />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
