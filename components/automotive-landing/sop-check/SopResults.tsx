"use client";

import { useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";
import { AlertTriangle, Check } from "lucide-react";
import styles from "../landing.module.css";
import s from "./sop.module.css";
import ObsidianCard from "../ObsidianCard";
import { config } from "../content";
import { CHAINS, OWNERS, STAGES, TYPICAL, statusLabel, type StatusValue } from "./data";
import { band, mapAsTable, score, type CheckState, type Score } from "./logic";

export type SendStatus = "idle" | "sending" | "sent" | "failed";

const consultationUrl = `${config.pagePath}#book`;
const PILL: Record<StatusValue, string> = { done: s.pillDone, progress: s.pillProgress, not: s.pillNot, na: s.pillNa };
const NODE: Record<StatusValue, string> = { done: s.nodeDone, progress: s.nodeProgress, not: s.nodeNot, na: s.nodeNa };
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

type Props = {
  state: CheckState;
  firstName: string;
  send: SendStatus;
  onRetry: () => void;
  onEdit: () => void;
  onRestart: () => void;
};

export default function SopResults({ state, firstName, send, onRetry, onEdit, onRestart }: Props) {
  const r = score(state);
  const b = band(r);
  const ctx = [state.profile.building, state.profile.project, state.profile.sop ? "SOP " + state.profile.sop.toLowerCase() : ""].filter(Boolean);

  /* ---------- tooltip for chart segments ---------- */
  const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el || !tip) return;
    const w = el.getBoundingClientRect();
    el.style.left = Math.min(window.innerWidth - w.width - 8, Math.max(8, tip.x - w.width / 2)) + "px";
    el.style.top = Math.max(8, tip.y - w.height - 12) + "px";
  }, [tip]);
  const tipFrom = (t: EventTarget) => (t as HTMLElement).closest<HTMLElement>("[data-tip]");
  const onMove = (e: PointerEvent) => {
    const el = tipFrom(e.target);
    setTip(el ? { text: el.dataset.tip || "", x: e.clientX, y: e.clientY } : null);
  };
  const onFocus = (e: FocusEvent) => {
    const el = tipFrom(e.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTip({ text: el.dataset.tip || "", x: rect.left + rect.width / 2, y: rect.top });
  };

  const [copied, setCopied] = useState(false);
  function copyMap() {
    const text = mapAsTable(state);
    const done = () => setCopied(true);
    const fallback = () => {
      const t = document.createElement("textarea");
      t.value = text;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      t.remove();
      done();
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  return (
    <section onPointerMove={onMove} onPointerLeave={() => setTip(null)} onFocus={onFocus} onBlur={() => setTip(null)}>
      <div className={s.resHead}>
        <span className={styles.chip}>Your SOP readiness</span>
        <h1 className={styles.h1} tabIndex={-1}>
          {b.label}
        </h1>
        <p className={styles.lead}>{b.line}</p>
        {ctx.length > 0 && (
          <div className={s.kicker}>
            {ctx.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        )}
      </div>

      <div className={s.statgrid}>
        <div className={s.stat}>
          <div className={s.statN}>{r.index}</div>
          <p className={s.statL}>Readiness index, out of 100</p>
        </div>
        <div className={s.stat}>
          <div className={s.statN}>
            {r.doneCount}
            <small> / 25</small>
          </div>
          <p className={s.statL}>Activities done</p>
        </div>
        <div className={s.stat}>
          <div className={cx(s.statN, r.gaps.length > 0 && s.warn)}>{r.gaps.length}</div>
          <p className={s.statL}>Open activities with no owner</p>
        </div>
        <div className={s.stat}>
          <div className={cx(s.statN, r.behind.length > 0 && s.warn)}>{r.behind.length}</div>
          <p className={s.statL}>Stages behind a typical plan</p>
        </div>
      </div>

      <div className={s.stack}>
        <div className={s.resGrid}>
          <StageChart r={r} sop={state.profile.sop} />
          <ChainsCard state={state} />
        </div>
        <GapsCard r={r} state={state} />
        <MovesCard r={r} state={state} />

        <ObsidianCard className={s.cardFit} sweepDelay="1.5s">
          <div id="map" className={s.cardT}>
            <h2 className={s.h3}>Your draft responsibility map</h2>
            <div className={s.mapTools}>
              <button type="button" className={`${styles.btn} ${styles.btnLine}`} onClick={copyMap}>
                Copy as a table
              </button>
              <span className={s.copied} aria-live="polite">
                {copied ? "Copied. Paste it into a sheet." : ""}
              </span>
            </div>
          </div>
          <p className={s.cardSub}>Paste it into Excel or Google Sheets to share with your team. Edit any answer and the map updates.</p>
          <MapTable state={state} />
        </ObsidianCard>
      </div>

      <section className={s.cta}>
        <h2 className={styles.h2s} style={{ marginTop: 0 }}>
          Walk through your map with a Gemba consultant
        </h2>
        <p>A focused 30-minute call on your stages, your open activities and who should own them, specific to your plant and your SOP date. No commitment.</p>
        <div className={s.btnRow}>
          <a className={`${styles.btn} ${styles.btnWhite}`} href={consultationUrl}>
            Book a 30-minute walkthrough
          </a>
        </div>
        {send === "sent" && (
          <div className={s.thanks} role="status">
            <strong>Thank you{firstName ? `, ${firstName}` : ""}.</strong> Your map is on its way, and a consultant will reach out within 24 hours.
          </div>
        )}
        {(send === "sending" || send === "idle") && (
          <p className={`${s.note} ${s.thanks}`} role="status" style={{ background: "transparent" }}>
            Sending your map…
          </p>
        )}
        {send === "failed" && (
          <div className={s.sendErr} role="alert">
            <span>We could not send your details. Check your connection and try again.</span>
            <button type="button" className={`${styles.btn} ${styles.btnLine}`} onClick={onRetry}>
              Try again
            </button>
          </div>
        )}
      </section>

      <div className={s.resTools}>
        <button type="button" className={s.linkBtn} onClick={onEdit}>
          Edit my answers
        </button>
        <button type="button" className={s.linkBtn} onClick={onRestart}>
          Start again
        </button>
      </div>
      <p className={s.method}>
        This is a self-check. The readiness index counts done as 1, in progress as half and not started as 0, across the activities you need. The
        typical-plan comparison is general planning guidance for EV and automotive projects, not a fixed rule. Your answers are saved in this browser
        and sent to Gemba Concepts with your contact details when you see these results.
      </p>
      <p className={s.trust}>Built by Gemba Concepts. Trusted by 500+ manufacturers across three continents, with 12+ years of shop-floor execution.</p>

      {tip && (
        <div ref={tipRef} className={s.tip} role="tooltip">
          {tip.text}
        </div>
      )}
    </section>
  );
}

function StageChart({ r, sop }: { r: Score; sop: string }) {
  return (
    <ObsidianCard className={s.cardFit} sweepDelay="0s">
      <div className={s.cardT}>
        <h2 className={s.h3}>Readiness by stage</h2>
        <div className={s.chLegend}>
          <em>
            <i className={`${s.sw} ${s.swDone}`} />
            Done
          </em>
          <em>
            <i className={`${s.sw} ${s.swProg}`} />
            In progress
          </em>
          <em>
            <i className={`${s.sw} ${s.swNot}`} />
            Not started
          </em>
        </div>
      </div>
      <div className={s.rows}>
        {r.stages.map((st) => {
          const seg = (cls: string, n: number, word: string) =>
            n ? (
              <span
                className={`${s.segB} ${cls}`}
                style={{ flex: n }}
                data-tip={`${st.name} · ${word}: ${n} of ${st.n + st.c.na}`}
                tabIndex={0}
                aria-label={`${word}: ${n}`}
              />
            ) : null;
          const meta = [`${st.c.done} done`, `${st.c.progress} in progress`, `${st.c.not} not started`]
            .concat(st.c.na ? [`${st.c.na} not needed`] : [])
            .join(" · ");
          return (
            <div key={st.id} className={s.srow} role="group" aria-label={`${st.name}: ${st.ready}% ready. ${meta}`}>
              <span className={s.nm}>{st.name}</span>
              <span className={s.pct}>{st.ready}%</span>
              <div className={s.barRow}>
                {st.n ? (
                  <>
                    {seg(s.bDone, st.c.done, "Done")}
                    {seg(s.bProg, st.c.progress, "In progress")}
                    {seg(s.bNot, st.c.not, "Not started")}
                  </>
                ) : (
                  <span className={`${s.segB} ${s.bNot}`} style={{ flex: 1 }} data-tip={`${st.name}: all marked not needed`} tabIndex={0} />
                )}
              </div>
              <div className={s.meta}>
                <span>{meta}</span>
                {st.behind && (
                  <span className={s.flag}>
                    <AlertTriangle aria-hidden />
                    Behind a typical plan
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className={`${s.note} ${s.chartFoot}`}>{timingNote(r, sop)}</p>
    </ObsidianCard>
  );
}

function timingNote(r: Score, t: string) {
  if (!TYPICAL[t]) return t ? `With SOP ${t.toLowerCase()}, no stage needs to be closed yet.` : "Add your SOP date to compare each stage with a typical plan.";
  const list = r.stages
    .filter((st) => st.need)
    .map((st) => st.name.toLowerCase() + (st.need === "done" ? " mostly done" : " well under way"))
    .join(", ");
  const n = r.behind.length;
  return `For SOP ${t.toLowerCase()}, a typical plan has ${list}. ` + (n ? `${n}${n === 1 ? " stage is" : " stages are"} behind that.` : "You are in line with it.");
}

function GapsCard({ r, state }: { r: Score; state: CheckState }) {
  return (
    <ObsidianCard className={s.cardFit} sweepDelay="0.75s">
      <div className={s.cardT}>
        <h2 className={s.h3}>Activities with no owner yet</h2>
        <span className={cx(s.count, r.gaps.length > 0 && s.warn)}>{r.gaps.length}</span>
      </div>
      {r.gaps.length ? (
        <>
          <p className={s.cardSub}>
            These are under way or not started, and nobody owns them yet. Handovers between your team, the machine supplier and factory engineering are
            where SOP dates usually slip.
          </p>
          <ul className={s.gaplist}>
            {r.gaps.map((a) => (
              <li key={a.id}>
                <strong>{a.name}</strong>
                <span>
                  {a.stage.short} · {statusLabel(state.status[a.id])}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={s.ok}>
          <Check aria-hidden />
          <span>Every open activity has an owner. Make sure each one is written into a contract or purchase order.</span>
        </p>
      )}
      {r.oemOpen.length > 0 && (
        <p className={s.note} style={{ marginTop: 14 }}>
          {r.oemOpen.length} open {r.oemOpen.length === 1 ? "activity is" : "activities are"} marked for the machine supplier. They are only theirs if
          the purchase order says so.
        </p>
      )}
    </ObsidianCard>
  );
}

function ChainsCard({ state }: { state: CheckState }) {
  return (
    <ObsidianCard className={s.cardFit} sweepDelay="0.4s">
      <h2 className={s.h3}>How your work links up</h2>
      <p className={s.cardSub}>Each step feeds the next. A gap early in a chain holds up everything after it.</p>
      <div className={s.chains}>
        {CHAINS.map((c) => {
          const nodes = c.ids.map((id, i) => ({ st: (state.status[id] || "not") as StatusValue, label: c.labels[i] }));
          const firstOpen = nodes.findIndex((n) => n.st === "progress" || n.st === "not");
          const say = firstOpen < 0 ? "Complete, every link is done or not needed." : `First open link: ${c.labels[firstOpen]}. Everything after it depends on it.`;
          return (
            <div key={c.name} className={s.chain}>
              <h4>{c.name}</h4>
              <div className={s.nodes}>
                {nodes.map((n, i) => (
                  <span key={n.label} style={{ display: "contents" }}>
                    {i > 0 && (
                      <span className={s.arrow} aria-hidden="true">
                        →
                      </span>
                    )}
                    <span className={cx(s.node, NODE[n.st], i === firstOpen && s.nodeFirst)}>
                      {n.st === "done" && <Check aria-hidden />}
                      {n.label}
                      <span className={styles.srOnly}> ({statusLabel(n.st)})</span>
                    </span>
                  </span>
                ))}
              </div>
              <p className={s.say}>{say}</p>
            </div>
          );
        })}
      </div>
    </ObsidianCard>
  );
}

function MovesCard({ r, state }: { r: Score; state: CheckState }) {
  if (!r.moves.length)
    return (
      <ObsidianCard className={s.cardFit} sweepDelay="1.1s">
        <h2 className={s.h3}>Your next moves</h2>
        <p className={s.ok}>
          <Check aria-hidden />
          <span>Nothing is open. Keep the evidence ready for your SOP sign-off.</span>
        </p>
      </ObsidianCard>
    );
  return (
    <ObsidianCard className={s.cardFit} sweepDelay="1.1s">
      <h2 className={s.h3}>Your top three next moves</h2>
      <p className={s.cardSub}>The earliest open activities in your plan, with behind-schedule stages first.</p>
      <div className={s.moves}>
        {r.moves.map((a, i) => {
          const ow = OWNERS.find((o) => o.v === (state.owner[a.id] || "tbd"))!;
          return (
            <div key={a.id} className={s.move}>
              <span className={s.num} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h4>{a.name}</h4>
                <div className={s.tags}>
                  <span>{a.stage.name}</span>
                  <span>{statusLabel(state.status[a.id])}</span>
                  <span>{ow.v === "tbd" ? "No owner yet" : "Owner: " + ow.short}</span>
                </div>
                <p>
                  <b>First move: </b>
                  {a.move}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </ObsidianCard>
  );
}

function MapTable({ state }: { state: CheckState }) {
  const cols = OWNERS.slice(1).concat(OWNERS.slice(0, 1));
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            <th scope="col">Activity</th>
            <th scope="col">Status</th>
            {cols.map((c) => (
              <th key={c.v} scope="col" className={s.c}>
                {c.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STAGES.map((st) => [
            <tr key={st.id} className={s.grp}>
              <td colSpan={2 + cols.length}>{st.name}</td>
            </tr>,
            ...st.acts.map((a) => {
              const status = state.status[a.id] || "not";
              const ow = status === "na" ? "" : state.owner[a.id] || "tbd";
              return (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>
                    <span className={cx(s.pill, PILL[status])}>{statusLabel(status)}</span>
                  </td>
                  {cols.map((c) => (
                    <td key={c.v} className={s.c}>
                      {ow === c.v ? (
                        c.v === "tbd" ? (
                          <span className={s.q} aria-label="Not decided">
                            ?
                          </span>
                        ) : (
                          <span className={s.dot} aria-label={c.short} />
                        )
                      ) : null}
                    </td>
                  ))}
                </tr>
              );
            }),
          ])}
        </tbody>
      </table>
    </div>
  );
}
