/**
 * All copy for the automotive landing page lives here, so the content team can
 * change words without touching layout code.
 *
 * Headlines use { lead, accent }: `accent` is the one green word or phrase
 * at the end of the headline (brand rule: one highlight per headline).
 */

export const config = {
  siteUrl: "https://gembaconcepts.com",
  pagePath: "/automotive-manufacturing-consulting-services",
  /** The gated EV Plant SOP Readiness Check. The #assessment section on the landing page is its gate. */
  toolPath: "/automotive-manufacturing-consulting-services/sop-readiness-check",
  /** Every lead form POSTs here, the tool's results too. app/api/leads/route.ts is a stub to wire to the CRM. */
  leadEndpoint: "/api/leads",
  email: "marketing@gembaconcepts.com",
  whatsappUrl:
    "https://wa.me/919606475131?text=Hi%2C%20I'd%20like%20to%20know%20more%20about%20Gemba%20Concepts.",
};

export const seo = {
  title: "Automotive Manufacturing Consulting | Gemba Concepts",
  description:
    "Automotive manufacturing consulting for automobile and auto component makers in India. More output and steadier quality from the plant you already run.",
};

export type Headline = { lead: string; accent: string };

const BLOB = "https://gembaconceptswebsite.blob.core.windows.net/media/";
const blob = (path: string) => BLOB + encodeURI(path);

export const nav = {
  tagline: "Better Productivity. Lower Costs.",
  cta: "Get a Free Shopfloor Consultation",
  ctaShort: "Free Consultation",
};

export const hero = {
  chip: "Automotive Manufacturing Consulting",
  title: "More Output From the Automotive Plant You Already Run.",
  lead:
    "We help automobile manufacturers and auto component makers across India get more good parts from every shift, with steadier quality and a lower cost per part. Most of that gain is already inside your plant. We help your team find it and keep it.",
  ticks: [
    "On your shop floor, not in a meeting room",
    "Former Toyota professionals on the team",
    "Every result measured against a signed baseline",
  ],
};

export const stats = [
  { value: "500+", label: "Clients Served" },
  { value: "12+", label: "Years" },
  { value: "40+", label: "Industries" },
  { value: "100%", label: "Shop Floor Execution" },
];

export const form = {
  heroButton: "Get a Free Shopfloor Consultation",
  bookButton: "Book a Free Shopfloor Consultation",
  note: "A senior consultant will call you within 24 hours.",
  companySizes: ["1–50 employees", "51–200 employees", "201–500 employees", "501–1,000 employees", "1,000+ employees"],
  businesses: ["Vehicle manufacturer (OEM)", "Tier 1 supplier", "Tier 2 or Tier 3 supplier", "Contract manufacturer"],
  messageLabel: "What would you like to improve first?",
  messagePlaceholder: "For example: more output from our machining line, or quicker die changes",
};

export const gains = {
  chip: "Where the Gain Sits",
  title: { lead: "Where Automotive Plants Find Their", accent: "Next Gain." } as Headline,
  sideTitle: "Six Areas on Your Shop Floor Where There Is Usually More to Give",
  sideBody: "We look at all six and start where the payoff is biggest.",
  button: "Schedule A Consultation",
  cards: [
    {
      title: { lead: "Every Station Working to the Same", accent: "Pace" },
      see: "One slow station sets the speed for the whole line, and the stations after it wait.",
      doo: "We time every station, share the work out evenly and keep the slowest machine running through breaks and changeovers.",
      result: "More parts per shift from the same line.",
    },
    {
      title: { lead: "More Good Parts From the Machines You", accent: "Own" },
      see: "Small stops, slow running and waiting for repairs quietly use up planned hours.",
      doo: "We track OEE on your key machines, find the biggest losses and fix them one by one. A 10-minute daily care routine helps operators keep machines healthy.",
      note: "OEE tells you how much good output a machine gives in the time it was planned to run.",
      result: "Higher OEE and fewer surprise breakdowns.",
    },
    {
      title: { lead: "Quicker Model and Die", accent: "Changes" },
      see: "Every setter changes over in their own way, so the time taken is different every time.",
      doo: "We film one changeover and move the prep to before the machine stops. Tools and dies wait ready on a trolley. The best method becomes the standard.",
      result: "More running time every shift, smaller batches and room for more variants.",
    },
    {
      title: { lead: "Right the First Time, Every", accent: "Shift" },
      see: "Most checks happen at the end of the line, so a problem is found after many parts are made.",
      doo: "We move checks to the station where the part is made, add simple mistake-proofing and give each top defect an owner and a date.",
      result: "Less rework and rejection, and stronger ratings from your customers.",
    },
    {
      title: { lead: "Parts at the Line, Right on", accent: "Time" },
      see: "Operators leave the line to fetch material, while extra stock sits in the wrong places.",
      doo: "We give every part a fixed spot and quantity at the line. We refill it based on what the line uses and set stock levels to match real demand.",
      result: "Steady lines, less searching and cash freed from extra inventory.",
    },
    {
      title: { lead: "The Same Good Result, Whoever Is on", accent: "Shift" },
      see: "New operators learn by watching others, so output changes from shift to shift.",
      doo: "We put picture-based instructions at every station and a skill chart on every line. Leaders take a short daily walk to check the standard holds.",
      result: "The same output across operators, shifts and plants.",
    },
  ] as { title: Headline; see: string; doo: string; note?: string; result: string }[],
};

/** EV Plant SOP Readiness Check: the gated tool. Activity copy lives in sop-check/data.ts. */
export const sopCheck = {
  name: "EV Plant SOP Readiness Check",
  seoTitle: "EV Plant SOP Readiness Check | Gemba Concepts",
  seoDescription:
    "A free 6-minute check for EV and automotive plant projects. Mark the 25 activities from layout to start of production, see your readiness by stage, the activities that still need an owner, and a draft responsibility map.",
  chip: "Free tool · EV and automotive plants",
  title: { lead: "How ready is your EV plant for", accent: "start of production?" } as Headline,
  body:
    "Go through the 25 activities between layout and SOP. Mark where each one stands and who owns it. You will see your readiness by stage, the activities that still need an owner, and a draft responsibility map to share with your team.",
  facts: [
    { title: "About 6 minutes", sub: "No login, nothing to prepare" },
    { title: "25 activities, 6 stages", sub: "From layout to start of production" },
    { title: "Built for EV and automotive", sub: "Battery, motor, MCU and vehicle assembly" },
  ],
  sopNote: "In this tool, SOP means start of production. Standard operating procedures are called standard work.",
  trust: "Built by Gemba Concepts. Trusted by 500+ manufacturers across three continents, with 12+ years of shop-floor execution.",
  /** The contact gate in front of the tool. Same fields as the other forms. */
  gateTitle: "Get free access to the readiness check",
  gateBody: "Share your details to open the tool. Your results and responsibility map come to you by email, and a consultant can walk you through them.",
  gateButton: "Unlock the Readiness Check",
  unlockedTitle: "Your readiness check is unlocked",
  unlockedBody: "Pick up where you left off. Your answers stay saved in this browser.",
  unlockedButton: "Open the Readiness Check",
};

export const results = {
  chip: "Proven Results",
  title: { lead: "Results we", accent: "delivered" } as Headline,
  sub: "From plants working on the same things automotive lines work on every day: OEE, changeovers, output and supplier delivery.",
  button: "Schedule A Consultation",
  cards: [
    {
      industry: "Packaging and Label Printing",
      title: "OEE More Than Doubled",
      points: ["OEE up 123%", "Changeovers 47% shorter, wastage down 36.6%", "Achieved within 12 months"],
    },
    {
      industry: "Solar PV Manufacturing",
      title: "37% More Modules a Day, From the Same Plant",
      points: ["1,404 to 1,923 modules a day", "Stringer OEE from 38.4% to 53.7%", "Achieved within 6 months"],
    },
    {
      industry: "Composite Pipe Manufacturing",
      title: "58% More Output From the Same Winding Lines",
      points: ["Quicker changeovers and a smarter production order", "Planned maintenance to protect run time", "OEE up 25%"],
    },
    {
      industry: "Electrical Products Manufacturing",
      title: "Suppliers Delivering On Time, In Full: 48% to 64%",
      points: ["Supplier scorecards and shared demand plans", "Regular supplier performance reviews", "Order fill rate from 93.7% to 96.1%"],
    },
  ],
};

export const approach = {
  chip: "Our Method",
  title: { lead: "The Gemba", accent: "Approach" } as Headline,
  sub: "Most automotive consulting stops at a report. Ours starts and ends on your shop floor.",
  steps: [
    {
      title: { lead: "Assessment &", accent: "diagnostics" },
      body: "A 2–4 day on-site study. We walk your lines, watch how work really happens and find where your biggest gains in output, quality and cost sit.",
    },
    {
      title: { lead: "Scope, deployment &", accent: "commercials" },
      body: "We plan the work from your own data, not a template. The proposal shows what you invest and what you can expect back, so you decide on numbers.",
    },
    {
      title: { lead: "Current state mapping &", accent: "baseline" },
      body: "Every process mapped in detail. A signed performance baseline, so every improvement is measured against where you started.",
    },
    {
      title: { lead: "Proof of concept, implementation & on-site", accent: "training" },
      body: 'Fixes are tested on the floor before full rollout. We implement alongside your team, and training happens at the gemba (Japanese for "the place where the work happens"), in real conditions.',
    },
    {
      title: { lead: "Sustenance & audit", accent: "handover" },
      body: "Before we step back, your team runs the daily reviews and checks on its own. We don't exit on a deadline. We exit when the results hold.",
    },
  ] as { title: Headline; body: string }[],
};

export const segments = {
  chip: "Who We Work With",
  title: { lead: "Built for India's Automobile and", accent: "Auto Component Makers" } as Headline,
  sub: "From full vehicle assembly to the smallest precision part.",
  groups: [
    {
      label: "Vehicle manufacturers",
      items: ["Passenger vehicles", "Commercial vehicles", "Two-wheelers", "Three-wheelers", "Tractors", "Electric vehicles", "Contract vehicle manufacturing"],
    },
    {
      label: "Auto component manufacturers · Tier 1, Tier 2 and Tier 3",
      items: [
        "Engine and transmission parts",
        "Gears and bearings",
        "Brakes, steering and suspension",
        "Forging and casting",
        "Machining and precision parts",
        "Sheet metal, body and chassis",
        "Plastics and rubber parts",
        "Electricals, electronics and wiring harness",
        "Fasteners",
        "EV components",
        "Dies and moulds",
      ],
    },
  ],
};

export const growth = {
  chip: "Expansion & EV",
  title: { lead: "Growing? Let's Build It Right the", accent: "First Time." } as Headline,
  sub: "For plants adding capacity, opening a new site or moving into EV parts.",
  tiles: [
    {
      icon: "factory",
      title: "New plant or new line",
      body: "We design the layout around how parts should move, before construction starts. We designed one new industrial valve plant for 2.7X the output.",
    },
    {
      icon: "battery",
      title: "Moving into EV",
      body: "New products bring new processes, new suppliers and new skills. We help you set up lines, standards and training that work from day one.",
    },
    {
      icon: "truck",
      title: "Steadier suppliers",
      body: "Supplier scorecards, shared demand plans and regular reviews, so parts reach your line on time and in full.",
    },
    {
      icon: "activity",
      title: "Simple digital tracking",
      body: "Live OEE boards, maintenance tracking and warehouse systems, added once the process is right, so the gains stay visible.",
    },
  ] as { icon: "factory" | "battery" | "truck" | "activity"; title: string; body: string }[],
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  initials: string;
  plateName: string;
  logo?: string;
};

/** Quotes are verbatim from gembaconcepts.com. Do not edit the wording. */
export const testimonials = {
  chip: "Client Voices",
  title: { lead: "What manufacturing leaders say after we", accent: "leave." } as Headline,
  items: [
    {
      quote: "Exceptional expertise in reducing bottlenecks, optimizing stock movement and data-driven inventory management.",
      name: "Sanjeev Wangoo",
      role: "Executive Director – Supply Chain",
      company: "Veedol Corporation Limited",
      sector: "Lubricants & Automotive Solutions · India",
      initials: "SW",
      plateName: "Veedol",
      logo: blob("images/Client-Brands-Logo/Veedol.png"),
    },
    {
      quote: "Practical, hands-on solutions that reduced wastage, optimized processes and increased overall equipment effectiveness.",
      name: "Jainam Deliwala",
      role: "Director",
      company: "Rolliflex Pvt Ltd",
      sector: "Wires & Cables Manufacturing · India",
      initials: "JD",
      plateName: "Rolliflex",
      logo: "https://gembaconcepts.com/images/clients/rolliflex-trimmed.png",
    },
    {
      quote: "Dedicated team efforts and data-backed, innovative solutions helped us deliver our operational targets.",
      name: "Mahaveer Agarwal",
      role: "Managing Director",
      company: "Suncity Metals & Tubes Pvt Ltd",
      sector: "Steel Tubes & Pipes Manufacturing · India",
      initials: "MA",
      plateName: "Suncity",
      logo: blob("images/Client-Brands-Logo/Logos/Engineering and Construction/suncity-metals-tubes-logo.svg"),
    },
    {
      quote: "The team demonstrated a profound, intrinsic understanding of our unique operational challenges.",
      name: "Naishadh Shah & Krishna Kumar",
      role: "MD & COO",
      company: "Swiss Parenterals / Eris Lifesciences",
      sector: "Pharmaceutical Manufacturing · India",
      initials: "NS",
      plateName: "Swiss Parenterals",
    },
  ] as Testimonial[],
};

export type Client = { name: string; logo?: string };

/** Logos come from the same media store as the live site's client strip. Automotive clients lead row one. */
export const trust = {
  chip: "Trusted by Industry",
  number: "500",
  line: "Industrial Businesses Across 3 Continents",
  rows: [
    [
      { name: "Ashok Leyland", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/Ashok-Leyland-Brand-Logo.svg") },
      { name: "Sansera", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/SanseraLogo.png") },
      { name: "Olectra", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/Olectra-Colour.svg") },
      { name: "Kumaran", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/KUMARAN_LOGO-1.webp") },
      { name: "Paloma", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/Paloma.png") },
      { name: "Arfin", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/arfin-logo.svg") },
      { name: "CNC Automotive", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/cnc automotive.webp") },
      { name: "Gearock", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/gearock.png") },
      { name: "Mod Forge", logo: blob("images/Client-Brands-Logo/Logos/Auto and Auto Components/mod forge.jpeg") },
      { name: "Veedol", logo: blob("images/Client-Brands-Logo/Veedol.png") },
      { name: "Godrej & Boyce", logo: blob("images/Client-Brands-Logo/Godrej-Boyce.png") },
      { name: "Polycab", logo: blob("images/Client-Brands-Logo/Logos/Engineering and Construction/polycab.jpg") },
      { name: "JSW Group", logo: blob("images/Client-Brands-Logo/Logos/Engineering and Construction/JSW_Group_Logo.png") },
      { name: "Crompton", logo: blob("images/Client-Brands-Logo/Logos/Home Appliances/crompton.png") },
    ],
    [
      { name: "Raymond", logo: blob("images/Client-Brands-Logo/Logos/Textile/raymond.png") },
      { name: "Arvind", logo: blob("images/Client-Brands-Logo/Logos/Textile/arvind.svg") },
      { name: "Kajaria", logo: blob("images/Client-Brands-Logo/kajaria.svg") },
      { name: "Somany", logo: blob("images/Client-Brands-Logo/Logos/Others/Somany-Logo-PNG.png") },
      { name: "Cello", logo: blob("images/Client-Brands-Logo/Cello.svg") },
      { name: "Safari", logo: blob("images/Client-Brands-Logo/safari.svg") },
      { name: "Kenstar", logo: blob("images/Client-Brands-Logo/Kenstar.png") },
      { name: "Stovekraft", logo: blob("images/Client-Brands-Logo/Logos/Home Appliances/stovekraft.png") },
      { name: "Blue Star", logo: blob("images/Client-Brands-Logo/Logos/UAE/blue star.svg") },
      { name: "Rolliflex", logo: "https://gembaconcepts.com/images/clients/rolliflex-trimmed.png" },
      { name: "Suncity Metals & Tubes", logo: blob("images/Client-Brands-Logo/Logos/Engineering and Construction/suncity-metals-tubes-logo.svg") },
      { name: "Manjushree", logo: blob("images/Client-Brands-Logo/Logos/Printing Packaging/manjushree_logo_header.png") },
      { name: "Parksons", logo: blob("images/Client-Brands-Logo/Logos/Printing Packaging/parksons.png") },
      { name: "Lloyds Metals", logo: blob("images/Client-Brands-Logo/Logos/Engineering and Construction/lloyds-metals-and-energy-ltd--507.webp") },
      { name: "Century Plyboards", logo: blob("images/Client-Brands-Logo/Logos/Others/Century_Plyboards.svg") },
      { name: "Synthite", logo: "https://gembaconcepts.com/images/clients/synthite-trimmed.png" },
    ],
  ] as Client[][],
};

export const faq = {
  chip: "FAQ",
  title: { lead: "Questions plant leaders", accent: "often ask." } as Headline,
  items: [
    {
      q: "What does an automotive manufacturing consultant do?",
      a: "We spend time on your shop floor, find where productivity, quality and cost can improve, and then make those changes with your team. You get real changes on your lines, measured against where you started.",
    },
    {
      q: "Do you work with auto component manufacturers, or only vehicle makers?",
      a: "Both, anywhere in India. We work with vehicle manufacturers and with Tier 1, Tier 2 and Tier 3 suppliers across machining, forging, casting, sheet metal, plastics, rubber, electricals and more.",
    },
    {
      q: "Will we need to buy new machines?",
      a: "Usually not to start. The first gains mostly come from how your existing lines, machines and people work together. If new equipment is the right call, the study will show it with numbers.",
    },
    {
      q: "How are you different from other automotive consulting firms in India?",
      a: "Three things. We work on your shop floor, side by side with your team. Our team includes former Toyota professionals. And we stay until your team runs the new way on its own.",
    },
    {
      q: "Do you use lean manufacturing methods in automotive plants?",
      a: "Yes. Line balancing, quick changeovers, kanban, mistake-proofing and daily reviews are all part of the toolkit. We pick the ones that fit your plant, and your team sees the results in the daily numbers.",
    },
    {
      q: "Can you help with software like ERP or a warehouse system?",
      a: "Yes, once the process is right. We fix how work flows first, then add simple digital tools so the gains stay visible. Software works best on a process that already runs well.",
    },
  ],
};

export const finalCta = {
  title: { lead: "Ready To Get More From Your", accent: "Automotive Plant?" } as Headline,
  sub: "Your lines can give more than they do today. Let's find out how much, together.",
};

export const footer = {
  copyright: "© 2026 Gemba Concepts Pvt. Ltd. All rights reserved.",
};
