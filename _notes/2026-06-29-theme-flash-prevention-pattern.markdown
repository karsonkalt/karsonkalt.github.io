---
layout: post
title: "Theme flash prevention"
date: 2026-02-10 00:00:00 -0400
tags: [pattern]
description: "Inline script sets .dark before first paint. .theme-switching kills all transitions for two rAF frames."
---

Two cooperating pieces. An inline `<script>` in the HTML shell reads the stored preference and adds `.dark` to `<html>` synchronously before any CSS or JS module loads. A `.theme-switching` class disables all transitions for exactly two animation frames when toggled at runtime.

## No flash on load

```html
<!-- Must be inline, not type="module" — modules are deferred -->
<script>
  try {
    var p = JSON.parse(localStorage.getItem("user-preferences") ?? "{}");
    if (p.theme === "dark" || (!p.theme && matchMedia("(prefers-color-scheme: dark)").matches))
      document.documentElement.classList.add("dark");
  } catch {}
</script>
```

`type="module"` scripts are deferred and run after first paint. A classic inline script runs as the parser hits it — `.dark` is on `<html>` before the browser lays out a single pixel.

## No transition flash on switch

```css
html.theme-switching,
html.theme-switching *,
html.theme-switching *::before,
html.theme-switching *::after {
  transition-duration: 0s !important;
}
```

```ts
function applyTheme(dark: boolean) {
  document.documentElement.classList.add("theme-switching");
  document.documentElement.classList.toggle("dark", dark);
  // Frame 1: class applied, transitions suppressed, browser paints instantly.
  // Frame 2: transitions re-enabled, hover/focus effects resume.
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      document.documentElement.classList.remove("theme-switching")
    )
  );
}
```

**Why two rAFs and not one:** a single `rAF` fires before the browser paints the frame in which `.theme-switching` was added — transitions haven't been suppressed for that paint yet. The second `rAF` ensures suppression is in effect for the actual repaint. Collapsing to one breaks it in Chrome.

**Why `.theme-switching` and not `.dark`:** `.dark` is permanent for the entire dark-mode session. Suppressing transitions on `.dark` would kill hover and focus effects globally. `.theme-switching` is ephemeral — two frames, gone.

## OS theme change

```ts
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (!storedThemeOverride()) applyTheme(/* system dark */);
});
```

Only fires when the user's preference is "system". Goes through the same `applyTheme` path so the two-rAF suppression applies.
