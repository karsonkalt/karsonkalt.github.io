---
layout: post
title: "Notify pattern"
date: 2026-02-19 00:00:00 -0400
tags: [pattern]
description: "notify.toast / .confirm / .interrupt — imperative, promise-based, no prop drilling."
---

Three imperative notification APIs callable from anywhere — mutation handlers, route guards, error boundaries — without prop-drilling or React context. Each returns a Promise that resolves when the user acts. Outlets mount once in the app root and subscribe to a shared external store.

## API

```ts
// Non-blocking banner
notify.toast({ title, description?, variant?, action?, cancel? })
notify.toast.promise(promise, { loading, success, error? })

// Two-button dialog — resolves true (confirm) or false (cancel/close)
notify.confirm({ title, description, confirmLabel?, cancelLabel?, variant? }): Promise<boolean>

// Blocking acknowledgement — no cancel, must be dismissed
notify.interrupt({ title, description?, action, media? }): Promise<void>
```

## toast

```ts
notify.toast({ title: "Saved", variant: "success" });

// Error variant stays open until dismissed (duration: Infinity)
notify.toast({ title: "Failed", variant: "error", description: "Try again." });

// Promise variant — loading → success/error automatically
const promise = save(data);
notify.toast.promise(promise, { loading: "Saving…", success: "Saved!" });
// Omit error — default reads .toast off the rejection
```

## confirm

```ts
async function handleDelete(id: string) {
  const ok = await notify.confirm({
    title: "Delete item?",
    description: "This cannot be undone.",
    confirmLabel: "Delete",
    variant: "destructive",
  });
  if (!ok) return;
  notify.toast.promise(deleteItem(id), { loading: "Deleting…", success: "Deleted." });
}
```

## interrupt

No cancel path — the user must click the action button. Use for session expiry, required acknowledgements, gates that must be cleared before the app can continue.

```ts
await notify.interrupt({
  title:  "Session expired",
  action: "Sign in again",
});
redirectToLogin();
```

## createActionStore — how confirm and interrupt work

```ts
function createActionStore<TOptions, TResolve = void>(cancelValue?: TResolve) {
  let entry: { options: TOptions; resolve: (v: TResolve) => void } | null = null;
  const listeners = new Set<() => void>();

  return {
    trigger: (options: TOptions): Promise<TResolve> =>
      new Promise((resolve) => {
        if (entry) entry.resolve(cancelValue as TResolve); // cancel any pending
        entry = { options, resolve };
        for (const l of listeners) l();
      }),
    dismiss: (value: TResolve) => {
      if (!entry) return;
      entry.resolve(value);
      entry = null;
      for (const l of listeners) l();
    },
    subscribe:   (l: () => void) => { listeners.add(l); return () => listeners.delete(l); },
    getSnapshot: () => entry,
  };
}
```

The outlet uses `useSyncExternalStore(subscribe, getSnapshot)`. When `entry` is non-null it renders the dialog open; `dismiss()` sets it to null and resolves the Promise.

Options are kept in a `useRef` so the dialog content doesn't blank out during its close animation.

## Rules

- One outlet of each type in the app root. Multiples cause duplicate notifications.
- Omit `error` from `toast.promise` unless overriding copy — the default reads `.toast` off the rejection.
- Don't `await` before closing a modal. Fire the mutation, call `toast.promise`, close immediately.
- Only one `confirm` or `interrupt` can be pending at a time — `trigger()` cancels any existing one.
