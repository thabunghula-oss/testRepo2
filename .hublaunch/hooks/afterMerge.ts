#!/usr/bin/env tsx
/**
 * afterMerge hook — runs after `hula approve` successfully merges a PR.
 * Best-effort: a failure only logs a warning, it never fails the merge.
 * See ./README.md for the full contract.
 *
 * Context: { issueNumber: number; prNumber: number; prTitle: string; branch: string }
 */

interface AfterMergeContext {
  issueNumber: number;
  prNumber: number;
  prTitle: string;
  branch: string;
}

async function main() {
  const context: AfterMergeContext = JSON.parse(process.argv[2] ?? '{}');

  // -----------------------------------------------------------------------
  // ACTIVE EXAMPLE — runs by default. Local-only: just logs what merged.
  // Remove this block once you add your own cleanup logic below.
  // -----------------------------------------------------------------------
  console.error(
    `[afterMerge] PR #${context.prNumber} "${context.prTitle}" merged (issue #${context.issueNumber}, branch ${context.branch}).`,
  );

  // -----------------------------------------------------------------------
  // EXAMPLE IDEA — Slack notification. Uncomment and set SLACK_WEBHOOK_URL.
  // -----------------------------------------------------------------------
  // const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text: `✅ Merged PR #${context.prNumber}: ${context.prTitle}` }),
  //   });
  //   console.error('[afterMerge] Slack notification sent.');
  // }

  // -----------------------------------------------------------------------
  // EXAMPLE IDEA — tear down the per-launch database branch (Neon + Vercel)
  // that a matching beforeLaunch.ts provisioned. Requires NEON_API_KEY,
  // NEON_PROJECT_ID, VERCEL_TOKEN, VERCEL_PROJECT_ID. Treat "not found" as
  // already-clean: log a warning and continue, don't throw — this hook may
  // re-run, or the launch may have been killed before beforeLaunch ran.
  // -----------------------------------------------------------------------
  // const branchName = `preview/${context.branch}`;
  // // ...GET the Neon branch by name; if found, DELETE it; if not found,
  // // console.error a warning and continue.
  // // ...GET the Vercel branch-scoped DATABASE_URL env var by gitBranch; if
  // // found, DELETE it; if not found, console.error a warning and continue.
}

main().catch((error) => {
  console.error('[afterMerge] Hook failed (non-fatal):', error instanceof Error ? error.message : String(error));
});
