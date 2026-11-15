"""Word timings with faster-whisper. Usage: python words.py audio.wav out.json [--model small.en]"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
model = sys.argv[3] if len(sys.argv) > 3 else "small.en"
m = WhisperModel(model, device="cpu", compute_type="int8")
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
audio = np.frombuffer(raw, dtype=np.float32)
segs, _ = m.transcribe(audio, word_timestamps=True, vad_filter=False)
words = [{"t": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
json.dump(words, open(sys.argv[2], "w"))
print(" ".join(w["t"] for w in words))
