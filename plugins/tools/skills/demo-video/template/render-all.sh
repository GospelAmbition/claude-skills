#!/bin/zsh
# Renders the whole timeline in N parallel segments, concatenates them, remixes narration and muxes output.mp4.
cd "$(dirname "$0")"
N=${1:-6}
node build-data.mjs
node render.mjs info 2>/dev/null | head -1 > timeline.json
TOTAL=$(node render.mjs info 2>/dev/null | awk '/^total/{print $2}')
FRAMES=$(python3 -c "import math; print(math.ceil($TOTAL*30))")
mkdir -p segs && rm -f segs/*.mp4
STEP=$(( (FRAMES + N - 1) / N ))
for i in $(seq 0 $((N-1))); do
  F0=$(( i * STEP )); F1=$(( F0 + STEP )); (( F1 > FRAMES )) && F1=$FRAMES
  node render.mjs frames segs/seg$i.mp4 $F0 $F1 > segs/log$i.txt 2>&1 &
done
wait
for i in $(seq 0 $((N-1))); do echo "file 'seg$i.mp4'"; done > segs/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i segs/list.txt -c copy video_only.mp4
python3 mix.py
ffmpeg -y -loglevel error -i video_only.mp4 -i narration.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart output.mp4
echo "frames $FRAMES total $TOTAL"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height -of compact output.mp4
