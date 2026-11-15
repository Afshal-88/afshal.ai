"""Free voiceover with Kokoro (kokoro-onnx). One line per script line.

Usage: python tts.py script.txt out_dir [--voice am_michael] [--speed 1.05] [--gap 0.28]
Writes out_dir/vo.wav and out_dir/timings.json ({"starts": [...], "ends": [...], "end": total}).
Model files (kokoro-v1.0.onnx, voices-v1.0.bin) are read from $KOKORO_MODELS.
"""
import argparse, json, os
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

p = argparse.ArgumentParser()
p.add_argument("script"); p.add_argument("out")
p.add_argument("--voice", default="am_michael"); p.add_argument("--speed", type=float, default=1.05)
p.add_argument("--gap", type=float, default=0.28)
a = p.parse_args()
m = os.environ.get("KOKORO_MODELS", ".")
k = Kokoro(os.path.join(m, "kokoro-v1.0.onnx"), os.path.join(m, "voices-v1.0.bin"))
lines = [l.strip() for l in open(a.script) if l.strip()]
os.makedirs(a.out, exist_ok=True)
chunks, starts, ends, t, sr = [], [], [], 0.15, 24000
chunks.append(np.zeros(int(0.15 * sr), dtype=np.float32))
for line in lines:
    audio, sr = k.create(line, voice=a.voice, speed=a.speed, lang="en-us")
    # trim leading/trailing near-silence so the gaps are even
    idx = np.where(np.abs(audio) > 0.01)[0]
    if len(idx): audio = audio[max(0, idx[0] - 240): idx[-1] + 480]
    starts.append(round(t, 3)); t += len(audio) / sr; ends.append(round(t, 3))
    chunks += [audio.astype(np.float32), np.zeros(int(a.gap * sr), dtype=np.float32)]
    t += a.gap
sf.write(os.path.join(a.out, "vo.wav"), np.concatenate(chunks), sr)
json.dump({"starts": starts, "ends": ends, "end": round(ends[-1], 3), "voice": a.voice}, open(os.path.join(a.out, "timings.json"), "w"))
print(json.dumps({"lines": len(lines), "end": ends[-1]}))
