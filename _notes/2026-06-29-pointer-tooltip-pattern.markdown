---
layout: post
title: "PointerTooltip pattern"
date: 2026-06-18 00:00:00 -0400
tags: [pattern]
description: "Cursor tooltip via CSS custom props on :root — no React re-render per move, edge flip in pure CSS."
---

A cursor-following tooltip. Pointer position is tracked by writing `--live-pointer-x/y` to `:root` on every `pointermove` — CSS reads them directly, so the tooltip repositions on every move without triggering a React re-render. Visibility is a single boolean state. Edge flipping (right→left, above→below) is computed entirely in CSS using a `max/min * 9999` conditional.

For transient value readouts: chart cursors, hover annotations, info icons. Not for surfacing partial detail in list or table cells — that belongs in the inspect flow.

## Setup

Call once at app boot (idempotent):

```ts
function initLivePointer() {
  const root = document.documentElement;
  const writeViewport = () => {
    root.style.setProperty("--live-viewport-w", String(window.innerWidth));
    root.style.setProperty("--live-viewport-h", String(window.innerHeight));
  };
  writeViewport();
  window.addEventListener("resize", writeViewport, { passive: true });
  window.addEventListener("pointermove", (e) => {
    root.style.setProperty("--live-pointer-x", String(e.clientX));
    root.style.setProperty("--live-pointer-y", String(e.clientY));
  }, { passive: true });
}
```

## PointerTooltip — wrapper form

Manages open state and portals to `document.body` to stay clear of `aria-hidden` sweeps inside dialogs:

```tsx
<PointerTooltip content={<span>{value}</span>}>
  <button disabled aria-disabled="true">Hover me</button>
</PointerTooltip>
```

Disabled elements don't fire pointer events in most browsers. Wrap in a `<span>` to intercept:

```tsx
<PointerTooltip content="No permission to edit.">
  <span>
    <button disabled aria-disabled="true">Edit</button>
  </span>
</PointerTooltip>
```

## PointerTooltipContent — bare shell

For surfaces that control their own open state and live inside a `ModalBoundary` (chart overlays):

```tsx
<ModalBoundary className="relative h-64">
  <svg onPointerMove={handleMove} onPointerLeave={() => setHovered(false)}>
    {/* chart */}
  </svg>
  <PointerTooltipContent open={isHovered}>
    <div className="font-medium">{item.label}</div>
    <div className="text-xs text-muted">{format.number(item.value)}</div>
  </PointerTooltipContent>
</ModalBoundary>
```

## Edge flip — CSS only

Boundary coordinates come from `--bound-*` (set by `ModalBoundary`) or fall back to `--live-viewport-*`:

```
roomRight = max(0px, rightLimit - preferred)
finalX    = max(leftLimit, min(preferred, flipped + roomRight * 9999))
```

When `roomRight > 0`, the `* 9999` term dominates so `min()` picks `preferred` (right of cursor). When `roomRight = 0`, `min()` picks `flipped` (left of cursor). Same pattern on the Y axis.

## Mount strategy

The portal element mounts on first hover and **stays mounted**. An unmounted node can't run a CSS exit animation. `role="tooltip"` is set only while open, so screen readers and `queryByRole("tooltip")` only see it when visible.

## Info icon pattern

```tsx
<PointerTooltip
  content={<div className="max-w-xs text-xs">Calculated over the last 30 days.</div>}
>
  <InfoIcon className="size-4 text-muted cursor-default" />
</PointerTooltip>
```
