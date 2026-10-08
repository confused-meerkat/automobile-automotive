import Image from "next/image";
import styles from "./landing.module.css";
import FooterContact from "./FooterContact";
import { footer } from "./content";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.foot}`}>
        <div className={styles.footLeft}>
          <span className={styles.footLogo}>
            <Image src="/images/logo-v1-full.png" alt="Gemba Concepts" width={480} height={319} sizes="72px" />
          </span>
          <p className={styles.footCopy}>{footer.copyright}</p>
        </div>
        <FooterContact />
      </div>
    </footer>
  );
}
