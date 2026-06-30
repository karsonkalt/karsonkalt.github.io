---
layout: post
title: "ModalBoundary pattern"
date: 2026-06-09 00:00:00 -0400
tags: [pattern]
description: "Scoped portal target that exposes --bound-x/y/w/h CSS vars for CSS-only tooltip edge clamping."
---

A `div` that serves as both a **portal target** and a **coordinate anchor**. Overlays portal into the nearest boundary so they cover that region but not adjacent regions. The boundary exposes its bounding rect as CSS custom properties so cursor-following tooltips can do edge-flip math in pure CSS without JS re-measuring on every pointer move.

## API

```tsx
// Marks a layout region as an overlay target
<ModalBoundary className="...">
  {children}
</ModalBoundary>

// Read the boundary's DOM node for createPortal / library container prop
const boundary = useModalBoundary(); // HTMLElement | null
```

## Implementation

```ts
const Context = createContext<HTMLElement | null>(null);

function ModalBoundary({ className, children, ...props }) {
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const write = () => {
      const r = node.getBoundingClientRect();
      node.style.setProperty("--bound-x", String(r.left));
      node.style.setProperty("--bound-y", String(r.top));
      node.style.setProperty("--bound-w", String(r.width));
      node.style.setProperty("--bound-h", String(r.height));
    };
    write();
    const ro = new ResizeObserver(write);
    ro.observe(node);
    window.addEventListener("scroll", write, { passive: true });
    window.addEventListener("resize", write, { passive: true });
    return () => { ro.disconnect(); /* remove listeners */ };
  }, [node]);

  return (
    <div ref={setNode} className={cn("relative", className)} {...props}>
      <Context.Provider value={node}>{children}</Context.Provider>
    </div>
  );
}
```

The `--bound-*` vars are set on the boundary node itself, not `:root` — they're scoped to the subtree and don't leak across regions.

## When to use

Wrap any region whose overlays should cover that region but not its neighbors. A chat sidebar sitting next to the main content area should have its own boundary — a drawer opened inside the main area must not cover the sidebar.

```tsx
function AppLayout() {
  return (
    <div className="flex h-screen">
      <ModalBoundary className="flex-1 overflow-hidden">
        <MainContent />   {/* drawers, sheets portal here */}
      </ModalBoundary>
      <ModalBoundary className="w-96 border-l">
        <SidePanel />     {/* its own overlay scope */}
      </ModalBoundary>
    </div>
  );
}
```

## Portaling into the boundary

```tsx
function MySheet({ children }) {
  const boundary = useModalBoundary();
  return (
    <Dialog.Portal container={boundary ?? document.body}>
      {children}
    </Dialog.Portal>
  );
}
```

Fall back to `document.body` when `boundary` is null — no boundary in scope means Storybook or a test environment.

## Rules

- `position: relative` is baked in — don't remove it; `position: absolute` overlays use it as their containing block.
- `--bound-*` vars feed PointerTooltip's CSS edge-flip math. Without a boundary in scope the tooltip falls back to `--live-viewport-w/h`.
