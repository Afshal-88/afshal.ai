// AI Solutions offer (Star X Marketing). Only services the site already lists elsewhere.
// No prices, results or client names here until Afshal supplies real ones.

export const solutions = [
  { key: "whatsapp", icon: "Send", title: "WhatsApp replies and follow-ups", body: "Common questions get answered straight away, and people who went quiet get a follow-up on time." },
  { key: "leads", icon: "Filter", title: "All leads in one place", body: "Leads from ads, the website and Instagram land in one sheet or CRM, with where each one came from." },
  { key: "chatbot", icon: "Bot", title: "Website chatbot", body: "Answers from your own services and FAQs, and passes the conversation to a person when it should." },
  { key: "bookings", icon: "CalendarCheck", title: "Bookings and reminders", body: "Customers pick a time themselves. Confirmations and reminders go out on WhatsApp and email." },
  { key: "content", icon: "PenTool", title: "AI content system", body: "Prompts and a weekly routine for reel scripts, captions and posts in your brand voice, in English or Urdu." },
  { key: "report", icon: "BarChart3", title: "Weekly report", body: "Leads, sales and ad spend in one short summary every Monday." },
] as const;

export const steps = [
  { title: "Free audit", when: "Week 0", body: "We look at how you get and handle customers today and pick the one to three things worth automating first." },
  { title: "Build", when: "Month 1", body: "We set everything up on your own accounts and test it with real messages before it goes live." },
  { title: "Run and train", when: "Month 2", body: "We run it with you, fix what doesn't work, and train you and your team on recorded calls." },
  { title: "Handover", when: "After month 2", body: "You get every login, the recordings and a written guide. From here you run it yourselves." },
];

export const handover = [
  "Every account and login, in your name",
  "Recorded training sessions to watch again",
  "A written guide for each automation",
  "A list of what to check each week",
];

export const faqs = [
  { q: "Do I need technical knowledge?", a: "No. The training is written for the person who will run it day to day, not for developers." },
  { q: "What happens after the two months?", a: "You run it yourselves. If you want help later, there is an optional support plan, but you are never locked in." },
  { q: "Who owns the accounts?", a: "You do, from day one. Everything is set up in your name, so nothing stops working when we hand over." },
  { q: "Who pays for tools like the WhatsApp API or ChatGPT?", a: "You pay for them directly from your own account. We tell you the expected tool costs before we start." },
  { q: "Can it work in Urdu?", a: "Yes. Replies and content can be in English, Urdu or Roman Urdu." },
  { q: "How much does it cost?", a: "Two monthly payments. The amount depends on what we set up, so we quote it after the free audit." },
  { q: "Do you guarantee more sales?", a: "No. We set up systems that answer faster and follow up more reliably. How much that grows sales depends on your offer and your market." },
];
