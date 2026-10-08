"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import styles from "./landing.module.css";
import { nav } from "./content";
import { useLandingTheme } from "./ThemeShell";

/** On the landing page the links stay in-page; other pages (the readiness check) point back to it. */
export default function SiteHeader({ homeHref = "#top", ctaHref = "#book" }: { homeHref?: string; ctaHref?: string }) {
  const { theme, setTheme } = useLandingTheme();
  return (
    <header className={styles.top}>
      <div className={styles.wrap}>
        <div className={styles.nav}>
          <a href={homeHref} className={styles.logoLink} aria-label="Gemba Concepts home">
            <Image
              src="/images/logo-v1-full.png"
              alt="Gemba Concepts"
              width={480}
              height={319}
              priority
              sizes="72px"
              className={styles.navLogo}
            />
          </a>
          <p className={styles.tag}>{nav.tagline}</p>
          <span className={styles.spacer} />
          <div className={styles.theme} role="group" aria-label="Colour theme">
            <button type="button" aria-pressed={theme === "light"} aria-label="Light theme" onClick={() => setTheme("light")}>
              <Sun size={16} strokeWidth={2} aria-hidden />
            </button>
            <button type="button" aria-pressed={theme === "dark"} aria-label="Dark theme" onClick={() => setTheme("dark")}>
              <Moon size={16} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <a className={styles.navBtn} href={ctaHref}>
            <span className={styles.navShort}>{nav.ctaShort}</span>
            <span className={styles.navLong}>{nav.cta}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
