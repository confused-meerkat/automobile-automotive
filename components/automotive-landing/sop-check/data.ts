/**
 * EV Plant SOP Readiness Check: the 25 activities, answer options and timing guidance.
 * Wording is the approved tool copy. Edit words here, not in the components.
 */

export type StatusValue = "done" | "progress" | "not" | "na";
export type OwnerValue = "tbd" | "own" | "oem" | "fe" | "partner";
export type StageId = "layout" | "process" | "quality" | "equipment" | "validation" | "sop";

export type Activity = { id: string; name: string; plain: string; covers: string[]; move: string };
export type Stage = { id: StageId; name: string; short: string; lead: string; acts: Activity[] };
export type Profile = { building: string; project: string; sop: string };

export const STATUS: { v: StatusValue; label: string; pts: number | null }[] = [
  { v: "done", label: "Done", pts: 1 },
  { v: "progress", label: "In progress", pts: 0.5 },
  { v: "not", label: "Not started", pts: 0 },
  { v: "na", label: "Not needed", pts: null },
];

export const OWNERS: { v: OwnerValue; label: string; short: string }[] = [
  { v: "tbd", label: "Not decided yet", short: "Not decided" },
  { v: "own", label: "Our own team", short: "Our team" },
  { v: "oem", label: "Machine supplier (OEM)", short: "Machine OEM" },
  { v: "fe", label: "Factory engineering partner (civil, MEP, utilities)", short: "Factory engg." },
  { v: "partner", label: "Consultant or other partner", short: "Consultant" },
];

export const PROFILE: Record<keyof Profile, string[]> = {
  building: ["Electric two-wheelers", "Electric three-wheelers", "Cars and SUVs", "Commercial vehicles and buses", "Battery packs", "Motors and controllers (MCU)", "Other auto components"],
  project: ["New plant (greenfield)", "New line in an existing plant", "Capacity expansion", "Relayout or plant move"],
  sop: ["Within 6 months", "6 to 12 months", "12 to 24 months", "More than 24 months", "Not fixed yet"],
};

/** What a typical plan has in place for each SOP window. General guidance, not a rule. */
export const TYPICAL: Record<string, Partial<Record<StageId, "done" | "progress">>> = {
  "Within 6 months": { layout: "done", process: "done", quality: "done", equipment: "done", validation: "progress" },
  "6 to 12 months": { layout: "done", process: "done", quality: "progress", equipment: "progress" },
  "12 to 24 months": { layout: "progress", process: "progress" },
};
export const NEED = { done: 0.7, progress: 0.35 };

export const STAGES: Stage[] = [
  { id: "layout", name: "Layout and flow", short: "Layout", lead: "Where everything sits, and how parts and people move.", acts: [
    { id: "l1", name: "Manufacturing layout", plain: "A 2D and 3D layout with every machine, station and walkway placed.", covers: ["2D and 3D layout", "Equipment positioning", "Operator movement", "Space optimisation"], move: "Freeze the layout version that both equipment orders and civil drawings will use, and log every change after that." },
    { id: "l2", name: "Line balancing and manpower", plain: "Takt time, how work is split across stations, and the people each line needs.", covers: ["Takt time", "Line balancing", "Yamazumi charts", "Work content", "Manpower", "Bottleneck analysis"], move: "Build a Yamazumi chart for each line against takt time, so station count and manpower come from the same numbers." },
    { id: "l3", name: "In-plant logistics", plain: "How parts reach each station, in what quantity and how often.", covers: ["Supermarket", "Kitting", "Line-side storage", "Milk-run", "Material handling equipment", "Tugger, AGV or AMR", "Replenishment frequency"], move: "Set line-side quantities and refill frequency for every part before you choose tuggers or AGVs." },
    { id: "l4", name: "Factory flow", plain: "The full path a part takes, from receiving to dispatch.", covers: ["Receiving → stores → supermarket → production → WIP → finished goods → dispatch", "FIFO", "WIP control", "Returnable packaging", "Empty-container flow"], move: "Walk one part number from receiving to dispatch on the layout and mark every storage point and handover." },
  ]},
  { id: "process", name: "Process engineering", short: "Process", lead: "What happens at every station, step by step.", acts: [
    { id: "p1", name: "Detailed process flow", plain: "A step-by-step flow diagram for every process, not just the high-level line flow.", covers: ["Battery assembly", "Motor assembly", "MCU / controller", "Vehicle assembly", "Sub-assemblies", "Electrical systems", "Testing and end-of-line (EOL)", "Rework, rejection and packing", "Updates through process freeze and engineering changes"], move: "Draw the detailed flow for battery, motor and EOL first. Every later document builds on it." },
    { id: "p2", name: "Operation-by-operation sequence", plain: "Work content, tools, fixtures, gauges and quality checks at every workstation.", covers: ["Operation sequence per station", "Work content", "Equipment, tooling and fixtures", "Gauges", "Operator activity", "Quality checkpoints"], move: "Write the station-level sequence for one full vehicle and check it against takt time." },
    { id: "p3", name: "Critical process parameters", plain: "The values each operation must hit, and proof that they work.", covers: ["Torque", "Press force", "Welding", "Adhesive and sealing", "Electrical and insulation testing", "Software flashing and programming", "EOL limits", "Battery assembly parameters"], move: "Put every critical parameter, with its target and limits, in one sheet, and agree who signs it off: your team or the machine supplier." },
  ]},
  { id: "quality", name: "Quality planning", short: "Quality", lead: "How problems are prevented, checked and handled.", acts: [
    { id: "q1", name: "Process FMEA (PFMEA)", plain: "A step-by-step list of what could go wrong at each operation, and how to stop it.", covers: ["Cross-functional PFMEA workshops", "Updates after trials", "Final revision before start of production"], move: "Run a cross-functional PFMEA workshop on the detailed process flow, starting with battery and EOL." },
    { id: "q2", name: "Control plan", plain: "What to check, how, how often, and what to do when something is off.", covers: ["Critical-to-quality characteristics (CTQ)", "Specification", "Measurement method", "Frequency and sample size", "Control method", "Reaction plan", "Responsibility", "Traceability"], move: "Build the control plan straight from the high-risk items in the PFMEA, so the two stay linked." },
    { id: "q3", name: "Standard work instructions", plain: "Station-wise instructions an operator can follow from day one.", covers: ["Operation sequence", "Work content and cycle time", "Tools and torque values", "Process parameters", "Quality checks", "Safety"], move: "Write picture-based instructions for the first three stations and test them with a new operator." },
    { id: "q4", name: "Poka-yoke (mistake-proofing)", plain: "Station-wise checks that stop a wrong part or a missed step from reaching the customer.", covers: ["Wrong or missing component", "Wrong orientation", "Wrong connector", "Wrong or missing torque", "Wrong software", "Wrong battery or MCU", "Wrong VIN", "EOL failure"], move: "List the known mistakes for each station and decide which ones the machine must physically block." },
  ]},
  { id: "equipment", name: "Equipment, tooling and data", short: "Equipment", lead: "What you buy, how you check it, and the data it records.", acts: [
    { id: "e1", name: "Equipment requirements (URS)", plain: "Your written requirements for each machine, before you ask for quotes.", covers: ["Capacity and cycle time", "Accuracy and repeatability", "Automation level", "Poka-yoke and safety", "Traceability, MES and data logging", "Alarms", "Maintenance, utilities and spare parts", "Acceptance criteria"], move: "Write acceptance criteria into every URS, so the factory and site tests have a clear pass mark." },
    { id: "e2", name: "Technical evaluation of quotes", plain: "Checking that a machine can really deliver your cycle time, accuracy and future volume.", covers: ["Cycle time", "Accuracy and quality", "Process capability", "Future capacity", "More than a spec-sheet match"], move: "Score every quote against the URS on cycle time, capability and future volume, not on price alone." },
    { id: "e3", name: "Tooling, fixtures and gauges", plain: "The jigs, fixtures, tools and gauges each station needs.", covers: ["Jigs and fixtures", "Assembly aids", "Torque tools", "Gauges and inspection fixtures", "Error-proofing", "Ergonomic aids"], move: "Make a station-by-station list of jigs, fixtures, tools and gauges, with an owner and a due date for each." },
    { id: "e4", name: "Factory acceptance test (FAT)", plain: "Testing each machine at the supplier's factory, before it ships.", covers: ["Cycle time", "Accuracy and repeatability", "Poka-yoke and interlocks", "Error handling", "Quality output", "Data capture and traceability", "Safety"], move: "Agree the FAT checklist and pass criteria with each supplier before the machine is built." },
    { id: "e5", name: "Traceability and MES data", plain: "What data each station must record, and how it links to your MES.", covers: ["VIN → battery → motor → MCU → critical components", "Process parameters per part", "EOL results", "Station-wise data capture", "MES interface requirements"], move: "Map the traceability chain from VIN down to process parameters, then list the data every station must send to MES." },
  ]},
  { id: "validation", name: "Installation and validation", short: "Validation", lead: "Proving the process works once the machines are in.", acts: [
    { id: "v1", name: "Site acceptance test (SAT)", plain: "Testing each machine again after it is installed in your plant.", covers: ["Performance against the agreed requirements, at your site", "Cycle time and quality output", "Safety and interlocks"], move: "Use the same pass criteria as the FAT, so site results can be compared like for like." },
    { id: "v2", name: "Process commissioning", plain: "Moving from installed machines to a running manufacturing process.", covers: ["Installation → commissioning → SAT → process validation → production acceptance", "A clear point where each party's work ends"], move: "Agree in writing where each party's work ends between installation and production acceptance." },
    { id: "v3", name: "Process validation and trial production", plain: "Running trials to prove that cycle time, parameters and quality hold.", covers: ["Trial production", "Cycle-time verification", "Process parameter validation", "Quality validation", "Repeatability", "Rejection and rework", "Operator loading"], move: "Give every trial run a target for cycle time, first-pass yield and rework, and review each run against it." },
    { id: "v4", name: "Measurement checks (MSA / Gauge R&R)", plain: "Making sure your measuring tools give the same answer every time.", covers: ["Measurement system analysis", "Gauge repeatability and reproducibility", "Critical measurements first"], move: "Run Gauge R&R on the gauges that measure critical characteristics before you trust any trial data." },
    { id: "v5", name: "Process capability (Cp / Cpk)", plain: "Proof that each critical process stays inside its limits.", covers: ["Cp / Cpk and Pp / Ppk", "Critical characteristics", "Corrective action where capability is low"], move: "Collect capability data on critical characteristics during trials, and fix anything below target before run-at-rate." },
  ]},
  { id: "sop", name: "Ramp-up and SOP readiness", short: "SOP", lead: "Showing the line can make the volume, at the quality, every day.", acts: [
    { id: "s1", name: "Capacity validation", plain: "Showing the line will hit the planned output in practice, not just on paper.", covers: ["Takt → cycle time → station count", "Equipment capacity → manpower", "OEE → yield → actual output"], move: "Redo the capacity sum with real trial cycle times, OEE and yield, not design values." },
    { id: "s2", name: "Run-at-rate", plain: "Running the line at full planned speed for a set time, to prove it holds.", covers: ["Required production rate", "Trial duration", "Cycle time and OEE", "First-pass yield (FPY)", "Rejection, rework and downtime", "Acceptance criteria"], move: "Agree the run-at-rate duration and pass criteria up front: rate, first-pass yield, OEE and downtime." },
    { id: "s3", name: "Production readiness review", plain: "A formal check of every area before start of production.", covers: ["Equipment and process", "PFMEA, control plan and standard work", "Manpower and material", "Quality, poka-yoke and traceability", "Maintenance and safety", "Capacity, trial production and run-at-rate"], move: "Hold a readiness review well before SOP, with one checklist and one named owner for each area." },
    { id: "s4", name: "Start of production sign-off", plain: "A go / no-go decision for mass production, based on evidence.", covers: ["Equipment validation evidence", "Process capability evidence", "Run-at-rate evidence", "A written go / no-go recommendation"], move: "Decide now what evidence the SOP go / no-go needs, so nobody argues about it in the last week." },
  ]},
];

export const CHAINS = [
  { name: "Quality documents", ids: ["p1", "q1", "q2", "q3"], labels: ["Process flow", "PFMEA", "Control plan", "Standard work"] },
  { name: "Equipment", ids: ["e1", "e2", "e4", "v1", "v2"], labels: ["URS", "Quote evaluation", "FAT", "SAT", "Commissioning"] },
  { name: "Capacity to SOP", ids: ["l2", "s1", "s2", "s3", "s4"], labels: ["Line balance", "Capacity check", "Run-at-rate", "Readiness review", "SOP sign-off"] },
];

export type FlatActivity = Activity & { stage: Stage; si: number; num: string };
export const ALL: FlatActivity[] = STAGES.flatMap((s, si) => s.acts.map((a, ai) => ({ ...a, stage: s, si, num: `${si + 1}.${ai + 1}` })));

export const STEPS = ["intro", "profile", "stage-0", "stage-1", "stage-2", "stage-3", "stage-4", "stage-5", "results"] as const;
export type Step = (typeof STEPS)[number];

export const statusLabel = (v: StatusValue) => STATUS.find((s) => s.v === v)?.label ?? "";
