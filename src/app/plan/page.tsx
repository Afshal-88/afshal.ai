import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import PlanQuiz from "@/components/plan/PlanQuiz";
import StarField from "@/components/starx/StarField";
import { profile } from "@/data/site";

const title = "Get your marketing plan — Star X Marketing";
const description = "Answer 10 quick questions about your brand. Get a marketing plan with Basic, Standard and Premium options in US dollars: website, SEO, social media and ads.";

export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: "/plan" },
  openGraph: { title, description, url: `${profile.site}/plan` },
};

export default function PlanPage() {
  return (
    <>
      <main id="main" className="relative overflow-hidden px-5 pb-16 pt-28 md:px-10 md:pt-36">
        <img src="/space/spiral-m96.webp" alt="" aria-hidden width={1200} height={985} className="pointer-events-none absolute -right-40 -top-24 w-[640px] max-w-none opacity-40 mix-blend-screen [mask-image:radial-gradient(closest-side,#000_60%,transparent)] md:-right-24 md:w-[820px]" />
        <StarField />
        <div className="relative">
          <nav aria-label="Breadcrumb" className="text-sm text-mute"><Link href="/" className="hover:text-ink">Home</Link> / Marketing plan</nav>
          <h1 className="display mt-4 max-w-4xl text-[11vw] leading-[0.98] md:text-[5vw]">Your marketing plan in 2 minutes</h1>
          <p className="mt-4 max-w-xl text-lg text-mute">New brand or existing one, answer a few questions and see three plans with prices.</p>
          <div className="mt-10 max-w-5xl"><PlanQuiz whatsapp={profile.whatsapp} /></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
