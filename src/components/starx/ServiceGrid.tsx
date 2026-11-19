"use client";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import Icon from "@/components/ui/Icon";
import { ContactButton } from "@/components/ui/ContactModal";

export type ServiceItem = { icon: string; title: string; body: string };

function Card({ s, i }: { s: ServiceItem; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 200, damping: 18 });
  const ix = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 160, damping: 16 });
  const iy = useSpring(useTransform(my, [0, 1], [-10, 10]), { stiffness: 160, damping: 16 });

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width); my.set((e.clientY - r.top) / r.height);
  };
  const leave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: (i % 3) * 0.08 }}
      className="[perspective:900px]"
    >
      <motion.div
        ref={ref}
        data-cursor="card"
        onPointerMove={move}
        onPointerLeave={leave}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-[24px] border border-line bg-bg-2 p-6 transition-colors duration-300 hover:border-accent md:p-7"
      >
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-x-100" />
        <div className="flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
          <motion.span style={reduce ? undefined : { x: ix, y: iy }} className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-[#111]">
            <Icon name={s.icon} className="h-7 w-7" />
          </motion.span>
          <span className="label text-dim">{String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3 className="display mt-6 text-2xl leading-tight" style={{ transform: "translateZ(20px)" }}>{s.title}</h3>
        <p className="mt-3 leading-relaxed text-mute">{s.body}</p>
        <ContactButton topic={s.title} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors group-hover:text-accent">
          Ask about this <Icon name="ArrowUpRight" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </ContactButton>
      </motion.div>
    </motion.li>
  );
}

export default function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((s, i) => <Card key={s.title} s={s} i={i} />)}</ul>;
}
