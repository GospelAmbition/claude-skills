---
name: demo-video
description: Make a narrated product demo video (1920x1080, 30fps MP4) from a running app. Research the product, confirm the story with the user in one short paragraph, then capture real screens with Playwright, write a storyboard and narration, generate the voice with Kokoro, animate modern motion graphics timed to the spoken words, render with ffmpeg, and check stills. Use when the user asks for a demo video, walkthrough video, product tour or explainer video of an app or feature. Invoke with /demo-video <product, feature or audience>.
user-invocable: true
---

# /demo-video

Makes a short, polished, narrated demo video of a product using **real screens from the running app**. The style is dark background, one accent color, smooth easing and punchy on-screen text. Real screens make the video credible, and motion graphics make it watchable.

Kit in this skill folder:
- `template/`: the renderer (`index.html`, `engine.js`), a documented `scenes.js`, `capture-lib.mjs`, and `phonemes.py`, `tts.py`, `stt.py`, `build-data.mjs`, `render.mjs`, `render-all.sh`, `mix.py`.
- `examples/`: a finished 3-minute video's scenes, narration and one capture step. Read these to learn the idioms.

## Phase 1: Research (no questions yet)

1. Read what the product is: README, plans/docs, the navigation config, and the pages or routes for the features in scope.
2. Find the running app: ports, test login, and seed data. Check the project's memory and docs first. Don't start servers if they are already running. If you must start one, stop it when done, and never stop servers you didn't start.
3. Click through the real flows with Playwright (Node, not Bun; see Gotchas) and screenshot the key pages to see what actually exists and what looks good.
4. Decide the story. Default shape: title → one concept diagram (the mental model) → 2–4 chapters, each 3–6 screen scenes → outro. Aim for 2–3 minutes unless the user says otherwise.

## Phase 2: Confirm (stop and wait)

Reply with **one short paragraph** in plain text: who the video is for, the story arc, the chapters, the demo data you'll create (e.g. "a site called Pray for Istanbul with 11 sign-ups"), and roughly how long it will be. Mention anything you'll change in the app's dev data. Then stop and wait for the user's go-ahead. Don't use AskUserQuestion. Apply any changes they ask for before continuing.

## Phase 3: Build

Work in the session scratchpad (e.g. `<scratchpad>/video/`) with `cp -r <skill-dir>/template/. <workdir>/`, where `<skill-dir>` is this skill's base directory. At the end, deliver to `<project>/demo-video/`: `output.mp4`, `storyboard.md`, and `src/` (the scenes, narration, engine, shots and capture scripts, so the video can be re-rendered).

### 3.1 Capture
- Use `capture-lib.mjs` (`open`, `shot`): a 1440px-wide viewport at deviceScaleFactor 2 keeps zooms crisp. Set `PLAYWRIGHT_MODULE` to the project's `node_modules/playwright/index.mjs`. If there is none, run `npm i playwright && npx playwright install chromium` in the workdir.
- Write one small script per flow step (see `examples/prayer-tools-capture-step.mjs`). Drive the real UI to create demo data, and capture before and after states of each action (empty form → filled → result, toast).
- Pass `targets` (Playwright locators) to `shot()`. It records each element's box in page coordinates to `shots/meta.json`, which is how you place highlights, cursor paths and camera keys precisely. `full: true` captures the whole page height. In a screen scene, `h` = CSS height (png height / 2).
- Make demo data look real: believable names, languages, times and a real-looking hero image. If you need an image, render an SVG illustration with Playwright rather than using a stock photo.

### 3.2 Storyboard and narration
- Write `storyboard.md`: a table of scene, length, on-screen text, visual and narration.
- Write `narration.json`: one entry per scene id. Keep it conversational and concrete, one idea per sentence, and 1–3 sentences per screen scene.
- On-screen text: kicker (`01 · Create`), a 2–5 word headline ending in a period, and at most 3 short sub-points.

### 3.3 Voice
- **Check pronunciation before the first `tts.py` run:** `uv run --python 3.12 --with kokoro --with soundfile python phonemes.py`. It lists, with the phonemes Kokoro picked:
  - every word it has to guess (names, brands, foreign places)
  - every heteronym, a word spelled one way but said two ways (record, live, lead, present, close, use…)
- Pin each listed word whose sound doesn't fit the meaning, inline in `narration.json` with Kokoro's phoneme syntax: `[Record](/ɹəkˈɔɹd/)` for the verb (Kokoro reads "Record" at the start of a sentence or a label as the noun), `[records](/ɹəkˈɔɹdz/)`, or a name like `[Ourique](/oʊɹˈikə/)`.
- Re-run until every listed word is either right or PINNED. The user shouldn't have to point out a mispronounced word.
- Pinned words keep their display text in `words.json`, so `w('Record')` still resolves.
- `uv run --python 3.12 --with kokoro --with soundfile python tts.py af_heart` generates `audio/<id>.wav`, `audio/timing.json` and `audio/words.json` (word timestamps). The first run downloads the model. Re-run with ids to regenerate single scenes: `python tts.py af_heart s02_model`.
- **Always run `stt.py` on the clips** (`uv run --python 3.12 --with faster-whisper python stt.py audio/*.wav`) and read the transcript. Kokoro mispronounces hyphenated names ("with-orgs" → "Wythorg's"), and possessive "its" before a noun ("its address" → "it's a dress"). For those, rewrite the sentence and regenerate. Whisper can't hear wrong stress (REC-ord vs re-CORD), so that check only comes from `phonemes.py`.

### 3.4 Animate
- Write `scenes.js` using the documented spec at the top of `template/scenes.js`. `w('word', offset, nth)` returns when a word is spoken, so clicks, highlights, page swaps, camera moves and sub-points all land on the narration. Scene length = lead-in + narration + tail, so visuals and voice stay in sync automatically.
- Scene types: `title`, `custom` (HTML diagram with `data-at="word"` reveals), `chapter`, `screen` (browser window with camera, cursor, click ripple and spotlight), `outro`.
- To change the accent, edit the `--accent`/`--accent-rgb` tokens in `index.html`. Pick the product's brand color if it reads well on dark.
- `node build-data.mjs && node render.mjs info` prints the timeline. It must print no `ERRORS` (unknown words, out-of-order keyframes, missing images).

### 3.5 Check stills (before the full render)
- `node render.mjs stills st <t1> <t2> …` renders chosen seconds. Pick 1–2 per scene at its busiest moment, then tile them: `ffmpeg -pattern_type glob -i 'st/*.png' -vf "scale=960:540,tile=2x2:padding=6:color=white" sheet_%02d.png`, and look at every sheet.
- Look for: overlapping or clipped text, headlines wrapping badly, tags covering UI, spotlight boxes that miss their target, half-cut app headers at the top of the viewport, zooms pushed against the page edge (the camera clamps at page edges, so a key beyond the edge simply doesn't move), empty-looking frames, and wrong page swaps.
- Fix, re-render those stills, and repeat until clean.

### 3.6 Render and deliver
- `./render-all.sh 6` renders 6 parallel segments, concatenates them, mixes narration (−16 LUFS) and muxes `output.mp4`. Run it in the background. A 3-minute video takes about 10–15 minutes.
- Extract a few stills from the final MP4 (including segment joins) and check them.
- Copy the deliverables to `<project>/demo-video/` and open the folder. Don't commit unless asked.
- Report: the length and format, what each chapter shows, the dev-data changes you made, and any app bugs you noticed while recording (don't fix them).

## Content rules

- **Outro:** a big three-word recap plus three short recap cards. **No file paths, markdown files, branch names or repo details** on screen. Viewers don't care about those.
- Speak and show the product's own terms. Never invent features; show only what the running app actually does.
- Avoid real people's names or real org branding in demo data.

## Gotchas

- Playwright's `request.post` hangs under Bun (the response body never resolves). Run capture and render scripts with Node.
- Public signup endpoints are often rate-limited per IP. Vary `x-forwarded-for` via `page.setExtraHTTPHeaders` when creating many demo sign-ups.
- Confirmation-email flows: use Mailpit's API (`http://localhost:8025/api/v1/messages`, then `/message/<ID>` for the text) to extract verification links.
- Full-page screenshots of apps with sticky or 100vh layouts are wrong; `shot(..., { full: true })` resizes the viewport instead.
- Camera `x` is the page point shown at the viewport centre. At zoom 1.0, x=720/y=450 shows the top of the page, and any x or y that would reveal beyond the page edge gets clamped.
- Keep narration clip boundaries trimmed (`tts.py` does this) so lead-in pauses stay consistent.
