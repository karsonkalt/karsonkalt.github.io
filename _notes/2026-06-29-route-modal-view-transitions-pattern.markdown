---
layout: post
title: "Route-modal + view transitions"
date: 2026-03-20 00:00:00 -0400
tags: [pattern]
description: "Modals are child routes. Close = history.back(). Exit animation via View Transition API."
---

Modals and sheets are child routes, not React state. Opening a dialog navigates to a child URL. The parent renders `<Outlet />` which mounts the modal. Closing navigates back. The router fires the View Transition API on every navigation, so entry/exit animations are CSS pseudos rather than in-component logic.

## Why routes

- Deep-linkable by default — share or reload and the modal reopens.
- Back button closes the modal; forward reopens it.
- No open-state to manage — `open` is always `true` in the route component.
- Exit animation is free — without routes an unmounted component can't animate out.

## File layout

```
views/items/
  _list.tsx          ← parent layout (renders <Outlet />)
  _list/
    new.tsx          ← modal route (always open)
    $itemId.edit.tsx
```

`_list.tsx` is a layout route — its `beforeLoad` runs for every nested path. A bare redirect must be `_list.index.tsx`, not `_list.tsx`, or it intercepts the children.

## Parent

```tsx
function ItemsPage() {
  return (
    <Page>
      <Link to="/items/new"><Button>Add item</Button></Link>
      <ItemsTable />
      <Outlet />
    </Page>
  );
}
```

## Modal route

```tsx
function NewItemModal() {
  const router = useRouter();
  return (
    <CreateItemDialog
      open
      onOpenChange={(open) => { if (!open) router.history.back(); }}
    />
  );
}
```

`router.history.back()` is the only correct close. `navigate({ to: ".." })` creates a new history entry, breaking the forward/back stack and losing parent search params.

## Passing context via search params

```tsx
export const Route = createFileRoute("/items/_list/new")({
  validateSearch: z.object({ template: z.string().catch("") }),
  component: NewItemModal,
});

// Caller
<Link to="/items/new" search={{ template: "api-key" }}>Add API key</Link>
```

## Search-param only navigation

When updating filters or panels without mounting/unmounting anything, skip the view transition:

```ts
navigate({
  search: (prev) => ({ ...prev, filter: "active" }),
  state: true,        // skip VT — no DOM structure change
  resetScroll: false, // don't jump to top
});
```

## View Transition exit CSS

```css
/* Suppress root cross-fade — only named elements animate */
::view-transition-old(root),
::view-transition-new(root) { animation: none; }

/* Dialog unmounts on navigate — VT handles the exit */
[data-slot="modal"] { view-transition-name: dialog-content; }
::view-transition-old(dialog-content) { /* fade-out + zoom-out-95 */ }
::view-transition-new(dialog-content) { animation: none; }

/* Sheet stays mounted (Radix needs data-[state=closed]) */
[data-slot="sheet-content"] { view-transition-name: sheet-content; }
::view-transition-old(sheet-content) { /* slide-out-to-right */ }
::view-transition-new(sheet-content) { animation: none; opacity: 0; }
```

VT snapshots the old DOM, swaps it, then animates the snapshot. `opacity: 0` on `::view-transition-new` hides the live closing state so only the snapshot plays. For Escape/backdrop closes, VT doesn't fire and the library handles exit alone.

## Adding a new overlay

1. Give its root a `data-slot` attribute.
2. Assign `view-transition-name` via CSS.
3. Add `::view-transition-old` with the exit animation.
4. Set `::view-transition-new { animation: none; }`.
