import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { OPEN_STEPS, solutions } from "@/data/solutions";

/** Picture-first cards for every AI solution. Server component: sends titles and covers only. */
export default function SolutionsGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {solutions.map((s) => (
        <li key={s.slug}>
          <Link href={`/solutions/${s.slug}`} data-cursor="card" className="group relative block overflow-hidden rounded-[24px] border border-line bg-bg-2 transition-colors duration-300 hover:border-accent">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={s.cover} alt={s.coverAlt} width={800} height={600} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]" />
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,15,15,.92),rgba(15,15,15,.1)_60%)]" />
              <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-accent text-[#111]"><Icon name={s.icon} className="h-5 w-5" /></span>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="display text-2xl md:text-3xl">{s.title}</p>
                <p className="mt-1 text-sm text-ink/80">{s.short}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
              <span className="text-mute">{OPEN_STEPS} free steps · {s.steps.length - OPEN_STEPS} with Pro</span>
              <span className="inline-flex items-center gap-1 font-semibold text-accent">Open <Icon name="ArrowRight" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
