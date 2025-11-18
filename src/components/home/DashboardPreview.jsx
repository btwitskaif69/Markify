import React from "react";
import dark from "@/assets/preview-dark.png";
import light from "@/assets/preview-light.png";
import { useTheme } from "../theme-provider";

const DashboardPreview = () => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-[90vw] max-w-[1600px] min-w-[350px]">
        <div className="bg-primary shadow-amber-300 rounded-md sm:rounded-3xl p-1 sm:p-3 shadow-2xl overflow-hidden">
          <img
            src={theme === "dark" ? dark : light}
            alt="Dashboard preview"
            width={1160}
            height={700}
            className="w-full h-auto object-cover rounded-lg sm:rounded-2xl shadow-lg"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
