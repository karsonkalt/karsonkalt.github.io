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

`htm` lets you write components as tagged template literals — no JSX, no transpilation step. The browser runs it directly.

The file ships with a small design system (CSS custom properties, utility classes, flex layout primitives) and six base components: `Box`, `Txt`, `Btn`, `Ghost`, `Nav`, `Pre`, `Field`. That's enough to build a real app shell. The default layout is `list → inspector` — sidebar on the left, detail pane on the right — but it's just a starting point.

## Why not just use a framework

I still use proper frameworks for real products. But I build a lot of one-off tools: a query viewer, a data diff explorer, a lightweight admin panel for a personal project. These don't need a monorepo. They don't need CI. They just need to work.

With mewmew I can go from nothing to a functioning UI in about ten minutes. When I'm done, the artifact is one file I can check in anywhere, share over Slack, or open on any machine without setup.

## Why it works as an AI starting point

This is the part I didn't expect to matter as much as it does.

When I hand the template to an AI agent and say "implement X on top of this," the constraints in the file act as a shared vocabulary. The comment block at the top is a literal spec:

- Every layout container is `<${Box}>`. Never a raw `<div>`.
- Token classes only. No inline colors.
- Buttons are `<${Btn}>` or `<${Ghost}>`.

The agent doesn't have to invent a component model. It doesn't drift toward some other CSS approach it saw in training. It follows the system that's already there.

I also added a `* suffix` convention — any class or component the agent introduces gets a `*` marker in a doc comment, so the next agent (or me) knows what's portable base system vs. what's specific to this project. That small discipline keeps the template reusable across projects.

## The tradeoff

No build step means no TypeScript, no tree-shaking, no bundled output. The `esm.sh` import requires a network connection the first time (it caches after). For anything that ships to real users or needs significant performance, this is the wrong tool.

But for internal tools, prototypes, and exploratory UIs — it's exactly right. The constraints aren't limitations. They're what make it fast.

The file is in my [notes](/notes) if you want to grab it.
