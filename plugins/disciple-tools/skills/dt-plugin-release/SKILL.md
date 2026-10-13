---
name: dt-plugin-release
description: Cut a new release for a Disciple.Tools plugin — bump version, commit, tag, push, and publish release notes
user-invocable: true
---

Release a new version of a Disciple.Tools plugin (any plugin under `wp-content/plugins/disciple-tools-*`).

Assume the code change being released is already committed. This skill handles the version-bump, tag, push, and the GitHub release notes.

## Steps

1. **Determine the bump.** Read the current version from the plugin's main `.php` file header (`Version:` line) and from `version-control.json` (`"version"` key). They must match.
   - Fix → patch bump (e.g. `1.7.0` → `1.7.1`)
   - New feature → minor bump (e.g. `1.7.0` → `1.8.0`)
   - Ask the user which it is if not obvious from context.

2. **Bump both files and the release date.** Update the version string in:
   - The plugin's main `.php` file (the one named like `disciple-tools-<name>.php` in the plugin root) — `Version:` header line.
   - `version-control.json` — `"version"` field.
   Both must end up identical. If `version-control.json` has a `"last_updated"` field, set it to the current month in its existing format (e.g. `"2026-09"` for `YYYY-MM`, or a full date if that's what it holds).

3. **Commit** the two changed files with message exactly `v<version>` (with the `v` prefix), e.g. `v1.7.1`. No body, no Co-Authored-By line.

4. **Tag** the commit with the bare version number (no `v` prefix), e.g. `1.7.1`. Tag name and version are identical.

5. **Push** the commit and the tag to `origin`:
   ```
   git push origin <branch>
   git push origin <tag>
   ```
   Always `origin` (the canonical DiscipleTools remote), even when other remotes (forks like `kodinkat`, `thecodezone`) exist.

6. **Wait for the Release workflow.** Most plugins have a `.github/workflows/release.yml` that triggers on the tag push and creates the GitHub release with the built `<plugin>.zip` asset and empty notes. Get the repo slug from `git remote get-url origin` (e.g. `DiscipleTools/disciple-tools-webform`), then watch with `gh run list -R <repo> -w Release -L 1` and `gh run watch <run-id> -R <repo> --exit-status`. Confirm with `gh release view <version> -R <repo>`. If the plugin has no release workflow or the run fails, stop and tell the user; don't create the release by hand, because it would be missing the zip asset that sites download.

7. **Draft release notes** — **every release, patch and minor alike**. Save them to `wp-content/releases/<plugin-slug>/<version>.md` (in the parent WordPress install, *not* in the plugin repo; `<plugin-slug>` is the plugin's folder name).
   - Gather what the release contains with `git log --oneline <previous-tag>..<version>` and `gh pr view <num> -R <repo> --json title,body,author,number` for each PR. Skip the version-bump commit itself; CI/tooling-only commits go under `## Dev Upgrades`.
   - Keep it short and plain, matching the theme's patch notes (e.g. `gh release view 1.83.1 -R DiscipleTools/disciple-tools-theme`): a one-line summary, then only the sections that have entries, in this order: `## New Features` → `## Improvements` → `## Fixes` → `## Dev Upgrades`. One `- Area: what changed` bullet per item, written for site admins (what they'll notice, not how the code changed), with the PR number and thanks to an outside contributor or reporter when there is one. End with the changelog line. No emoji or playful accolades.
     ```
     Patch release with one fix.

     ## Fixes
     - Forms: <what was broken and what changed>. #104


     **Full Changelog**: https://github.com/<repo>/compare/<previous-tag>...<version>
     ```
   - Summary line: patch → `Patch release with <n> fix(es).`; minor → one sentence naming the headline feature(s).

8. **Update the GitHub release** with the drafted notes:
   ```
   gh release edit <version> -R <repo> --notes-file wp-content/releases/<plugin-slug>/<version>.md
   ```
   Verify with `gh release view <version> -R <repo>`.

9. **Report** the release URL (`https://github.com/<repo>/releases/tag/<version>`) and a one-line summary of what shipped.

## Notes

- Commit message has the `v` prefix (`v1.7.1`); tag does NOT (`1.7.1`).
- Release notes are written for every release and cover only what changed since the previous tag.
- GitHub releases are the source of truth, not the local `wp-content/releases/<plugin-slug>/` files. `gh release view` takes the bare tag (`1.7.1`).
- Direct push to master/main is the established release pattern for these plugins — there is no PR step. If a permission rule blocks the push, surface it to the user rather than working around it; they may need to push manually or relax the rule.
- Don't add `Co-Authored-By` lines to the version-bump commit.
- The plugin repo is its own git repo (separate from the parent WordPress install), so all git commands run inside the plugin directory.
