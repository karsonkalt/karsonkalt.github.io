---
layout: post
title: "Typed route path union"
date: 2026-05-05 00:00:00 -0400
tags: [pattern]
description: "Derive AppRoutePath from the generated route tree — one type alias, zero maintenance, compile-time enforcement."
---

One type alias derived from the router's generated output. Every nav config, tab mapping, crosslink, and URL-generating utility is typed against the real route tree. Rename or delete a route and every stale reference becomes a compile error.

## The alias

```ts
// artifacts/app/src/routePaths.ts
export type AppRoutePath = FileRouteTypes["to"];
```

`FileRouteTypes` is populated by TanStack Router's code generator via module augmentation on `@tanstack/react-router`. Run the generator; the type updates. No maintenance required.

The resulting union looks like:

```ts
type AppRoutePath =
  | "/rules"
  | "/rules/$ruleId"
  | "/rules/$ruleId/alerts"
  | "/controls/controls/$controlId"
  | "/vulnerabilities"
  | ... // every registered route
```

## Usage

Use `AppRoutePath` anywhere a route path string appears:

```ts
// Nav config
type NavItem = { label: string; path: AppRoutePath };

// Tab route mapping
const TABS: Record<string, AppRoutePath> = {
  overview:  "/controls/controls/$controlId",
  evidence:  "/controls/controls/$controlId/evidence",
};

// Crosslink helpers
function buildLink(to: AppRoutePath, params: Record<string, string>): string { ... }
```

When `/controls/controls/$controlId` is renamed to `/controls/$controlId`, every `NavItem`, tab mapping, and crosslink that referenced the old string fails at `tsc`, not at runtime.

## Exemptions

Fields that point outside the SPA (legacy app routes, third-party URLs) use `string` explicitly and are annotated:

```ts
type NavItem = {
  path:       AppRoutePath;  // SPA route, enforced
  legacyPath: string;        // legacy app, exempt
};
```

## Why not just use the router's `<Link to="...">` inference?

`<Link to>` is enforced at the component boundary. `AppRoutePath` enforces the shape in data structures — nav arrays, lookup maps, utility functions — that don't go through a JSX element. Both are necessary; they cover different surfaces.
