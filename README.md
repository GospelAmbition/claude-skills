# Gospel Ambition Claude skills

Claude Code plugins the Gospel Ambition team shares. Each plugin is a bundle of skills (and sometimes a hook) you install once. They then show up in every Claude Code session.

The repo is public, so you don't need a GitHub account or sign-in to install.

## Install

In Claude Code:

```
/plugin marketplace add GospelAmbition/claude-skills
```

Then install the plugins you want:

```
/plugin install nuxtinator@gospel-ambition
/plugin install disciple-tools@gospel-ambition
/plugin install tools@gospel-ambition
```

Or run `/plugin`, open **Discover**, and pick from the list.

### Get updates automatically

Updates are off by default for team marketplaces. Turn them on once: `/plugin` → **Marketplaces** → **gospel-ambition** → **Enable auto-update**. Without it, run `/plugin marketplace update gospel-ambition` to pull the latest.

## Plugins

Skills from a plugin are run as `/<plugin>:<skill>`, for example `/nuxtinator:sync-layers`. Claude also uses them on its own when your request matches.

### nuxtinator

| Skill | What it does |
|---|---|
| `release-layer` | Cut a release for one layer: bump, commit, tag `@nuxtinator/<id>@x.y.z`, push. Run inside the nuxtinator monorepo. |
| `sync-layers` | Move a host app's layers to their newest in-range tags, then commit the lockfile and push. |
| `feedback` | Embed the feedback widget in any site (HTML, Nuxt, Vite + Vue, React) so reports land on a feedback board. |
| `nuxt-ui` | Nuxt UI v4 component reference: props, slots and events. Claude loads it when writing `U*` components. |
| `code-owned-defaults` | Convention for settings, enums and labels: the database stores only what users chose; defaults and labels live in code. |

It also has a **hook**. When Claude edits a `.vue` file that uses `USelect` or `USelectMenu` and adds an option with `value: ''`, the hook tells Claude to fix it. Reka UI throws on an empty-string option, and the error doesn't say which option caused it, so the dropdown just opens empty.

### disciple-tools

| Skill | What it does |
|---|---|
| `dt-theme-release` | Release the theme: version bump, tag, push, version-control JSON, release notes. |
| `dt-plugin-release` | Release a `disciple-tools-*` plugin: version bump, tag, push, release notes. |

### tools

General skills that work in any project. New ones that don't belong to a specific product go here.

| Skill | What it does |
|---|---|
| `discover` | Before planning or coding, Claude asks short questions with lettered options and lays out the choices, then waits for "make the plan" or "implement". |
| `demo-video` | A narrated demo video (1080p MP4) of a running app, from real screens. |
| `demo-page` | A how-to page for teammates, with copyable prompts and an optional video, published on a Nuxtinator apps host. |

`demo-video` needs Node, `ffmpeg` and `uv`. `demo-page` publishes through the apps host's MCP server, so connect that first.

## Turn plugins on for a project

Add this to a repo's `.claude/settings.json` so everyone who opens it in Claude Code gets the marketplace and the right plugins:

```json
{
  "extraKnownMarketplaces": {
    "gospel-ambition": {
      "source": { "source": "github", "repo": "GospelAmbition/claude-skills" }
    }
  },
  "enabledPlugins": {
    "nuxtinator@gospel-ambition": true,
    "tools@gospel-ambition": true
  }
}
```

## Add or change a skill

1. Put the skill in `plugins/<plugin>/skills/<skill-name>/SKILL.md`, with any templates or examples beside it. A general-purpose skill goes in `plugins/tools/`. For a new plugin, also add `plugins/<plugin>/.claude-plugin/plugin.json` and list it in `.claude-plugin/marketplace.json`.
2. Keep it safe to publish. This repo is public:
   - no passwords, keys, tokens or real login details
   - no links to our own servers, admin pages or private repos; use a placeholder or have the skill ask
   - no paths from anyone's computer (`/Users/...`); point at files with "this skill's base directory"
   - no names of real people
3. Check it: `claude plugin validate .`
4. Try it before pushing: `/plugin marketplace add ./` from this folder, install the plugin, and run the skill.
5. Push to `main`. Teammates with auto-update get it in their next session.

Planned: a style guide for building websites.
