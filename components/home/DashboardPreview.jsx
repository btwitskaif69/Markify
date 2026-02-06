"use client";

import Image from "next/image";
import { useTheme } from "../theme-provider";

const PREVIEW_DARK = "/images/dashboard-preview-dark-1160.webp";
const PREVIEW_LIGHT = "/images/dashboard-preview-light-1160.webp";

const DashboardPreview = () => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="relative w-[90vw] max-w-[1600px] min-w-[350px]">
        <div className="relative z-10 rounded-md sm:rounded-3xl p-1 sm:p-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-md sm:rounded-3xl p-1 sm:p-3"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 78%, transparent) 0%, color-mix(in srgb, var(--color-primary) 32%, transparent) 44%, color-mix(in srgb, var(--color-primary) 8%, transparent) 72%, color-mix(in srgb, var(--color-primary) 0%, transparent) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div className="relative overflow-hidden rounded-lg sm:rounded-2xl">
            <Image
              src={theme === "dark" ? PREVIEW_DARK : PREVIEW_LIGHT}
              alt="Markify dashboard preview showing bookmark management interface"
              width={1160}
              height={700}
              className="w-full h-auto object-cover rounded-lg sm:rounded-2xl"
              sizes="(max-width: 640px) 90vw, (max-width: 1600px) 90vw, 1600px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
