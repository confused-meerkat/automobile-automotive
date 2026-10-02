"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./landing.module.css";
import { config, form as copy } from "./content";

type Field = "fullname" | "email" | "company" | "designation" | "phone" | "size";
type Errors = Partial<Record<Field, string>>;

const RULES: Record<Field, (v: string) => string> = {
  fullname: (v) => (v ? "" : "Please enter your name."),
  email: (v) => (!v ? "Please enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Enter a valid work email."),
  company: (v) => (v ? "" : "Please enter your company."),
  designation: (v) => (v ? "" : "Please enter your designation."),
  phone: (v) => (v.replace(/\D/g, "").length === 10 ? "" : "Enter a 10-digit mobile number."),
  size: (v) => (v ? "" : "Please choose a company size."),
};

const TRACKING_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "li_fat_id", "fbclid"];

export default function LeadForm({ placement, buttonLabel }: { placement: "hero" | "book"; buttonLabel: string }) {
  const uid = useId();
  const id = (name: string) => `${placement}-${name}-${uid}`;
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [firstName, setFirstName] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    const data = Object.fromEntries(
      Array.from(new FormData(el).entries()).map(([k, v]) => [k, String(v).trim()])
    ) as Record<string, string>;
    if (data.website) return; // honeypot: bots fill it, people never see it

    const next: Errors = {};
    (Object.keys(RULES) as Field[]).forEach((k) => {
      const msg = RULES[k](data[k] ?? "");
      if (msg) next[k] = msg;
    });
    setErrors(next);
    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      (el.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const tracking = Object.fromEntries(TRACKING_KEYS.filter((k) => params.get(k)).map((k) => [k, params.get(k) as string]));
    const { website: _hp, ...lead } = data;
    void _hp;

    setStatus("sending");
    try {
      const res = await fetch(config.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: config.pagePath,
          form: placement,
          submittedAt: new Date().toISOString(),
          lead,
          tracking,
          referrer: document.referrer || null,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setFirstName((data.fullname || "").split(" ")[0]);
      setStatus("done");
    } catch {
      setStatus("failed");
    }
  }

  const clear = (k: Field) => errors[k] && setErrors((p) => ({ ...p, [k]: undefined }));
  const fieldClass = (k: Field) => [styles.field, errors[k] ? styles.bad : ""].filter(Boolean).join(" ");
  const err = (k: Field) =>
    errors[k] ? (
      <p className={styles.ferr} id={id(`${k}-err`)}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: Field) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? id(`${k}-err`) : undefined });

  if (status === "done") {
    return (
      <div className={styles.thanks} role="status">
        <h3>Thank you{firstName ? `, ${firstName}` : ""}.</h3>
        <p>A senior consultant will call you within 24 hours to talk about your plant.</p>
        <p>
          While you wait, <a href={config.assessmentUrl}>take the 5-minute Plant Assessment</a> so we come to the call ready.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Book a free shopfloor consultation">
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.fgrid}>
        <div className={fieldClass("fullname")}>
          <label htmlFor={id("fullname")}>Full name</label>
          <input className={styles.input} id={id("fullname")} name="fullname" autoComplete="name" required onInput={() => clear("fullname")} {...aria("fullname")} />
          {err("fullname")}
        </div>
        <div className={fieldClass("email")}>
          <label htmlFor={id("email")}>Work email</label>
          <input className={styles.input} id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" required onInput={() => clear("email")} {...aria("email")} />
          {err("email")}
        </div>
        <div className={fieldClass("company")}>
          <label htmlFor={id("company")}>Company</label>
          <input className={styles.input} id={id("company")} name="company" autoComplete="organization" required onInput={() => clear("company")} {...aria("company")} />
          {err("company")}
        </div>
        <div className={fieldClass("designation")}>
          <label htmlFor={id("designation")}>Designation</label>
          <input className={styles.input} id={id("designation")} name="designation" autoComplete="organization-title" required onInput={() => clear("designation")} {...aria("designation")} />
          {err("designation")}
        </div>
        <div className={fieldClass("phone")}>
          <label htmlFor={id("phone")}>Phone number</label>
          <div className={styles.phone}>
            <span aria-hidden="true">+91</span>
            <input className={styles.input} id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="10-digit mobile" required onInput={() => clear("phone")} {...aria("phone")} />
          </div>
          {err("phone")}
        </div>
        <div className={fieldClass("size")}>
          <label htmlFor={id("size")}>Company size</label>
          <select className={styles.select} id={id("size")} name="size" required defaultValue="" onChange={() => clear("size")} {...aria("size")}>
            <option value="">Select company size</option>
            {copy.companySizes.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {err("size")}
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor={id("business")}>Your business</label>
          <select className={styles.select} id={id("business")} name="business" defaultValue="">
            <option value="">Select your business</option>
            {copy.businesses.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <label htmlFor={id("message")}>{copy.messageLabel}</label>
          <textarea className={styles.textarea} id={id("message")} name="message" placeholder={copy.messagePlaceholder} />
        </div>
        <div className={`${styles.field} ${styles.full}`}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.block}`} disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : buttonLabel}
          </button>
          <p className={[styles.fnote, status === "failed" ? styles.fnoteError : ""].join(" ")} role={status === "failed" ? "alert" : undefined}>
            {status === "failed" ? "We couldn't send your details. Check your connection and try again." : copy.note}
          </p>
        </div>
      </div>
    </form>
  );
}
