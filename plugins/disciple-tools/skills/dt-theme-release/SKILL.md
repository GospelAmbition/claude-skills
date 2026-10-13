---
name: dt-theme-release
description: Cut a new release for the Disciple.Tools theme — bump version, commit, tag, push, update the version-control JSON, and publish release notes
user-invocable: true
---

Release a new version of the Disciple.Tools theme (the WordPress theme repo at `wp-content/themes/disciple-tools-theme`).

Assume the code being released is already merged to `master`. This skill handles the version-bump, tag, push, the version-control JSON update that tells D.T sites a new version exists, and the GitHub release notes update.

## Steps

1. **Confirm starting state.** Be on `master` with a clean working tree, up to date with `origin/master`. The release is cut from `master`, not `develop`. (Historically `develop` is merged into `master` first; if `develop` has commits not on `master`, surface that to the user before continuing.)

2. **Determine the bump.** Read the current version from `style.css` (`Version:` header), `functions.php` (`$this->version = '...'`), and (for the previous feature release) `dt-core/release-notifications.php` (`$show_notification_for_theme_version`). Decide:
   - Fix-only → patch bump (e.g. `1.81.1` → `1.81.2`)
   - New feature(s) → minor bump (e.g. `1.81.1` → `1.82.0`)
   - Ask the user if not obvious from `git log <last-tag>..master`.

3. **Bump version files.** Update the version string in:
   - `style.css` — `Version:` header line
   - `functions.php` — `$this->version = '<version>'` line
   - `dt-core/release-notifications.php` — `$show_notification_for_theme_version` — **only on feature releases (x.y.0)**, skip on patch releases

4. **Commit** the changed files with message exactly `Disciple.Tools v<version>`, e.g. `Disciple.Tools v1.82.0`. No body, no Co-Authored-By line. The husky pre-commit hook will run lint-staged (`phpcbf`); let it run, do not bypass with `--no-verify`.

5. **Tag** the commit with the bare version number (no `v` prefix), e.g. `1.82.0`. Use an annotated tag with the version as the message: `git tag -a "<version>" -m "<version>"`. Tag name and version are identical.

6. **Push** the commit and the tag to `origin`:
   ```
   git push origin master
   git push origin <tag>
   ```

7. **Wait for the Release workflow.** A GitHub Action triggers on the tag push and creates a release on GitHub with the built `disciple-tools-theme.zip` asset. Watch with `gh run list -R DiscipleTools/disciple-tools-theme --limit 5` and `gh run watch <run-id> -R DiscipleTools/disciple-tools-theme --exit-status`. The release is created with empty notes — that's expected.

8. **Update the version-control JSON** — **every release, patch and feature alike**. D.T sites poll `disciple-tools-theme-version-control.json` in `DiscipleTools/disciple-tools-version-control` (branch `master`) to discover theme updates. Set `version` to the new version and `download_url` to `https://github.com/DiscipleTools/disciple-tools-theme/releases/download/<version>/disciple-tools-theme.zip`; leave `details_url` as is. Only do this after step 7 confirms the zip asset exists, because sites will start downloading from that URL immediately. There is no local checkout of that repo — commit straight through the GitHub contents API, with the bare version as the commit message (matches history: `1.82.2`, `1.82.1`, ...):
   ```
   REPO=DiscipleTools/disciple-tools-version-control
   FILE=disciple-tools-theme-version-control.json
   SHA=$(gh api repos/$REPO/contents/$FILE --jq .sha)
   gh api repos/$REPO/contents/$FILE --jq .content | base64 -d \
     | sed -e 's/"version": "[^"]*"/"version": "<version>"/' \
           -e 's#/download/[^/]*/disciple-tools-theme.zip#/download/<version>/disciple-tools-theme.zip#' \
     > <scratchpad>/disciple-tools-theme-version-control.json
   gh api -X PUT repos/$REPO/contents/$FILE -f message="<version>" -f sha="$SHA" \
     -f content="$(base64 -i <scratchpad>/disciple-tools-theme-version-control.json)"
   ```
   Verify by re-fetching the file and checking both `version` and `download_url` show the new version.

9. **Draft release notes** — **every release, patch and feature alike**. Save them to `wp-content/releases/<version>.md` (this folder lives in the parent WordPress install, *not* in the theme repo).
   - Gather PRs and direct commits for the release with `git log --oneline <range>` and `gh pr view <num> -R DiscipleTools/disciple-tools-theme --json title,body,author,number` for context. Range: feature release → `<last-feature-tag>..master`; patch release → `<previous-tag>..master` (only what this patch adds).
   - **Feature releases:** follow `wp-content/releases/guide.md`, with its section order exactly: What's New → New Features → Improvements → Fixes → Dev Upgrades → Translation Updates → Contributors → Community → Full Changelog.
   - **Patch releases:** keep it short and plain, matching earlier patch notes (e.g. `gh release view 1.83.1 -R DiscipleTools/disciple-tools-theme`) rather than `guide.md` — a one-line summary (`Patch release with <n> fix(es).`), a `## Fixes` list with one `- Area: what changed` bullet per fix (PR number and reporter thanks when there is one), then the changelog line. No What's New, Contributors or Community sections, no emoji or playful accolades:
     ```
     Patch release with one fix.

     ## Fixes
     - Record pictures: <what was broken and what changed>. #1234


     **Full Changelog**: https://github.com/DiscipleTools/disciple-tools-theme/compare/<previous-tag>...<version>
     ```
   - Full Changelog compares against the previous tag (`<previous-tag>...<version>`).
   - Include an `## Excerpt` section at the bottom of the local file (the user uses it separately).

10. **Update the GitHub release** with the drafted notes, **excluding the Excerpt section** (the excerpt is for the user's separate use, not for the published release):
   ```
   gh release edit <version> -R DiscipleTools/disciple-tools-theme --notes-file <path-to-notes-without-excerpt>
   ```
   Easiest approach: keep the excerpt in the local `wp-content/releases/<version>.md` file, but write the notes-to-publish to a temp file (or strip the excerpt before uploading and re-add it after). Whatever you do, the local file ends up *with* the excerpt and the published release ends up *without* it.

11. **Report** the release URL (`https://github.com/DiscipleTools/disciple-tools-theme/releases/tag/<version>`) and a one-line summary of headline changes.

## Notes

- Release notes are written for every release. Feature releases cover everything since the last feature release; patch releases cover only what changed since the previous tag.
- Commit message has the `Disciple.Tools v` prefix (`Disciple.Tools v1.82.0`); tag does NOT (`1.82.0`).
- GitHub releases are the source of truth, not the local `wp-content/releases/` files. When referencing past releases for tone or content, prefer `gh release view <version> -R DiscipleTools/disciple-tools-theme`.
- `gh release view` requires the bare tag (`1.82.0`), not `v1.82.0`.
- Don't add `Co-Authored-By` lines to the version-bump commit.
- The theme repo is its own git repo (separate from the parent WordPress install). The `wp-content/releases/` folder lives one level up, in the parent install — this is intentional, do not create a `releases/` folder inside the theme repo.
- Direct push to `master` is the established release pattern — there is no PR step for the version bump.
- The version-control JSON (step 8) is what actually makes sites offer the update; a tag and GitHub release alone do nothing for existing installs. Its commit history is one commit per release, message = bare version.
