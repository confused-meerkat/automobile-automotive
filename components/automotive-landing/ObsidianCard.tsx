import type { CSSProperties, ReactNode } from "react";
import styles from "./landing.module.css";

// Circuit traces drawn inside every Obsidian card, same paths and timing as the live site.
const TRACES: { d: string; dur: string; delay: string }[] = [
  { d: "M 96 0 L 96 134 Q 96 144 106 144 L 230 144 Q 240 144 240 154 L 240 400", dur: "6.5s", delay: "0s" },
  { d: "M 0 96 L 182 96 Q 192 96 192 106 L 192 278 Q 192 288 202 288 L 384 288", dur: "8.2s", delay: "1.7s" },
  { d: "M 288 0 L 288 230 Q 288 240 278 240 L 144 240", dur: "5.1s", delay: "3.1s" },
  { d: "M 0 336 L 86 336 Q 96 336 96 326 L 96 192", dur: "9.4s", delay: "0.8s" },
];

type Props = {
  children: ReactNode;
  className?: string;
  /** Delay for the sweep along the top edge, so neighbouring cards don't pulse in sync. */
  sweepDelay?: string;
  "aria-label"?: string;
};

export default function ObsidianCard({ children, className, sweepDelay = "0s", ...rest }: Props) {
  return (
    <article
      className={[styles.card, className].filter(Boolean).join(" ")}
      style={{ "--d": sweepDelay } as CSSProperties}
      aria-label={rest["aria-label"]}
    >
      <span className={styles.gridOverlay} aria-hidden="true" />
      <svg className={styles.traces} viewBox="0 0 480 400" fill="none" aria-hidden="true">
        {TRACES.map((t) => (
          <g key={t.d}>
            <path d={t.d} className={styles.traceBase} />
            <path d={t.d} pathLength={1} className={styles.traceGlow} style={{ animationDuration: t.dur, animationDelay: t.delay }} />
            <path d={t.d} pathLength={1} className={styles.traceCore} style={{ animationDuration: t.dur, animationDelay: t.delay }} />
          </g>
        ))}
      </svg>
      <span className={styles.edge} aria-hidden="true" />
      <div className={styles.cardBody}>{children}</div>
    </article>
  );
}
