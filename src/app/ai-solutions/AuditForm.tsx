"use client";
import { useState } from "react";
import { btnCls, Field, inputCls } from "@/components/hub/ui";

type Option = { key: string; title: string };

export default function AuditForm({ whatsapp, options }: { whatsapp: string; options: Option[] }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [wa, setWa] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const body = {
      name: f.get("name"), business: f.get("business"), whatsapp: f.get("whatsapp"), email: f.get("email"),
      problem: f.get("problem"), interests: f.getAll("interests"), website: f.get("website"),
    };
    setState("sending");
    const r = await fetch("/api/audit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    if (!r?.ok) { setState("idle"); setError(j?.error || "That didn't send. Check your connection and try again."); return; }
    const picked = options.filter((o) => body.interests.includes(o.key)).map((o) => o.title).join(", ");
    const text = `Hi, I just asked for a free AI audit.\nName: ${body.name}\nBusiness: ${body.business}${picked ? `\nInterested in: ${picked}` : ""}`;
    setWa(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`);
    setState("sent");
  };

  if (state === "sent") return (
    <div role="status" className="rounded-[24px] border border-accent bg-bg-2 p-8">
      <p className="text-2xl font-semibold">Got it, thank you.</p>
      <p className="mt-2 text-mute">We&apos;ll reply on WhatsApp, usually within one working day. If it&apos;s urgent, send us a message now and we&apos;ll see it sooner.</p>
      <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnCls} mt-6`}>Send on WhatsApp</a>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[24px] border border-line bg-bg-2 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name"><input name="name" required maxLength={80} autoComplete="name" className={inputCls} /></Field>
        <Field label="WhatsApp number" hint="Example: 0300 1234567 or +44 7700 900123"><input name="whatsapp" type="tel" required inputMode="tel" maxLength={20} autoComplete="tel" className={inputCls} /></Field>
      </div>
      <Field label="Your business" hint="Name and what you sell or do"><input name="business" required maxLength={160} autoComplete="organization" className={inputCls} /></Field>
      <Field label="Email (optional)"><input name="email" type="email" maxLength={120} autoComplete="email" className={inputCls} /></Field>
      <fieldset>
        <legend className="text-sm text-mute">What would help most? (optional)</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <label key={o.key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-line bg-bg px-4 py-2 text-sm has-[:checked]:border-accent">
              <input type="checkbox" name="interests" value={o.key} className="h-4 w-4 accent-[#ffd400]" />{o.title}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="What takes up most of your time right now?"><textarea name="problem" required minLength={10} maxLength={1200} rows={4} className={`${inputCls} h-auto py-3`} /></Field>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button disabled={state === "sending"} className={btnCls}>{state === "sending" ? "Sending…" : "Request my free audit"}</button>
        <span className="text-sm text-mute">We only use your details to reply to you.</span>
      </div>
    </form>
  );
}
