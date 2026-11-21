import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import StarField from "@/components/starx/StarField";
import SolutionsGrid from "@/components/solutions/SolutionsGrid";
import { OPEN_STEPS, solutions } from "@/data/solutions";
import { profile } from "@/data/site";

const title = "Build with AI: step-by-step prompts for real projects";
const description = `Build a portfolio, website, mobile app, brand, reels or sales copy with Claude, ChatGPT and Gemini. ${solutions.length} solutions, first ${OPEN_STEPS} steps free.`;

export const metadata: Metadata = {
  title: { absolute: `${title} — Star X Marketing` }, description, alternates: { canonical: "/solutions" },
  openGraph: { title, description, url: `${profile.site}/solutions` },
};

export default function SolutionsPage() {
  return (
    <>
      <main id="main">
        <section className="relative overflow-hidden px-5 pb-14 pt-28 md:px-10 md:pt-36">
          <img src="/space/cosmic-cliffs.webp" alt="" aria-hidden width={1920} height={1111} className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,15,15,.3),#0f0f0f)]" />
          <StarField />
          <div className="relative">
            <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / Build with AI</nav>
            <h1 className="display mt-4 max-w-4xl text-[11vw] leading-[0.98] md:text-[5.2vw]">Pick a project. Follow the steps.</h1>
            <p className="mt-4 max-w-xl text-lg text-mute">Ready prompts for Claude, ChatGPT and Gemini. The first {OPEN_STEPS} steps of each are free.</p>
          </div>
        </section>
        <section className="px-5 pb-20 md:px-10"><SolutionsGrid /></section>
      </main>
      <Footer />
    </>
  );
}
