---
name: hula-launch
description: "Launch a validated plan: creates the GitHub issue and starts the cloud run that ends in a verified PR (offered automatically after /hula-plan). Use when the user asks to launch a plan."
disable-model-invocation: true
argument-hint: <branch-name> [<plan-path>] [--handoff <username>] [--test] [--skip-regression] [--kill] [--kill-and-relaunch] [--folder <path>] [--group-id <id>] [--plan <repo>=<path>] [--issue <ref> | --pr <ref>] [--base <branch>]
allowed-tools: Bash Read
---

You are an expert HubLaunch workflow assistant. Your job is to extract two values from the user input and chat history, then run a single script.

## Step 1: Extract branch name and plan path

From `$ARGUMENTS`:
- **Branch name** (required): the first word (e.g., `feature-auth`).
- **Plan path** (optional): the second word, if present (e.g., `.hublaunch/plans/2026-06-10-14:00-feature-auth.md`).
- **--handoff** (optional): a `--handoff <username>` flag anywhere in `$ARGUMENTS`.
- **--test** (optional): the bare flag `--test`, anywhere in `$ARGUMENTS`. Sets test mode (server uses a mock Claude — fast E2E run; a real PR is still created).
- **--skip-regression** (optional): the bare flag `--skip-regression`, anywhere in `$ARGUMENTS`. Force-skips the regression-tests pipeline step for this one launch (overrides any `steps.regression.skip` config default).
- **--kill** (optional): the bare flag `--kill`, anywhere in `$ARGUMENTS`. Stops the in-flight task for this branch name **without** relaunching. A plan path is **not** required with `--kill` — the branch name alone is enough.
- **--kill-and-relaunch** (optional): the bare flag `--kill-and-relaunch`, anywhere in `$ARGUMENTS`. Cancels the in-flight task, resets stale state, and launches a fresh task (needs a plan path, like a normal launch).
- **--folder** (optional): `--folder <path>`. Multi-repo mode — launches the feature in **every initialized repo directly under `<path>`** as one correlated feature group.
  - ⚠️ **This `--folder` is DIFFERENT from `/hula-plan`'s `--folder`.** Here `<path>` is the **PARENT directory that contains sibling repos** (e.g. `~/code/myapp`, which holds `~/code/myapp/mobile` and `~/code/myapp/api`). In `/hula-plan`, `--folder <subfolder>` names a **plans subdirectory**. Never conflate the two.
  - In folder mode the plan path is resolved **per repository** — do NOT pass a positional plan path. A single positional is the branch name.
- **--group-id** (optional): `--group-id <id>`. Use an explicit group id instead of generating one (join/retry an existing group). Valid ids match `^[A-Za-z0-9_-]{1,64}$`.
- **--plan** (optional, repeatable): `--plan <repo>=<path>`. Override the auto-resolved plan for one repo in `--folder` mode. `<repo>` is the discovered directory name; `<path>` is relative to that repo's root.
- **--issue** (optional): `--issue <ref>` (a number, `#number`, or issue URL). Work on an **existing** GitHub issue: no new issue is created, the issue is never edited, and the PR links it with `Closes #N`.
- **--pr** (optional): `--pr <ref>` (a number, `#number`, or PR URL). Continue an **existing** same-repo pull request: the plan is committed to the PR's head branch and new commits are pushed on top. Fork PRs are rejected.
- **--base** (optional): `--base <branch>`. Cut the work branch from `<branch>` and open the PR into it. Not allowed with `--pr` (the PR already has a base).
- **Source from `/hula-plan`**: if `--issue`/`--pr` is not in `$ARGUMENTS`, look in the chat history for a `<!-- hula-source: --issue <n> -->` or `<!-- hula-source: --pr <n> -->` comment emitted by `/hula-plan` **for the same plan path** you resolve below (it is printed next to that plan's `<!-- hula-plan: <path> -->` comment). If found, use that flag as if the user had passed it. A `hula-source` comment for a different plan does not apply.

`--issue`/`--pr` cannot be combined with `--kill` or `--folder`. `--issue` and `--pr` together are only valid without a plan file — that combination is a direct CLI launch (`hula launch --issue <n> --pr <m>`), not a `/hula-launch` run; if both are present here, stop with:
```
❌ /hula-launch takes a plan, so pass --issue or --pr, not both. To work an issue on an existing PR without a plan, run: hula launch --issue <n> --pr <m>
```

`--kill` and `--kill-and-relaunch` are mutually exclusive; if the user passes both, stop with:
```
❌ --kill and --kill-and-relaunch cannot be used together.
```

If no branch name is provided, stop with:
```
❌ Branch name required. Usage: /hula-launch <branch-name> [<plan-path>] [--handoff <username>] [--test] [--kill] [--kill-and-relaunch]
```

**Plan path resolution** (skip entirely when `--kill` is set — a bare kill needs only the branch name):

If no plan path was given in `$ARGUMENTS`, look in the current chat history for the HTML comment:
```
<!-- hula-plan: <path> -->
```
Use the path from the most recent such comment.

If no plan path is found in `$ARGUMENTS` or chat history (and `--kill` is not set), stop with:
```
❌ No plan found in this chat. Run /hula-plan first, or pass the plan path as the second argument.
```

> 💡 **Launching from an existing GitHub issue or PR without a plan?** The
> normal path is `/hula-plan --issue <n>` / `/hula-plan --pr <n>`, which plans
> from the GitHub text and then launches through this skill with the source
> flag. To skip planning entirely, run the CLI directly: `hula launch --issue
> <ref>` or `hula launch --pr <ref>` generates the plan from the GitHub text
> (a single positional is then the tracking name, never a plan path). See the
> README's "Launch from an existing issue or PR".

## Step 2: Run the launch script

With the values known, run exactly one Bash command.

Without handoff:
```bash
hula script launch-run -- <plan-path> <branch-name>
```

With handoff:
```bash
hula script launch-run -- <plan-path> <branch-name> --handoff <username>
```

With test mode:
```bash
hula script launch-run -- <plan-path> <branch-name> --test
```

With handoff + test mode:
```bash
hula script launch-run -- <plan-path> <branch-name> --handoff <username> --test
```

With skip-regression:
```bash
hula script launch-run -- <plan-path> <branch-name> --skip-regression
```

Append `--test` whenever the user passed it; it composes with `--handoff`. Append `--skip-regression` whenever the user passed it; it composes with `--handoff` and `--test` too.

**From an existing issue or PR** — append the source flag (from `$ARGUMENTS` or the plan's `hula-source` comment), and `--base` if given; they compose with the flags above:
```bash
hula script launch-run -- <plan-path> <branch-name> --issue <n>
hula script launch-run -- <plan-path> <branch-name> --pr <n>
hula script launch-run -- <plan-path> <branch-name> --issue <n> --base <branch>
```

**Stop the in-flight task without relaunching (`--kill`)** — pass only the branch name (no plan path):
```bash
hula script launch-run -- <branch-name> --kill
```

**Kill the in-flight task and relaunch fresh (`--kill-and-relaunch`)** — needs a plan path, like a normal launch, and composes with `--handoff`/`--test`:
```bash
hula script launch-run -- <plan-path> <branch-name> --kill-and-relaunch
```

**Launch a multi-repo feature group (`--folder`)** — pass only the branch name (no plan path); plans resolve per repo:
```bash
hula script launch-run -- <branch-name> --folder <parent-path>
```

**Override a repo's plan, or join/retry an existing group:**
```bash
hula script launch-run -- <branch-name> --folder <parent-path> --plan api=.hublaunch/plans/2026-08-10-11:00-login-api.md
hula script launch-run -- <branch-name> --folder <parent-path> --group-id login-a3f9c1
```

**Stop every member's in-flight task (`--folder --kill`):**
```bash
hula script launch-run -- <branch-name> --folder <parent-path> --kill
```

## Step 3: Show the result

Parse the JSON output from the script:
- If `status` is `"error"`, display `❌ Launch failed: <message>` and stop.
- If `status` is `"success"` **and `prNumber` is non-empty** (a `--pr` launch), the work continues on the existing pull request. Display:

```
✅ Launched on existing PR #<prNumber> (branch `<branchName>` tracks it)

🔀 **Pull request**: <repo>#<prNumber> — new commits are pushed to its head branch
📋 **Issue**: <repo>#<issueNumber>   (only when `issueNumber` is non-empty)
📄 **Plan**: `<planPath>`

<!-- hula-issue: <issueNumber> -->   (only when `issueNumber` is non-empty)

**Next Steps:**
- Use `/hula-verify` to check implementation against the plan
- Use `/hula-approve` when ready to merge
```
- If `status` is `"success"` **and this was a `--kill` (cancel-only) run** — indicated by an empty `issueNumber` — there is no new issue/PR. Display a cancel summary instead of the launch template:

```
🛑 Kill request sent for branch `<branchName>`

<cliOutput>
```

The `cliOutput` already says whether a task was cancelled (`Cancelled '<branch>'`) or there was nothing to cancel (`No active task to cancel for '<branch>'`). Do **not** emit a `hula-issue` comment for a pure kill.

- If `status` is `"success"` **and this was a `--folder` (feature-group) run** — indicated by a non-empty `folder` and a `groupId` — there is no single issue/PR. Display a group summary instead of the single-launch template:

```
✅ Launched feature group `<groupId>`

<cliOutput>

<!-- hula-group: <groupId> -->

**Next Steps:**
- Use `/hula-launch <branch-name> --show-group <groupId>` (or `hula launch --show-group <groupId>`) to see combined per-repo status
- A failing member does not stop the others — the summary above lists ✓/✗ per repo and an exact retry command
```

The `cliOutput` already contains the per-repo roster, ✓/✗ summary, and any retry commands. Do **not** emit a `hula-issue` comment for a group launch (issue numbers are per-repo).

- Otherwise (`status` is `"success"` with a non-empty `issueNumber` — a normal launch or `--kill-and-relaunch`), display:

```
✅ Launched issue #<issueNumber> on branch `<branchName>`

📋 **Issue**: <repo>#<issueNumber>
🌿 **Branch**: `<branchName>`
📄 **Plan**: `<planPath>`

<!-- hula-issue: <issueNumber> -->

**Next Steps:**
- Use `/hula-fix <problem>` to make corrections
- Use `/hula-verify` to check implementation against the plan
- Use `/hula-approve` when ready to merge
```

## Important Notes

- Do NOT call the `Read` tool to check if the plan file exists. The `hula launch` CLI validates file existence (locally, on the plan's feature branch, and on `origin/main`) and reports errors clearly.
- Do NOT run `hula upload` separately. `hula launch` publishes the plan to its feature branch automatically (creating the branch from the base branch if `/hula-plan` didn't already, and refreshing it after validation edits or a rename).
- This command is typically run after `/hula-plan` and `/hula-confirm`.
