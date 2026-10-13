---
name: sync-layers
description: Update a nuxtinator host's layers to their newest in-range tags, fetch them, then commit the lockfile change and push. Use when asked to "sync layers", "sync layers and push", "bump layers", or "again" right after a previous layer sync. Run from the root of a nuxtinator host project (one with layers.ts and layers.lock.json).
---

Sync the nuxtinator layers in the current host project, commit, and push. Invoking this skill is explicit permission to commit and push the lockfile change.

Always sync the default branch (`master`, or `main` if that is what the remote uses), never the branch that happens to be checked out. Run each step as its own command and check its result before the next one. Never chain the steps together, because a failed check must stop the run.

## Where to run

- If the main checkout is on the default branch, run the steps there.
- Otherwise, leave the main checkout alone. Its branch, `_layers/`, lockfiles and any running dev server stay as they are. Create a temporary worktree of the default branch in the session scratchpad with `git worktree add <scratchpad>/<project>-<branch> <branch>`, run `bun install` there once to bootstrap, then run every step below inside it. When finished, remove it with `git worktree remove --force <path>` and `git worktree prune`.

## Preconditions

- `package.json` must have the `layers:update` and `sync-layers` scripts. If either is missing, stop and report which layer scripts the project has instead.
- If `layers.lock.json` or `bun.lock` already has uncommitted edits in the checkout you are about to sync, stop and report them. Don't mix someone else's edits into the bump commit.

## Steps

1. **Pull first.** Run `git fetch origin`, then `git pull --ff-only origin <branch>`. If the pull fails for any reason, stop and report it.
2. **Check unpushed local commits.** Run `git log --format='%h %an %ad %s' --date=short origin/<branch>..HEAD`. If there are any, the push will publish them too. Before pushing, run a quick consistency check on them: files they point at should exist and be tracked, and nothing should still reference things they deleted. Name them in the final report.
3. **Resolve.** Run `bun run layers:update`. This writes the newest in-range tag for each layer into `layers.lock.json` and prints the moves. Note any "Major updates available (held)" lines. Those are not applied and should be reported.
4. **Fetch.** Run `bun run sync-layers`. It fetches every layer into `_layers/<id>/` at its locked ref.
5. **Install.** Run `bun install`. It may rewrite `bun.lock` when a layer's dependencies change.
6. **Inspect.** Run `git status --short` and `git diff layers.lock.json`. If `bun.lock` changed, confirm it still lists the same number of `_layers/` workspace entries as `HEAD`, plus or minus any layers that `layers.ts` added or removed.
   - If nothing changed, don't commit. Report that every layer is already at its newest tag.
   - If anything other than `layers.lock.json` and `bun.lock` shows as changed, leave it alone and mention it.
7. **Commit only the lockfiles.** Stage `layers.lock.json`, plus `bun.lock` if it changed. Never stage `_layers/`. Commit with a HEREDOC:

   ```
   chore: bump layer versions

   core 1.5.0 -> 1.6.0, files 1.2.0 -> 1.3.0
   ```

   The body lists each moved layer as `<id> <old> -> <new>`, comma-separated, wrapped near 72 characters. Add no Co-Authored-By line. Never use `--no-verify`.
8. **Push and verify.** Run `git push origin <branch>`, then `git fetch origin` and `git ls-remote origin refs/heads/<branch>`. The remote SHA must equal local `HEAD`.
   - A push can fail with "cannot lock ref ... is at <new sha> but expected <old sha>". That is a transient race on GitHub's side. If `ls-remote` shows the remote at your new commit, the push landed.
   - If the push is rejected because the remote moved, pull with `--ff-only` and push again. Don't force-push.

## Report

Lead with the outcome: pushed, or nothing to do. Then show a table of the layers that moved:

| Layer | Before | After |
|---|---|---|
| core | 1.5.0 | 1.6.0 |

After the table, cover these points briefly:
- Say whether `bun.lock` changed and went into the commit.
- Name any unpushed local commits that the push published.
- List any held major updates.
- Say how many other layers were already at their newest tag.
