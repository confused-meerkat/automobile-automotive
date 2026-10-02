import Image from "next/image";
import type { CSSProperties } from "react";
import { Activity, BatteryCharging, Check, Clock, Factory, Plus, Truck } from "lucide-react";
import styles from "./landing.module.css";
import ThemeShell from "./ThemeShell";
import SiteHeader from "./SiteHeader";
import HeroGrid from "./HeroGrid";
import ObsidianCard from "./ObsidianCard";
import LeadForm from "./LeadForm";
import TestimonialCarousel from "./TestimonialCarousel";
import FooterContact from "./FooterContact";
import { MarqueeLogo } from "./LogoImage";
import Accent from "./Accent";
import {
  approach,
  assessment,
  config,
  faq,
  finalCta,
  footer,
  form,
  gains,
  growth,
  hero,
  results,
  segments,
  stats,
  trust,
} from "./content";

const GROWTH_ICONS = { factory: Factory, battery: BatteryCharging, truck: Truck, activity: Activity } as const;
const FACT_ICONS = [Clock, Check, Factory];

export default function AutomotiveLanding() {
  const progress = `${(assessment.currentStation / (assessment.stations.length - 1)) * 83.34}%`;

  return (
    <ThemeShell>
      <SiteHeader />

      <main id="top">
        {/* Hero + form + stats */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <HeroGrid />
          <div className={`${styles.wrap} ${styles.section}`}>
            <div className={`${styles.grid} ${styles.heroGrid}`}>
              <div className={styles.heroCopy}>
                <span className={styles.chip}>{hero.chip}</span>
                <h1 id="hero-title" className={styles.h1}>
                  {hero.title}
                </h1>
                <p className={styles.lead}>{hero.lead}</p>
                <ul className={styles.ticks}>
                  {hero.ticks.map((t) => (
                    <li key={t}>
                      <Check aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.heroForm}>
                <div className={styles.formCard}>
                  <LeadForm placement="hero" buttonLabel={form.heroButton} />
                </div>
              </div>
              <div className={styles.stats}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className={styles.statNum}>{s.value}</div>
                    <p className={styles.statLabel}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.divider} aria-hidden="true">
          <svg viewBox="0 0 1440 112" preserveAspectRatio="xMidYMid slice" fill="none">
            <path d="M0 40 H420 Q432 40 432 52 V53 Q432 65 444 65 H1440" stroke="var(--line)" strokeWidth={1} />
            <path
              d="M0 40 H420 Q432 40 432 52 V53 Q432 65 444 65 H1440"
              pathLength={1}
              stroke="var(--streak)"
              strokeWidth={2}
              className={styles.traceCore}
              style={{ strokeDasharray: "0.05 0.95", animationDuration: "7s", filter: "drop-shadow(0 0 5px var(--accent-500))" }}
            />
            <circle cx="432" cy="52.5" r="3" stroke="var(--line-strong)" strokeWidth={1} fill="var(--surface-subtle)" />
          </svg>
        </div>

        {/* Where the next gain sits */}
        <section style={{ background: "var(--surface)" }} aria-labelledby="gains-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <div className={`${styles.grid} ${styles.headGrid}`}>
              <div className={styles.headL}>
                <span className={styles.chip}>{gains.chip}</span>
                <h2 id="gains-title" className={styles.h2}>
                  <Accent h={gains.title} />
                </h2>
              </div>
              <div className={styles.headR}>
                <p className={styles.rTitle}>{gains.sideTitle}</p>
                <p className={styles.rBody}>{gains.sideBody}</p>
              </div>
            </div>
            <div className={`${styles.grid} ${styles.cards} ${styles.mt9}`}>
              {gains.cards.map((c, i) => (
                <ObsidianCard key={c.title.lead} sweepDelay={`${i * 0.75}s`}>
                  <p className={styles.idx}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={styles.cardTitle}>
                    <Accent h={c.title} />
                  </h3>
                  <p className={styles.p1}>{c.see}</p>
                  <p className={styles.p2}>{c.doo}</p>
                  {c.note && <p className={styles.note}>{c.note}</p>}
                  <p className={styles.res}>
                    <span className={styles.acc}>Result: </span>
                    {c.result}
                  </p>
                </ObsidianCard>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <a className={`${styles.btn} ${styles.btnWhite}`} href="#book">
                {gains.button}
              </a>
            </div>
          </div>
        </section>

        {/* Assessment tool */}
        <section id="assessment" style={{ background: "var(--surface-subtle)" }} aria-labelledby="assess-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <div className={`${styles.grid} ${styles.assessGrid}`}>
              <div className={styles.assessL}>
                <span className={styles.chip}>{assessment.chip}</span>
                <h2 id="assess-title" className={styles.h2}>
                  <Accent h={assessment.title} />
                </h2>
                <p className={styles.subMuted}>{assessment.body}</p>
                <div className={styles.facts}>
                  {assessment.facts.map((f, i) => {
                    const Icon = FACT_ICONS[i] ?? Check;
                    return (
                      <span key={f}>
                        <Icon aria-hidden />
                        {f}
                      </span>
                    );
                  })}
                </div>
                <a className={`${styles.btn} ${styles.btnPrimary} ${styles.assessBtn}`} href={config.assessmentUrl}>
                  {assessment.button}
                </a>
              </div>
              <div className={styles.assessR}>
                <ObsidianCard sweepDelay="0.4s" aria-label="Example of the assessment">
                  <div className={styles.pvTop}>
                    <p className={styles.pvTag}>{assessment.previewLabel}</p>
                    <p className={styles.pvTag}>Example</p>
                  </div>
                  <div className={styles.stations} style={{ "--progress": progress } as CSSProperties}>
                    {assessment.stations.map((s, i) => (
                      <div
                        key={s}
                        className={[
                          styles.station,
                          i < assessment.currentStation ? styles.stationDone : "",
                          i === assessment.currentStation ? styles.stationNow : "",
                        ].join(" ")}
                      >
                        <b>{i + 1}</b>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <p className={styles.stationCaption}>
                    Area {assessment.currentStation + 1} of {assessment.stations.length} · {assessment.stations[assessment.currentStation]}
                  </p>
                  <div className={styles.bars}>
                    {assessment.exampleBars.map((b) => (
                      <div key={b.label} className={styles.bar}>
                        <i style={{ "--v": `${b.inPlace}%` } as CSSProperties} aria-hidden="true" />
                        <span>{b.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.legend}>
                    <em>
                      <i className={styles.legendIn} />
                      In place today
                    </em>
                    <em>
                      <i className={styles.legendUp} />
                      Upside available
                    </em>
                  </div>
                </ObsidianCard>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section style={{ background: "var(--surface)" }} aria-labelledby="results-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <span className={styles.chip}>{results.chip}</span>
            <h2 id="results-title" className={styles.h2s}>
              <Accent h={results.title} />
            </h2>
            <p className={styles.sub}>{results.sub}</p>
            <div className={`${styles.grid} ${styles.cards} ${styles.mt9}`}>
              {results.cards.map((r, i) => (
                <ObsidianCard key={r.title} className={styles.resCard} sweepDelay={`${i * 1.125}s`}>
                  <p className={styles.ind}>{r.industry}</p>
                  <h3 className={styles.cardTitle}>{r.title}</h3>
                  <ul className={styles.checks}>
                    {r.points.map((p) => (
                      <li key={p}>
                        <Check aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </ObsidianCard>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <a className={`${styles.btn} ${styles.btnWhite}`} href="#book">
                {results.button}
              </a>
            </div>
          </div>
        </section>

        {/* The Gemba Approach */}
        <section id="approach" style={{ background: "var(--surface-subtle)" }} aria-labelledby="approach-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <span className={styles.chip}>{approach.chip}</span>
            <h2 id="approach-title" className={styles.h2s}>
              <Accent h={approach.title} />
            </h2>
            <p className={styles.sub}>{approach.sub}</p>
            <ol className={styles.steps}>
              {approach.steps.map((s, i) => (
                <li key={s.title.accent} className={styles.step}>
                  <p className={styles.idx}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={styles.stepTitle}>
                    <Accent h={s.title} />
                  </h3>
                  <p className={styles.stepBody}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Who we work with */}
        <section style={{ background: "var(--surface)" }} aria-labelledby="segments-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <span className={styles.chip}>{segments.chip}</span>
            <h2 id="segments-title" className={styles.h2s}>
              <Accent h={segments.title} />
            </h2>
            <p className={styles.sub}>{segments.sub}</p>
            {segments.groups.map((g) => (
              <div key={g.label} className={styles.group}>
                <h3 className={styles.groupLabel}>{g.label}</h3>
                <div className={styles.iChips}>
                  {g.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Growing */}
        <section style={{ background: "var(--surface)" }} aria-labelledby="growth-title">
          <div className={`${styles.wrap} ${styles.section}`} style={{ paddingTop: 0 }}>
            <span className={styles.chip}>{growth.chip}</span>
            <h2 id="growth-title" className={styles.h2s}>
              <Accent h={growth.title} />
            </h2>
            <p className={styles.sub}>{growth.sub}</p>
            <div className={styles.tiles}>
              {growth.tiles.map((t) => {
                const Icon = GROWTH_ICONS[t.icon];
                return (
                  <div key={t.title} className={styles.tile}>
                    <Icon strokeWidth={1.25} aria-hidden />
                    <h3 className={styles.tileTitle}>{t.title}</h3>
                    <p className={styles.tileBody}>{t.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <TestimonialCarousel />

        {/* Trust band */}
        <section className={styles.trust} aria-labelledby="trust-title">
          <div className={`${styles.glow} ${styles.g1}`} aria-hidden="true" />
          <div className={`${styles.glow} ${styles.g2}`} aria-hidden="true" />
          <div className={`${styles.glow} ${styles.g3}`} aria-hidden="true" />
          <div className={styles.dots} aria-hidden="true" />
          <div className={styles.trustTop}>
            <span className={styles.chip}>{trust.chip}</span>
            <p id="trust-title" className={styles.big}>
              <span>{trust.number}</span>
              <span className={styles.acc}>+</span>
            </p>
            <p className={styles.trustLine}>{trust.line}</p>
          </div>
          <div className={styles.marquee} aria-label="Some of the manufacturers we have worked with">
            <span className={`${styles.fade} ${styles.fadeL}`} aria-hidden="true" />
            <span className={`${styles.fade} ${styles.fadeR}`} aria-hidden="true" />
            {trust.rows.map((row, r) => (
              <div key={r} className={[styles.row, r % 2 ? styles.rowRev : ""].join(" ")}>
                <div className={styles.run}>
                  {[...row, ...row].map((c, i) => (
                    <div key={`${c.name}-${i}`} className={styles.logoPlate} aria-hidden={i >= row.length ? true : undefined}>
                      <MarqueeLogo src={c.logo} name={c.name} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ background: "var(--surface)" }} aria-labelledby="faq-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <span className={styles.chip}>{faq.chip}</span>
            <h2 id="faq-title" className={styles.h2s}>
              <Accent h={faq.title} />
            </h2>
            <div className={styles.faq}>
              {faq.items.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>
                    {f.q}
                    <Plus size={20} aria-hidden />
                  </summary>
                  <p className={styles.faqA}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="book" className={styles.final} aria-labelledby="book-title">
          <div className={`${styles.wrap} ${styles.section}`}>
            <div className={`${styles.grid} ${styles.finalGrid}`}>
              <div className={styles.finalL}>
                <h2 id="book-title" className={styles.h2}>
                  <Accent h={finalCta.title} />
                </h2>
                <p className={styles.sub}>{finalCta.sub}</p>
              </div>
              <div className={styles.finalR}>
                <div className={styles.formCard}>
                  <LeadForm placement="book" buttonLabel={form.bookButton} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
    </ThemeShell>
  );
}
