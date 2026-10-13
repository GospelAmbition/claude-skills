# Places each scene's narration at scene start + lead-in and normalises to -16 LUFS → narration.wav.
import json, subprocess
tl = json.load(open('timeline.json'))
total = tl[-1]['start'] + tl[-1]['dur']
inputs, filters = [], []
for i, s in enumerate(tl):
    inputs += ['-i', f"audio/{s['id']}.wav"]
    ms = int(round((s['start'] + s['lead']) * 1000))
    filters.append(f"[{i}:a]aresample=48000,adelay={ms}|{ms}[a{i}]")
mix = ''.join(f"[a{i}]" for i in range(len(tl)))
filters.append(f"{mix}amix=inputs={len(tl)}:normalize=0:dropout_transition=0,apad=whole_dur={total:.3f},atrim=0:{total:.3f},loudnorm=I=-16:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', ';'.join(filters), '-map', '[out]', '-ac', '2', '-ar', '48000', 'narration.wav'], check=True)
print('total', total)
