"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../landing.module.css";
import s from "./sop.module.css";
import Accent from "../Accent";
import LeadForm from "../LeadForm";
import { config, sopCheck } from "../content";
import { readUnlock, type Unlock } from "./logic";

/**
 * The contact gate in front of the readiness check. Same fields as the other forms on the page.
 * - "section": the #assessment band on the landing page. On submit it opens the tool page.
 * - "page": shown on the tool page itself to anyone who has not shared their details yet.
 */
export default function SopGate({ variant, onUnlock }: { variant: "section" | "page"; onUnlock?: (u: Unlock) => void }) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState<Unlock | null>(null);

  useEffect(() => {
    if (variant === "section") setUnlocked(readUnlock());
  }, [variant]);

  const Heading = variant === "page" ? "h1" : "h2";

  return (
    <div className={`${styles.grid} ${styles.assessGrid} ${s.tool}`}>
      <div className={`${styles.assessL} ${s.gateCopy}`}>
        <span className={styles.chip}>{sopCheck.chip}</span>
        <Heading id="assess-title" className={variant === "page" ? styles.h1 : styles.h2}>
          <Accent h={sopCheck.title} />
        </Heading>
        <p className={styles.subMuted}>{sopCheck.body}</p>
        <div className={s.factsRow}>
          {sopCheck.facts.map((f) => (
            <div key={f.title}>
              <strong>{f.title}</strong>
              <span>{f.sub}</span>
            </div>
          ))}
        </div>
        <p className={`${s.note} ${s.sopNote}`}>{sopCheck.sopNote}</p>
      </div>
      <div className={styles.assessR}>
        <div className={styles.formCard}>
          {unlocked ? (
            <div className={s.unlocked}>
              <h3 className={s.h3}>
                {sopCheck.unlockedTitle}
                {unlocked.lead.fullname ? `, ${unlocked.lead.fullname.split(" ")[0]}` : ""}.
              </h3>
              <p>{sopCheck.unlockedBody}</p>
              <a className={`${styles.btn} ${styles.btnPrimary}`} href={config.toolPath}>
                {sopCheck.unlockedButton}
              </a>
            </div>
          ) : (
            <>
              <div className={s.gateHead}>
                <h3 className={s.h3}>{sopCheck.gateTitle}</h3>
                <p>{sopCheck.gateBody}</p>
              </div>
              <LeadForm
                placement="tool"
                buttonLabel={sopCheck.gateButton}
                ariaLabel={`Unlock the ${sopCheck.name}`}
                onDone={(u) => {
                  const full = { ...u, at: new Date().toISOString() };
                  if (onUnlock) onUnlock(full);
                  else router.push(config.toolPath);
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
