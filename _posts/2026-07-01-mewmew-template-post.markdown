---
layout: post
title: "mew mew — a single-file Preact starter"
date: 2026-07-01 00:00:00 -0400
description: "Why I keep coming back to a 330-line HTML file instead of scaffolding a new project."
---

Most of my internal tools start the same way: I need a UI, I need it fast, and I do not want to spend the first hour on config.

The usual options are bad. Scaffold a Vite + React project and you get a `node_modules` directory before you've written a line of product code. Use a CDN script tag and you lose component model. Copy a previous project and you inherit its decisions.

I wanted something I could drop in a directory and open in a browser. No install, no build, no dependencies on disk. Just a file.

## What it is

`mewmew.html` is a ~330-line single-file starter for Preact apps. It imports from `esm.sh` at runtime:

```html
<script type="module">
import { html, render, useState, useEffect } from 'https://esm.sh/htm/preact/standalone'
```

`htm` lets you write components as tagged template literals — no JSX, no transpilation. The browser runs it directly.

The file ships with a small design system (CSS custom properties, utility classes, flex layout primitives) and seven base components: `Box`, `Txt`, `Btn`, `Ghost`, `Nav`, `Pre`, `Field`. The default shell is `list → inspector` — sidebar left, detail pane right.

## Built for agents

The template has a MODE block that the agent is required to fill in before writing any product code:

```
 * ── MODE (agent-maintained) ──────────────────────────────
 *   current: not yet set — replace this line after first implementation pass
 *
 *   Patterns to pick from (or combine):
 *     list → inspector     sidebar list, detail pane opens on selection
 *     data-viz             chart-first layout, tables are secondary
 *     query viewer         input (sql/j1ql/filter) + result table below
 *     data dense           multi-column table, filters prominent, minimal chrome
 *     dashboard            metric cards + trend charts, read-only overview
 *     form / wizard        sequential input, validation, submit flow
 *     canvas               freeform spatial layout (graph, diagram, map)
```

The agent can't skip this. Before touching the app shell it has to name the layout pattern — which forces the right questions up front: what is the primary view, what is the user doing, what's the interaction model. That decision lives in the file, updated as the app evolves, so a later agent can read the current state without reverse-engineering it.

The `*` suffix convention does the same thing for components: anything added by an agent or user gets a `*` marker in the doc comment. A future agent reads the inventory and immediately knows what's portable base system vs. what's project-specific.

## In practice

The GIF below is the historian workbench — a query tool I built on top of this template to explore time-series graph snapshots.

![historian workbench]({{ site.baseurl }}/assets/img/historian-workbench.gif)

That app is ~1000 lines in a single file. No bundler, no build step. The full mewmew base is in my [notes](/notes) if you want to copy it.

## The tradeoff

No build step means no TypeScript, no tree-shaking, no bundled output. The `esm.sh` import needs a network connection the first time. For anything that ships to real users or needs significant scale, this is the wrong tool.

For internal tools, prototypes, and exploratory UIs it's right. The constraints aren't limitations — they're what make it fast.
