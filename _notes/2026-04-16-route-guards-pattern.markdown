---
layout: post
title: "Route guard functions"
date: 2026-04-16 00:00:00 -0400
tags: [pattern]
description: "beforeLoad composes typed guard functions. Denials throw typed errors. RouteErrorComponent maps them to UX — inside the app layout."
---

`beforeLoad` never contains raw conditionals. It composes typed guard functions that throw on denial. A single `RouteErrorComponent` maps each error class to a full-page component rendered inside the app shell — nav rail and all. `notFound()` is explicitly banned for access gates because it replaces the entire page tree.

## Guard functions

```ts
// features/authorization/src/guards.ts

function requireFeatureFlag(key: string): void {
  if (!getFeatureFlag(key)) throw new FeatureFlagDisabledError(key);
}

function requireEntitlement(client: QueryClient, name: string): void {
  const plan = client.getQueryData<Plan>(planQueryKey());
  if (!plan?.entitlements.includes(name)) throw new NotInPlanError(name);
}

function requireAllAbac(client: QueryClient, ...statements: AbacStatement[]): void {
  const perms = client.getQueryData<Perms>(permissionsQueryKey());
  if (!statements.every(s => hasAbacStatement(perms, s))) throw new AccessDeniedError();
}

function requireAnyAbac(client: QueryClient, ...statements: AbacStatement[]): void {
  const perms = client.getQueryData<Perms>(permissionsQueryKey());
  if (!statements.some(s => hasAbacStatement(perms, s))) throw new AccessDeniedError();
}

// Convenience wrappers
const requireCanCreate = (client, area, target?) => requireAnyAbac(client, { action: "CREATE", area, target });
const requireCanRead   = (client, area, target?) => requireAnyAbac(client, { action: "READ",   area, target });
```

## Typed errors

```ts
class FeatureFlagDisabledError extends Error { readonly type = "feature-flag-disabled" }
class NotInPlanError           extends Error { readonly type = "not-in-plan"           }
class AccessDeniedError        extends Error { readonly type = "access-denied"          }
```

## Route usage

Sequential calls compose as AND — first failure throws and stops the chain:

```ts
// beforeLoad runs before any child, so permission data is already cached
export const Route = createFileRoute("/rules/$ruleId")({
  beforeLoad: ({ context: { queryClient } }) => {
    requireFeatureFlag("release-rules");
    requireEntitlement(queryClient, "rules");
    requireCanRead(queryClient, "rules");
  },
});
```

OR logic uses `requireAnyAbac` directly:

```ts
requireAnyAbac(queryClient,
  { action: "READ", area: "vulnerabilities" },
  { action: "READ", area: "exposures" },
);
```

## RouteErrorComponent

```tsx
// router.tsx
function RouteErrorComponent({ error }: { error: unknown }) {
  if (error instanceof FeatureFlagDisabledError) return <NotFoundPage />;
  if (error instanceof NotInPlanError)           return <NotInPlanPage feature={error.message} />;
  if (error instanceof AccessDeniedError)        return <AccessDeniedPage />;
  throw error; // unexpected — let the root error boundary handle it
}

const router = createRouter({
  routeTree,
  defaultErrorComponent: RouteErrorComponent,
  context: { queryClient },
});
```

All three pages render inside the existing layout. The nav rail stays. The user isn't ejected from the app shell.

## Why not `notFound()`?

TanStack Router's `notFound()` replaces the **entire page tree**, including the layout. Using it for access gates means the nav rail, sidebar, and app chrome all disappear — the user sees a blank page with an error message, with no way to navigate elsewhere. A typed error rendered by `RouteErrorComponent` renders within the shell and lets the user continue using the app.

## Prerequisite: permission data pre-fetched in the root

The guards synchronously read from the QueryClient cache. That only works if the session, plan, and permissions queries were already fetched before any child `beforeLoad` runs — i.e. in the root layout's `beforeLoad`:

```ts
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(sessionQueryOptions()),
      queryClient.ensureQueryData(planQueryOptions()),
      queryClient.ensureQueryData(permissionsQueryOptions()),
    ]);
  },
});
```

Once they're in cache, every child guard is a synchronous cache read — no async guards needed in leaf routes.

## Nav gate consistency

Every nav link hidden behind a flag or entitlement uses the same underlying check:

```ts
// nav config
{ label: "Rules",  path: "/rules",  hidden: !getFeatureFlag("release-rules") || !hasEntitlement("rules") }
```

If the nav hides a link, the route guard uses the same `requireFeatureFlag` + `requireEntitlement` pair. They can't drift because they call the same functions.
