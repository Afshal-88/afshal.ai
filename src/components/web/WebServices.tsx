import Icon from "@/components/ui/Icon";
import { FadeUp } from "@/components/Reveal";
import { buildSteps, webServices } from "@/data/web";

/** Website services as numbered rows that fill with the accent on hover, then the 4 build steps. */
export default function WebServices() {
  return (
    <>
      <ul className="grid border-t border-line md:grid-cols-2 md:gap-x-10">
        {webServices.map((s, i) => (
          <li key={s.title} className="group relative overflow-hidden border-b border-line">
            <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100" />
            <div className="relative flex items-center gap-4 px-1 py-5 transition-colors duration-300 group-hover:text-[#111] md:gap-6 md:px-3 md:py-6">
              <span className="label w-8 shrink-0 text-dim transition-colors group-hover:text-[#111]/60">{String(i + 1).padStart(2, "0")}</span>
              <Icon name={s.icon} className="h-6 w-6 shrink-0 text-accent transition-colors group-hover:text-[#111]" />
              <span className="min-w-0">
                <span className="block text-xl font-semibold md:text-2xl">{s.title}</span>
                <span className="block text-sm text-mute transition-colors group-hover:text-[#111]/75 md:text-base">{s.line}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
      <ol className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {buildSteps.map((s, i) => (
          <FadeUp key={s.title} delay={i * 0.08} className="h-full">
            <li className="relative h-full overflow-hidden rounded-[22px] border border-line p-5 md:p-6">
              <span className="display block text-5xl text-accent md:text-6xl">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-5 block text-xl font-semibold">{s.title}</span>
              <span className="mt-1 block text-sm leading-snug text-mute">{s.body}</span>
            </li>
          </FadeUp>
        ))}
      </ol>
    </>
  );
}
