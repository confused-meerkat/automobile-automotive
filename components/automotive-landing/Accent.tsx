import styles from "./landing.module.css";
import type { Headline } from "./content";

/** Renders a headline with its one green accent word or phrase at the end. */
export default function Accent({ h }: { h: Headline }) {
  return (
    <>
      {h.lead} <span className={styles.acc}>{h.accent}</span>
    </>
  );
}
