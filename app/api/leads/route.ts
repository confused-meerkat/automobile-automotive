import { NextResponse } from "next/server";

/**
 * Receives both landing-page forms.
 * TODO before go-live: send `body` to the CRM / form backend the main site uses
 * (and keep the UTM fields in `body.tracking` for campaign reporting).
 */
const REQUIRED = ["fullname", "email", "company", "designation", "phone", "size"] as const;

export async function POST(req: Request) {
  let body: { lead?: Record<string, string>; [k: string]: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const lead = body.lead ?? {};
  const missing = REQUIRED.filter((k) => !String(lead[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "Missing fields", missing }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }

  // Replace this with the CRM call.
  console.log("[automotive-landing] new lead", JSON.stringify(body));

  return NextResponse.json({ ok: true });
}
