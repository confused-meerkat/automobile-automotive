"use client";

import { useState } from "react";
import styles from "./landing.module.css";
import { config } from "./content";

export default function FooterContact() {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div className={styles.footRight}>
      <a
        className={`${styles.btn} ${styles.btnLine}`}
        href={`mailto:${config.email}`}
        onClick={() => {
          setShown(true);
          navigator.clipboard?.writeText(config.email).then(() => setCopied(true), () => {});
        }}
      >
        {copied ? "Email copied" : "Email us"}
      </a>
      <a className={`${styles.btn} ${styles.btnLine}`} href={config.whatsappUrl} target="_blank" rel="noopener noreferrer">
        WhatsApp us
      </a>
      {shown && <span className={styles.emailLine}>{config.email}</span>}
    </div>
  );
}
