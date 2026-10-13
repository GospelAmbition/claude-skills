---
name: feedback
description: Wire any project to embed the feedback web component widget, so users can report bugs and ideas straight into a Kanban feedback board. Use when the user wants to add the feedback widget, embed the feedback button/bubble, or wire a site to report feedback. Covers plain HTML, Nuxt, Vite+Vue, React, and generic SPAs.
user-invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Feedback widget wiring

Help the user drop the **`<feedback-web-component>`** widget onto the current project. It's a
floating chat-bubble that captures a bug or idea (text + optional screenshot/attachments) and POSTs
every submission to a central Kanban board, where it lands as a card in the `FEEDBACK INBOX` column.

The widget is a single-file Vue IIFE served by the feedback host. One `<script>` tag + one custom
element is the whole integration — no npm package, no build step on the consumer side, no API key.

> **Reporting target**
> - **Base URL (`apiBase`)**: the origin of the apps host that runs the feedback board, written as
>   `https://FEEDBACK_HOST` in the snippets below.
> - **Board (where feedback lands / where you get the project id)**: `https://FEEDBACK_HOST/@<org>/feedback`
>
> The base URL is the bare origin — **not** the `/@.../feedback` board path and **not** the
> `/api/...` path. The widget appends the right paths itself.

This is a single-file skill. Read **The embed contract** once, then jump to the section matching the
target project: **Plain HTML → Nuxt → Vite + Vue → React → Generic SPA**. Finish with **Origin
allowlist**, **Verification**, and **Invariants**.

The canonical consumer-facing doc is `embeddables/feedback-web-component/docs/EMBEDDING.md` in the
feedback layer of the nuxtinator monorepo (read it if a checkout is available and you need to confirm
a detail) — but this skill is self-contained, so you don't need the monorepo present to wire a project.

---

## Step 1 — Get the two things the widget needs

| Value | How to obtain |
|---|---|
| `apiBase` (base URL) | The apps host's origin. Reuse it if the project already sets `NUXT_PUBLIC_FEEDBACK_API_BASE` / `VITE_FEEDBACK_API_BASE`; otherwise ask the user. |
| `projectId` | Open the board at `https://FEEDBACK_HOST/@<org>/feedback`, pick (or create) the project feedback should land in, and copy its UUID. |

The skill argument may carry the project id and the base URL (e.g. `/feedback 3f2a…
https://apps.example.org`). If either isn't supplied, **ask the user for it** — point them at the
board URL above to find/copy the project id. Don't invent a UUID and don't
try to provision a project; that's done in the board UI, out of scope here.

## Step 2 — Detect the target project

Look before choosing an approach:

- **Nuxt** — `nuxt.config.ts` present → **Nuxt** section.
- **Vite + Vue (non-Nuxt)** — `vite.config.*` + `@vitejs/plugin-vue` → **Vite + Vue** section.
- **React** — `react` in `package.json` → **React** section.
- **Plain static HTML site** — `.html` files, no SPA framework → **Plain HTML** section.
- **Anything else (other SPA / server-rendered templates)** → **Generic SPA** section.

When in doubt, the **Plain HTML** snippet works on any page that lets you drop raw markup + a script
tag into the served HTML.

---

# The embed contract

Three things go on the page: a **wrapper div**, the **custom element**, and the **script tag**.

```html
<!-- 1. Wrapper div. The bundle injects CSS scoped to this class that anchors the widget bottom-right. -->
<div class="feedback-widget-slot">
  <!-- 2. The custom element. profile-config is a JSON string attribute. -->
  <feedback-web-component
    profile-config='{
      "profile": "chat-bubble",
      "instanceId": "fb-1",
      "projectId": "PROJECT_UUID_HERE",
      "apiBase": "https://FEEDBACK_HOST",
      "enabled": true,
      "showByDefault": true
    }'
  ></feedback-web-component>
</div>

<!-- 3. The bundle. CSS is inlined — no <link> needed. -->
<script src="https://FEEDBACK_HOST/js/feedback-web-component.iife.js" defer></script>
```

The script registers the custom element on load; the element mounts; every submission POSTs to
`<apiBase>/api/v1/feedback` and becomes a card on the project named by `projectId`.

## `profile-config` fields

| Field | Type | Required | What it does |
|---|---|---|---|
| `profile` | string | yes | UI profile to mount. `"chat-bubble"` is the only one today. |
| `instanceId` | string | yes | Unique per widget instance on a page. Prevents two widgets sharing state. Use `"fb-1"` if there's only one. |
| `projectId` | string | yes | Kanban project UUID. Submissions become cards here. |
| `apiBase` | string | yes | **The base URL** — bare origin of the host (default `https://FEEDBACK_HOST`). Not the bundle URL, not the `/api/...` URL. |
| `enabled` | boolean | yes | `false` loads the bundle but skips mounting (feature-flag off switch). |
| `showByDefault` | boolean | no (default `true`) | `false` = hidden until a visitor opts in with `?feedback` in the URL (see **Hidden-by-default**). |

`profile-config` is an HTML attribute holding JSON. In templating engines that choke on the inner
quotes, escape them with `&quot;` or build the object and `JSON.stringify` it (see the React/Vue
sections).

## The wrapper div is not optional

`<div class="feedback-widget-slot">` must wrap the element. The bundle prepends positioning CSS
scoped to `.feedback-widget-slot` into `<head>` on load; without the wrapper the element renders but
floats unpositioned. Default position is bottom-right, 20px inset. To move it, override on the
wrapper: `<div class="feedback-widget-slot" style="right:auto; left:20px;">`, or add later rules for
`.feedback-widget-slot` in your own stylesheet (later rules win by cascade).

---

# Plain HTML / static site

Paste the **embed contract** snippet (above) into the page template, just before `</body>`, with the
real `projectId` filled in. Put it in the shared layout/footer partial so it appears on every page.
Nothing else to configure.

---

# Nuxt

SSR-safe approach: a **client plugin** that injects the script + element on the browser only, reading
config from `runtimeConfig`. This mirrors how the feedback monorepo's own host mounts the widget.

## 1. runtimeConfig + env

`nuxt.config.ts` — merge into the existing `runtimeConfig.public` (don't clobber other keys), and
declare the custom element so Vue's compiler doesn't warn on the unknown tag:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      feedbackApiBase: process.env.NUXT_PUBLIC_FEEDBACK_API_BASE || 'https://FEEDBACK_HOST',
      feedbackProjectId: process.env.NUXT_PUBLIC_FEEDBACK_PROJECT_ID || ''
    }
  },
  vue: {
    compilerOptions: {
      // Only needed if you put <feedback-web-component> directly in a template;
      // the plugin below injects it via the DOM and doesn't strictly require this,
      // but it's harmless and future-proofs template usage.
      isCustomElement: (tag: string) => tag === 'feedback-web-component'
    }
  }
})
```

`.env` / `.env.example`:

```env
NUXT_PUBLIC_FEEDBACK_API_BASE=https://FEEDBACK_HOST
NUXT_PUBLIC_FEEDBACK_PROJECT_ID=PROJECT_UUID_HERE
```

## 2. Client plugin — `app/plugins/feedback-widget.client.ts`

```ts
// Mounts the feedback web component on the client. No-op when the project id is unset.
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const projectId = String(config.public.feedbackProjectId || '')
  const apiBase = String(config.public.feedbackApiBase || 'https://FEEDBACK_HOST')
  if (!projectId || typeof window === 'undefined') return

  // Idempotent across HMR / route changes.
  if (!document.querySelector('script[data-feedback-widget]')) {
    const s = document.createElement('script')
    s.src = `${apiBase.replace(/\/$/, '')}/js/feedback-web-component.iife.js`
    s.async = true
    s.dataset.feedbackWidget = '1'
    document.head.appendChild(s)
  }
  if (document.querySelector('feedback-web-component')) return

  const slot = document.createElement('div')
  slot.className = 'feedback-widget-slot'
  const el = document.createElement('feedback-web-component')
  el.setAttribute('profile-config', JSON.stringify({
    profile: 'chat-bubble',
    instanceId: 'fb-1',
    projectId,
    apiBase,
    enabled: true,
    showByDefault: true
  }))
  slot.appendChild(el)
  document.body.appendChild(slot)
})
```

The `.client.ts` suffix keeps it out of the server bundle. The widget mounts in the browser only —
don't expect it in SSR output.

---

# Vite + Vue (non-Nuxt)

## 1. Declare the custom element

`vite.config.js` — so Vue's template compiler doesn't warn:

```js
import vue from '@vitejs/plugin-vue'
export default {
  plugins: [
    vue({ template: { compilerOptions: { isCustomElement: tag => tag === 'feedback-web-component' } } })
  ]
}
```

## 2. Mount once at app start

In your root component (e.g. `App.vue`), inject the script + element on mount. Read config from
`import.meta.env` (`VITE_FEEDBACK_*`):

```vue
<script setup>
import { onMounted } from 'vue'

const apiBase = (import.meta.env.VITE_FEEDBACK_API_BASE || 'https://FEEDBACK_HOST').replace(/\/$/, '')
const projectId = import.meta.env.VITE_FEEDBACK_PROJECT_ID || ''

onMounted(() => {
  if (!projectId) return
  if (!document.querySelector('script[data-feedback-widget]')) {
    const s = document.createElement('script')
    s.src = `${apiBase}/js/feedback-web-component.iife.js`
    s.async = true
    s.dataset.feedbackWidget = '1'
    document.head.appendChild(s)
  }
})
</script>

<template>
  <!-- your app -->
  <div class="feedback-widget-slot">
    <feedback-web-component
      :profile-config="JSON.stringify({
        profile: 'chat-bubble', instanceId: 'fb-1', projectId,
        apiBase, enabled: true, showByDefault: true
      })"
    />
  </div>
</template>
```

`.env`: `VITE_FEEDBACK_API_BASE=https://FEEDBACK_HOST` and
`VITE_FEEDBACK_PROJECT_ID=PROJECT_UUID_HERE`.

---

# React

React 19+ handles custom elements and `profile-config` casing natively. Render the wrapper + element,
and load the bundle once with an effect:

```jsx
import { useEffect } from 'react'

const API_BASE = (import.meta.env?.VITE_FEEDBACK_API_BASE || 'https://FEEDBACK_HOST').replace(/\/$/, '')
const PROJECT_ID = import.meta.env?.VITE_FEEDBACK_PROJECT_ID || 'PROJECT_UUID_HERE'

export function FeedbackWidget() {
  useEffect(() => {
    if (!PROJECT_ID || document.querySelector('script[data-feedback-widget]')) return
    const s = document.createElement('script')
    s.src = `${API_BASE}/js/feedback-web-component.iife.js`
    s.async = true
    s.dataset.feedbackWidget = '1'
    document.head.appendChild(s)
  }, [])

  if (!PROJECT_ID) return null
  return (
    <div className="feedback-widget-slot">
      <feedback-web-component
        profile-config={JSON.stringify({
          profile: 'chat-bubble', instanceId: 'fb-1', projectId: PROJECT_ID,
          apiBase: API_BASE, enabled: true, showByDefault: true
        })}
      />
    </div>
  )
}
```

Mount `<FeedbackWidget />` once near the app root (in your layout, not per-route). On React < 19,
pass `profile-config` via a `ref` instead of as a JSX attribute, since older React lowercases/strips
unknown attributes.

---

# Generic SPA / other

For any frontend not covered above, the **Plain HTML** snippet works if you can edit the served HTML
shell (`index.html`). If the app routes client-side and you need the widget injected from JS, copy
the inject-script-on-mount pattern from the React or Vite sections — the only moving parts are: add
the `<script>` once, render `<div class="feedback-widget-slot"><feedback-web-component
profile-config='…'></feedback-web-component></div>`. Read `projectId` / `apiBase` from the app's own
public env, never hardcode secrets (there are none to hardcode here — the widget needs no key).

---

# Origin allowlist (only for sign-in)

**Anonymous submissions work from any origin** — the public API reflects the caller's origin in CORS
and needs no per-site setup. A visitor just types their name and submits.

**Letting a submitter sign in** (so they can track their submission's status in "My Submissions")
requires the embedding site's **origin** to be in that project's `allowed_origins` list, edited in the
board's project settings (runtime, no rebuild). Localhost is allowed automatically outside production,
so local testing needs no config. If the user wants signed-in submissions from a production site, tell
them to add that site's exact origin (e.g. `https://app.example.com`) to the project's allowed origins
on the board.

---

# Hidden-by-default mode

Set `"showByDefault": false` to keep the widget in the page for everyone but visible only to people
you point at it (internal testers, a beta cohort, a customer you've shared a link with).

- A visitor opts in by loading any page on the site with `?feedback` (or `?feedback=true` / `?feedback=1`).
- The widget persists `localStorage["show-feedback-widget"] = "true"` against the embedding origin and
  renders from then on, param or not.
- It's per-browser/per-origin; clearing site data reverts to hidden. To force-hide from your own code:
  `localStorage.removeItem('show-feedback-widget')`.
- `enabled: false` still wins over the opt-in flag.

---

# Verification

After wiring, give the user this checklist:

- [ ] `projectId` is a real UUID from the board and `apiBase` is the real host, not placeholders.
- [ ] Load a page → a floating chat bubble appears bottom-right (or, with `showByDefault: false`,
      after loading the page once with `?feedback`).
- [ ] DevTools → Network: the bundle `…/js/feedback-web-component.iife.js` returns **200** with
      `Content-Type: application/javascript` (a 404 HTML page → `Refused to execute script` / wrong base URL).
- [ ] Submit a test bug → Network shows `POST <apiBase>/api/v1/feedback` returning **200**, and a new
      card appears in the `FEEDBACK INBOX` column on the board. (Ask before submitting — it writes a real card.)
- [ ] The `<div class="feedback-widget-slot">` wrapper is present (element renders but floats unpositioned without it).
- [ ] For Vue/Nuxt: no "unknown custom element" compiler warning (the `isCustomElement` entry is in place).

# Invariants (always hold)

- **`apiBase` is the bare origin** — e.g. `https://FEEDBACK_HOST`, never the `/@…/feedback` board
  path and never the `/api/v1/feedback` path. The widget appends paths itself.
- **No secret to embed.** The widget needs no API key; submission is public, abuse-bounded by per-IP
  and per-project rate limits server-side. Don't scaffold any key.
- **One wrapper div, one script tag.** Mount the widget once near the app root, not per route. Keep the
  script injection idempotent (the `data-feedback-widget` guard) so HMR / re-renders don't double-load it.
- **Don't provision.** Creating the project and copying its UUID happens on the board, out of scope here.
  If there's no project id, ask for it.
