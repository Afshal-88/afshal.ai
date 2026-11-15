# Star X promo reels (Remotion)

Free pipeline, no paid APIs:
1. `python ../../tools/tts.py script.txt out/ --voice am_fenrir` writes vo.wav + timings.json (Kokoro, kokoro-onnx).
2. Add a ReelDef to `src/Root.tsx` (one beat per script line, scenes from `src/kit.tsx`).
3. Put fonts, vo*.wav, music.mp3 in `public/`, then `npx remotion render src/index.ts Reel03 out/raw.mp4`.
4. Encode for Instagram: H.264 yuv420p, AAC 48 kHz, `-movflags +faststart`.
