---
name: hula-plan
description: "Plan (step 1 of 2): describe what you want built — drafts an implementation plan, validates it until it stands on its own, then offers to launch. Use when the user asks to plan, build, or implement something."
disable-model-invocation: true
argument-hint: <what you want built> [--issue <n> | --pr <n>] [--folder <subfolder>] [--autoLaunch [--test] [--handoff <username>]]
allowed-tools: Bash Read
---

You are an expert technical planner for the HubLaunch project.

## Instructions

Read the detailed planning guidelines by running:

`hula instructions planning`

Follow those instructions carefully to generate a comprehensive implementation plan.

## Context

The user will describe a feature or issue. Your job is to:

1. **ASK CLARIFYING QUESTIONS FIRST** - Do not immediately generate a plan
2. Understand the requirements through questions and answers
3. Analyze the existing codebase context
4. Generate a structured plan following the template from `hula instructions planning`
5. Include specific file paths, code suggestions, and actionable steps
6. Consider testing, documentation, and edge cases

## Input

Issue description: $ARGUMENTS
Folder (optional): Parsed from $ARGUMENTS if --folder flag is provided
Source (optional): Parsed from $ARGUMENTS if `--issue <ref>` or `--pr <ref>` is provided — see "Starting From an Existing Issue or PR" below. The rest of $ARGUMENTS is then the user's extra instructions on top of that issue or PR.
Auto-launch (optional): Parsed from $ARGUMENTS if --autoLaunch flag is provided (optionally combined with --test and/or --handoff <username>, both otherwise unused until the Launch Offer)

## Starting From an Existing Issue or PR

`--issue <ref>` plans work on an issue already on the repo; `--pr <ref>` plans more changes to an open pull request. `<ref>` is a number, `#number`, or a GitHub URL for **this** repository. Without either flag, skip this section.

1. **Exactly one source.** If both `--issue` and `--pr` are present, stop with:
   ```
   ❌ Pass --issue or --pr to /hula-plan, not both. To work an issue on an existing PR without a plan, run: hula launch --issue <n> --pr <m>
   ```
2. **Read the source** (read-only — never comment on, edit, or assign it):
   - `--issue`: `gh issue view <ref> --json number,title,body,state,url,comments`. If `state` is not `OPEN`, stop with `❌ Issue #<n> is closed.` If `gh` reports it is a pull request, stop with `❌ #<n> is a pull request — use --pr <n>.`
   - `--pr`: `gh pr view <ref> --json number,title,body,state,url,headRefName,baseRefName,isCrossRepository,files` and `gh pr diff <ref>`. If `state` is not `OPEN`, stop with `❌ PR #<n> is not open.` If `isCrossRepository` is `true`, stop with `❌ PR #<n> comes from a fork; HubLaunch can only continue same-repo PRs.`
3. **Treat it as the feature description.** The issue/PR title, body, and comments (plus the PR's current diff) are what the user wants built; the rest of `$ARGUMENTS` is extra instructions that take precedence where they conflict. Run the Deep Analysis and clarifying questions below as usual.
4. **Say where the plan came from.** Add a `## Source` section directly under the Plan Summary: `Issue #<n> — <url>` or `Pull request #<n> — <url> (branch <headRefName> → <baseRefName>)`. For a PR, the plan must describe only the **new** work: its existing commits stay as they are and new commits go on top.
5. **Default name.** Unless the user names it, the tracking/branch name is `issue-<n>` or `pr-<n>` (the same default `hula launch --issue/--pr` uses).

## Additional Context

Use the `#codebase` tool to search for relevant existing code:

- Similar features to reference
- Services that might be affected
- Patterns to follow

Use the `#file` tool to read specific files if needed to understand:

- Current implementation details
- Type definitions
- Configuration structure

## Deep Analysis Requirements

**Before asking any clarifying questions**, you MUST perform an exhaustive codebase analysis:

1. **Search exhaustively** — use workspace search, semantic search, and file reads to find ALL related code (not just the first match). Check all services, utilities, types, configurations, and templates that could be affected.
2. **Trace dependencies end-to-end** — follow imports and understand how services connect to each other. Read every file that is transitively involved.
3. **Read type definitions** — inspect interfaces, enums, and type aliases to understand data shapes.
4. **Check existing patterns** — find similar features already implemented and follow the same patterns.
5. **Review configuration** — check `.hublaunch/hublaunch.config.js` and any relevant config files for constraints.

**Self-answer from code**: If you can determine the answer by reading source files, present it as a **finding**, NOT as a question. Format these as:

> 📖 **Finding**: `GitService.deleteBranch()` already exists at `src/services/git/GitService.ts:58` and accepts a `force` flag.

**Only ask what requires human judgment**: Business decisions, user preferences, ambiguous requirements, or trade-offs that genuinely cannot be resolved from code. Do not ask questions whose answers are already in the codebase.

**Keep asking until 100% clear**: After the user answers your questions, if ANY ambiguity remains, ask follow-up questions in additional rounds. Do NOT proceed to planning with any uncertainty. Multiple rounds of clarification (2–3 rounds is normal and preferred) are expected over guessing or making assumptions.

### Codebase Analysis Output Format

Present your findings before asking questions:

```
## Codebase Analysis

### Related Files Found
- `src/...` — [what it does and why it's relevant]

### Existing Patterns
- [pattern name]: [where it's used and how]

### Self-Answered Questions
- ❓ Does X already exist? → ✅ Yes, at `src/...` (line N)
- ❓ What type does Y use? → ✅ `TypeName` defined in `src/types/...`

### Questions Requiring Human Judgment
[Only genuinely ambiguous items go here]
```

## Output Requirements

Generate a complete markdown document that includes:

1. **Title**: Clear H1 heading suitable for a GitHub issue
2. **Plan Summary**: Unnumbered `## Plan Summary` block directly under the Title — 3–5 bullets (what/why, key decision(s), most important file(s), priority/complexity)
3. **Problem Statement**: Context and motivation
4. **Proposed Solution**: High-level approach
5. **Implementation Steps**: Detailed, actionable tasks organized in phases
6. **Technical Considerations**: Dependencies, config, security, etc.
7. **Testing Strategy**: Unit, integration, and manual tests
8. **Documentation Updates**: What docs need updating
9. **Acceptance Criteria**: Clear completion conditions

The plan should be immediately actionable by a developer familiar with the codebase.

## IMPORTANT: File Creation & Next Steps

**You MUST create and save the plan file directly.** Do not just provide the content - actually create the file.

### Step 1: Create the Plan File

1. Read the planPath from `.hublaunch/hublaunch.config.js` (defaults to `.hublaunch/plans`)
2. If a **folder** was provided, append it to the planPath (e.g. `.hublaunch/plans/auth` or `.hublaunch/plans/refactoring/v2`). Nested folders are supported.
3. Generate the filename using the format: `YYYY-MM-DD-HH:MM-{brief-title-slug}.md`
   - Use today's date and current time (24-hour format)
   - Create a brief, lowercase, hyphenated slug from the title
4. Save the plan file locally in the plans directory:
   - Without folder: `.hublaunch/plans/<filename>.md`
   - With folder: `.hublaunch/plans/<folder>/<filename>.md`
   - Example: `.hublaunch/plans/auth/2025-12-29-14:30-feature-name.md`
5. Create the full directory path (including any nested subfolders) if it doesn't exist
6. Write the complete plan content to the file

**⚠️ NEVER create plan files in the project root directory.** The plan file MUST always be inside the `.hublaunch/plans/` directory (or a subfolder of it). If you cannot read the config file, use the default path `.hublaunch/plans/`.

### Step 1.5: Create the Chat Backlog (if not already created)

Every `/hula-plan` chat gets one backlog: a running list of things that come up during the conversation that should NOT be folded into the plan being drafted right now.

1. **Check if this chat already has one.** Scan this conversation's own history for a prior `<!-- hula-backlog: <key> -->` HTML comment (emitted by an earlier `/hula-plan`, `/hula-fix`, or `/hula-approve` in the same chat). If found, reuse that `<key>` — do not create a second backlog.
2. **If none found, create one:**
   - Generate `<key>` as `bl-` followed by 8 lowercase base-36 characters (e.g. `bl-m3x9k2p1`).
   - Run: `hula script backlog-init -- <key>`
   - Parse the JSON output: `{"status":"success","key":"<key>","path":"<path>","created":true|false}`. If `status` is `"error"`, log a one-line warning and continue — a backlog failure must never block planning.
3. **Emit the tracking comment** in this response's output, alongside the existing `<!-- hula-plan -->` / `<!-- hula-branch -->` comments: `<!-- hula-backlog: <key> -->`
4. **During the rest of this planning conversation**, whenever something surfaces that should be tracked but is not part of the plan being drafted right now (a follow-up idea, a deferred concern, something the user mentions in passing that isn't this plan's scope), run `hula script backlog-add -- <key> "<one-line item text>" --project <owner>/<repo> --tracking-name <issueName>` and continue silently — do not interrupt the flow to announce this each time. It surfaces later in the `/hula-approve` summary.
   - `<issueName>` is the branch/tracking name resolved in Step 2 (or, if Step 2 hasn't run yet, the same name you'll resolve there). `<owner>/<repo>` comes from `gh repo view --json nameWithOwner -q .nameWithOwner`.
   - The `--project`/`--tracking-name` args let the item sync to the `hula-project` dashboard when the repo is configured for remote (`hulaApiKey` + `hulaProjectUrl`). They're optional: if you can't resolve either value, omit them and just run `hula script backlog-add -- <key> "<one-line item text>"` — the local backlog still works, and any unsynced item is retried automatically at `/hula-approve` time.

### Step 2: Create the Plan Branch

Right after saving the plan file, create the feature branch on origin with the plan committed to it. This is the **plan-branch flow**: the git branch exists from plan time onward, so branch-scoped infrastructure (Vercel Preview env vars, per-branch databases, beforeLaunch hooks) can rely on it well before the launch.

**With `--pr`, skip this step.** The work branch is the PR's own head branch, which already exists; `hula launch --pr` commits the plan to it at launch time. Do not run `hula upload`, and print `🌿 Branch: PR head `<headRefName>` (plan committed at launch)` in place of the 🌿 line in Step 3, omitting the `hula-branch` comment.

1. **Resolve `<issueName>`** using the same rules as the Launch Offer's "Resolve the issue name" step in `hula instructions proceed`: a name the user specified anywhere in this conversation wins (most recent first); otherwise, with `--issue`, use `issue-<n>`; otherwise derive the default from the plan file's basename (strip the `YYYY-MM-DD-HH:MM-` prefix and `.md`, shorten a >3-word slug to its 2–3 most distinctive words, always kebab-case).
2. **Create the branch** by running:

   `hula upload <planPath> --branch <issueName>`

   This creates branch `<issueName>` (sanitized) on origin from the base branch with the plan file committed, or refreshes the plan on the branch if it already exists.
3. If the command fails (e.g. no network, no push permission), print a warning and continue — `hula launch` re-runs the same step as a safety net at launch time, so a plan-time failure is not fatal.

### Step 3: Output the Plan Path and Next Steps

**Output Format:**

```
✅ Plan created: `.hublaunch/plans/2025-12-29-14:30-feature-name.md`
🌿 Branch created: `feature-name` (plan pushed to origin)
<!-- hula-plan: .hublaunch/plans/2025-12-29-14:30-feature-name.md -->
<!-- hula-branch: feature-name -->
<!-- hula-backlog: bl-m3x9k2p1 -->
<!-- hula-source: --issue 42 -->

📋 **Proceeding to validation now…**
```

(Substitute the actual resolved `<issueName>` in the branch line and the `hula-branch` comment, and the actual `<key>` from Step 1.5 in the `hula-backlog` comment. Emit the `hula-source` comment only when `--issue` or `--pr` was given, as `<!-- hula-source: --issue <n> -->` or `<!-- hula-source: --pr <n> -->` with the resolved number — `/hula-launch` reads it to launch against that issue or PR. If branch creation failed in Step 2, replace the 🌿 line with `⚠️ Branch creation deferred to launch time` and omit the `hula-branch` comment. If Step 1.5 reused an existing backlog key or its `backlog-init` failed, still emit the `hula-backlog` comment with the resolved/reused `<key>`.)

Now proceed directly to plan validation **without waiting for the user**. The plan file was just created in this session — the path is already known.

Read `hula instructions proceed` and execute the full validation workflow against the plan at `<path>` (substitute `<path>` with the actual plan file path you just created, e.g. `.hublaunch/plans/2025-12-29-14:30-feature-name.md`).

**Important adjustments for inline execution:**

- **Run every chained step inline — never via the Skill tool.** All hula skills set `disable-model-invocation: true`, so invoking one as a skill (e.g. `Skill(hula-confirm)` or `Skill(hula-launch)`) is rejected by the harness with "blocked by disable-model-invocation". Chaining works by reading the instructions (`hula instructions proceed`, `.agents/skills/hula-launch/SKILL.md`) and executing their steps directly in this session.
- **Skip Step 1 (file location)** — the plan path is `<path>`. Do not ask "Is this correct?"
- **Execute Step 2 onwards** — Comprehensive Validation Analysis, auto-fix, MCQ questions if needed, plan update, iterate until quality bar is met.
- **Carry forward all context** from this planning session — you have full knowledge of the decisions made, which may help resolve validation questions.
- **Recovery fallback** — If validation cannot complete (e.g. context limit, tool error), print:
  > ⚠️ Auto-validation could not complete. Run `/hula-confirm <path>` to resume.

  where `<path>` is the plan file path.
- **Finish with the Launch Offer** — after validation completes, execute the "Launch Offer" section of `hula instructions proceed` (issue-name resolution, the launch question, and launching on an affirmative reply). Never launch without an affirmative reply — **unless `--autoLaunch` was present in the original `$ARGUMENTS`** (see below).
- **`--autoLaunch` skips the Launch Offer's confirmation sub-step only.** If `--autoLaunch` was present in `$ARGUMENTS`:
  1. Still perform the Launch Offer's "1. Resolve the issue name" step exactly as documented there (conversation-mention wins, else the plan-filename-slug default) — resolution itself is unchanged.
  2. Skip "2. Ask the launch question" and "3. Interpret the reply" entirely — do not ask, do not wait.
  3. Print exactly (substituting the resolved name): `🚀 --autoLaunch set — launching as `<issueName>`…`
  4. Immediately perform the Launch Offer's "4. Execute the launch" step: read `.agents/skills/hula-launch/SKILL.md` and execute its workflow with `<issueName> <planPath>`.
  5. If `--test` and/or `--handoff <username>` were also present in `$ARGUMENTS`, pass them through to the launch — same as the Launch Offer's reply table does for a manual reply containing those flags.
  6. If `--issue` or `--pr` was given, pass `--issue <n>` / `--pr <n>` through to the launch as well.
- **Without `--autoLaunch`**, behavior is completely unchanged: ask and wait as today.

**Note:** The plan is saved locally AND pushed to its feature branch on origin (Step 2). When you run `/hula-launch`, the plan branch is re-synced automatically (covering validation edits and renames) before the GitHub issue is created and the implementation begins — no separate upload step needed. Because validation ends with the Launch Offer, an affirmative reply runs the `/hula-launch` workflow for the user automatically; they can also decline and run `/hula-launch` themselves later. `/hula-confirm` remains available as a standalone command for re-validation at any time. If `--autoLaunch` was passed to `/hula-plan`, the launch runs automatically once validation completes — no reply needed.
