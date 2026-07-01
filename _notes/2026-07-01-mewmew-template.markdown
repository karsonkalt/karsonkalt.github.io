---
layout: post
title: "mew mew template"
date: 2026-07-01 00:00:00 -0400
tags: [snippet]
description: "A single-file Preact starter. No build step, no bundler — copy and go."
---

A lightweight base for single-file Preact apps. No install, no build step. Copy this file into a project directory, open it in a browser, start building.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>mew mew</title>
<style>

/*
 * mew mew design system — karsonkalt.dev
 *
 * A lightweight UI base for single-file Preact apps.
 * No build step. No bundler. Copy this file into a project and start building.
 *
 * STACK
 *   import { html, render, useState, useEffect } from 'https://esm.sh/htm/preact/standalone'
 *   All UI is written as tagged template literals — no JSX, no transpilation.
 *
 * TOKENS
 *   Three surface depths: --bg / --surface / --code-bg
 *   One border: --border
 *   Text: --text / --dim / --blue / --green / --red / --code
 *   Type: --f (13px base) / --ff (system-ui) / --ffm (monospace)
 *   Never hardcode colors or font sizes. Always var(--x).
 *
 * LAYOUT CLASSES
 *   .box .row     flex column / row (min-height:0 on both — safe for nested scroll)
 *   .f1           flex:1 + min-height:0
 *   .sc .cl       overflow auto / hidden
 *   .ac .jb       align-items:center / justify-content:space-between
 *   .bb .br       1px border-bottom / border-right
 *   .wrap         flex-wrap:wrap
 *   .rel          position:relative
 *   .fs0          flex-shrink:0
 *   gap: .g4 .g5 .g6 .g8 .g10 .g12 .g14 .g16 .g20 .g24
 *   pad: .p4 .p6 .p8 .p12 .p14 .p16 .p20 .p24
 *       .ph8 .ph12 .ph16 .ph20  (horizontal only)
 *       .pv8 .pv12              (vertical only)
 *
 * TYPE CLASSES
 *   .lg .sm .xs   15px·600 / 11px / 10px
 *   .bold .med    weight 600 / 500
 *   .dim .lnk     --dim color / --blue color
 *   .mono         monospace
 *   .tr           truncate with ellipsis (display:block)
 *   .caps         uppercase + letter-spacing
 *   .sub          11px dim line (display:block, mt:2px)
 *   .i            italic
 *   .ma           margin:auto
 *
 * BASE COMPONENTS (defined in <script> below)
 *   Box({ row,f1,sc,cl,ac,jb,bb,br,rel,fs0,wrap,gap,pad,flex,class,style,...rest })
 *     The only layout primitive. Never use a raw <div> for structure.
 *   Txt({ dim,lnk,mono,tr,sm,xs,bold,med,i,ma,class,style,...rest })
 *     Inline text with token modifiers.
 *   Btn({ primary,danger,disabled,onClick,style,children })
 *     primary → green fill. danger → red outline. default → surface.
 *   Ghost({ onClick,class,style,children })
 *     Inline text action button. Blue, no border.
 *   Nav({ on,onClick,children })
 *     Sidebar nav item. .on = active state (blue left border).
 *     Wrap children in .lbl-primary and .lbl-secondary spans.
 *   Pre({ code,style,children })
 *     Preformatted block. code=true applies monospace code styling.
 *   Field({ label,children })
 *     Label above, content below, 5px gap.
 *
 * RULES FOR THE NEXT AGENT
 *   This file is the base. Your job is to implement the application on top of it.
 *   The comment block above describes the system. The CSS and JS below are the artifact.
 *
 *   1. Use html`...` for all markup. No .jsx files, no createElement calls.
 *   2. Every layout container is <${Box}>. Never a raw <div> for structure.
 *   3. Token classes only. No inline colors, no hardcoded font sizes.
 *   4. Buttons are <${Btn}> or <${Ghost}>. No raw <button> with ad-hoc styles.
 *   5. Controlled inputs: always bind value + onInput.
 *      Every <option> must have an explicit value attribute.
 *   6. Keep state close to where it's used.
 *      Pass the setter down as a prop named "set".
 *   7. Fetch in useEffect. Swallow AbortError. Surface everything else.
 *   8. The .field / .lbl classes exist for form layout — use Field for all labeled inputs.
 *   9. Compose upward from these primitives. Do not redefine what's already here.
 *  10. Everything you add — classes, components, patterns — gets a * suffix in the
 *      doc comment of that file. This marks it as agent/user-authored, not base system.
 *      Keep the * inventory current. A future agent reads it to know what is portable
 *      (no *) vs what belongs to this project (* = do not carry forward blindly).
 *  11. Update the MODE block whenever the shape of the app changes. One line max.
 *
 * ── MODE (agent-maintained) ───────────────────────────────────────────────────
 *   Describe the layout pattern and interaction model of this implementation.
 *   Update this block whenever the shape of the app changes. Keep it to 3 lines max.
 *
 *   Patterns to pick from (or combine):
 *     list → inspector     sidebar list, detail pane opens on selection
 *     data-viz             chart-first layout, tables are secondary
 *     query viewer         input (sql/j1ql/filter) + result table below
 *     data dense           multi-column table, filters prominent, minimal chrome
 *     dashboard            metric cards + trend charts, read-only overview
 *     form / wizard        sequential input, validation, submit flow
 *     canvas               freeform spatial layout (graph, diagram, map)
 *
 *   current: not yet set — replace this line after first implementation pass
 */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
button, input, select, textarea { font: inherit }
button { appearance: none; -webkit-appearance: none; cursor: pointer }

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

html, body { height: 100%; overflow: hidden }
body { background: var(--bg); color: var(--text); font: var(--f)/1.5 var(--ff); display: flex; flex-direction: column }

/* layout */
.box { display: flex; flex-direction: column; min-height: 0; min-width: 0 }
.row { flex-direction: row }
.f1  { flex: 1; min-height: 0 }
.sc  { overflow: auto }
.cl  { overflow: hidden }
.ac  { align-items: center }
.jb  { justify-content: space-between }
.bb  { border-bottom: 1px solid var(--border) }
.br  { border-right:  1px solid var(--border) }
.rel { position: relative }
.fs0 { flex-shrink: 0 }
.wrap{ flex-wrap: wrap }

/* gap */
.g2{gap:2px}.g3{gap:3px}.g4{gap:4px}.g5{gap:5px}.g6{gap:6px}.g8{gap:8px}
.g10{gap:10px}.g12{gap:12px}.g14{gap:14px}.g16{gap:16px}.g20{gap:20px}.g24{gap:24px}

/* padding */
.p4{padding:4px}.p6{padding:6px}.p8{padding:8px}.p12{padding:12px}
.p14{padding:14px}.p16{padding:16px}.p20{padding:20px}.p24{padding:24px}
.ph8{padding-left:8px;padding-right:8px}
.ph12{padding-left:12px;padding-right:12px}
.ph16{padding-left:16px;padding-right:16px}
.ph20{padding-left:20px;padding-right:20px}
.pv8{padding-top:8px;padding-bottom:8px}
.pv12{padding-top:12px;padding-bottom:12px}

/* text */
.dim  { color: var(--dim) }
.lnk  { color: var(--blue) }
.mono { font-family: var(--ffm) }
.tr   { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block }
.lg   { font-size: 15px; font-weight: 600; line-height: 1.2 }
.sm   { font-size: 11px }
.xs   { font-size: 10px }
.bold { font-weight: 600 }
.med  { font-weight: 500 }
.i    { font-style: italic }
.ma   { margin: auto }
.caps { text-transform: uppercase; letter-spacing: .04em }
.sub  { display: block; font-size: 11px; margin-top: 2px; line-height: 1.3; color: var(--dim) }

/* buttons */
.btn       { background: #21262d; border: 1px solid var(--border); border-radius: 6px; padding: 5px 12px; cursor: pointer; color: var(--text); font-weight: 500 }
.btn:hover { background: #30363d }
.btn:disabled { opacity: .5; cursor: default }
.btn-p       { background: #238636; border-color: #2ea043; color: #fff }
.btn-p:hover { background: #2ea043 }
.btn-d       { background: transparent; border-color: rgba(248,81,73,.4); color: var(--red) }
.ghost       { background: none; border: none; color: var(--blue); cursor: pointer; padding: 2px 0; font-size: 12px }
.ghost:hover { opacity: .8 }

/* nav item */
.nav        { display: flex; align-items: flex-start; width: 100%; text-align: left; background: none; border: none; border-left: 2px solid transparent; padding: 9px 10px 9px 14px; border-radius: 0 6px 6px 0; cursor: pointer; color: var(--dim) }
.nav:hover  { background: var(--surface) }
.nav.on     { background: var(--surface); border-left-color: var(--blue); color: var(--text) }
.nav.on .lbl-primary { color: var(--text); font-weight: 500 }
.nav > div  { flex: 1; min-width: 0; overflow: hidden }
.lbl-primary   { color: var(--text); font-size: 13px; line-height: 1.4; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }
.lbl-secondary { color: var(--dim); font-size: 11px; font-family: var(--ffm); display: block; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap }

/* field / form */
.field { display: flex; flex-direction: column; gap: 5px }
.lbl   { font-size: 11px; font-weight: 600; color: var(--dim) }
input[type=text], input[type=date], input[type=number], select, textarea {
  background: var(--surface); border: 1px solid var(--border); border-radius: 6px;
  color: var(--text); padding: 4px 8px
}
input:focus, select:focus, textarea:focus { outline: 2px solid var(--blue); outline-offset: -1px }

/* pre */
.pre  { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 10px 12px; font-family: var(--ffm); font-size: 12px; color: var(--dim); white-space: pre-wrap; overflow-x: auto }
.pre.code { color: var(--code); background: var(--code-bg) }

/* table */
table { border-collapse: collapse; width: 100%; font-size: 12px }
th { text-align: left; padding: 5px 10px; color: var(--dim); font-weight: 500; border-bottom: 1px solid var(--border); white-space: nowrap }
td { padding: 4px 10px; border-bottom: 1px solid var(--border); font-family: var(--ffm); white-space: nowrap }
tr:last-child td { border-bottom: none }
</style>
</head>
<body>
<div id="app"></div>
<script type="module">
import { html, render, useState, useEffect } from 'https://esm.sh/htm/preact/standalone'

// ── layout lookup tables ───────────────────────────────────────────────────────
const G = {2:'g2',3:'g3',4:'g4',5:'g5',6:'g6',8:'g8',10:'g10',12:'g12',14:'g14',16:'g16',20:'g20',24:'g24'}
const P = {'4px':'p4','6px':'p6','8px':'p8','12px':'p12','14px':'p14','16px':'p16','20px':'p20','24px':'p24'}

// ── base components ───────────────────────────────────────────────────────────
function Box({ row,f1,sc,cl,ac,jb,bb,br,rel,fs0,wrap, gap,pad,flex, class:cx='', style:s={}, children, ...rest }) {
  const gc = G[gap], pc = P[pad]
  const style = { ...(gc?{}:{gap}), ...(pc?{}:{padding:pad}), flex, ...s }
  const c = ['box',row&&'row',f1&&'f1',sc&&'sc',cl&&'cl',ac&&'ac',jb&&'jb',bb&&'bb',br&&'br',rel&&'rel',fs0&&'fs0',wrap&&'wrap',gc,pc,cx].filter(Boolean).join(' ')
  return html`<div class=${c} style=${Object.keys(style).some(k=>style[k]!=null)?style:undefined} ...${rest}>${children}</div>`
}

function Txt({ dim,lnk,mono,tr,sm,xs,bold,med,i,ma, class:cx='', style:s={}, children, ...rest }) {
  const c = [dim&&'dim',lnk&&'lnk',mono&&'mono',tr&&'tr',sm&&'sm',xs&&'xs',bold&&'bold',med&&'med',i&&'i',ma&&'ma',cx].filter(Boolean).join(' ')
  return html`<span class=${c||undefined} style=${Object.keys(s).length?s:undefined} ...${rest}>${children}</span>`
}

const Btn = ({ primary,danger,disabled,onClick,style:s={},children }) =>
  html`<button class=${['btn',primary&&'btn-p',danger&&'btn-d'].filter(Boolean).join(' ')} disabled=${disabled} onClick=${onClick} style=${Object.keys(s).length?s:undefined}>${children}</button>`

const Ghost = ({ onClick,children,class:cx='',style:s={} }) =>
  html`<button class=${['ghost',cx].filter(Boolean).join(' ')} onClick=${onClick} style=${Object.keys(s).length?s:undefined}>${children}</button>`

const Nav = ({ on,onClick,children }) =>
  html`<button class=${on?'nav on':'nav'} onClick=${onClick}><div>${children}</div></button>`

const Pre = ({ code,style:s={},children }) =>
  html`<pre class=${code?'pre code':'pre'} style=${Object.keys(s).length?s:undefined}>${children}</pre>`

const Field = ({ label,children }) =>
  html`<div class="field"><span class="lbl">${label}</span>${children}</div>`

// ── app ───────────────────────────────────────────────────────────────────────
// Placeholders below show common structural zones. Delete what you don't need,
// rename what you do. The comments describe intent, not implementation.

// Topbar — app name, global actions, gear/settings toggle.
// Keep it ≤38px tall. One row only.
function Topbar() {
  return html`
    <${Box} row ac jb bb class="topbar" style=${{flexShrink:0,height:'38px',padding:'0 16px'}}>
      <${Txt} bold>app name</${Txt}>
      <${Box} row gap=${8}>
        <!-- global actions / toggles go here -->
      </${Box}>
    </${Box}>
  `
}

// Sidebar — nav list, section headers, search.
// Use <${Nav}> for items. .lbl-primary + .lbl-secondary for two-line labels.
function Sidebar({ selected, onSelect }) {
  const items = [] // replace with real data
  return html`
    <${Box} br sc class="nav-panel" style=${{width:'220px',flexShrink:0}}>
      <!-- section header example -->
      <${Box} row ac jb class="ph16 pv8 bb">
        <${Txt} sm bold dim>section</${Txt}>
        <${Ghost} onClick=${()=>{}}>+ new</${Ghost}>
      </${Box}>
      ${items.map(item => html`
        <${Nav} key=${item.id} on=${selected===item.id} onClick=${()=>onSelect(item.id)}>
          <span class="lbl-primary">${item.name}</span>
          <span class="lbl-secondary">${item.meta}</span>
        </${Nav}>
      `)}
    </${Box}>
  `
}

// Detail — main content area. Receives the selected item.
// Swap this out entirely depending on the mode (table, chart, form, etc).
function Detail({ item }) {
  if (!item) return html`<${Box} f1 ac style=${{justifyContent:'center'}}><${Txt} dim i>select something</${Txt}></${Box}>`
  return html`
    <${Box} f1 sc>
      <!-- detail header -->
      <${Box} row ac jb bb class="ph20 pv12" style=${{flexShrink:0}}>
        <${Box} gap=${2}>
          <${Txt} bold>${item.name}</${Txt}>
          <${Txt} dim sm>${item.meta}</${Txt}>
        </${Box}>
        <${Box} row gap=${6}>
          <${Btn} onClick=${()=>{}}>action</${Btn}>
          <${Btn} danger onClick=${()=>{}}>delete</${Btn}>
        </${Box}>
      </${Box}>
      <!-- body — replace with table / chart / form / etc -->
      <${Box} pad="20px" gap=${12}>
        <${Txt} dim i>content goes here</${Txt}>
      </${Box}>
    </${Box}>
  `
}

// Root app shell. Wires layout together.
// Replace the list→inspector pattern here with whatever MODE this becomes.
function App() {
  const [items]    = useState([]) // replace with fetch
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
</script>
</body>
</html>
```
