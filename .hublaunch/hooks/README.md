# HubLaunch Hooks

This directory contains project-specific hooks that extend HubLaunch functionality.

`beforeLaunch.ts` and `afterMerge.ts` are generated with a working local-only example already active, plus commented-out Slack and database-branch (Neon+Vercel) examples you can uncomment and adapt.

## Available Hooks

### `beforeLaunch.ts`
Runs **before** `hula launch` sends its launch request, so a project can
provision a freshly-created, per-launch resource (e.g. a database branch) and
inject its connection string into the container.

- On success it must print `{"envVars": {"KEY": "value", ...}}` to **stdout**.
  Those values are merged into the launch request's `envVars`, taking
  precedence over any `.env`-sourced values with the same key.
- **A nonzero exit, or stdout that is not valid `{"envVars": {...}}` JSON,
  aborts the launch** — no request is sent. (Launching against the wrong
  resource, e.g. a shared database, is worse than not launching.)
- **stderr streams live** to your terminal, so you can watch the hook's
  progress (it may make several seconds of API calls).
- Printing nothing, `{}`, or `{"envVars": {}}` is a valid no-op — the launch
  proceeds with no injected variables.
- The hook is responsible for its own **find-or-create idempotency**: a
  kill-and-relaunch runs `beforeLaunch` again with the same context, so key
  your resource off `issueName`/`planPath` and reuse an existing resource
  rather than creating a duplicate.

**Context Provided**:
```typescript
{
  issueName: string;   // The launch's issue/plan name
  planPath: string;    // Path to the plan being launched
}
```

---

### `afterMerge.ts`
Runs **after** `hula approve` successfully merges a PR. Use it to clean up
whatever a `beforeLaunch` hook provisioned (e.g. delete the per-launch
database branch).

- **Best-effort**: a failure only logs a warning — it never fails the merge,
  which has already completed by the time this hook runs.

**Context Provided**:
```typescript
{
  issueNumber: number;   // Associated issue number
  prNumber: number;      // Merged PR number
  prTitle: string;       // Merged PR title
  branch: string;        // The merged PR's source branch
}
```

---

## Creating Custom Hooks

All hooks must:
1. Be TypeScript files with `.ts` extension
2. Accept context as first CLI argument (JSON string)
3. Handle errors gracefully (try/catch)
4. Exit with code 0 on success, non-zero on failure

### Example: Custom Hook

```typescript
#!/usr/bin/env tsx

interface HookContext {
  [key: string]: unknown;
}

async function main() {
  // Parse context from CLI argument
  const contextJson = process.argv[2];
  const context: HookContext = JSON.parse(contextJson);

  console.log("Hook executing with context:", context);

  // Your custom logic here
  // ...

  console.log("✅ Hook completed successfully!");
}

main().catch((error) => {
  console.error("❌ Hook failed:", error);
  process.exit(1);
});
```

---

## Configuration

Configure hooks in `.hublaunch/hublaunch.config.ts`:

```typescript
export const config = {
  // ... other config ...

  hooks: {
    beforeLaunch: ".hublaunch/hooks/beforeLaunch.ts",    // optional — inject per-launch env vars
    afterMerge: ".hublaunch/hooks/afterMerge.ts",        // optional — cleanup after merge
  },
};
```

---

## Environment Variables

Store sensitive data in environment variables:

```bash
# .env (gitignored)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=your-test-password
CUSTOM_API_KEY=your-api-key
```

Access in hooks:
```typescript
const email = process.env.TEST_USER_EMAIL;
```

A variable is only available inside the container if it's listed in your project's `envVars` config in `.hublaunch/hublaunch.config.js` (or covered by `envVars: "all"`). See the "Forwarding environment variables to the container" section of the project README for the full behavior, including which variable names are reserved and blocked.

---

## Debugging Hooks

Run hook manually for testing:

```bash
# Test with sample context
tsx .hublaunch/hooks/beforeLaunch.ts '{"issueName":"my-feature","planPath":".hublaunch/plans/my-feature.md"}'

# Enable debug mode
DEBUG=true tsx .hublaunch/hooks/beforeLaunch.ts '{"issueName":"my-feature","planPath":".hublaunch/plans/my-feature.md"}'
```

---

## More Information

- **Full Documentation**: https://github.com/YizYah/hub-launch/blob/main/docs/hooks-and-plugins.md
- **Examples**: https://github.com/YizYah/hub-launch/tree/main/examples
- **Support**: https://github.com/YizYah/hub-launch/issues
