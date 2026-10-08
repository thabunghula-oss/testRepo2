#!/usr/bin/env tsx
/**
 * beforeLaunch hook — runs before `hula launch` sends its launch request.
 * See ./README.md for the full stdout/stderr contract.
 *
 * Context: { issueName: string; planPath: string }
 */

interface BeforeLaunchContext {
  issueName: string;
  planPath: string;
}

async function main() {
  const context: BeforeLaunchContext = JSON.parse(process.argv[2] ?? '{}');

  // -----------------------------------------------------------------------
  // ACTIVE EXAMPLE — runs by default. Local-only, no external services or
  // credentials required. Demonstrates the {"envVars": {...}} stdout
  // contract by injecting a LAUNCH_TIMESTAMP env var into the container.
  // Remove this block once you add your own logic below.
  // -----------------------------------------------------------------------
  console.error(`[beforeLaunch] Launching "${context.issueName}"...`);
  const envVars: Record<string, string> = { LAUNCH_TIMESTAMP: new Date().toISOString() };
  console.error(`[beforeLaunch] Injecting LAUNCH_TIMESTAMP=${envVars.LAUNCH_TIMESTAMP}`);

  // -----------------------------------------------------------------------
  // EXAMPLE IDEA — Slack notification. Uncomment and set SLACK_WEBHOOK_URL
  // to post a message when a launch starts.
  // -----------------------------------------------------------------------
  // const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  // if (webhookUrl) {
  //   await fetch(webhookUrl, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ text: `🚀 Launching *${context.issueName}*` }),
  //   });
  //   console.error('[beforeLaunch] Slack notification sent.');
  // }

  // -----------------------------------------------------------------------
  // EXAMPLE IDEA — per-launch database branch (Neon + Vercel). Provisions
  // an isolated Postgres branch and injects its connection string, so each
  // launch gets its own database instead of sharing one. Requires
  // NEON_API_KEY, NEON_PROJECT_ID, VERCEL_TOKEN, VERCEL_PROJECT_ID.
  // Find-or-create by name is required (this hook re-runs on a
  // kill-and-relaunch with the same issueName) — never log the actual
  // connection string or tokens.
  // -----------------------------------------------------------------------
  // const branchName = `preview/${context.issueName}`;
  // const branches = await fetch(
  //   `https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches`,
  //   { headers: { Authorization: `Bearer ${process.env.NEON_API_KEY}` } },
  // ).then((r) => r.json());
  // // ...find branchName in branches.branches; if absent, POST to create one
  // // off the default branch, then read the connection string back.
  // // let connectionString = /* from the found or created branch */ '';
  // await fetch(
  //   `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/env`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       key: 'DATABASE_URL',
  //       value: /* connectionString from above */ '',
  //       target: ['preview'],
  //       gitBranch: context.issueName,
  //       type: 'encrypted',
  //     }),
  //   },
  // );
  // envVars.DATABASE_URL = /* connectionString from above */ '';
  // console.error('[beforeLaunch] Neon branch + Vercel env var provisioned.');

  console.log(JSON.stringify({ envVars }));
}

main().catch((error) => {
  console.error('[beforeLaunch] Hook failed:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
