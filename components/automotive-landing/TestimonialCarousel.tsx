"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./landing.module.css";
import Accent from "./Accent";
import { PlateLogo } from "./LogoImage";
import { testimonials } from "./content";

export default function TestimonialCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const t = track.current;
    if (!t) return;
    setAtStart(t.scrollLeft < 8);
    setAtEnd(t.scrollLeft + t.clientWidth > t.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const move = (dir: 1 | -1) => {
    const t = track.current;
    const card = t?.querySelector<HTMLElement>("[data-card]");
    if (!t || !card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap || "24") || 24;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className={styles.sectionLg} style={{ background: "var(--surface-subtle)" }} aria-labelledby="tv-title">
      <div className={styles.wrap}>
        <div className={styles.tvHead}>
          <div>
            <span className={styles.chip}>{testimonials.chip}</span>
            <h2 id="tv-title" className={styles.h2s}>
              <Accent h={testimonials.title} />
            </h2>
          </div>
          <div className={styles.arrows}>
            <button type="button" aria-label="Previous testimonials" disabled={atStart} onClick={() => move(-1)}>
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button type="button" aria-label="Next testimonials" disabled={atEnd} onClick={() => move(1)}>
              <ChevronRight size={20} aria-hidden />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.track} ref={track} onScroll={update} tabIndex={0} aria-label="Client testimonials">
        {testimonials.items.map((t) => (
          <div className={styles.tCard} key={t.name} data-card="">
            <figure className={styles.tFig}>
              <div className={styles.tIn}>
                <span className={styles.plate}>
                  <PlateLogo src={t.logo} name={t.plateName} />
                </span>
                <blockquote className={styles.quote}>“{t.quote}”</blockquote>
                <figcaption className={styles.tCaption}>
                  <p className={styles.tName}>{t.name}</p>
                  <p className={styles.tRole}>{t.role}</p>
                  <p className={styles.tCo}>{t.company}</p>
                  <p className={styles.tSector}>{t.sector}</p>
                </figcaption>
              </div>
              <span className={styles.initials} aria-hidden="true">
                {t.initials}
              </span>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
