---
layout: post
title: "Query waterfall profiler"
date: 2026-06-30 00:00:00 -0400
tags: [pattern]
description: "Subscribe to QueryCache events, cluster by start-time, expose on window. Zero component instrumentation."
---

A dev-only module that subscribes to `QueryCache` events and groups fetches into waterfall phases. Each phase is a cluster of queries that started within 50ms of each other. Multiple phases mean sequential Suspense waterfalls — the profiler tells you exactly where `beforeLoad` prefetches are missing.

No instrumentation in components. No wrapper hooks. Zero production overhead.

## Core

```ts
type TimingEntry = {
  queryKey: readonly unknown[];
  startedAt: number;
  settledAt?: number;
  status: "pending" | "success" | "error";
};

type WaterfallGroup = {
  startedAt: number;
  entries: TimingEntry[];
};

const GROUP_GAP_MS = 50;

function buildWaterfallGroups(entries: TimingEntry[]): WaterfallGroup[] {
  const sorted = [...entries].sort((a, b) => a.startedAt - b.startedAt);
  const groups: WaterfallGroup[] = [];

  for (const entry of sorted) {
    const last = groups[groups.length - 1];
    const lastStart = last?.entries.at(-1)?.startedAt ?? -Infinity;

    if (!last || entry.startedAt - lastStart > GROUP_GAP_MS) {
      groups.push({ startedAt: entry.startedAt, entries: [entry] });
    } else {
      last.entries.push(entry);
    }
  }
  return groups;
}
```

## Initialization

Subscribe to the `QueryCache` observer once, before the first route loads:

```ts
function initQueryTiming(client: QueryClient) {
  const entries = new Map<string, TimingEntry>();

  client.getQueryCache().subscribe((event) => {
    const key = JSON.stringify(event.query.queryKey);

    if (event.type === "observerResultsUpdated") {
      if (event.query.state.fetchStatus === "fetching") {
        entries.set(key, { queryKey: event.query.queryKey, startedAt: Date.now(), status: "pending" });
      } else {
        const entry = entries.get(key);
        if (entry?.status === "pending") {
          entry.settledAt = Date.now();
          entry.status = event.query.state.status === "error" ? "error" : "success";
        }
      }
    }
  });

  window.__QUERY_TIMING = {
    snapshot: () => buildWaterfallGroups([...entries.values()]),
    clear:    () => entries.clear(),
  };
}
```

## Triggering from a script

The profiler activates via a localStorage flag — set it before navigating so recording begins from the first cache event:

```ts
// pnpm measure script (Node, runs in a Playwright context)
await page.evaluate(() => localStorage.setItem("__QUERY_TIMING_AUTO_RECORD", "true"));
await page.goto(route);
await page.waitForLoadState("networkidle");
const groups = await page.evaluate(() => window.__QUERY_TIMING.snapshot());

console.log(`${groups.length} waterfall phase(s)`);
for (const [i, g] of groups.entries()) {
  const dur = Math.max(...g.entries.map(e => (e.settledAt ?? Date.now()) - e.startedAt));
  console.log(`  Phase ${i + 1}: ${g.entries.length} queries, ${dur}ms`);
  for (const e of g.entries) console.log(`    ${JSON.stringify(e.queryKey)}`);
}
```

In `queryClient.ts`, check the flag synchronously:

```ts
if (import.meta.env.DEV && localStorage.getItem("__QUERY_TIMING_AUTO_RECORD")) {
  initQueryTiming(queryClient);
}
```

## Reading the output

```
3 waterfall phase(s)
  Phase 1: 2 queries, 120ms
    ["session"]
    ["user","me"]
  Phase 2: 1 queries, 340ms
    ["dashboard","overview"]
  Phase 3: 3 queries, 80ms
    ["widgets",{"dashboardId":"d1"}]
    ["widgets",{"dashboardId":"d1"},"counts"]
    ["user-preferences"]
```

3 phases = 2 avoidable Suspense cascades. Phase 2 fired after phase 1 settled because its component was inside a Suspense boundary and the query wasn't prefetched in `beforeLoad`. Move it to `beforeLoad` → phases collapse to 1.

## Rules

- 50ms gap constant is the only magic number. Tune to your network latency.
- Never run in production — guard with `import.meta.env.DEV`.
- Only `snapshot()` and `clear()` need to be on `window` — don't expose the raw entries map.
- One phase is ideal. Two is acceptable. Three or more is always worth fixing.
