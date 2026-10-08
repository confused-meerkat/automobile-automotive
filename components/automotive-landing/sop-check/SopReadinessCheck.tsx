"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import styles from "../landing.module.css";
import s from "./sop.module.css";
import Accent from "../Accent";
import ObsidianCard from "../ObsidianCard";
import SopGate from "./SopGate";
import SopResults, { type SendStatus } from "./SopResults";
import { config, sopCheck } from "../content";
import { OWNERS, PROFILE, STAGES, STATUS, STEPS, type Profile, type Step } from "./data";
import { answersSig, blank, loadState, readUnlock, resultPayload, saveState, type CheckState, type Unlock } from "./logic";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const stageIndex = (step: Step) => (step.startsWith("stage-") ? parseInt(step.split("-")[1], 10) : -1);

/** The EV Plant SOP Readiness Check, gated: it only opens once contact details are on file. */
export default function SopReadinessCheck() {
  const [unlock, setUnlock] = useState<Unlock | null | undefined>(undefined);
  const [state, setState] = useState<CheckState | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [send, setSend] = useState<SendStatus>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);
  const sendingSig = useRef<string | null>(null);

  useEffect(() => {
    setUnlock(readUnlock());
    setState(loadState());
  }, []);

  const update = useCallback((fn: (prev: CheckState) => CheckState) => {
    setState((prev) => {
      const next = fn(prev ?? blank());
      saveState(next);
      return next;
    });
  }, []);

  const go = (step: Step) => {
    navigated.current = true;
    setMissing([]);
    update((p) => ({ ...p, step }));
  };
  const step = state?.step;
  const next = () => step && go(STEPS[STEPS.indexOf(step) + 1]);
  const prev = () => step && go(STEPS[STEPS.indexOf(step) - 1]);

  // After moving between steps: back to the top, focus on the new heading.
  useEffect(() => {
    if (!navigated.current) return;
    navigated.current = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const h = rootRef.current?.querySelector<HTMLElement>("h1, h2");
    if (h) {
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }
  }, [step]);

  /* ---------- results go to the lead endpoint with the gated contact details ---------- */
  const sendResults = useCallback(
    async (st: CheckState, u: Unlock) => {
      const sig = answersSig(st);
      sendingSig.current = sig;
      setSend("sending");
      try {
        const res = await fetch(config.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: config.toolPath,
            form: "sop-readiness-check",
            submittedAt: new Date().toISOString(),
            lead: u.lead,
            tracking: u.tracking,
            referrer: document.referrer || null,
            ...resultPayload(st),
          }),
        });
        if (!res.ok) throw new Error(String(res.status));
        update((p) => ({ ...p, sentSig: sig }));
        setSend("sent");
      } catch {
        sendingSig.current = null;
        setSend("failed");
      }
    },
    [update]
  );

  useEffect(() => {
    if (!state || !unlock || state.step !== "results") return;
    const sig = answersSig(state);
    if (state.sentSig === sig) setSend("sent");
    else if (sendingSig.current !== sig) void sendResults(state, unlock);
  }, [state, unlock, sendResults]);

  /* ---------- gate ---------- */
  if (unlock === undefined || !state) return <div className={s.gateWait} aria-busy="true" />;
  if (!unlock)
    return (
      <div className={s.toolMain}>
        <SopGate variant="page" onUnlock={setUnlock} />
      </div>
    );

  const si = stageIndex(state.step);

  return (
    <div ref={rootRef} className={cx(s.tool, s.toolMain)}>
      {si >= 0 && <StationLine cur={si} />}

      {state.step === "intro" && (
        <Intro
          started={Object.keys(state.status).length > 0}
          onStart={() => {
            const started = Object.keys(state.status).length > 0;
            if (!started) return go("profile");
            const firstOpen = STAGES.findIndex((st) => st.acts.some((a) => !state.status[a.id]));
            go(firstOpen < 0 ? "results" : (`stage-${firstOpen}` as Step));
          }}
          onReset={() => update(() => blank())}
        />
      )}

      {state.step === "profile" && (
        <ProfileView
          profile={state.profile}
          onPick={(k, v) => update((p) => ({ ...p, profile: { ...p.profile, [k]: v } }))}
          onBack={prev}
          onNext={next}
        />
      )}

      {si >= 0 && (
        <StageView
          si={si}
          state={state}
          missing={missing}
          onStatus={(id, v) => {
            update((p) => ({ ...p, status: { ...p.status, [id]: v } }));
            setMissing((m) => m.filter((x) => x !== id));
          }}
          onOwner={(id, v) => update((p) => ({ ...p, owner: { ...p.owner, [id]: v } }))}
          onBack={prev}
          onNext={() => {
            const miss = STAGES[si].acts.filter((a) => !state.status[a.id]).map((a) => a.id);
            if (miss.length) {
              setMissing(miss);
              rootRef.current?.querySelector<HTMLInputElement>(`input[name="st-${miss[0]}"]`)?.focus();
              return;
            }
            next();
          }}
        />
      )}

      {state.step === "results" && (
        <SopResults
          state={state}
          firstName={(unlock.lead.fullname || "").split(" ")[0]}
          send={send}
          onRetry={() => void sendResults(state, unlock)}
          onEdit={() => go("stage-0")}
          onRestart={() => {
            navigated.current = true;
            setMissing([]);
            update(() => blank());
          }}
        />
      )}
    </div>
  );
}

function StationLine({ cur }: { cur: number }) {
  return (
    <div className={s.lineWrap}>
      <div className={s.line} role="list" aria-label="Your progress">
        <span className={s.prog} style={{ width: `calc(83.34% * ${cur / 5})` }} />
        {STAGES.map((st, i) => (
          <div key={st.id} className={cx(s.st, i < cur && s.stDone, i === cur && s.stNow)} role="listitem" aria-current={i === cur ? "step" : undefined}>
            <b>{i + 1}</b>
            <span>{st.short}</span>
          </div>
        ))}
      </div>
      <p className={s.lineCap} aria-live="polite">
        Stage {cur + 1} of 6 · {STAGES[cur].name}
      </p>
    </div>
  );
}

function Intro({ started, onStart, onReset }: { started: boolean; onStart: () => void; onReset: () => void }) {
  return (
    <section className={s.introGrid}>
      <div>
        <span className={styles.chip}>{sopCheck.chip}</span>
        <h1 className={styles.h1}>
          <Accent h={sopCheck.title} />
        </h1>
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
        <div className={s.btnRow}>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onStart}>
            {started ? "Continue where you left off" : "Start the readiness check"}
          </button>
          {started && (
            <button type="button" className={s.linkBtn} onClick={onReset}>
              Start again
            </button>
          )}
        </div>
        <p className={s.trust}>{sopCheck.trust}</p>
      </div>
      <ObsidianCard className={cx(s.cardFit, s.lifecycle)} sweepDelay="0.4s" aria-label="The six stages">
        <p className={s.tag}>Concept to SOP</p>
        <ol className={s.lcList}>
          {STAGES.map((st, i) => (
            <li key={st.id}>
              <b>{i + 1}</b>
              <div>
                <strong>{st.name}</strong>
                <span>{st.lead}</span>
              </div>
            </li>
          ))}
        </ol>
      </ObsidianCard>
    </section>
  );
}

const PROFILE_Q: { k: keyof Profile; q: string }[] = [
  { k: "building", q: "What are you building?" },
  { k: "project", q: "What kind of project is it?" },
  { k: "sop", q: "When is start of production planned?" },
];

function ProfileView({ profile, onPick, onBack, onNext }: { profile: Profile; onPick: (k: keyof Profile, v: string) => void; onBack: () => void; onNext: () => void }) {
  return (
    <section className={s.screen}>
      <span className={styles.chip}>Before you start</span>
      <h2 className={styles.h2}>A little about your project</h2>
      <p className={styles.subMuted}>This sets the timeline check in your results. All three are optional.</p>
      {PROFILE_Q.map(({ k, q }) => (
        <fieldset key={k} className={s.fs}>
          <legend className={s.legend}>{q}</legend>
          <div className={s.chips}>
            {PROFILE[k].map((t) => (
              <label key={t}>
                <input type="radio" name={k} value={t} checked={profile[k] === t} onChange={() => onPick(k, t)} />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <div className={s.navrow}>
        <button type="button" className={s.linkBtn} onClick={onBack}>
          Back
        </button>
        <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNext}>
          Start stage 1
        </button>
      </div>
    </section>
  );
}

type StageProps = {
  si: number;
  state: CheckState;
  missing: string[];
  onStatus: (id: string, v: CheckState["status"][string]) => void;
  onOwner: (id: string, v: CheckState["owner"][string]) => void;
  onBack: () => void;
  onNext: () => void;
};

function StageView({ si, state, missing, onStatus, onOwner, onBack, onNext }: StageProps) {
  const st = STAGES[si];
  const last = si === STAGES.length - 1;
  const answered = st.acts.filter((a) => state.status[a.id]).length;
  const showErr = missing.length > 0 && answered < st.acts.length;
  return (
    <section className={s.screen}>
      <div className={s.stageHead}>
        <span className={styles.chip}>Stage {si + 1} of 6</span>
        <h2 className={styles.h2}>{st.name}</h2>
        <p>{st.lead}</p>
      </div>
      <div className={s.acts}>
        {st.acts.map((a, ai) => {
          const cur = state.status[a.id] || "";
          const ow = state.owner[a.id] || "tbd";
          return (
            <article key={a.id} className={cx(s.act, missing.includes(a.id) && !cur && s.actMissing)}>
              <p className={s.actN}>
                {si + 1}.{ai + 1}
              </p>
              <h3>{a.name}</h3>
              <p className={s.plain}>{a.plain}</p>
              <details>
                <summary>
                  <ChevronRight aria-hidden />
                  What it covers
                </summary>
                <ul className={s.covers}>
                  {a.covers.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </details>
              <div className={s.controls}>
                <fieldset>
                  <legend className={s.ctlLabel}>Where does it stand?</legend>
                  <div className={s.seg}>
                    {STATUS.map((o) => (
                      <label key={o.v}>
                        <input type="radio" name={`st-${a.id}`} value={o.v} checked={cur === o.v} onChange={() => onStatus(a.id, o.v)} />
                        <span>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <label className={s.ctlLabel} htmlFor={`ow-${a.id}`}>
                    Who owns it?
                  </label>
                  <select
                    className={`${styles.select} ${s.ownerSelect}`}
                    id={`ow-${a.id}`}
                    name={`ow-${a.id}`}
                    value={ow}
                    disabled={cur === "na"}
                    onChange={(e) => onOwner(a.id, e.target.value as CheckState["owner"][string])}
                  >
                    {OWNERS.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className={s.err} role="alert">
        {showErr ? "Mark where each activity stands to continue. Choose 'Not needed' if one does not apply." : ""}
      </p>
      <div className={s.navrow}>
        <button type="button" className={s.linkBtn} onClick={onBack}>
          Back
        </button>
        <div className={s.navEnd}>
          <span className={s.tally}>
            {answered} of {st.acts.length} marked
          </span>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNext}>
            {last ? "See my results" : "Next stage"}
          </button>
        </div>
      </div>
    </section>
  );
}
