// Step-by-step AI solutions by topic. The first OPEN steps of each are public; the rest are
// for Pro members. Server-side data: imported only by server pages, so locked prompts never
// reach visitors who haven't unlocked them.
import { guideSteps, type GuideStep } from "./portfolio-guide";

export const OPEN_STEPS = 3;

export type Solution = {
  slug: string; title: string; short: string; icon: string;
  cover: string; coverAlt: string; gallery?: { src: string; alt: string }[];
  result: string; tools: string[]; steps: GuideStep[];
};

const renumber = (s: GuideStep[]) => s.map((x, i) => ({ ...x, n: i + 1 }));

const portfolioStyle: GuideStep = {
  n: 0, title: "Choose your look",
  body: ["Decide how the site should feel before any code. The AI turns your taste into a clear design brief."],
  prompts: [{ title: "Design brief", use: "Claude, ChatGPT or Gemini, in the same chat as step 2", text: `Using my content above, write a one-page design brief for my portfolio website.

Ask me 5 short questions first about: the feeling I want (e.g. bold, calm, premium, playful), colours I like, 2–3 websites I admire, whether I want a dark or light site, and what the 3D element in the hero should be.

Then give me:
1. Colour palette: background, text, one accent colour (hex codes).
2. Fonts: one display font for headings and one for text (Google Fonts).
3. The 3D hero idea in one sentence.
4. Section order with one line about each.
5. Three words the site must feel like, and three it must never feel like.
Keep it short. I'll paste this brief into the build prompt.` }],
};

export const solutions: Solution[] = [
  {
    slug: "portfolio", title: "3D portfolio website", short: "Turn your PDF and CV into a live 3D portfolio.", icon: "Briefcase",
    cover: "/sites/zufishan-desktop.webp", coverAlt: "A portfolio website we built",
    gallery: [{ src: "/sites/keune-desktop.webp", alt: "Website we built for Keune" }, { src: "/sites/zufishan-mobile.webp", alt: "Portfolio site on a phone" }],
    result: "A live portfolio on your own link, with a 3D hero, project popups and a CV download.",
    tools: ["Claude", "ChatGPT", "Gemini", "Vercel"],
    steps: renumber([guideSteps[0], guideSteps[1], portfolioStyle, ...guideSteps.slice(2)]),
  },
  {
    slug: "website", title: "Business website", short: "Plan, write and build a fast website with AI.", icon: "Globe",
    cover: "/sites/houseofflowers-desktop.webp", coverAlt: "A business website we built",
    gallery: [{ src: "/sites/buzzazi-desktop.webp", alt: "Website we built for Buzzazi" }, { src: "/sites/houseofflowers-mobile.webp", alt: "The same site on a phone" }],
    result: "A fast business website with your copy, SEO, WhatsApp button and contact form, live on your domain.",
    tools: ["Claude", "ChatGPT", "Next.js", "Vercel"],
    steps: renumber([
      { n: 0, title: "Plan the pages", body: ["Get a sitemap built around what customers ask before they buy."], prompts: [{ title: "Sitemap", use: "Any AI", text: `I run [BUSINESS] in [CITY/COUNTRY]. We sell [PRODUCTS/SERVICES] to [CUSTOMERS].
Plan my website:
1. The 5–8 pages I need and why each exists.
2. For each page: its goal, the main question it answers and the one action a visitor should take.
3. The 10 questions customers ask before buying, and which page answers each.
4. What to put above the fold on the home page.
Use only what I told you. Ask me up to 5 questions if something important is missing.` }] },
      { n: 0, title: "Write the copy", body: ["Clear words sell more than fancy design. Write every page before building."], prompts: [{ title: "Page copy", use: "Same chat", text: `Write the copy for every page in the sitemap above.
For each page: SEO title (under 60 characters), meta description (under 155), H1, sections with headings and short paragraphs, and button text.
Rules: plain words, short sentences, talk to the customer as "you". No slogans, no made-up numbers, reviews or awards. Where proof is needed, write [ADD REAL REVIEW] or [ADD REAL NUMBER].` }] },
      { n: 0, title: "Pick a design direction", body: ["Give the AI your taste so the site doesn't look like every other template."], prompts: [{ title: "Design direction", use: "Same chat", text: `Here are 2–3 websites I like: [LINKS]. My brand colours: [COLOURS or "suggest"]. My logo: [describe it].
Write a design direction for my site: colour palette with hex codes, two Google Fonts, button and card style, photo style, spacing, and how the home page hero should look. Explain each choice in one line. Keep one accent colour only.` }] },
      { n: 0, title: "Build it", body: ["One prompt that turns your sitemap, copy and design into a complete Next.js website."], prompts: [{ title: "Build the website", use: "Claude (best) or another coding AI", text: `You are a senior web developer. Build my business website from the sitemap, copy and design direction above.

TECH: Next.js (App Router), TypeScript, Tailwind CSS, next/font, next/image. Deploys on Vercel with no extra setup.
EVERY PAGE: the copy exactly as written, mobile first (works at 360px), one H1, SEO title and description, Open Graph image.
SITE-WIDE: sticky header with logo and menu, footer with contact details, a floating WhatsApp button (https://wa.me/[NUMBER]), a contact form posting to https://formsubmit.co/[EMAIL].
SPEED: no heavy libraries, images lazy-loaded and sized, Lighthouse 90+ on mobile.
SEO: sitemap.xml, robots.txt, LocalBusiness schema with my real details only.
OUTPUT: every file in full, all text kept in one data/content.ts file, the list of images I must add to /public, then the commands to run it.` }] },
      { n: 0, title: "Review speed and SEO", body: ["Make the AI check its own work like a strict reviewer."], prompts: [{ title: "Strict review", use: "Same chat", text: `Review the website as a strict senior reviewer and return corrected files only.
Check: copy matches exactly; phone, tablet and desktop layouts; image sizes and lazy loading; colour contrast; alt text; keyboard focus; one H1 per page; titles and descriptions; schema details are real; every link and the form work. List each problem and the fix before the files.` }] },
      { n: 0, title: "Add tracking and leads", body: ["Know where visitors come from and never miss an enquiry."], prompts: [{ title: "Tracking setup", use: "Same chat", text: `Add to my website: Google Analytics 4 (ID [G-XXXX]) and Meta Pixel (ID [XXXX]) loaded after the page is interactive; events for WhatsApp click, phone click and form submit; a thank-you page after the form; and a cookie notice only if my audience is in the EU or UK. Show me how to test each event.` }] },
      { n: 0, title: "Go live on your domain", body: ["GitHub plus Vercel: free to start, redeploys on every change."], checklist: ["Push the project to a new GitHub repository", "vercel.com → Add New → Project → pick the repository → Deploy", "Settings → Domains → add your domain and copy the DNS records", "Add the records at your domain provider and wait for the green check", "Submit sitemap.xml in Google Search Console"] },
    ]),
  },
  {
    slug: "mobile-app", title: "Mobile app", short: "From app idea to a working app on your phone.", icon: "Smartphone",
    cover: "/space/andromeda.webp", coverAlt: "The Andromeda galaxy, photographed by NASA",
    gallery: [{ src: "/sites/keune-mobile.webp", alt: "Phone layout of a website we built for Keune" }, { src: "/sites/buzzazi-mobile.webp", alt: "Phone layout of a store we built for Buzzazi" }],
    result: "A working Android and iPhone app you can test on your own phone, ready to publish.",
    tools: ["Claude", "Expo", "React Native", "Supabase"],
    steps: renumber([
      { n: 0, title: "Shape the idea", body: ["Cut the idea down to the smallest app people would actually use."], prompts: [{ title: "App idea to MVP", use: "Any AI", text: `My app idea: [IDEA]. Users: [WHO]. Problem it solves: [PROBLEM].
1. Ask me 5 questions to sharpen the idea.
2. Then define the first version (MVP): the one main job, max 5 features, and what to leave out for later.
3. List 3 similar apps and what my app must do better.
4. Name the riskiest assumption and a cheap way to test it this week.` }] },
      { n: 0, title: "Map the screens", body: ["Every screen and how users move between them, before any design."], prompts: [{ title: "Screens and flow", use: "Same chat", text: `For the MVP above, list every screen. For each: its name, what the user sees, what they can do, and where each button goes. Then write the main user journey from first open to the "aha" moment in 6–8 steps. Mark which screens need login and which data each screen reads or saves.` }] },
      { n: 0, title: "Design the screens", body: ["A design system and screen-by-screen descriptions you can build or mock up."], prompts: [{ title: "App design", use: "Same chat, or a design AI", text: `Create a simple design system for my app: colours (hex), font, spacing scale, button styles, input style, card style, icons set. Then describe each screen from the list above in detail (layout top to bottom, components, empty state, loading state, error state). Keep it clean, thumb-friendly and readable at 360px width.` }] },
      { n: 0, title: "Build the app", body: ["One prompt for a complete Expo (React Native) project."], prompts: [{ title: "Build with Expo", use: "Claude (best) or a coding agent", text: `Build my app with Expo (React Native, TypeScript, Expo Router) from the screens and design system above.
- Every screen with real navigation, empty, loading and error states.
- Shared components for buttons, inputs and cards using the design system.
- Data kept in one service file so I can connect a backend next.
- Works on Android and iPhone, safe areas respected, dark mode if my design has it.
Give every file in full, then the exact commands to run it with Expo Go on my phone.` }] },
      { n: 0, title: "Add login and data", body: ["Real accounts and a database, without writing a server."], prompts: [{ title: "Supabase backend", use: "Same chat", text: `Connect my app to Supabase: email login and sign-up, a profile table, and tables for [MY DATA]. Write the SQL for the tables with row-level security so users only see their own data. Replace the mock service with real Supabase calls, handle errors and offline gracefully, and keep keys in environment variables. Explain each step I must do in the Supabase dashboard.` }] },
      { n: 0, title: "Test and fix", body: ["Test on real phones and let the AI fix what breaks."], prompts: [{ title: "Bug hunt", use: "Same chat", text: `Act as a QA tester. Write a test checklist for every screen and flow (happy path, empty data, wrong input, no internet, small and large phones). I'll run it and paste what failed: [FAILURES]. Fix each one and give me the changed files only.` }] },
      { n: 0, title: "Publish to the stores", body: ["Store listing, screenshots and the publish steps."], prompts: [{ title: "Store listing", use: "Any AI", text: `Write my app store listing for Google Play and the App Store: app name (30 characters), subtitle, short description (80), full description, 5 screenshot captions, keywords, and a privacy policy outline based on the data my app collects: [DATA]. No claims I can't prove.` }], checklist: ["Google Play Console: one-time developer fee, then create the app", "Apple Developer Program: yearly fee, then App Store Connect", "Build with EAS: eas build -p android / -p ios", "Upload, fill the listing and the data-safety form, submit for review"] },
    ]),
  },
  {
    slug: "video-editing", title: "Video editing with AI", short: "Reels that keep people watching, edited faster.", icon: "Clapperboard",
    cover: "/influencers/ducky-bhai.webp", coverAlt: "Creator campaign video Afshal planned",
    gallery: [{ src: "/influencers/muhammad-abrar.webp", alt: "Creator campaign with Muhammad Abrar" }, { src: "/starx/need-a-stunning-website.webp", alt: "Star X social post" }],
    result: "A finished reel with a strong hook, captions, b-roll, music and a cover, ready to post.",
    tools: ["CapCut", "ChatGPT", "Claude", "Kling or Runway"],
    steps: renumber([
      { n: 0, title: "Plan the edit", body: ["Turn your script or raw clip into a cut-by-cut edit plan."], prompts: [{ title: "Edit plan", use: "Any AI", text: `Here is my script or the transcript of my raw video: [PASTE]. Target: [PLATFORM], [LENGTH] seconds, for [AUDIENCE].
Make an edit plan as a table: time, what is said, what is on screen (A-roll, b-roll, text, zoom), and the reason. Cut anything that doesn't move the story. Aim for a visual change every 2–3 seconds.` }] },
      { n: 0, title: "Fix the first 3 seconds", body: ["Most people decide in the first moment. Give them a reason to stay."], prompts: [{ title: "Hook options", use: "Same chat", text: `Write 6 opening hooks for this video, each under 10 words, in different styles: question, bold claim, mistake, result first, curiosity, pattern interrupt. For each, describe the first frame on screen and the text overlay. Mark the 2 strongest and say why.` }] },
      { n: 0, title: "Captions that read well", body: ["Captions keep silent viewers watching."], prompts: [{ title: "Caption script", use: "Same chat", text: `Split my script into on-screen captions: max 4 words per line, one idea per caption, key words marked in CAPS for highlight colour. Add emoji only where they help meaning. Give me the list in order so I can paste it into CapCut auto-captions and fix the timing.` }] },
      { n: 0, title: "Edit in CapCut, step by step", body: ["The exact edit sequence, with settings."], prompts: [{ title: "CapCut walkthrough", use: "Any AI", text: `Using my edit plan, give me a CapCut desktop walkthrough in order: import and organise clips, rough cut, J and L cuts for smooth talking, zoom punches on key words, speed ramps, transitions (only where they add meaning), caption style (font, size, position safe from the app's buttons), colour adjustment for phone footage, and audio levels (voice -6 dB, music -20 dB).` }] },
      { n: 0, title: "AI b-roll and voiceover", body: ["Fill gaps with AI clips and a clean voice."], prompts: [{ title: "B-roll prompts", use: "Kling, Runway or Veo", text: `For each b-roll slot in my edit plan, write a text-to-video prompt: subject, action, camera move, lens, lighting, colour grade matching my footage, 4–5 seconds, no text in frame. Then write a voiceover script with pauses (…) and stressed words in CAPS, matching the timings.` }] },
      { n: 0, title: "Sound design", body: ["Sound is half the feeling of a reel."], prompts: [{ title: "Sound plan", use: "Any AI", text: `For my edit plan, suggest: music mood and tempo (BPM) for each section, where the beat should drop, sound effects (whoosh, pop, click, riser) at each cut or text pop, and where to use silence. Keep it subtle; the voice must stay clear.` }] },
      { n: 0, title: "Export, cover and caption", body: ["Settings and words that help the reel get found."], prompts: [{ title: "Post pack", use: "Any AI", text: `For this reel about [TOPIC]: 3 cover text options (max 5 words), a caption with a first line that works before "more", one call to action, 5 searchable keywords to use naturally, and 3–5 hashtags. Also tell me the export settings for [PLATFORM]: resolution, frame rate, bitrate.` }] },
    ]),
  },
  {
    slug: "copywriting", title: "Copywriting that sells", short: "Words for pages, ads and WhatsApp that get replies.", icon: "PenLine",
    cover: "/starx/brand-first-impression.webp", coverAlt: "Star X social post about first impressions",
    gallery: [{ src: "/starx/websites-that-build.webp", alt: "Star X post: websites that build trust" }, { src: "/starx/you-can-trust-us.webp", alt: "Star X social post" }],
    result: "A landing page, ad set and follow-up messages written in your customer's own words.",
    tools: ["Claude", "ChatGPT", "Gemini"],
    steps: renumber([
      { n: 0, title: "Know the reader", body: ["Good copy starts with what the customer already thinks."], prompts: [{ title: "Customer research", use: "Any AI", text: `I sell [PRODUCT/SERVICE] at [PRICE] to [CUSTOMER]. Here are real reviews, comments or questions from customers: [PASTE].
Give me: their top 5 problems in their own words, what they've tried before, their fears about buying, what "success" looks like to them, and the exact phrases I should reuse. Only use what's in the text I gave you.` }] },
      { n: 0, title: "Find the angle", body: ["One clear promise beats a list of features."], prompts: [{ title: "Offer and angle", use: "Same chat", text: `Based on the research above, write 5 different angles to sell my offer (pain, gain, speed, fear of missing out, identity). For each: the one-line promise, who it suits best, and the proof I'd need to make it believable. Pick the strongest and explain why.` }] },
      { n: 0, title: "Write the headlines", body: ["Most people only read the headline. Make it count."], prompts: [{ title: "Headline set", use: "Same chat", text: `Write 15 headlines for the chosen angle: 5 short (under 8 words), 5 specific (with a real detail), 5 question-style. No hype words like "revolutionary" or "game-changing". Then pick the 3 best for a website, an ad and a WhatsApp message.` }] },
      { n: 0, title: "Landing page copy", body: ["A full page that takes a visitor from curious to customer."], prompts: [{ title: "Landing page", use: "Same chat", text: `Write a full landing page for my offer: headline, sub-headline, 3 benefit bullets, the problem, the solution, how it works in 3 steps, proof section with [ADD REAL REVIEW] placeholders, offer and price, guarantee (only if I have one: [GUARANTEE]), 6 FAQs, final call to action. Short sentences, "you" language.` }] },
      { n: 0, title: "Ad copy set", body: ["Ads for Meta and Google that match the page."], prompts: [{ title: "Ad set", use: "Same chat", text: `Write 6 Meta ads (primary text, headline, description) using 3 angles × 2 lengths, and 1 Google responsive search ad (15 headlines under 30 characters, 4 descriptions under 90). Every ad must match the landing page promise. No claims I can't prove.` }] },
      { n: 0, title: "Follow-up messages", body: ["Most sales happen in the follow-up."], prompts: [{ title: "WhatsApp and email sequence", use: "Same chat", text: `Write a 5-message follow-up for people who asked but didn't buy: day 0 (answer + offer), day 1 (proof), day 3 (objection), day 5 (reminder), day 7 (last call). Give a WhatsApp version (under 60 words, friendly) and an email version (with subject line) for each.` }] },
      { n: 0, title: "Edit like a pro", body: ["Cut the fluff and check every claim."], prompts: [{ title: "Edit pass", use: "Any AI", text: `Edit this copy: [PASTE]. Cut 20% of the words without losing meaning, replace vague words with specific ones, make every sentence under 20 words, remove hype, and flag any claim that needs proof. Show the edited version, then a list of what you changed.` }] },
    ]),
  },
  {
    slug: "branding", title: "Brand and logo", short: "Name, logo, colours and voice for a new brand.", icon: "Palette",
    cover: "/work/brand-myra-bano.webp", coverAlt: "Brand identity by Afshal and the team",
    gallery: [{ src: "/work/logo-jolta.webp", alt: "Jolta logo" }, { src: "/work/brand-gwb.webp", alt: "GWB brand identity" }],
    result: "A complete starter brand kit: name, logo, colours, fonts, voice and social templates.",
    tools: ["Claude", "ChatGPT", "Ideogram or Midjourney", "Canva"],
    steps: renumber([
      { n: 0, title: "Write the brand brief", body: ["Everything else is built on this page."], prompts: [{ title: "Brand brief", use: "Any AI", text: `Interview me to write a brand brief. Ask one question at a time, up to 10: what we sell, who buys, why they'd pick us, competitors, price level, personality, values, where people will see the brand, what we never want to look like. Then write the brief on one page.` }] },
      { n: 0, title: "Name ideas", body: ["Names that are easy to say, spell and find."], prompts: [{ title: "Brand names", use: "Same chat", text: `Suggest 20 brand names from the brief: mix real words, compound words, invented words and Urdu/English blends if it fits. For each: meaning, why it fits, and a .com or .pk style domain idea. Tell me to check trademarks and Instagram handles myself before choosing.` }] },
      { n: 0, title: "Brand voice", body: ["How the brand talks, so every post sounds like one person."], prompts: [{ title: "Voice guide", use: "Same chat", text: `Write a brand voice guide: 3 voice words with what they mean and don't mean, words we use and never use, how we write a caption, a reply to a complaint and a sales message. Give one example of each in English and Roman Urdu.` }] },
      { n: 0, title: "Logo concepts", body: ["AI image prompts for logo ideas, then clean them up."], prompts: [{ title: "Logo prompts", use: "Ideogram, Midjourney or ChatGPT images", text: `Write 8 logo prompts for [BRAND NAME] from the brief: 2 wordmarks, 2 lettermarks, 2 icon + wordmark, 2 emblem. Each: style, shapes, colours (max 2), flat vector, plain white background, no mockup, no gradients. Then tell me how to turn the best one into a clean vector (trace in Illustrator or Figma, fix spacing, test at 32px).` }] },
      { n: 0, title: "Colours and fonts", body: ["A small system you'll use everywhere."], prompts: [{ title: "Visual system", use: "Same chat", text: `Create the visual system: primary, accent and 3 neutral colours with hex codes and where to use each; contrast check for text; two Google Fonts (headings and text) with sizes for web and social posts; photo style rules; and 3 things never to do with the logo.` }] },
      { n: 0, title: "Social templates", body: ["Ready layouts so posting is quick and consistent."], prompts: [{ title: "Template set", use: "Same chat, then Canva", text: `Design 6 Instagram templates for the brand: quote, tip carousel cover, carousel inside slide, offer post, testimonial (with [REAL REVIEW] slot) and announcement. For each: layout, font sizes, colour use, logo position. Give instructions to build them in Canva as brand templates.` }] },
      { n: 0, title: "Brand guidelines", body: ["One document your team, designers and printers can follow."], prompts: [{ title: "Guidelines doc", use: "Same chat", text: `Put everything above into a brand guidelines document: brand story, voice, logo usage (sizes, spacing, wrong uses), colours, fonts, photo style, social templates and a checklist for every new design. Make it short enough to read in 10 minutes.` }] },
    ]),
  },
];

export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);
