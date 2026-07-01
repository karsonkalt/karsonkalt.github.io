---
layout: post
title: "mew mew template"
date: 2026-07-01 00:00:00 -0400
tags: [snippet]
description: "A single-file Preact starter. No build step, no bundler — copy and go."
---

A lightweight base for single-file Preact apps. Drop it in a project directory, open it in a browser, start building.

**Stack:** `htm/preact/standalone` via `esm.sh` — tagged template literals, no JSX, no transpilation.

```html
<script type="module">
import { html, render, useState, useEffect } from 'https://esm.sh/htm/preact/standalone'
```

## Design tokens

```css
:root {
  --bg:      #0d1117;
  --surface: #161b22;
  --code-bg: #0a0d12;
  --border:  #30363d;
  --text:    #e6edf3;
  --dim:     #8b949e;
  --blue:    #58a6ff;
  --green:   #3fb950;
  --red:     #f85149;
  --code:    #79c0ff;
  --f:       13px;
  --ff:      system-ui, sans-serif;
  --ffm:     ui-monospace, monospace;
}
```

Never hardcode colors or font sizes. Always `var(--x)`.

## Layout primitives

| Class | Meaning |
|---|---|
| `.box` | `flex-direction: column`, `min-height: 0` |
| `.row` | `flex-direction: row` |
| `.f1` | `flex: 1`, `min-height: 0` |
| `.sc` / `.cl` | `overflow: auto` / `overflow: hidden` |
| `.ac` / `.jb` | `align-items: center` / `justify-content: space-between` |
| `.bb` / `.br` | 1px border-bottom / border-right |
| `.g4`…`.g24` | gap utilities |
| `.p4`…`.p24` | padding utilities |

## Base components

```js
Box({ row,f1,sc,cl,ac,jb,bb,br,rel,fs0,wrap,gap,pad,flex,class,style,...rest })
Txt({ dim,lnk,mono,tr,sm,xs,bold,med,i,ma,class,style,...rest })
Btn({ primary,danger,disabled,onClick,style,children })
Ghost({ onClick,class,style,children })
Nav({ on,onClick,children })       // sidebar nav item; .lbl-primary + .lbl-secondary inside
Pre({ code,style,children })
Field({ label,children })
```

`Box` is the only layout primitive. Never use a raw `<div>` for structure.

## Shell skeleton

```js
function App() {
  const [items]    = useState([])
  const [selected, setSelected] = useState(null)
  const item = items.find(i => i.id === selected) ?? null

  return html`
    <${Box} f1>
      <${Topbar}/>
      <${Box} row f1 cl>
        <${Sidebar} selected=${selected} onSelect=${setSelected}/>
        <${Detail} item=${item}/>
      </${Box}>
    </${Box}>
  `
}
render(html`<${App}/>`, document.getElementById('app'))
```

Default pattern: `list → inspector`. Swap `Detail` for whatever mode the app needs — table, form, chart, query viewer.

## Rules

1. `html\`...\`` for all markup. No `.jsx`, no `createElement`.
2. Every layout container is `<${Box}>`.
3. Token classes only — no inline colors, no hardcoded font sizes.
4. Buttons are `<${Btn}>` or `<${Ghost}>`.
5. Controlled inputs: always bind `value` + `onInput`. Every `<option>` needs an explicit `value`.
6. Keep state close to where it's used. Pass the setter down as a prop named `set`.
7. Fetch in `useEffect`. Swallow `AbortError`. Surface everything else.
8. Use `<${Field}>` for all labeled inputs.
9. Mark agent/user-added symbols with a `*` suffix in comments so the next agent knows what's portable vs. project-specific.
