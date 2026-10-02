"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import styles from "./landing.module.css";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "dark",
  setTheme: () => {},
});

export const useLandingTheme = () => useContext(ThemeContext);

const BODY_BG: Record<Theme, string> = { dark: "#000000", light: "#f4f1ea" };

/**
 * Wraps the page, holds the light/dark choice and scopes the colour tokens.
 * Dark is the default, like the live site. If the main site already has a
 * site-wide theme provider, drive `data-theme` from it instead.
 */
export default function ThemeShell({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("gc-theme");
      if (saved === "light" || saved === "dark") setThemeState(saved);
    } catch {
      /* storage blocked: keep dark */
    }
  }, []);

  useEffect(() => {
    document.body.style.background = BODY_BG[theme];
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      window.localStorage.setItem("gc-theme", t);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={styles.page} data-theme={theme} data-gc-page="">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
