---
name: demo-page
description: Make a teammate-facing how-to page (step-by-step instructions with copy-paste prompts, optionally with an embedded video) as a single HTML file, preview it locally, and only after the user confirms, publish it as a shared site on your Nuxtinator apps host (the files layer) with the video and poster uploaded as shared files. Pairs with /demo-video (embed its output.mp4) but works without a video. Also updates an already-published page in place. Use when the user wants a web page, instructions page, or landing page to share with teammates, or asks to publish/post a demo video with instructions. Invoke with /demo-page <topic, audience, or path to a video>.
user-invocable: true
---

# /demo-page

Builds a clean, single-file instructions page and publishes it as a shared site on a Nuxtinator apps host (the files layer). The page is what teammates open: a headline, an optional video, then numbered steps with copyable messages, plain-English definitions and a short footer.

Kit in this skill folder:
- `template/page.html`: the page skeleton (light and dark themes, phone layout, numbered step cards, `.prompt` boxes with Copy buttons, definition cards). Placeholders `__VIDEO_URL__` and `__POSTER_URL__`.
- `template/verify.mjs`: loads a published page logged out with Playwright and checks the video plays and seeks.
- `examples/codex-website-page.html`: a finished page ("Change the website, just by asking") to learn the tone and structure from.

## Phase 1: Gather (no questions yet)

1. Work out the audience and the job they need done. Read whatever the user points to: a `/demo-video` storyboard and narration (`demo-video/storyboard.md`, `src/narration.json`), a call transcript, notes, the project README.
2. Find the video, if there is one: usually `<project>/demo-video/output.mp4` from `/demo-video`. Make a poster from its title card: `ffmpeg -ss 6 -i output.mp4 -frames:v 1 -vf scale=1280:720 -q:v 3 poster.jpg`, then look at the poster image to check it before using it. No video is fine; drop the `.video` and `.facts` blocks.
3. When the page goes with a video, the steps follow the same order and wording as the video's chapters, and the page's headline matches the video's title.

## Phase 2: Build locally

- Work in `<project>/demo-page/` (or next to the video in `<project>/demo-video/`). Copy `template/page.html` to `page.html` there and write the content.
- For local preview, write `page-local.html` with the placeholders replaced by relative paths (`sed -e 's#__VIDEO_URL__#output.mp4#' -e 's#__POSTER_URL__#poster.jpg#'`), keeping the video and poster beside it, then `open` it.
- **Do not publish yet.** Tell the user the page is open locally, summarize the sections in a few lines, and wait. Apply their changes, re-open, and repeat until they say to publish ("push live", "publish", "ship it").

### Content rules
- Write for the reader, not for developers: plain words, the app's own button labels in bold, one action per step. A step is a title, one or two sentences, and at most one `.prompt` box.
- Every message the reader should send goes in a `.prompt` box, word for word, so the Copy button works. Highlight the part they should change with `<em>`.
- Group steps under `h3` headings (for example "Once: set up", "Every change", "Share it"). Numbering continues across groups: set `style="counter-reset: step N"` on each later `<ol>`, where N is the number of steps before it.
- **Never name a person** (no "ask <name>", no reviewer names). Say "a teammate".
- No local file paths, branch names from the demo, or internal tooling on the page unless the reader must type them.
- End with a short "words in plain English" card grid when the topic has jargon, and a one-line footer ("Stuck? Ask a teammate…").
- Keep `<title>` to two to four words. Change `--accent` in both themes to the product's color when it reads well.
- External resources: Google Fonts and cdnjs only. Everything else inline.

## Phase 3: Publish (only after the user confirms)

Uses the apps host's MCP tools: `files_begin_upload`, `files_complete_upload`, `files_create_site`, `files_update_site`, `files_read_site`, `files_list`, `files_share` (load them with ToolSearch if they're deferred). If no MCP server offers these tools, stop and tell the user to connect their apps host's MCP server first. Ask which org to publish under unless the user already said, and pass `org` explicitly on every call.

1. **Upload each binary** (video, poster, any download) in three steps:
   - `files_begin_upload { filename, mime, size_bytes, org }`, with the exact size from `ls -l`.
   - `curl -sS -o /dev/null -w '%{http_code}' -X PUT -H 'Content-Type: <mime>' -T <file> "<upload_url>"` must print 200. The URL expires in an hour, and the limit is 50 MB.
   - `files_complete_upload { key, filename, title, share: true, tags, org }` returns a `raw_url`.
   - Give every item the same tags (for example the topic slug plus `demo-video`) so they can be found together later.
2. **Fill the page**: replace `__VIDEO_URL__` / `__POSTER_URL__` with the `raw_url`s and save it as `page-published.html`. This is the exact HTML that goes live; keep it.
3. **Create the site**: `files_create_site { title, html, share: true, tags, org }`. Its `share_url` is the link to give the user. Note the site `id`, because updates need it.
4. **Verify logged out**: `PLAYWRIGHT_MODULE=<…/playwright/index.mjs> node <skill-dir>/template/verify.mjs <share_url>`, where `<skill-dir>` is this skill's base directory. It must report `play: "ok"`, a real `duration`, and a `seekedTo` near the target. Look at the screenshot. If there's no Playwright, `npm i playwright && npx playwright install chromium` in a scratch dir.
5. Report the share URL plus the ids of the site and the files.

### Updating a published page
- **Find it:** use `files_list { kind: 'site' }`, or the id from the earlier report. Read it with `files_read_site` before changing it.
- **Keep the link:** `files_update_site { id, html }` replaces the HTML in place, so the share URL stays the same. Never create a new site for an update.
- **New video:** a new or re-rendered video is a new upload with a new `raw_url`. Swap it into the HTML, then update the site.
- **Reuse the poster:** if the title frame didn't change, keep the poster's existing `raw_url`.
- **Old files:** the previous video stays in the files layer, still shared. Tell the user, and unshare or delete it only if they ask.
- Re-run verify after every update.

## Gotchas (files-layer sites)

- **Sandbox:** sites are served in a sandboxed, opaque origin (CSP `sandbox` without `allow-same-origin`):
  - `fetch` to an app's `/api` fails CORS.
  - `localStorage` throws.
  - The Clipboard API may be refused, which is why the template's Copy button falls back to selecting the text.
  - Don't iframe app pages: they inherit the sandbox and break.
- **What works:** `<video>`, `<img>` and `<a href="<raw_url>?download=1">` load and redirect fine with no CORS. `raw_url` is a 302 to a short-lived signed URL. Links with `target="_blank"` open normally (the sandbox allows popups to escape).
- **Never `files_share { reissue: true }`** on a file a page embeds: it changes the `raw_url` and breaks the page.
- **Upload binaries as files.** Don't inline images as data URIs: it bloats the site HTML, which is capped at 2 MB.
- **Cloudflare rewrites the page:**
  - It obfuscates any email address in the HTML (it decodes fine).
  - Its RUM beacon logs a CORS error in the console. That's harmless, and `verify.mjs` filters it out.
