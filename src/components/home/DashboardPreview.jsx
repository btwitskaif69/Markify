import React from "react";
import { useTheme } from "../theme-provider";

const PREVIEW_DARK = "https://assets.markify.tech/assets/assets_preview-dark.webp";
const PREVIEW_LIGHT = "https://assets.markify.tech/assets/assets_preview-light.webp";

const DashboardPreview = () => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-[90vw] max-w-[1600px] min-w-[350px]">
        <div className="bg-primary shadow-amber-300 rounded-md sm:rounded-3xl p-1 sm:p-3 shadow-2xl overflow-hidden">
          <img
            src={theme === "dark" ? PREVIEW_DARK : PREVIEW_LIGHT}
            alt="Markify dashboard preview showing bookmark management interface"
            width={1160}
            height={700}
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
