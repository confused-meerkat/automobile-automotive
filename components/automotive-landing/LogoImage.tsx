"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./landing.module.css";

/**
 * Shows a logo; if the file is missing or blocked, shows the company name, so a
 * plate is never left blank. The mount check catches images that failed before
 * React hydrated (their error event fired before onError was attached).
 */
function useLogo(src?: string) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(!src);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  return { ref, failed, onError: () => setFailed(true) };
}

export function PlateLogo({ src, name }: { src?: string; name: string }) {
  const { ref, failed, onError } = useLogo(src);
  if (failed || !src) return <span className={styles.plateText}>{name}</span>;
  return (
    <Image
      ref={ref}
      src={src}
      alt={name}
      width={140}
      height={40}
      className={styles.plateImg}
      unoptimized={src.endsWith(".svg")}
      onError={onError}
    />
  );
}

export function MarqueeLogo({ src, name }: { src?: string; name: string }) {
  const { ref, failed, onError } = useLogo(src);
  if (failed || !src) return <span className={styles.logoName}>{name}</span>;
  return (
    <span className={styles.logoBox}>
      <Image ref={ref} src={src} alt={name} fill sizes="200px" unoptimized={src.endsWith(".svg")} onError={onError} />
    </span>
  );
}
