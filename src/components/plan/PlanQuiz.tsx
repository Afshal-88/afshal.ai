"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Icon from "@/components/ui/Icon";
import { btnCls, Field, ghostCls, inputCls } from "@/components/hub/ui";
import { buildPlans, firstSteps, visibleQuestions, type Answers, type SiteSeen } from "@/data/plans";

type Contact = { name: string; business: string; whatsapp: string; email: string };

const tile = "group flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left text-base transition-colors duration-200";

export default function PlanQuiz({ whatsapp }: { whatsapp: string }) {
  const [a, setA] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState<SiteSeen | null>(null);
  const [peeking, setPeeking] = useState(false);
  const [peekErr, setPeekErr] = useState("");
  const [contact, setContact] = useState<Contact | null>(null);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const reduce = useReducedMotion();

  const qs = visibleQuestions(a.stage ? a : { ...a, stage: "existing" }).filter((x) => a.stage || !x.when || x.key !== "newStage");
  const total = qs.length + 1; // + contact step
  const done = contact !== null;
  const q = qs[step];
  const plans = useMemo(() => buildPlans(a), [a]);
  const steps = useMemo(() => firstSteps(a, seen), [a, seen]);

  const set = (k: keyof Answers, v: unknown) => setA((p) => ({ ...p, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, qs.length));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const choose = (k: keyof Answers, v: string) => {
    // changing the first answer can change which questions follow
    setA((p) => (k === "stage" && p.stage !== v ? { stage: v as Answers["stage"] } : { ...p, [k]: v }));
    if (k === "stage") setSeen(null);
    setTimeout(next, reduce ? 0 : 180);
  };
  const toggle = (k: keyof Answers, v: string) => {
    const cur = (a[k] as string[] | undefined) ?? [];
    if (v === "none") return set(k, cur.includes("none") ? [] : ["none"]);
    set(k, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur.filter((x) => x !== "none"), v]);
  };

  const peek = async () => {
    if (!a.website?.trim()) return next();
    setPeekErr(""); setPeeking(true);
    const r = await fetch("/api/plan/peek", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: a.website }) }).catch(() => null);
    const j = await r?.json().catch(() => null);
    setPeeking(false);
    if (!r?.ok || !j) { setPeekErr(j?.error || "We couldn't open that website. Check the address or skip."); return; }
    setSeen(j);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const c: Contact = { name: String(f.get("name") ?? ""), business: String(f.get("business") ?? ""), whatsapp: String(f.get("whatsapp") ?? ""), email: String(f.get("email") ?? "") };
    setErr(""); setSending(true);
    const r = await fetch("/api/plan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...c, company: f.get("company"), answers: a }) }).catch(() => null);
    const j = await r?.json().catch(() => ({}));
    setSending(false);
    if (!r?.ok) { setErr(j?.error || "That didn't send. Check your connection and try again."); return; }
    setContact(c);
    requestAnimationFrame(() => document.getElementById("your-plan")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  const wa = (planName: string, setup: number, monthly: number) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi Star X, I want the ${planName} plan ($${setup} setup + $${monthly}/month).\nName: ${contact?.name}\nBusiness: ${contact?.business || "-"}`)}`;

  if (done) return (
    <div id="your-plan" className="scroll-mt-24">
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-[24px] border border-line bg-bg-2 p-6 lg:col-span-7">
          <p className="label text-accent">Your first 30 days</p>
          <ol className="mt-4 grid gap-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-[#111]">{i + 1}</span><span className="pt-0.5">{s}</span></li>
            ))}
          </ol>
        </div>
        <div className="rounded-[24px] border border-line bg-bg-2 p-6 lg:col-span-5">
          {seen ? (
            <>
              <p className="label text-accent">What we saw on your website</p>
              {seen.title && <p className="mt-3 font-semibold">{seen.title}</p>}
              <ul className="mt-3 grid gap-2 text-sm">
                {seen.good.slice(0, 3).map((g) => <li key={g} className="flex gap-2"><Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{g}</li>)}
                {seen.issues.map((g) => <li key={g} className="flex gap-2 text-mute"><Icon name="X" className="mt-0.5 h-4 w-4 shrink-0" />{g}</li>)}
              </ul>
            </>
          ) : (
            <>
              <p className="label text-accent">Next step</p>
              <p className="mt-3">Pick a plan below. We&apos;ll confirm the details with you on WhatsApp before any work or payment.</p>
            </>
          )}
        </div>
      </div>

      <ul className="mt-6 grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <li key={p.key} className={`relative flex flex-col rounded-[24px] border bg-bg-2 p-6 ${p.recommended ? "border-accent" : "border-line"}`}>
            {p.recommended && <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-[#111]">Best fit for you</span>}
            <h3 className="display text-3xl">{p.name}</h3>
            <p className="mt-4"><span className="display text-4xl tabular-nums">${p.monthly}</span><span className="text-mute"> / month</span></p>
            <p className="mt-1 text-sm text-mute">+ ${p.setup} one-time setup</p>
            <p className="label mt-6 text-dim">Setup</p>
            <ul className="mt-2 grid gap-2 text-sm">{p.setupItems.map((s) => <li key={s} className="flex gap-2"><Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s}</li>)}</ul>
            <p className="label mt-5 text-dim">Every month</p>
            <ul className="mt-2 grid flex-1 content-start gap-2 text-sm">{p.monthlyItems.map((s) => <li key={s} className="flex gap-2"><Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s}</li>)}</ul>
            <a href={wa(p.name, p.setup, p.monthly)} target="_blank" rel="noopener noreferrer" className={`${p.recommended ? btnCls : ghostCls} mt-6 w-full`}>Choose {p.name} <Icon name="ArrowRight" className="h-4 w-4" /></a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-mute">Prices in US dollars. Ad spend is paid to Meta or Google directly and isn&apos;t included. We confirm scope with you before starting.</p>
      <button type="button" onClick={() => { setContact(null); setStep(0); setA({}); setSeen(null); }} className="mt-4 text-sm text-mute underline underline-offset-4 hover:text-ink">Start again</button>
    </div>
  );

  return (
    <div className="rounded-[28px] border border-line bg-bg-2 p-5 md:p-8">
      <div className="flex items-center justify-between gap-4 text-sm text-mute">
        <span>Question {Math.min(step + 1, total)} of {total}</span>
        {step > 0 && <button type="button" onClick={back} className="inline-flex items-center gap-1 hover:text-ink"><Icon name="ChevronLeft" className="h-4 w-4" /> Back</button>}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={q ? q.key : "contact"} initial={reduce ? false : { opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className="mt-6">
          {q ? (
            <fieldset>
              <legend className="display text-2xl md:text-3xl">{q.title}</legend>
              {q.hint && <p className="mt-2 text-mute">{q.hint}</p>}

              {q.kind === "one" && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {q.options!.map((o) => {
                    const on = a[q.key] === o.value;
                    return (
                      <button key={o.value} type="button" onClick={() => choose(q.key, o.value)} aria-pressed={on} className={`${tile} ${on ? "border-accent bg-accent/10" : "border-line hover:border-white/40"}`}>
                        {o.icon && <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-accent text-[#111]" : "bg-white/5 text-accent"}`}><Icon name={o.icon} className="h-5 w-5" /></span>}
                        <span>{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {q.kind === "many" && (
                <>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {q.options!.map((o) => {
                      const on = ((a[q.key] as string[] | undefined) ?? []).includes(o.value);
                      return (
                        <button key={o.value} type="button" onClick={() => toggle(q.key, o.value)} aria-pressed={on} className={`${tile} ${on ? "border-accent bg-accent/10" : "border-line hover:border-white/40"}`}>
                          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${on ? "border-accent bg-accent text-[#111]" : "border-white/30"}`}>{on && <Icon name="Check" className="h-4 w-4" />}</span>
                          <span>{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={next} disabled={!((a[q.key] as string[] | undefined)?.length)} className={`${btnCls} mt-6`}>Next <Icon name="ArrowRight" className="h-4 w-4" /></button>
                </>
              )}

              {q.kind === "links" && (
                <div className="mt-5 grid gap-4">
                  <Field label="Website"><input value={a.website ?? ""} onChange={(e) => { set("website", e.target.value); setSeen(null); setPeekErr(""); }} placeholder="yourbrand.com" inputMode="url" autoComplete="url" className={inputCls} /></Field>
                  <Field label="Instagram or Facebook page"><input value={a.social ?? ""} onChange={(e) => set("social", e.target.value)} placeholder="@yourbrand" className={inputCls} /></Field>
                  {peekErr && <p role="alert" className="text-sm text-[#ff8a80]">{peekErr}</p>}
                  {seen && (
                    <div role="status" className="rounded-2xl border border-line bg-bg p-4">
                      <p className="font-semibold">We had a look{seen.title ? `: ${seen.title}` : ""}</p>
                      <ul className="mt-2 grid gap-1.5 text-sm">
                        {seen.good.slice(0, 3).map((g) => <li key={g} className="flex gap-2"><Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{g}</li>)}
                        {seen.issues.slice(0, 4).map((g) => <li key={g} className="flex gap-2 text-mute"><Icon name="X" className="mt-0.5 h-4 w-4 shrink-0" />{g}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {seen ? <button type="button" onClick={next} className={btnCls}>Next <Icon name="ArrowRight" className="h-4 w-4" /></button>
                      : <button type="button" onClick={peek} disabled={peeking} className={btnCls}>{peeking ? "Looking at your website…" : a.website?.trim() ? "Look at my website" : "Next"} {!peeking && <Icon name="ArrowRight" className="h-4 w-4" />}</button>}
                    {!seen && a.website?.trim() && <button type="button" onClick={next} className={ghostCls}>Skip</button>}
                  </div>
                </div>
              )}
            </fieldset>
          ) : (
            <form onSubmit={submit} className="grid gap-4">
              <div>
                <h3 className="display text-2xl md:text-3xl">Your plan is ready</h3>
                <p className="mt-2 text-mute">Where should we send it? We&apos;ll show it here right away.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name"><input name="name" required minLength={2} maxLength={80} autoComplete="name" className={inputCls} /></Field>
                <Field label="Business or brand name"><input name="business" maxLength={120} autoComplete="organization" className={inputCls} /></Field>
                <Field label="WhatsApp number"><input name="whatsapp" required type="tel" inputMode="tel" autoComplete="tel" placeholder="+92 3xx xxxxxxx" className={inputCls} /></Field>
                <Field label="Email (optional)"><input name="email" type="email" autoComplete="email" className={inputCls} /></Field>
              </div>
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              {err && <p role="alert" className="text-sm text-[#ff8a80]">{err}</p>}
              <button type="submit" disabled={sending} className={`${btnCls} w-full sm:w-auto`}>{sending ? "Building your plan…" : "Show my plan"} {!sending && <Icon name="ArrowRight" className="h-4 w-4" />}</button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
