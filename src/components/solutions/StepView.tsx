import Icon from "@/components/ui/Icon";
import CopyButton from "@/components/hub/CopyButton";
import type { GuideStep } from "@/data/portfolio-guide";

/** One open step: number, title, short text, checklist and copyable prompts. Server component. */
export function OpenStep({ s }: { s: GuideStep }) {
  return (
    <li id={`step-${s.n}`} className="scroll-mt-24 grid gap-5 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <span className="display block text-5xl text-accent">{String(s.n).padStart(2, "0")}</span>
        <h3 className="display mt-2 text-2xl md:text-3xl">{s.title}</h3>
        {s.body.map((p) => <p key={p} className="mt-2 leading-relaxed text-mute">{p}</p>)}
      </div>
      <div className="space-y-4 lg:col-span-8">
        {s.checklist && (
          <ul className="grid gap-2 rounded-[22px] border border-line bg-bg-2 p-5">
            {s.checklist.map((c) => <li key={c} className="flex gap-3"><Icon name="Check" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />{c}</li>)}
          </ul>
        )}
        {s.prompts?.map((p) => (
          <div key={p.title} className="overflow-hidden rounded-[22px] border border-line bg-bg-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div><p className="font-semibold">{p.title}</p><p className="text-sm text-mute">{p.use}</p></div>
              <CopyButton text={p.text} label="Copy prompt" />
            </div>
            <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[13px] leading-relaxed text-ink/90">{p.text}</pre>
          </div>
        ))}
      </div>
    </li>
  );
}

/** A locked step: only the number, title and one line show. The prompt is never sent. */
export function LockedStep({ s }: { s: GuideStep }) {
  return (
    <li className="flex items-start gap-4 rounded-[22px] border border-line bg-bg-2 p-5">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-accent"><Icon name="Lock" className="h-5 w-5" /></span>
      <div className="min-w-0">
        <p className="label text-dim">Step {s.n}{s.prompts?.length ? ` · ${s.prompts.length} prompt${s.prompts.length > 1 ? "s" : ""}` : ""}</p>
        <p className="mt-1 text-lg font-semibold">{s.title}</p>
        <p className="mt-1 text-mute">{s.body[0]}</p>
      </div>
    </li>
  );
}
