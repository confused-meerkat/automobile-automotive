"use client";

import { useEffect, useRef } from "react";
import styles from "./landing.module.css";
import { useLandingTheme } from "./ThemeShell";

type Streak = { horiz: boolean; at: number; pos: number; dir: 1 | -1; len: number; sp: number };

/** The hero's grid ground with green streaks travelling along the lines. */
export default function HeroGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useLandingTheme();

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const host = (cv.closest("[data-gc-page]") as HTMLElement) || document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = (n: string) => getComputedStyle(host).getPropertyValue(n).trim();

    let W = 0;
    let H = 0;
    let cell = 96;
    let streaks: Streak[] = [];
    let last = 0;
    let spawn = 0;
    let visible = true;
    let raf = 0;
    let base: HTMLCanvasElement | null = null;

    const drawBase = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      base = document.createElement("canvas");
      base.width = W * dpr;
      base.height = H * dpr;
      const b = base.getContext("2d");
      if (!b) return;
      b.scale(dpr, dpr);
      b.strokeStyle = css("--grid-line");
      b.globalAlpha = 0.55;
      b.lineWidth = 1;
      for (let x = 0.5; x < W; x += cell) {
        b.beginPath();
        b.moveTo(x, 0);
        b.lineTo(x, H);
        b.stroke();
      }
      for (let y = 0.5; y < H; y += cell) {
        b.beginPath();
        b.moveTo(0, y);
        b.lineTo(W, y);
        b.stroke();
      }
      b.globalAlpha = 0.7;
      b.fillStyle = css("--grid-dot");
      for (let x = 0.5; x < W; x += cell)
        for (let y = 0.5; y < H; y += cell) {
          b.beginPath();
          b.arc(x, y, 1.1, 0, Math.PI * 2);
          b.fill();
        }
    };

    const add = () => {
      const horiz = Math.random() < 0.55;
      const n = Math.floor(Math.random() * Math.ceil((horiz ? H : W) / cell));
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
      const len = 70 + Math.random() * 70;
      const sp = 60 + Math.random() * 40;
      streaks.push({ horiz, at: n * cell + 0.5, pos: dir > 0 ? -len : (horiz ? W : H) + len, dir, len, sp });
    };

    const frame = (t: number, once = false) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      ctx.clearRect(0, 0, W, H);
      if (base) ctx.drawImage(base, 0, 0, W, H);
      if (!reduce) {
        spawn -= dt;
        if (spawn <= 0 && streaks.length < 7) {
          add();
          spawn = 0.7 + Math.random() * 0.9;
        }
        const col = css("--streak");
        for (const s of streaks) {
          s.pos += s.dir * s.sp * dt;
          const a = s.pos;
          const bp = s.pos - s.dir * s.len;
          const g = s.horiz ? ctx.createLinearGradient(bp, 0, a, 0) : ctx.createLinearGradient(0, bp, 0, a);
          g.addColorStop(0, "transparent");
          g.addColorStop(1, col);
          ctx.save();
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = col;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          if (s.horiz) {
            ctx.moveTo(bp, s.at);
            ctx.lineTo(a, s.at);
          } else {
            ctx.moveTo(s.at, bp);
            ctx.lineTo(s.at, a);
          }
          ctx.stroke();
          ctx.restore();
        }
        streaks = streaks.filter((s) => (s.dir > 0 ? s.pos - s.len < (s.horiz ? W : H) : s.pos + s.len > 0));
      }
      if (!once && visible && !reduce) raf = requestAnimationFrame((n) => frame(n));
    };

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      cell = W < 768 ? 64 : 96;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBase();
      frame(performance.now(), true);
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    let io: IntersectionObserver | null = null;
    if (!reduce) {
      io = new IntersectionObserver((entries) => {
        const v = entries[0]?.isIntersecting ?? true;
        if (v && !visible) {
          visible = true;
          last = 0;
          raf = requestAnimationFrame((n) => frame(n));
        }
        visible = v;
      });
      io.observe(cv);
      raf = requestAnimationFrame((n) => frame(n));
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
    };
  }, [theme]);

  return <canvas ref={ref} className={styles.heroCanvas} aria-hidden="true" />;
}
