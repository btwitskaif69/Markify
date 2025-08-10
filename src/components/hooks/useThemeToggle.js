// src/components/Dashboard/useThemeToggle.js
import { useState } from "react";

export function useThemeToggle(theme, setTheme) {
  const isDark = theme === "dark";
  const [animationConfig, setAnimationConfig] = useState({ variant: "circle", start: "top-left" });

  const handleThemeToggle = () => {
    const newTheme = isDark ? "light" : "dark";
    const nextAnimation = newTheme === "dark" ? "bottom-right" : "top-left";

    setAnimationConfig({ variant: "circle-blur", start: nextAnimation });

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  return { isDark, animationConfig, handleThemeToggle };
}
