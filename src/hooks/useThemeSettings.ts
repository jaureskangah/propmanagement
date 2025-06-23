
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useThemeSettings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (isDark: boolean) => {
    setTheme(isDark ? "dark" : "light");
  };

  return {
    theme: resolvedTheme,
    mounted,
    toggleTheme,
  };
};
