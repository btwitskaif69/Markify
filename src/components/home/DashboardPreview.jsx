import React from "react";
import dark from "@/assets/preview-dark.png";
import light from "@/assets/preview-light.png";
import { useTheme } from "../theme-provider";

const DashboardPreview = () => {
  const { theme } = useTheme();

  return (
    <div className="w-[calc(100vw-32px)] md:w-[1500px]">
      <div className="bg-primary shadow-amber-300 rounded-xl p-2 shadow-2xl">
        <img
          src={theme === "dark" ? dark : light}
          alt="Dashboard preview"
          width={1160}
          height={700}
          className="w-full h-full object-cover rounded-xl shadow-lg"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default DashboardPreview;
