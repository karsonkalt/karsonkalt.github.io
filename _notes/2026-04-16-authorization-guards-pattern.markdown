---
layout: post
title: "Authorization guards — one API for flags, entitlements, and ABAC"
date: 2026-04-16 00:00:00 -0400
tags: [pattern]
description: "requireFeatureFlag / requireEntitlement / requireAllAbac compose in beforeLoad. Storybook mocks the same session context. Nav gates and route gates can't drift."
---

One set of guard functions covers feature flags, plan entitlements, and ABAC permissions. They compose in `beforeLoad`, throw typed errors that `RouteErrorComponent` maps to UX, and read from the same session context that Storybook mocks globally. Nav visibility and route access use the same underlying checks — they can't drift.

## Three access dimensions

| Dimension | Check | Source |
|---|---|---|
| Feature flag | `getFeatureFlag(key)` | LaunchDarkly / localStorage override |
| Entitlement | `hasEntitlement(plan, name)` | Plan record from API |
| ABAC permission | `hasAbacStatement(perms, stmt)` | Permissions record from API |

Each guard is a one-liner that throws a typed error on denial:

```ts
function requireFeatureFlag(key: string): void {
  if (!getFeatureFlag(key)) throw new FeatureFlagDisabledError(key);
}

function requireEntitlement(client: QueryClient, name: string): void {
  const plan = client.getQueryData<Plan>(planQueryKey());
  if (!hasEntitlement(plan, name)) throw new NotInPlanError(name);
}

function requireAllAbac(client: QueryClient, ...stmts: AbacStatement[]): void {
  const perms = client.getQueryData<Perms>(permissionsQueryKey());
  if (!stmts.every(s => hasAbacStatement(perms, s))) throw new AccessDeniedError();
}

function requireAnyAbac(client: QueryClient, ...stmts: AbacStatement[]): void {
  const perms = client.getQueryData<Perms>(permissionsQueryKey());
  if (!stmts.some(s => hasAbacStatement(perms, s))) throw new AccessDeniedError();
}
```

Convenience wrappers for common CRUD patterns:

```ts
const requireCanCreate = (client, area) => requireAnyAbac(client, { action: "CREATE", area });
const requireCanRead   = (client, area) => requireAnyAbac(client, { action: "READ",   area });
const requireCanUpdate = (client, area) => requireAnyAbac(client, { action: "UPDATE", area });
const requireCanDelete = (client, area) => requireAnyAbac(client, { action: "DELETE", area });
```

## Route usage

```ts
export const Route = createFileRoute("/rules")({
  beforeLoad: ({ context: { queryClient } }) => {
    requireFeatureFlag("release-rules");     // must have flag
    requireEntitlement(queryClient, "rules"); // must have plan entitlement
    requireCanRead(queryClient, "rules");    // must have ABAC read permission
  },
});
```

Sequential calls are AND. The first failure throws; subsequent checks are skipped.

## In-component usage

Same primitives, read synchronously from cache, used for conditional rendering:

```tsx
function RulesToolbar({ queryClient }: { queryClient: QueryClient }) {
  const perms = queryClient.getQueryData<Perms>(permissionsQueryKey());
  const canCreate = hasAbacStatement(perms, { action: "CREATE", area: "rules" });

  return (
    <div>
      {canCreate && <Button>Create rule</Button>}
    </div>
  );
}
```

## Nav gate consistency

The same underlying functions gate nav visibility and route access:

```ts
// nav config
{
  label: "Rules",
  path:  "/rules" satisfies AppRoutePath,
  hidden: !getFeatureFlag("release-rules") || !hasEntitlement(plan, "rules"),
}

// route beforeLoad
requireFeatureFlag("release-rules");
requireEntitlement(queryClient, "rules");
```

If you hide the nav link behind a flag, the route guards the same flag. Structural consistency — not a convention you have to remember.

## Storybook: global auth defaults

Every story runs with full admin access and all flags enabled by default, wired in `preview.tsx`:

```tsx
// .storybook/preview.tsx
const mockSession: Session = {
  accountId:    "test-account",
  featureFlags: allFlagsOn(),   // every flag returns true
  plan:         fullPlan(),     // every entitlement included
  permissions:  fullAdmin(),    // every ABAC statement allowed
};

const preview: Preview = {
  decorators: [
    (Story) => (
      <SessionProvider value={mockSession}>
        <Story />
      </SessionProvider>
    ),
  ],
};
```

Stories never hit real auth. The default session lets every component render its "authorized" state. Specific stories override only the dimensions they're testing.

## Storybook: per-story overrides

```tsx
// Read-only view
export const ReadOnly: Story = {
  decorators: [
    withSession({
      permissions: noWritePermissions("rules"),
    }),
  ],
};

// Behind a flag
export const FeatureFlagOff: Story = {
  decorators: [
    withSession({
      featureFlags: { "release-rules": false },
    }),
  ],
};

// Non-plan account
export const NotEntitled: Story = {
  decorators: [
    withSession({
      plan: planWithout("rules"),
    }),
  ],
};
```

`withSession` is a decorator factory that merges overrides into the mock session context:

```ts
function withSession(overrides: Partial<Session>): Decorator {
  return (Story) => (
    <SessionProvider value={mergeSession(mockSession, overrides)}>
      <Story />
    </SessionProvider>
  );
}
```

The same `SessionProvider` the real app uses. No special Storybook-only auth system to maintain.

## Why this works

All three access dimensions — flags, entitlements, ABAC — read from a single `SessionProvider` context. Mocking that context in Storybook mocks all three simultaneously. There's no separate LaunchDarkly mock, no separate plan mock, no separate ABAC mock to keep in sync. One context, one override, full control.
