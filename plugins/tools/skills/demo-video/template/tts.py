# Generates audio/<id>.wav per narration entry with Kokoro, plus audio/timing.json (seconds)
# and audio/words.json (word start/end times) used to key animation beats to spoken words.
# uv run --python 3.12 --with kokoro --with soundfile python tts.py [voice] [only_id ...]
import json, os, sys
import numpy as np
import soundfile as sf
from kokoro import KPipeline

VOICE = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
SR = 24000
os.makedirs("audio", exist_ok=True)
pipe = KPipeline(lang_code="a")
scenes = json.load(open("narration.json"))
only = set(sys.argv[2:])
timing = json.load(open("audio/timing.json")) if only else {}
words = json.load(open("audio/words.json")) if only else {}
for s in scenes:
    if only and s["id"] not in only:
        continue
    chunks, ws, off = [], [], 0.0
    for r in pipe(s["text"], voice=VOICE, speed=1.0):
        a = r.audio.numpy() if hasattr(r.audio, "numpy") else np.asarray(r.audio)
        for tok in (r.tokens or []):
            if tok.start_ts is not None and tok.text.strip():
                ws.append([tok.text, round(off + tok.start_ts, 3), round(off + (tok.end_ts or tok.start_ts), 3)])
        chunks.append(a)
        off += len(a) / SR
    audio = np.concatenate(chunks)
    # trim leading/trailing near-silence so scene timing follows speech
    idx = np.where(np.abs(audio) > 0.01)[0]
    start = max(0, idx[0] - 1200)
    audio = audio[start: idx[-1] + 2400]
    words[s["id"]] = [[w, round(a - start / SR, 3), round(b - start / SR, 3)] for w, a, b in ws]
    sf.write(f"audio/{s['id']}.wav", audio, SR)
    timing[s["id"]] = round(len(audio) / SR, 3)
    print(s["id"], timing[s["id"]])
json.dump(timing, open("audio/timing.json", "w"), indent=1)
json.dump(words, open("audio/words.json", "w"))
print("total", round(sum(timing.values()), 1))
