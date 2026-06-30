---
layout: post
title: "Storybook as offline test runner"
date: 2026-06-30 00:00:00 -0400
tags: [pattern]
description: "VITE_OFFLINE_MODE routes every queryFn to its co-located mock. One source of truth — Storybook renders it, Vitest runs it, no MSW needed."
---

Every network request in the app is defined with a co-located mock. A single env var routes all `queryFn` calls to those mocks. Storybook runs with that env var always set — every story renders against deterministic data with zero setup. The same stories are executed as integration tests by Vitest's Storybook project. No MSW, no per-story fixtures, no separate test data files.

## The single source of truth

Every query definition ships its own mock alongside the real fetcher:

```ts
// features/api-hooks/src/rules/ruleInstancesQueryOptions.ts
export function ruleInstancesQueryOptions(filter: RuleFilter) {
  return graphqlQueryOptions({
    queryKey: ["rules", "instances", filter],
    query:    LIST_RULE_INSTANCES,
    variables: { filter },
    mock: {
      listRuleInstances: {
        items: [
          { id: "rule-1", name: "MFA not enabled", severity: "HIGH", status: "ENABLED",
            latestAlertCount: 3, lastEvaluatedOn: "2026-06-01T10:00:00Z" },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
      },
    },
  });
}
```

Mock data is always deterministic — no `Date.now()`, no `Math.random()`. The mock can be a static value or a function `(variables?) => TData` for cases where different inputs should return different shapes.

## The factory

```ts
const OFFLINE_MODE = import.meta.env.VITE_OFFLINE_MODE === "true";

function graphqlQueryOptions<TData, TVars>({ queryKey, query, variables, mock }: {
  queryKey: readonly unknown[];
  query:    string;
  variables?: TVars;
  mock:     TData | ((vars?: TVars) => TData);
}) {
  return {
    queryKey,
    queryFn: OFFLINE_MODE
      ? () => Promise.resolve(typeof mock === "function" ? mock(variables) : mock)
      : () => apiFetcher<TData>(GQL_URL, { query, variables }),
    retry: OFFLINE_MODE ? false : undefined,  // no retry noise in Storybook interaction tests
  };
}
```

One branch, one env var, no per-story configuration.

## Storybook setup

```ts
// .storybook/main.ts
export default {
  viteFinalConfig: async (config) => {
    config.define ??= {};
    config.define["import.meta.env.VITE_OFFLINE_MODE"] = JSON.stringify("true");
    return config;
  },
};
```

Every story in the entire app now renders offline by default. No `parameters.msw`, no `beforeEach` server setup, no `handlers` array.

## Global providers in preview.tsx

A single `preview.tsx` wraps every story with the same providers the real app uses:

```tsx
// .storybook/preview.tsx
const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={storybookQueryClient}>
        <TooltipProvider>
          <SessionProvider value={mockSession}>
            <ThemeProvider>
              <Story />
            </ThemeProvider>
          </SessionProvider>
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
};
```

The `storybookQueryClient` has `staleTime: Infinity` and `retry: false`. Queries resolve from the mock immediately and never re-fetch.

## Authorization in Storybook

Session flags, entitlements, and ABAC permissions are seeded globally via the `SessionProvider` mock. Default: full admin with all flags on. Individual stories override specific permissions:

```tsx
// story that tests the read-only view
export const ReadOnly: Story = {
  decorators: [
    withSession({ permissions: { canCreate: false, canUpdate: false } }),
  ],
};

// story that tests behind a feature flag
export const BehindFlag: Story = {
  decorators: [
    withFeatureFlags({ "release-new-rules-ui": false }),
  ],
};
```

`withSession` and `withFeatureFlags` are thin decorators that merge overrides into the mock session context. Auth-gated components test their disabled states without any real auth system.

## Vitest as the test runner

Vitest runs stories as integration tests via its Storybook project:

```ts
// vitest.workspace.ts
export default defineWorkspace([
  { extends: "vitest.config.ts", test: { name: "unit", include: ["**/*.test.ts"] } },
  {
    extends: "vitest.config.ts",
    test: {
      name:    "storybook",
      browser: { enabled: true, name: "chromium", provider: "playwright" },
      include: ["**/*.stories.tsx"],
    },
  },
]);
```

Stories with `play` functions become interaction tests. The same mock-backed stories used for visual development run as automated assertions in CI.

```tsx
export const SubmitsForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Name"), "My Rule");
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(canvas.getByText("Rule saved")).toBeInTheDocument();
    });
  },
};
```

## CI sharding

The storybook project is sharded across 4 parallel runners in CI:

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]
steps:
  - run: VITE_OFFLINE_MODE=true pnpm vitest run --project storybook --shard=${{ matrix.shard }}/4
```

`VITE_OFFLINE_MODE=true` is redundant (Storybook's Vite config already sets it) but is explicit here for clarity in CI logs.

## What you get for free

- Every component is documented with realistic data (the mock is the documentation).
- Every story runs as a test without writing separate test files.
- CI never makes real network requests.
- Adding a new query automatically makes its consuming stories testable offline — no MSW handler to register.
- Flaky tests from network calls or timing are structurally impossible.
