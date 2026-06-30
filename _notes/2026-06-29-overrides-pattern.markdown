---
layout: post
title: "Overrides pattern"
date: 2026-03-30 00:00:00 -0400
tags: [pattern]
description: "createOverrideStore<V> — guarded localStorage key-value store, reactive via useSyncExternalStore."
---

A generic observable key-value store for runtime toggles — feature flags, permission overrides, locale settings — that must be changeable without a deploy. Each store is isolated per domain, guarded by a build-context predicate, optionally persisted to localStorage, and reactive via `useSyncExternalStore`.

## API

```ts
const store = createOverrideStore<boolean>({
  guard:      () => isDev,           // writes no-op in prod
  storageKey: "app:my-overrides",    // opt-in persistence
  name:       "my-overrides",        // opt-in DevTools registration
});

store.set(key, value)    // write (checked by guard)
store.get(key)           // V | undefined
store.getAll()           // ReadonlyMap<string, V>
store.remove(key)
store.clear()
store.version()          // monotonic int — snapshot for useSyncExternalStore
store.subscribe(cb)      // returns unsubscribe
```

## Implementation

```ts
function createOverrideStore<V>(opts?: {
  guard?: () => boolean;
  storageKey?: string;
}): OverrideStore<V> {
  const map = new Map<string, V>();
  const subscribers = new Set<() => void>();
  let ver = 0;

  // Hydrate synchronously so overrides exist before first render
  if (opts?.storageKey) {
    try {
      const raw = localStorage.getItem(opts.storageKey);
      if (raw) for (const [k, v] of JSON.parse(raw)) map.set(k, v);
    } catch {}
  }

  const allowed = () => opts?.guard ? opts.guard() : true;
  const notify  = () => { for (const cb of subscribers) cb(); };
  const persist = () => {
    if (!opts?.storageKey) return;
    map.size === 0
      ? localStorage.removeItem(opts.storageKey)
      : localStorage.setItem(opts.storageKey, JSON.stringify([...map]));
  };

  return {
    set(k, v)     { if (!allowed()) return; map.set(k, v); ver++; persist(); notify(); },
    remove(k)     { if (!allowed()) return; if (map.delete(k)) { ver++; persist(); notify(); } },
    clear()       { if (!allowed()) return; if (map.size) { map.clear(); ver++; persist(); notify(); } },
    get(k)        { return map.get(k); },
    getAll()      { return map; },
    version()     { return ver; },
    subscribe(cb) { subscribers.add(cb); return () => subscribers.delete(cb); },
  };
}
```

## Imperative usage

Check the override first — it wins unconditionally:

```ts
const permOverrides = createOverrideStore<boolean>({ guard: () => isDev });

function canEdit(userId: string): boolean {
  const ov = permOverrides.get(`edit:${userId}`);
  if (ov !== undefined) return ov;
  return evaluateRealPermission(userId);
}
```

## Reactive usage

`version()` is a monotonic counter — safe as a `useSyncExternalStore` snapshot:

```ts
function usePermission(key: string) {
  const _ver = useSyncExternalStore(
    (cb) => permOverrides.subscribe(cb),
    ()   => permOverrides.version(),
  );

  return useMemo(() => {
    const ov = permOverrides.get(key);
    return ov !== undefined ? ov : evaluateRealPermission(key);
  }, [key, _ver]);
}
```

## Rules

- One store per domain area. Never mix permission and flag overrides.
- Always guard. A missing guard means prod users can write overrides.
- Override check comes first in every evaluator — override wins unconditionally.
- `version()` as the snapshot, not entry count — a value update without a size change would skip the re-render.
