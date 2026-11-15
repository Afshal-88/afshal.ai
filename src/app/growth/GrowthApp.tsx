"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { btnCls, Field, ghostCls, inputCls } from "@/components/hub/ui";
import { businessTypes, goals, languages, modules, type ModuleKey } from "@/data/growth";
import { profile as site } from "@/data/site";

type Step = { id: string; title: string; detail: string; tool: string; time: string };
type Plan = { steps: Step[]; createdAt: string };
type Profile = {
  business: string; type: string; city: string; offer: string; audience: string; goals: string[];
  website: string; socials: string; budget: string; language: "english" | "roman-urdu";
};
type Data = { profile: Profile | null; plans: Partial<Record<ModuleKey, Plan>>; done: Partial<Record<ModuleKey, string[]>>; left: number };

const post = async (url: string, body: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  const d = await r?.json().catch(() => ({}));
  return { ok: !!r?.ok, d: d ?? {} };
};
const Alert = ({ children }: { children: React.ReactNode }) => (
  <p role="alert" className="rounded-xl border border-amber-400/30 bg-amber-400/[0.07] p-3 text-sm text-amber-100">{children}</p>
);
const Bar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10" aria-hidden><div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${Math.round(value * 100)}%` }} /></div>
);

export default function GrowthApp() {
  const [data, setData] = useState<Data | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("/api/growth").then(async (r) => (r.status === 401 ? null : r.ok ? r.json() : Promise.reject())).then(setData).catch(() => setData(null));
  }, []);

  if (data === undefined) return <div className="h-72 animate-pulse rounded-[24px] bg-bg-2" />;
  if (data === null) return <SignedOut />;
  if (!data.profile || editing) {
    return <ProfileForm initial={data.profile} onCancel={data.profile ? () => setEditing(false) : undefined} onSaved={(p) => { setData({ ...data, profile: p }); setEditing(false); }} />;
  }
  return <Dashboard data={data} setData={setData} onEdit={() => setEditing(true)} />;
}

function SignedOut() {
  return (
    <div className="rounded-[24px] border border-line bg-bg-2 p-6 md:p-10">
      <h2 className="display text-3xl md:text-4xl">Make your free Growth Plan</h2>
      <p className="mt-3 max-w-2xl text-lg text-mute">Create a free account, tell us about your business in two minutes, and get a step-by-step plan for each part of your marketing. Tick steps off as you go.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/account?next=/growth" className={btnCls}>Create free account <Icon name="ArrowRight" className="h-4 w-4" /></a>
        <a href="/account?mode=login&next=/growth" className={ghostCls}>I already have an account</a>
      </div>
    </div>
  );
}

function ProfileForm({ initial, onSaved, onCancel }: { initial: Profile | null; onSaved: (p: Profile) => void; onCancel?: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [picked, setPicked] = useState<string[]>(initial?.goals ?? []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr(""); setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const { ok, d } = await post("/api/growth/profile", { ...f, goals: picked });
    setBusy(false);
    if (!ok) { setErr(d.error || "Something went wrong. Check your connection and try again."); return; }
    onSaved(d.profile);
  };
  const toggle = (g: string) => setPicked((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  return (
    <form onSubmit={submit} className="rounded-[24px] border border-line bg-bg-2 p-6 md:p-10">
      <h2 className="display text-3xl md:text-4xl">{initial ? "Edit your business profile" : "Tell us about your business"}</h2>
      <p className="mt-3 max-w-2xl text-mute">Your plans are written from this. The more specific you are, the more useful the steps. Only you and the site admin can see it.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field label="Business name"><input name="business" required minLength={2} maxLength={120} defaultValue={initial?.business} className={inputCls} /></Field>
        <Field label="What kind of business">
          <select name="type" required defaultValue={initial?.type ?? ""} className={inputCls}>
            <option value="" disabled>Choose one</option>
            {businessTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="City or area" hint="Where your customers are. Example: DHA Lahore, or all of Pakistan"><input name="city" required minLength={2} maxLength={80} defaultValue={initial?.city} className={inputCls} /></Field>
        <Field label="Monthly marketing budget (optional)" hint="Rough is fine. Example: Rs 30,000 including ads"><input name="budget" maxLength={120} defaultValue={initial?.budget} className={inputCls} /></Field>
        <div className="md:col-span-2"><Field label="What do you sell?" hint="Your main products or services, and roughly what they cost"><textarea name="offer" required minLength={10} maxLength={500} rows={3} defaultValue={initial?.offer} className={`${inputCls} h-auto py-3`} /></Field></div>
        <div className="md:col-span-2"><Field label="Who are your customers?" hint="Example: working women 25-40 in Lahore who order online"><textarea name="audience" required minLength={5} maxLength={400} rows={2} defaultValue={initial?.audience} className={`${inputCls} h-auto py-3`} /></Field></div>
        <Field label="Website (optional)"><input name="website" maxLength={200} placeholder="example.com" defaultValue={initial?.website} className={inputCls} /></Field>
        <Field label="Social pages (optional)" hint="Instagram, Facebook, TikTok links or handles"><input name="socials" maxLength={300} defaultValue={initial?.socials} className={inputCls} /></Field>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm text-mute">What do you want most? Pick one or more.</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {goals.map((g) => (
            <button type="button" key={g} aria-pressed={picked.includes(g)} onClick={() => toggle(g)}
              className={`min-h-11 rounded-full border px-4 text-sm ${picked.includes(g) ? "border-accent bg-accent font-semibold text-[#111]" : "border-line text-mute hover:border-white/40"}`}>{g}</button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-sm text-mute">Write my plans in</legend>
        <div className="mt-3 flex flex-wrap gap-4">
          {languages.map((l) => (
            <label key={l.key} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="radio" name="language" value={l.key} defaultChecked={(initial?.language ?? "english") === l.key} className="h-4 w-4 accent-[#ffd400]" /> {l.label}
            </label>
          ))}
        </div>
      </fieldset>

      {err && <div className="mt-6"><Alert>{err}</Alert></div>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button disabled={busy} className={btnCls}>{busy ? "Saving…" : initial ? "Save profile" : "Save and see my plan"}</button>
        {onCancel && <button type="button" onClick={onCancel} className={ghostCls}>Cancel</button>}
      </div>
    </form>
  );
}

function Dashboard({ data, setData, onEdit }: { data: Data; setData: (d: Data) => void; onEdit: () => void }) {
  const [open, setOpen] = useState<ModuleKey>(modules[0].key);
  const [busy, setBusy] = useState<ModuleKey | null>(null);
  const [err, setErr] = useState("");
  const p = data.profile!;

  const stat = (k: ModuleKey) => {
    const total = data.plans[k]?.steps.length ?? 0, done = data.done[k]?.length ?? 0;
    return { total, done };
  };
  const all = modules.reduce((a, m) => { const s = stat(m.key); return { total: a.total + s.total, done: a.done + s.done }; }, { total: 0, done: 0 });

  const make = async (k: ModuleKey) => {
    if (data.plans[k] && !confirm("Make a new plan for this area? Your ticks for it will be cleared.")) return;
    setErr(""); setBusy(k);
    const { ok, d } = await post("/api/growth/plan", { module: k });
    setBusy(null);
    if (!ok) { setErr(d.error || "Something went wrong. Please try again."); return; }
    setData({ ...data, plans: { ...data.plans, [k]: d.plan }, done: { ...data.done, [k]: [] }, left: d.left });
  };

  const tick = async (k: ModuleKey, step: string, done: boolean) => {
    const before = data.done[k] ?? [];
    const next = done ? [...before, step] : before.filter((s) => s !== step);
    setData({ ...data, done: { ...data.done, [k]: next } });
    const { ok, d } = await post("/api/growth/progress", { module: k, step, done });
    if (!ok) { setData({ ...data, done: { ...data.done, [k]: before } }); setErr(d.error || "Couldn't save that tick. Check your connection."); }
  };

  const mod = modules.find((m) => m.key === open)!;
  const plan = data.plans[open];
  const doneSet = new Set(data.done[open] ?? []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-[24px] border border-line bg-bg-2 p-6 md:p-8">
        <div className="min-w-0">
          <p className="text-sm text-mute">Growth Plan for</p>
          <p className="mt-1 text-2xl font-semibold md:text-3xl">{p.business}</p>
          <p className="text-mute">{p.type} · {p.city}</p>
        </div>
        <div className="w-full max-w-xs">
          <p className="text-sm text-mute">{all.total ? `${all.done} of ${all.total} steps done` : "No plans made yet"}</p>
          <div className="mt-2"><Bar value={all.total ? all.done / all.total : 0} /></div>
        </div>
        <button onClick={onEdit} className={ghostCls}><Icon name="PenTool" className="h-4 w-4" /> Edit profile</button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3" role="tablist" aria-label="Marketing areas">
        {modules.map((m) => {
          const s = stat(m.key), active = m.key === open;
          return (
            <button key={m.key} role="tab" aria-selected={active} onClick={() => { setOpen(m.key); setErr(""); if (window.innerWidth < 640) requestAnimationFrame(() => document.getElementById("growth-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })); }}
              className={`rounded-[20px] border p-4 text-left md:p-5 transition-colors ${active ? "border-accent bg-accent/[0.06]" : "border-line bg-bg-2 hover:border-white/30"}`}>
              <span className="flex items-center gap-2 md:gap-3"><Icon name={m.icon} className="h-5 w-5 shrink-0 text-accent" /><span className="text-sm font-semibold md:text-base">{m.title}</span></span>
              <span className="mt-2 hidden text-sm text-mute sm:block">{m.body}</span>
              <span className="mt-4 block text-xs text-mute">{s.total ? `${s.done} / ${s.total} done` : "Not started"}</span>
              <span className="mt-2 block"><Bar value={s.total ? s.done / s.total : 0} /></span>
            </button>
          );
        })}
      </div>

      <section id="growth-panel" role="tabpanel" aria-label={mod.title} className="mt-6 scroll-mt-24 rounded-[24px] border border-line bg-bg-2 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="display text-3xl md:text-4xl">{mod.title}</h2>
            <p className="mt-2 max-w-2xl text-mute">{mod.body}</p>
          </div>
          {plan && <button disabled={!!busy || data.left < 1} onClick={() => make(open)} className={ghostCls}><Icon name="RotateCcw" className="h-4 w-4" /> {busy === open ? "Making…" : "Make a new plan"}</button>}
        </div>

        {err && <div className="mt-5"><Alert>{err}</Alert></div>}

        {!plan ? (
          <div className="mt-6">
            <p className="text-mute">Get {mod.title} steps written for {p.business} in {p.city}. Takes about 20 seconds.</p>
            <button disabled={!!busy || data.left < 1} onClick={() => make(open)} className={`${btnCls} mt-4`}>
              {busy === open ? "Writing your steps…" : `Make my ${mod.title} plan`}
            </button>
          </div>
        ) : (
          <ol className="mt-6 space-y-3">
            {plan.steps.map((s, i) => {
              const done = doneSet.has(s.id);
              return (
                <li key={s.id} className={`rounded-2xl border p-4 md:p-5 ${done ? "border-accent/40 bg-accent/[0.04]" : "border-line"}`}>
                  <label className="flex cursor-pointer gap-4">
                    <input type="checkbox" checked={done} onChange={(e) => tick(open, s.id, e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#ffd400]" />
                    <span className="min-w-0">
                      <span className={`block font-semibold ${done ? "text-mute line-through" : ""}`}>{i + 1}. {s.title}</span>
                      <span className="mt-1.5 block whitespace-pre-line text-sm leading-relaxed text-mute">{s.detail}</span>
                      {(s.tool || s.time) && <span className="mt-2 block text-xs text-mute/80">{[s.tool, s.time].filter(Boolean).join(" · ")}</span>}
                    </span>
                  </label>
                </li>
              );
            })}
          </ol>
        )}
        <p className="mt-6 text-xs text-mute">{data.left} new plan{data.left === 1 ? "" : "s"} left today. AI can make mistakes, so check anything important before you act on it.</p>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-line p-6 md:p-8">
        <div>
          <p className="text-xl font-semibold">Rather have it done for you?</p>
          <p className="mt-1 text-mute">Star X Marketing can set this up and run it with you for two months, then hand it over.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/ai-solutions#audit" className={btnCls}>Get a free audit</a>
          <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I made a Growth Plan for ${p.business} and want help with it.`)}`} target="_blank" rel="noopener noreferrer" className={ghostCls}><Icon name="MessageCircle" className="h-4 w-4" /> WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
