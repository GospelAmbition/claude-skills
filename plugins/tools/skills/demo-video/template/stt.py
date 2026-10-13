# Transcribes narration clips so mispronunciations can be caught before rendering.
# uv run --python 3.12 --with faster-whisper python stt.py audio/*.wav
import sys, subprocess, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("base.en", device="cpu", compute_type="int8")
for f in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True).stdout
    segs, _ = m.transcribe(np.frombuffer(raw, dtype=np.float32), beam_size=5)
    print(f, "|", " ".join(s.text.strip() for s in segs))
