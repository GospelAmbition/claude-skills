---
name: code-owned-defaults
description: Convention for persisted settings, preferences, config, feature flags, enums, statuses, and any field that has a default value or a human-facing label. The database stores only explicit, user-chosen keys/overrides; defaults and labels live in code or the i18n/translation system; reads merge the two. Use whenever designing or changing a preferences/settings/config table or column, an enum/status field, or anything that renders a label for a stored value — so adding an option or changing a default is a code change, never a migration or data backfill. Invoke with /code-owned-defaults.
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# code-owned-defaults

**The database stores explicit, user-chosen state (keys and overrides). Code owns the defaults and the labels. Read = `merge(code-owned defaults, DB overrides)`. Labels resolve from the stored key (a code map or i18n).**

Never persist a default value or a human-facing label in the database. Get this right and changing a default, renaming/translating a label, or adding a new option/preference is a **code change** — never a schema migration or a data backfill.

## Why

- A DB-level default (`ADD COLUMN ... DEFAULT '<business default>'`) freezes the default into the schema. Changing it needs a migration, and it won't retroactively reflect on existing rows the way you expect.
- A new option/preference key would otherwise need a migration to add a column or seed a value.
- A label stored in the DB duplicates copy, can't be translated, and goes stale the moment the wording changes.

## The two facets

1. **Defaults** — the column holds only what the user explicitly set (or is `NULL` / a sparse object). The effective value is computed at read time by merging the stored overrides over a **code-owned default constant**.
2. **Labels / enums** — the column holds a stable **key** (enum value / slug). The display string comes from a **code map or i18n**, keyed by that value. The DB never stores the label.

## Implementation recipe (TypeScript / Postgres shown; the shape generalizes to any stack)

**Schema — one-time only, then never again for this concern:**
- The column is **nullable** (or defaults to `'{}'`/empty) with **no business default baked in**. It stores overrides, not a fully-defaulted value.
- For enums/statuses, store the **key** (text or a DB enum), not the label.

**Code owns the default + a single resolver:**
```ts
export const DEFAULT_PREFS = {
  stats: { daily: false, weekly: false, monthly: false, yearly: false },
  adoption: false,
} as const

// Merge a stored value (possibly null, or missing newer keys) over the defaults.
// Read EVERYTHING through this — never read the column raw.
export function resolvePrefs(stored) {
  const s = (stored && typeof stored === 'object') ? stored : {}
  return {
    stats: { ...DEFAULT_PREFS.stats, ...(s.stats ?? {}) },
    adoption: typeof s.adoption === 'boolean' ? s.adoption : DEFAULT_PREFS.adoption,
  }
}
```

**Read** every path through the resolver. Missing keys — older rows, or options added later — fall back to the code default automatically.

**Write** the explicit choice(s). Persisting the full resolved object or a sparse override both work, because reads always re-merge over current code defaults.

**Labels — keyed lookup, never stored:**
```ts
const STATUS_LABELS: Record<string, string> = { open: 'Open', closed: 'Closed' }
const label = STATUS_LABELS[row.status] ?? row.status      // or: t(`status.${row.status}`)
```
Mirror the same resolve/merge on the client when a form pre-populates from stored values, so unset/newer keys show the code default there too.

## What this buys

- **Change a default** → edit the constant. No migration.
- **Add an option / preference key** → add it to the constant (+ a resolver line if the merge isn't generic, + UI + consumer). Schemaless/keyed columns accept it; old rows merge-fill. No migration.
- **Rename or translate a label** → edit the code map or the locale file. No DB change.

## Anti-patterns (do NOT do)

- `ADD COLUMN ... DEFAULT '<business default>'` — bakes the default into the schema; changing it later needs a migration. Use a nullable/empty column + code-owned default instead.
- Storing the display label/text in a column (alongside or instead of the key).
- Reading the column directly and treating a missing key as "unset/off" without merging the code default — this silently breaks the moment you add a new key.
- A migration whose only purpose is to change a default value or add an enum/option. That's the smell this pattern exists to remove.

## Checklist before shipping a settings / enum / config change

- [ ] DB stores keys/overrides only — no labels, no baked-in business default.
- [ ] One code constant defines the defaults.
- [ ] One resolver/merge function; every server **and** client read path goes through it.
- [ ] Labels come from a code map or i18n, keyed by the stored value.
- [ ] Sanity check: adding a hypothetical new option would need **no** migration. If it would, the design isn't there yet.
