import React from "react";
import { useTheme } from "../theme-provider";

const PREVIEW_DARK = "/images/dashboard-preview-dark-960.webp";
const PREVIEW_LIGHT = "/images/dashboard-preview-light-960.webp";
const PREVIEW_DARK_SRCSET = [
  "/images/dashboard-preview-dark-360.webp 360w",
  "/images/dashboard-preview-dark-640.webp 640w",
  "/images/dashboard-preview-dark-960.webp 960w",
  "/images/dashboard-preview-dark-1160.webp 1160w",
].join(", ");
const PREVIEW_LIGHT_SRCSET = [
  "/images/dashboard-preview-light-360.webp 360w",
  "/images/dashboard-preview-light-640.webp 640w",
  "/images/dashboard-preview-light-960.webp 960w",
  "/images/dashboard-preview-light-1160.webp 1160w",
].join(", ");
const PREVIEW_SIZES =
  "(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1160px";

const DashboardPreview = () => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-[90vw] max-w-[1600px] min-w-[350px]">
        <div className="bg-primary shadow-amber-300 rounded-md sm:rounded-3xl p-1 sm:p-3 shadow-2xl overflow-hidden">
          <img
            src={theme === "dark" ? PREVIEW_DARK : PREVIEW_LIGHT}
            srcSet={theme === "dark" ? PREVIEW_DARK_SRCSET : PREVIEW_LIGHT_SRCSET}
            sizes={PREVIEW_SIZES}
            alt="Markify dashboard preview showing bookmark management interface"
            width={1160}
            height={652}
            className="w-full h-auto object-cover rounded-lg sm:rounded-2xl shadow-lg"
            fetchpriority="high"
            decoding="async"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
