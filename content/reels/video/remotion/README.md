# Reel video template (Remotion)

- `src/Reel.tsx`: scenes, on-screen cards and captions
- `src/timings.json`: start time of each spoken line, and the voiceover file

Setup:
1. `npm install`
2. Copy the fonts from `src/fonts/` (site root) into `public/` as `display.woff2`, `body.woff2` and `mono.woff2`.
3. Put the voiceover in `public/` and set `audio` in `timings.json`.

Render:
`npx remotion render src/index.ts Reel01 out/reel.mp4`
