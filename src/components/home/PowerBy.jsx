import React from "react";
// Import tech logos (light/dark)
import ReactLight from "@/assets/react-light.svg";
import ReactDark from "@/assets/react-dark.svg";
import ExpressLight from "@/assets/express-light.svg";
import ExpressDark from "@/assets/express-dark.svg";
import TailwindLight from "@/assets/tailwind-light.svg";
import TailwindDark from "@/assets/tailwind-dark.svg";
import ShadcnLight from "@/assets/shadcn-light.svg";
import ShadcnDark from "@/assets/shadcn-dark.svg";
import { useTheme } from "../theme-provider";

const logoData = [
  {
    name: "React",
    light: ReactLight,   // show when dark mode
    dark: ReactDark,     // show when light mode
  },
  {
    name: "Express",
    light: ExpressLight,
    dark: ExpressDark,
  },
  {
    name: "Tailwind",
    light: TailwindLight,
    dark: TailwindDark,
  },
  {
    name: "shadcn/ui",
    light: ShadcnLight,
    dark: ShadcnDark,
  },
];

const PowerBy = () => {
  const { theme } = useTheme();

  let mode = theme;
  if (mode === "system") {
    mode = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return (
    <section className="w-full py-10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-4xl font-semibold mb-10 text-center">
          Powered by the best
        </h2>

        {/* Logos Row */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-15 items-center justify-center">
  {logoData.map((logo, index) => (
    <div
      key={index}
      className="flex items-center justify-center w-auto h-20"
    >
      <img
        src={mode === "dark" ? logo.light : logo.dark}
        alt={logo.name + " logo"}
        className="max-h-12 max-w-full object-contain"
      />
    </div>
  ))}
</div>

      </div>
      
    </section>
  );
};

export default PowerBy;
