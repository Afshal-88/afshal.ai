# Star X: website development reels style guide

Taken from 5 reference reels Afshal shared (Nov 23) and a Pinterest search for "3D website mockup".
Use this for every website development reel.

## What the references do
1. **3D laptop with the site running inside** (ref 1 virtual try-on, ref 3 FORMA pizza)
   - A realistic laptop on a desk: neon cyan rim light, or a warm wooden desk.
   - The camera slowly dollies in or orbits.
   - The website scrolls inside the screen.
   - Premium and calm. No loud gradients.
2. **Kinetic one-word cards** (ref 5 "Web Design / Portals / Branding / Performance")
   - One word per cut, alternating cream (#efe8dc) and black (#121212).
   - A small `# handle` at the bottom, and a logo end card.
3. **Cinematic HUD** (ref 2 allié cold brew)
   - REC dot, timecode, corner brackets.
   - Two-weight text, e.g. "Then it got **too close.**"
4. **Logo motion** (ref 4 bunny knocks)
   - Shapes morph into the logo.
   - A flat brand colour sweeps the screen at the end.
5. **Pinterest pattern**
   - Several browser windows floating in 3D at different depths, each scrolling a site.
   - Tablet or phone trios.
6. **Sound:** music and cuts only, no voiceover. Use a whoosh on each cut.

## Rules for our version
- **Only real work.** Use screenshots of sites Star X actually built, from `starxmarketing.com/sites/*.webp`:
  - Keune Pakistan, House of Flowers, Buzzazi, Zufishan.
  - Lawyers Connect, ARTOSO and Jolta have no screenshot on the site yet.
- **Tags come from the site only.** Each site's tags (platform, features) must match the portfolio page.
- **No invented numbers.** "50+ websites" is allowed because the site says it.
- **Text:**
  - Max 3–4 words on a card.
  - Two weights: light for the setup, bold for the punch.
- **Shot length:**
  - Hook card at 0–2.4 s with a number that counts up.
  - Device shots 3–4 s.
  - Word cards 0.6–1 s.
  - End card about 3 s.
- **End card:**
  - Star X logo.
  - "Websites built to bring in **enquiries.**" (from the site copy).
  - One ask: DM "WEBSITE".
- **Export for Instagram:**
  - H.264 yuv420p, AAC 48 kHz, faststart.
  - **File under 20 MB**, because jsDelivr will not serve larger files.
  - Check that the jsDelivr link returns 200 `video/mp4` before posting.

## Code
`content/reels/video/remotion-promo/src/Web3D.tsx` contains:
- the 3D laptop (CSS 3D, keyboard deck)
- the floating browser stack
- the phone mockup
- the HUD, word cards and end card

Change `WEB_CUTS` to make a new reel.
