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
import PrismaLight from "@/assets/prisma-light.svg";
import PrismaDark from "@/assets/prisma-dark.svg";
// import NeonLight from "@/assets/neon-light.svg";
// import NeonDark from "@/assets/neon-dark.svg";
import { useTheme } from "../theme-provider";

const logoData = [
  { name: "React", light: ReactLight, dark: ReactDark },
  { name: "Express", light: ExpressLight, dark: ExpressDark },
  { name: "Tailwind", light: TailwindLight, dark: TailwindDark },
  { name: "shadcn/ui", light: ShadcnLight, dark: ShadcnDark },
  { name: "Prisma", light: PrismaLight, dark: PrismaDark },
  // { name: "Neon", light: NeonLight, dark: NeonDark },
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
        <h2 className="text-4xl font-semibold mb-10 text-center">
          Powered by the best
        </h2>

        {/* auto-fit grid: creates as many equal columns as will fit */}
        <div
          className="grid gap-6 items-center justify-center w-full"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
        >
          {logoData.map((logo, index) => (
            <div
              key={index}
              className="h-24 flex items-center justify-center px-4 min-w-0"
            >
              <img
                src={mode === "dark" ? logo.light : logo.dark}
                alt={`${logo.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PowerBy;
