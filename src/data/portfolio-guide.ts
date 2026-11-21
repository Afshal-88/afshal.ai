// Members-only guide: build a 3D portfolio from your PDF/folder and resume with Claude, ChatGPT or Gemini,
// then put it live on Vercel. Imported only by the server page, so none of this reaches visitors who are not signed in.

export type GuidePrompt = { title: string; use: string; text: string };
export type GuideStep = { n: number; title: string; body: string[]; prompts?: GuidePrompt[]; checklist?: string[] };

export const guideSteps: GuideStep[] = [
  {
    n: 1,
    title: "Collect your material",
    body: [
      "Make one folder on your computer called portfolio. Everything the AI needs goes in it.",
      "Pick only your best work. Four to six strong projects beat twenty average ones.",
    ],
    checklist: [
      "Your portfolio as a PDF, or a folder of project images and screenshots",
      "Your resume / CV as a PDF",
      "One clear photo of yourself (face visible, plain background)",
      "Links: LinkedIn, Instagram, Behance, GitHub, anything you use",
      "For each project: name, client or company, year, what you did, and the result (only real results)",
      "Your email and WhatsApp number for the contact section",
    ],
  },
  {
    n: 2,
    title: "Turn your files into clean content",
    body: [
      "Open Claude, ChatGPT or Gemini. Upload your portfolio PDF (or the images) and your resume, then paste this prompt.",
      "Read what comes back. Fill every [MISSING] yourself and answer the questions at the end. Save the final text; you'll paste it into the next prompt.",
    ],
    prompts: [
      {
        title: "Prompt 1 — Extract my content",
        use: "Claude, ChatGPT or Gemini, with your PDF and resume attached",
        text: `I'm attaching my portfolio (PDF or images) and my resume. I want to turn them into a personal portfolio website.

Read both files carefully and give me back ONE organised content document in Markdown with these parts:

1. About me — full name, current role, city and country, and a 2–3 sentence introduction in first person, plain and specific (no slogans).
2. Skills — grouped, for example: Design, Marketing, Development, Tools.
3. Experience — for each job: company, role, start and end dates, and 3 short bullet points of what I actually did.
4. Education and certificates — with dates and institutions.
5. Projects — for each project: title, client or context, year, my role, what I did, the result, and which pages or images from my portfolio belong to it (give each image a file name like project-1-a.jpg).
6. Contact — email, phone/WhatsApp, LinkedIn and every other link in my files.

Rules:
- Use only facts that appear in my files. Do not invent clients, numbers, awards, testimonials or results.
- If something is missing, write [MISSING: what is needed] so I can fill it in.
- Keep my wording where it is good; fix spelling and grammar.
- At the end, list up to 8 questions I should answer to make the portfolio stronger.`,
      },
    ],
  },
  {
    n: 3,
    title: "Build the 3D portfolio",
    body: [
      "Choose one of the two prompts below. Prompt 2A builds a proper Next.js site (best if you will keep improving it). Prompt 2B builds a single HTML file (easiest if you have never coded).",
      "Claude is usually the strongest at writing complete, working code. Paste your content from step 2 where the prompt says so.",
    ],
    prompts: [
      {
        title: "Prompt 2A — Next.js 3D portfolio (recommended)",
        use: "Claude (best), ChatGPT or Gemini",
        text: `You are a senior front-end developer and designer. Build my personal portfolio website from the content at the end of this message.

TECH
- Next.js (App Router) with TypeScript and Tailwind CSS
- React Three Fiber + @react-three/drei for ONE 3D element in the hero: [choose: my initials in 3D / a slowly rotating abstract shape / a star field] that gently turns toward the mouse
- motion (Framer Motion) for scroll-in animations
- Must deploy on Vercel with zero extra setup

SECTIONS (one page)
1. Hero — my name, role, one-line intro, the 3D element, buttons "View my work" and "Download CV" (links to /cv.pdf).
2. About — my photo and short bio.
3. Selected work — project cards (image, title, role, year). Clicking a card opens a popup with all images and the full description.
4. Skills and tools — grouped chips.
5. Experience — a timeline.
6. Education and certificates.
7. Contact — email, WhatsApp link (https://wa.me/[my number in international format]), social links, and a simple contact form using https://formsubmit.co/[my email] (no backend needed).

DESIGN
- Style: [e.g. dark background #0f0f0f, light text, one accent colour #____, clean and modern]
- Fonts: [e.g. a bold display font for headings, a readable sans-serif for text], loaded with next/font
- Mobile first: everything must work on a 360px-wide phone.
- The 3D element loads after the page is visible, pauses when scrolled off screen, and is replaced by a static image on phones and for people who prefer reduced motion.
- Only my real content. No fake numbers, testimonials or client logos.

OUTPUT
- The complete project, file by file: package.json, next.config, app/layout.tsx, app/page.tsx, components/*, data/content.ts, tailwind/global CSS.
- Put ALL my text in data/content.ts so I can edit it later without touching the design.
- Tell me exactly which image files to put in /public (with names) and to save my CV as /public/cv.pdf.
- Finish with the commands to run it on my computer (npm install, npm run dev) and what I should see.

MY CONTENT
[paste the Markdown from Prompt 1 here]`,
      },
      {
        title: "Prompt 2B — One-file 3D portfolio (no coding)",
        use: "Claude, ChatGPT or Gemini",
        text: `Build my portfolio as ONE single index.html file that I can open in a browser and upload anywhere.

- Use Three.js from a CDN for an animated 3D background (slow-moving stars or a rotating shape that follows the mouse). Plain HTML, CSS and JavaScript for everything else.
- Sections: hero (name, role, intro, "Download CV" button), about with my photo, projects with a popup image gallery, skills, experience, education, contact (email, WhatsApp link, social links).
- Mobile friendly and fast. Turn the 3D effect off on phones and for people who prefer reduced motion.
- Image paths: images/photo.jpg, images/project-1.jpg, images/project-2.jpg … and cv.pdf. List every file I need to add at the end.
- Use only my content below. Do not invent anything; write [MISSING] where something is not given.

MY CONTENT
[paste the Markdown from Prompt 1 here]`,
      },
    ],
  },
  {
    n: 4,
    title: "Check it and fix it",
    body: [
      "Run the site on your computer (or open index.html). Look at it on your phone too. Then ask the AI to review its own work with this prompt.",
    ],
    prompts: [
      {
        title: "Prompt 3 — Strict review",
        use: "Same chat as step 3",
        text: `Review the portfolio you just wrote as a strict senior reviewer, then give me the corrected files only.

1. Content: does every word match my content? List anything invented or missing.
2. Phone (360px), tablet and desktop: fix anything that overflows, overlaps or is too small to tap.
3. Speed: images sized and lazy-loaded, the 3D part loaded last, nothing blocking the first paint. Aim for Lighthouse 90+ on mobile.
4. Accessibility: alt text on every image, readable colour contrast, keyboard navigation, visible focus.
5. SEO: page title "[My Name] — [My Role]", meta description, an Open Graph image, my name in the H1.`,
      },
    ],
  },
  {
    n: 5,
    title: "Put it live on Vercel",
    body: [
      "This is how the Star X website itself is hosted: code on GitHub, live on Vercel, free to start.",
      "If you use an AI coding agent (Claude Code, Cursor or similar), give it Prompt 4 and it will do the steps with you. If not, follow the manual steps under it.",
    ],
    prompts: [
      {
        title: "Prompt 4 — Deploy to Vercel",
        use: "Claude Code or another AI coding agent, inside your project folder",
        text: `I have built my portfolio website (Next.js) in this folder and I want it live on Vercel with my own GitHub, set up like this:

1. Create a new GitHub repository called [my-name-portfolio] and push all project files to the main branch. Make sure .env files and node_modules are NOT uploaded.
2. Import that repository into Vercel (framework: Next.js, default settings) and deploy it to production.
3. Every push to main should redeploy automatically.
4. After deploying, open the live URL and check: the page loads, the 3D element shows on desktop, the phone layout works, the CV downloads, every link and the contact form work. Report anything that fails and fix it.
5. Optional — connect my domain [mydomain.com]: give me the exact DNS records (A record for the root and CNAME for www) to add at my domain provider, then confirm Vercel shows the domain as valid with HTTPS.

Explain each step in simple words. Stop and ask me before anything that needs my login, a password or a payment.`,
      },
    ],
    checklist: [
      "Make a free account on github.com, then New repository → name it → Create",
      "Click \"uploading an existing file\" and drag in your project files (not node_modules)",
      "Sign in to vercel.com with GitHub → Add New → Project → pick the repository → Deploy",
      "In about two minutes you get a live link like your-name.vercel.app",
      "Optional: Vercel → Settings → Domains → add your own domain and copy the DNS records it shows",
    ],
  },
  {
    n: 6,
    title: "Share it",
    body: [
      "Put the link in your Instagram bio, LinkedIn Featured section, email signature and the top of your CV. Then use this prompt to announce it.",
    ],
    prompts: [
      {
        title: "Prompt 5 — Launch post",
        use: "Any AI",
        text: `Write a short LinkedIn post and an Instagram caption announcing my new portfolio website: [link].
I am a [role] in [city]. My best projects on it are [project 1], [project 2] and [project 3].
Tone: friendly and confident, no buzzwords, no exaggeration. End with one clear line inviting people to get in touch. Give me 2 versions of each.`,
      },
    ],
  },
];

export const guideTeaser = [
  { icon: "FileText", title: "Use your PDF and CV", body: "Turn what you already have into clean website content." },
  { icon: "Sparkles", title: "6 ready prompts", body: "For Claude, ChatGPT and Gemini, copy and paste." },
  { icon: "Layers", title: "3D portfolio", body: "A modern site with a 3D hero, popups and animations." },
  { icon: "Rocket", title: "Live on Vercel", body: "Free hosting, your own link, optional custom domain." },
];
