import { ALL, NEED, STAGES, STATUS, TYPICAL, statusLabel, OWNERS } from "./data";
import type { FlatActivity, OwnerValue, Profile, Stage, StatusValue, Step } from "./data";

/* ---------- tool state (saved in this browser so a half-done check survives a reload) ---------- */
export type CheckState = {
  step: Step;
  profile: Profile;
  status: Record<string, StatusValue>;
  owner: Record<string, OwnerValue>;
  /** Signature of the answers last sent to the lead endpoint, so edits are sent again. */
  sentSig: string | null;
};

const STATE_KEY = "gc-sop-check";
export const blank = (): CheckState => ({ step: "intro", profile: { building: "", project: "", sop: "" }, status: {}, owner: {}, sentSig: null });

export function loadState(): CheckState {
  try {
    const s = JSON.parse(window.localStorage.getItem(STATE_KEY) || "null");
    if (s && s.status) return { ...blank(), ...s };
  } catch {
    /* storage blocked or corrupt: start fresh */
  }
  return blank();
}
export function saveState(state: CheckState) {
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/* ---------- gate: contact details captured by any landing-page form unlock the tool ---------- */
export type Unlock = { lead: Record<string, string>; tracking: Record<string, string>; at: string };
const UNLOCK_KEY = "gc-sop-unlock";

export function saveUnlock(u: Omit<Unlock, "at">) {
  try {
    window.localStorage.setItem(UNLOCK_KEY, JSON.stringify({ ...u, at: new Date().toISOString() }));
  } catch {
    /* ignore */
  }
}
export function readUnlock(): Unlock | null {
  try {
    const u = JSON.parse(window.localStorage.getItem(UNLOCK_KEY) || "null");
    return u && u.lead && u.lead.email ? u : null;
  } catch {
    return null;
  }
}

/* ---------- scoring ---------- */
const pts = (v: StatusValue | undefined) => STATUS.find((s) => s.v === v)?.pts;

export type StageResult = Stage & {
  si: number;
  c: Record<StatusValue, number>;
  n: number;
  ready: number;
  need: "done" | "progress" | undefined;
  behind: boolean;
};
export type Score = {
  stages: StageResult[];
  index: number;
  open: FlatActivity[];
  gaps: FlatActivity[];
  oemOpen: FlatActivity[];
  moves: FlatActivity[];
  doneCount: number;
  behind: StageResult[];
};

export function score(state: CheckState): Score {
  const stages = STAGES.map((s, si) => {
    const c: Record<StatusValue, number> = { done: 0, progress: 0, not: 0, na: 0 };
    s.acts.forEach((a) => {
      c[state.status[a.id] || "not"]++;
    });
    const n = c.done + c.progress + c.not;
    const ready = n ? Math.round(((c.done + c.progress * 0.5) / n) * 100) : 100;
    const need = (TYPICAL[state.profile.sop] || {})[s.id];
    const behind = need ? ready < NEED[need] * 100 : false;
    return { ...s, si, c, n, ready, need, behind };
  });
  const scored = ALL.filter((a) => pts(state.status[a.id]) !== null);
  const index = scored.length ? Math.round((scored.reduce((t, a) => t + (pts(state.status[a.id]) || 0), 0) / scored.length) * 100) : 0;
  const open = ALL.filter((a) => ["progress", "not"].includes(state.status[a.id]));
  const gaps = open.filter((a) => (state.owner[a.id] || "tbd") === "tbd");
  const oemOpen = open.filter((a) => state.owner[a.id] === "oem");
  const behindStages = new Set(stages.filter((s) => s.behind).map((s) => s.id));
  const order = (a: FlatActivity) => ALL.indexOf(a);
  const moves = [...open]
    .sort((x, y) => Number(behindStages.has(y.stage.id)) - Number(behindStages.has(x.stage.id)) || order(x) - order(y))
    .slice(0, 3);
  const doneCount = ALL.filter((a) => state.status[a.id] === "done").length;
  return { stages, index, open, gaps, oemOpen, moves, doneCount, behind: stages.filter((s) => s.behind) };
}

export function band(r: Score) {
  if (r.index >= 70) return { label: "Well placed for SOP", line: "Most of the groundwork is in place. Close the open items and protect your run-at-rate." };
  if (r.index >= 40) return { label: "Clear gaps to close", line: "Good progress, with a few areas that need an owner and a plan before start of production." };
  return { label: "Early days, the best time to plan", line: "You have the most room now to set up layout, process and quality the right way, before decisions lock in." };
}

/* ---------- lead payload ---------- */
export const answers = (state: CheckState) =>
  ALL.map((a) => ({ stage: a.stage.name, activity: a.name, status: state.status[a.id] || "not", owner: state.owner[a.id] || "tbd" }));

export const answersSig = (state: CheckState) => JSON.stringify([state.profile, answers(state)]);

export function resultPayload(state: CheckState) {
  const r = score(state);
  return {
    tool: "ev-plant-sop-readiness-check",
    profile: state.profile,
    answers: answers(state),
    result: {
      readinessIndex: r.index,
      band: band(r).label,
      done: r.doneCount,
      ownershipGaps: r.gaps.map((a) => a.name),
      behindStages: r.behind.map((s) => s.name),
      stages: r.stages.map((s) => ({ stage: s.name, ready: s.ready })),
    },
  };
}

/** Tab-separated responsibility map, for pasting into Excel or Google Sheets. */
export function mapAsTable(state: CheckState) {
  const lines = [["Stage", "Activity", "Status", "Owner"].join("\t")].concat(
    ALL.map((a) => {
      const s = state.status[a.id] || "not";
      return [a.stage.name, a.name, statusLabel(s), s === "na" ? "" : OWNERS.find((o) => o.v === (state.owner[a.id] || "tbd"))?.label ?? ""].join("\t");
    })
  );
  return lines.join("\n");
}
