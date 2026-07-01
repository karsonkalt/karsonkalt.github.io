---
layout: post
title: "mew mew template"
date: 2026-07-01 00:00:00 -0400
tags: [snippet]
description: "A single-file Preact starter. No build step, no bundler — copy and go."
---

A lightweight base for single-file Preact apps. No install, no build step. Copy this file into a project directory, open it in a browser, start building.

The default view is a live demo — tokens, layout reference, components, and five mode skeletons to copy. Replace `App()` and everything below it on your first pass.

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
 *   This file is the base. Pick a MODE skeleton below, replace App() and all
 *   placeholder components with your implementation, then delete the unused
 *   MODE skeletons and this instruction block.
 *
 *   0. THEME FIRST — before writing any code, ask the user:
 *      "What's the vibe? Dark (default), light, or something specific —
 *       a color, a mood, a brand palette?"
 *      Then update the :root token block to match before anything else.
 *      The defaults are a dark GitHub-style palette — good baseline but totally
 *      replaceable. Common directions: warm dark (amber/sand), light neutral,
 *      high-contrast, a brand color as --blue/--green accent.
 *      Keep the token names the same; only change the values.
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
 *  11. Update the MODE line in the header comment whenever the shape changes.
 *
 * ── MODE (agent-maintained) ───────────────────────────────────────────────────
 *   current: demo — mew mew component showcase
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

// ── demo app ──────────────────────────────────────────────────────────────────
// This is the default template. It demonstrates mew mew's tokens, layout
// system, and components. Replace everything below App() on your first pass.

const SECTIONS = [
  { id: 'overview',    name: 'Overview',    meta: 'what & why' },
  { id: 'tokens',      name: 'Tokens',      meta: 'colors · type · surfaces' },
  { id: 'layout',      name: 'Layout',      meta: 'Box · gap · pad · flex' },
  { id: 'components',  name: 'Components',  meta: 'Btn · Ghost · Nav · Field · Pre' },
  { id: 'modes',       name: 'Modes',       meta: 'skeleton templates' },
]

function Topbar({ section, onSection }) {
  return html`
    <${Box} row ac jb bb style=${{flexShrink:0,height:'38px',padding:'0 16px'}}>
      <${Box} row ac gap=${10}>
        <${Txt} bold>mew mew</${Txt}>
        <${Txt} dim sm>design system</${Txt}>
      </${Box}>
      <${Box} row gap=${8}>
        ${SECTIONS.map(s => html`
          <${Ghost} key=${s.id} onClick=${()=>onSection(s.id)}
            style=${{color: section===s.id ? 'var(--text)' : 'var(--dim)', fontWeight: section===s.id?600:400}}>
            ${s.name}
          </${Ghost}>
        `)}
      </${Box}>
    </${Box}>
  `
}

// ── section: overview ────────────────────────────────────────────────────────
function SectionOverview() {
  return html`
    <${Box} sc f1 pad="32px" gap=${24} style=${{maxWidth:'680px',margin:'0 auto',width:'100%'}}>
      <${Box} gap=${8}>
        <${Txt} class="lg">mew mew</${Txt}>
        <${Txt} dim>A lightweight UI base for single-file Preact apps. No build step. No bundler.</${Txt}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Stack</${Txt}>
        <${Pre} code>${`import { html, render, useState, useEffect }
  from 'https://esm.sh/htm/preact/standalone'`}</${Pre}>
        <${Txt} dim sm>All UI is tagged template literals — no JSX, no transpilation. Copy the file, open in a browser, start building.</${Txt}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>How to use</${Txt}>
        <${Box} gap=${8}>
          ${[
            ['1', 'Copy mewmew.html into your project.'],
            ['2', 'Pick a MODE skeleton from the Modes section.'],
            ['3', 'Replace App() and the placeholder components with your implementation.'],
            ['4', 'Delete unused MODE skeletons and this demo section.'],
            ['5', 'Update the MODE line in the header comment.'],
          ].map(([n,t]) => html`
            <${Box} row gap=${10} ac key=${n}>
              <span style=${{width:'18px',height:'18px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',color:'var(--dim)',flexShrink:0}}>${n}</span>
              <${Txt} sm>${t}</${Txt}>
            </${Box}>
          `)}
        </${Box}>
      </${Box}>

      <${Box} gap=${8}>
        <${Txt} bold>Conventions</${Txt}>
        <table>
          <tbody>
            ${[
              ['Layout',    'Always Box. Never a raw div for structure.'],
              ['Text',      'Always Txt. Token modifiers (dim, sm, bold…) as boolean props.'],
              ['Buttons',   'Btn or Ghost. No raw button with ad-hoc styles.'],
              ['Colors',    'var(--x) only. Never hardcode hex.'],
              ['State',     'Keep close to where it\'s used. Pass setter as prop named "set".'],
              ['Fetch',     'useEffect. Swallow AbortError. Surface everything else.'],
              ['New code',  'Add * suffix to doc entries. Marks agent-authored vs portable base.'],
            ].map(([k,v]) => html`
              <tr key=${k}>
                <td style=${{width:'100px',color:'var(--dim)'}}>${k}</td>
                <td>${v}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </${Box}>
    </${Box}>
  `
}

// ── section: tokens ──────────────────────────────────────────────────────────
function SectionTokens() {
  const colors = [
    ['--bg',      '#0d1117', 'Page background'],
    ['--surface', '#161b22', 'Cards, panels, inputs'],
    ['--code-bg', '#0a0d12', 'Code blocks'],
    ['--border',  '#30363d', 'All borders'],
    ['--text',    '#e6edf3', 'Primary text'],
    ['--dim',     '#8b949e', 'Secondary / muted text'],
    ['--blue',    '#58a6ff', 'Links, active states, focus'],
    ['--green',   '#3fb950', 'Primary actions, success'],
    ['--red',     '#f85149', 'Destructive actions, errors'],
    ['--code',    '#79c0ff', 'Code text'],
  ]
  const typeTokens = [
    ['--f',   '13px',           'Base body size'],
    ['--ff',  'system-ui',      'Body typeface'],
    ['--ffm', 'ui-monospace',   'Monospace typeface'],
  ]
  const typeClasses = [
    ['.lg',    '15px / 600', 'Headings, labels'],
    ['.sm',    '11px',       'Secondary text, meta'],
    ['.xs',    '10px',       'Timestamps, codes'],
    ['.bold',  '600',        'Weight emphasis'],
    ['.med',   '500',        'Soft emphasis'],
    ['.dim',   'var(--dim)', 'Muted text'],
    ['.lnk',   'var(--blue)','Link / action text'],
    ['.mono',  '--ffm',      'Inline code'],
    ['.caps',  'uppercase',  'Label caps'],
    ['.tr',    'truncate',   'Ellipsis overflow'],
    ['.sub',   '11px dim',   'Subscript line'],
  ]

  return html`
    <${Box} sc f1 pad="32px" gap=${24} style=${{maxWidth:'760px',margin:'0 auto',width:'100%'}}>

      <${Box} gap=${12}>
        <${Txt} bold>Color tokens</${Txt}>
        <${Box} gap=${6}>
          ${colors.map(([name, val, desc]) => html`
            <${Box} row ac gap=${12} key=${name}>
              <div style=${{width:'32px',height:'32px',background:`var(${name})`,border:'1px solid var(--border)',borderRadius:'6px',flexShrink:0}}></div>
              <${Txt} mono sm style=${{width:'90px',flexShrink:0,color:'var(--code)'}}>${name}</${Txt}>
              <${Txt} mono sm dim style=${{width:'72px',flexShrink:0}}>${val}</${Txt}>
              <${Txt} sm dim>${desc}</${Txt}>
            </${Box}>
          `)}
        </${Box}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Type tokens</${Txt}>
        <table>
          <thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead>
          <tbody>
            ${typeTokens.map(([k,v,d]) => html`<tr key=${k}><td class="mono" style=${{color:'var(--code)'}}>${k}</td><td class="mono">${v}</td><td class="dim">${d}</td></tr>`)}
          </tbody>
        </table>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Type classes</${Txt}>
        <table>
          <thead><tr><th>Class</th><th>Value</th><th>Use</th></tr></thead>
          <tbody>
            ${typeClasses.map(([k,v,d]) => html`<tr key=${k}><td class="mono" style=${{color:'var(--code)'}}>${k}</td><td class="mono dim">${v}</td><td class="dim">${d}</td></tr>`)}
          </tbody>
        </table>
      </${Box}>

    </${Box}>
  `
}

// ── section: layout ──────────────────────────────────────────────────────────
function SectionLayout() {
  return html`
    <${Box} sc f1 pad="32px" gap=${24} style=${{maxWidth:'760px',margin:'0 auto',width:'100%'}}>

      <${Box} gap=${12}>
        <${Txt} bold>Box — the only layout primitive</${Txt}>
        <${Pre} code>${`<\${Box} row ac jb bb gap=\${12} pad="16px">
  <\${Txt} bold>title<\/\${Txt}>
  <\${Btn} primary>action<\/\${Btn}>
<\/\${Box}>`}</${Pre}>
        <${Txt} dim sm>Every prop maps to a CSS class or inline style. Never nest raw divs for structure.</${Txt}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Box props</${Txt}>
        <table>
          <thead><tr><th>Prop</th><th>Class / Effect</th></tr></thead>
          <tbody>
            ${[
              ['row',    '.row — flex-direction: row'],
              ['f1',     '.f1 — flex:1 + min-height:0 (fills available space)'],
              ['sc',     '.sc — overflow: auto (scrollable)'],
              ['cl',     '.cl — overflow: hidden (clip)'],
              ['ac',     '.ac — align-items: center'],
              ['jb',     '.jb — justify-content: space-between'],
              ['bb',     '.bb — border-bottom'],
              ['br',     '.br — border-right'],
              ['rel',    '.rel — position: relative'],
              ['fs0',    '.fs0 — flex-shrink: 0'],
              ['wrap',   '.wrap — flex-wrap: wrap'],
              ['gap={n}','.g{n} — gap (2/3/4/5/6/8/10/12/14/16/20/24)'],
              ['pad="xpx"','.p{n} or inline — padding (4/6/8/12/14/16/20/24px)'],
              ['flex',   'inline flex: value'],
            ].map(([k,v]) => html`<tr key=${k}><td class="mono" style=${{color:'var(--code)'}}>${k}</td><td class="dim sm">${v}</td></tr>`)}
          </tbody>
        </table>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Common patterns</${Txt}>
        <${Box} gap=${16}>
          <${Box} gap=${6}>
            <${Txt} sm dim>Topbar (fixed height, never grows)</${Txt}>
            <${Pre} code>${`<\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
  ...
<\/\${Box}>`}</${Pre}>
          </${Box}>
          <${Box} gap=${6}>
            <${Txt} sm dim>Two-pane shell (sidebar + main, both scroll independently)</${Txt}>
            <${Pre} code>${`<\${Box} f1>          // full height
  <\${Box} row f1 cl> // clip outer, row layout
    <\${Box} br sc style={{width:'220px',flexShrink:0}}>  // sidebar scrolls
    <\${Box} f1 sc>  // main scrolls
  <\/\${Box}>
<\/\${Box}>`}</${Pre}>
          </${Box}>
          <${Box} gap=${6}>
            <${Txt} sm dim>Card / panel</${Txt}>
            <${Pre} code>${`<\${Box} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'8px'}}>
  <\${Box} row ac jb bb pad="12px"><\/\${Box}>  // header
  <\${Box} pad="16px" gap=\${12}><\/\${Box}>    // body
<\/\${Box}>`}</${Pre}>
          </${Box}>
        </${Box}>
      </${Box}>

    </${Box}>
  `
}

// ── section: components ───────────────────────────────────────────────────────
function SectionComponents() {
  const [nav, setNav] = useState('alpha')
  const [inp, setInp] = useState('')
  const [sel, setSel] = useState('b')

  return html`
    <${Box} sc f1 pad="32px" gap=${28} style=${{maxWidth:'760px',margin:'0 auto',width:'100%'}}>

      <${Box} gap=${12}>
        <${Txt} bold>Btn</${Txt}>
        <${Box} row gap=${8} ac wrap>
          <${Btn}>default</${Btn}>
          <${Btn} primary>primary</${Btn}>
          <${Btn} danger>danger</${Btn}>
          <${Btn} disabled>disabled</${Btn}>
        </${Box}>
        <${Pre} code>${`<\${Btn}>default<\/\${Btn}>
<\${Btn} primary>primary<\/\${Btn}>
<\${Btn} danger>danger<\/\${Btn}>
<\${Btn} disabled>disabled<\/\${Btn}>`}</${Pre}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Ghost</${Txt}>
        <${Box} row gap=${16}>
          <${Ghost}>action</${Ghost}>
          <${Ghost}>+ new item</${Ghost}>
          <${Ghost}>view all →</${Ghost}>
        </${Box}>
        <${Pre} code>${`<\${Ghost} onClick=\${handler}>action<\/\${Ghost}>`}</${Pre}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Nav</${Txt}>
        <${Box} style=${{width:'200px',border:'1px solid var(--border)',borderRadius:'8px',overflow:'hidden'}}>
          ${['alpha','beta','gamma'].map(id => html`
            <${Nav} key=${id} on=${nav===id} onClick=${()=>setNav(id)}>
              <span class="lbl-primary">${id}</span>
              <span class="lbl-secondary">meta · ${id}</span>
            </${Nav}>
          `)}
        </${Box}>
        <${Pre} code>${`<\${Nav} on=\${selected===id} onClick=\${()=>setSelected(id)}>
  <span class="lbl-primary">label<\/span>
  <span class="lbl-secondary">meta<\/span>
<\/\${Nav}>`}</${Pre}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Field + inputs</${Txt}>
        <${Box} gap=${12} style=${{maxWidth:'300px'}}>
          <${Field} label="TEXT INPUT">
            <input type="text" value=${inp} onInput=${e=>setInp(e.target.value)} placeholder="type something"/>
          </${Field}>
          <${Field} label="SELECT">
            <select value=${sel} onChange=${e=>setSel(e.target.value)}>
              <option value="a">Option A</option>
              <option value="b">Option B</option>
              <option value="c">Option C</option>
            </select>
          </${Field}>
          <${Field} label="TEXTAREA">
            <textarea rows=${3} placeholder="multiline…"></textarea>
          </${Field}>
        </${Box}>
        <${Pre} code>${`<\${Field} label="LABEL">
  <input type="text" value=\${val} onInput=\${e=>setVal(e.target.value)}/>
<\/\${Field}>`}</${Pre}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Pre</${Txt}>
        <${Pre}>plain preformatted block with .pre styling</pre>
        <${Pre} code>code block — monospace, code color, dark bg</pre>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Txt</${Txt}>
        <${Box} gap=${6}>
          <${Txt}>default text</${Txt}>
          <${Txt} dim>dim secondary text</${Txt}>
          <${Txt} lnk>link / action text</${Txt}>
          <${Txt} sm>small (11px)</${Txt}>
          <${Txt} xs>extra small (10px)</${Txt}>
          <${Txt} bold>bold 600</${Txt}>
          <${Txt} mono>monospace inline</${Txt}>
          <${Txt} class="caps">caps label</${Txt}>
          <${Txt} i dim>italic muted</${Txt}>
        </${Box}>
      </${Box}>

      <${Box} gap=${12}>
        <${Txt} bold>Table</${Txt}>
        <table>
          <thead><tr><th>Name</th><th>Type</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>alpha</td><td class="dim">string</td><td class="mono">foo</td></tr>
            <tr><td>beta</td><td class="dim">number</td><td class="mono">42</td></tr>
            <tr><td>gamma</td><td class="dim">boolean</td><td class="mono">true</td></tr>
          </tbody>
        </table>
        <${Txt} dim sm>Table styles are global. No component needed.</${Txt}>
      </${Box}>

    </${Box}>
  `
}

// ── section: modes ────────────────────────────────────────────────────────────
// Each mode is a full skeleton. Pick one, activate it as App(), delete the rest.
// ─────────────────────────────────────────────────────────────────────────────
function SectionModes() {
  const [active, setActive] = useState('list-inspector')
  const modes = [
    { id: 'list-inspector', name: 'List → Inspector',   desc: 'Sidebar nav list, detail pane on selection. Data-entry, settings, entity viewers.' },
    { id: 'query-viewer',   name: 'Query Viewer',       desc: 'Input at top, result table below. SQL/J1QL explorers, filters, search.' },
    { id: 'dashboard',      name: 'Dashboard',          desc: 'Metric cards + stat rows, read-only overview. No sidebar.' },
    { id: 'data-dense',     name: 'Data Dense',         desc: 'Full-width table, filter bar at top, minimal chrome. Bulk operations.' },
    { id: 'form-wizard',    name: 'Form / Wizard',      desc: 'Sequential steps, validation, submit. Onboarding, config flows.' },
  ]

  const skeletons = {
    'list-inspector': `// MODE: list → inspector
// Topbar (38px) + sidebar (220px) + detail pane
// Sidebar scrolls independently; detail scrolls independently.

function App() {
  const [items] = useState([])          // fetch your data here
  const [sel, setSel] = useState(null)
  const item = items.find(i => i.id === sel) ?? null

  return html\`
    <\${Box} f1>
      <\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
        <\${Txt} bold>app name</\${Txt}>
      </\${Box}>
      <\${Box} row f1 cl>

        <\${Box} br sc style={{width:'220px',flexShrink:0}}>
          <\${Box} row ac jb class="ph16 pv8 bb">
            <\${Txt} sm bold dim>items</\${Txt}>
            <\${Ghost} onClick={() => {}}>+ new</\${Ghost}>
          </\${Box}>
          \${items.map(it => html\`
            <\${Nav} key=\${it.id} on=\${sel===it.id} onClick={() => setSel(it.id)}>
              <span class="lbl-primary">\${it.name}</span>
              <span class="lbl-secondary">\${it.meta}</span>
            </\${Nav}>
          \`)}
        </\${Box}>

        <\${Box} f1 sc>
          \${!item
            ? html\`<\${Box} f1 ac style={{justifyContent:'center'}}><\${Txt} dim i>select an item</\${Txt}></\${Box}>\`
            : html\`
              <\${Box} row ac jb bb class="ph20 pv12" style={{flexShrink:0}}>
                <\${Txt} bold>\${item.name}</\${Txt}>
                <\${Btn} primary onClick={() => {}}>save</\${Btn}>
              </\${Box}>
              <\${Box} pad="20px" gap=\${16}>
                <!-- fields / content here -->
              </\${Box}>
            \`
          }
        </\${Box}>

      </\${Box}>
    </\${Box}>
  \`
}`,

    'query-viewer': `// MODE: query viewer
// Topbar + query input bar (fixed) + result table (scrollable).
// Input is always visible; table fills remaining height.

function App() {
  const [query, setQuery]   = useState('')
  const [rows, setRows]     = useState([])
  const [loading, setLoad]  = useState(false)

  async function run() {
    setLoad(true)
    // fetch / query logic here
    setLoad(false)
  }

  return html\`
    <\${Box} f1>
      <\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
        <\${Txt} bold>app name</\${Txt}>
      </\${Box}>

      <\${Box} row ac bb gap=\${8} class="p8" style={{flexShrink:0}}>
        <input type="text" value=\${query} onInput=\${e=>setQuery(e.target.value)}
          placeholder="enter query…" style={{flex:1}}/>
        <\${Btn} primary disabled=\${loading} onClick=\${run}>
          \${loading ? 'running…' : 'run'}
        </\${Btn}>
      </\${Box}>

      <\${Box} f1 sc>
        \${rows.length === 0
          ? html\`<\${Box} f1 ac style={{justifyContent:'center'}}><\${Txt} dim i>no results</\${Txt}></\${Box}>\`
          : html\`
            <table>
              <thead><tr>
                \${Object.keys(rows[0]).map(k => html\`<th key=\${k}>\${k}</th>\`)}
              </tr></thead>
              <tbody>
                \${rows.map((r,i) => html\`
                  <tr key=\${i}>
                    \${Object.values(r).map((v,j) => html\`<td key=\${j}>\${v}</td>\`)}
                  </tr>
                \`)}
              </tbody>
            </table>
          \`
        }
      </\${Box}>
    </\${Box}>
  \`
}`,

    'dashboard': `// MODE: dashboard
// No sidebar. Topbar + metric cards row + content area.
// Cards are fixed-height; content scrolls.

function App() {
  const metrics = [
    { label: 'Total',   value: '—' },
    { label: 'Active',  value: '—' },
    { label: 'Errors',  value: '—' },
  ]

  return html\`
    <\${Box} f1>
      <\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
        <\${Txt} bold>app name</\${Txt}>
      </\${Box}>

      <\${Box} row gap=\${12} bb class="p16" style={{flexShrink:0}}>
        \${metrics.map(m => html\`
          <\${Box} key=\${m.label} gap=\${4}
            style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px 16px',minWidth:'120px'}}>
            <\${Txt} xs dim caps>\${m.label}</\${Txt}>
            <\${Txt} class="lg">\${m.value}</\${Txt}>
          </\${Box}>
        \`)}
      </\${Box}>

      <\${Box} f1 sc pad="16px" gap=\${16}>
        <!-- charts / tables / content here -->
      </\${Box}>
    </\${Box}>
  \`
}`,

    'data-dense': `// MODE: data dense
// Full-width table. Filter bar at top (fixed). Table scrolls.
// Minimal chrome — no sidebar, no detail pane.

function App() {
  const [filter, setFilter] = useState('')
  const [rows, setRows]     = useState([])
  const visible = rows.filter(r => !filter || JSON.stringify(r).includes(filter))

  return html\`
    <\${Box} f1>
      <\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
        <\${Txt} bold>app name</\${Txt}>
        <\${Txt} dim sm>\${visible.length} rows</\${Txt}>
      </\${Box}>

      <\${Box} row ac bb gap=\${8} class="ph16 pv8" style={{flexShrink:0}}>
        <input type="text" value=\${filter} onInput=\${e=>setFilter(e.target.value)}
          placeholder="filter…" style={{width:'240px'}}/>
        <\${Btn} primary onClick={() => {}}>+ new</\${Btn}>
      </\${Box}>

      <\${Box} f1 sc>
        <table>
          <thead><tr>
            <!-- column headers here -->
          </tr></thead>
          <tbody>
            \${visible.map((r,i) => html\`
              <tr key=\${i}>
                <!-- cells here -->
              </tr>
            \`)}
          </tbody>
        </table>
      </\${Box}>
    </\${Box}>
  \`
}`,

    'form-wizard': `// MODE: form / wizard
// Sequential steps. Step indicator (fixed) + form body (scrollable) + footer nav.
// No sidebar.

const STEPS = ['Details', 'Config', 'Review']

function App() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({})
  const set = k => v => setData(d => ({...d, [k]: v}))

  return html\`
    <\${Box} f1>
      <\${Box} row ac jb bb style={{flexShrink:0,height:'38px',padding:'0 16px'}}>
        <\${Txt} bold>app name</\${Txt}>
        <\${Txt} dim sm>step \${step+1} of \${STEPS.length}</\${Txt}>
      </\${Box}>

      <\${Box} row ac bb gap=\${0} style={{flexShrink:0}}>
        \${STEPS.map((s,i) => html\`
          <\${Box} key=\${s} pad="12px" class="ph20"
            style={{borderBottom: i===step ? '2px solid var(--blue)' : '2px solid transparent',
                    color: i===step ? 'var(--text)' : 'var(--dim)',
                    fontWeight: i===step ? 600 : 400}}>
            \${s}
          </\${Box}>
        \`)}
      </\${Box}>

      <\${Box} f1 sc pad="32px" gap=\${16} style={{maxWidth:'520px',margin:'0 auto',width:'100%'}}>
        <!-- step content here, gate on step index -->
      </\${Box}>

      <\${Box} row ac jb bb class="ph20 pv12" style={{flexShrink:0,borderTop:'1px solid var(--border)'}}>
        <\${Btn} disabled=\${step===0} onClick=\${()=>setStep(s=>s-1)}>← back</\${Btn}>
        \${step < STEPS.length-1
          ? html\`<\${Btn} primary onClick=\${()=>setStep(s=>s+1)}>next →</\${Btn}>\`
          : html\`<\${Btn} primary onClick=\${()=>{}}>submit</\${Btn}>\`
        }
      </\${Box}>
    </\${Box}>
  \`
}`,
  }

  return html`
    <${Box} row f1 cl>
      <${Box} br sc style=${{width:'200px',flexShrink:0}}>
        <${Box} row ac class="ph16 pv8 bb">
          <${Txt} sm bold dim>templates</${Txt}>
        </${Box}>
        ${modes.map(m => html`
          <${Nav} key=${m.id} on=${active===m.id} onClick=${()=>setActive(m.id)}>
            <span class="lbl-primary">${m.name}</span>
          </${Nav}>
        `)}
      </${Box}>

      <${Box} f1 sc pad="24px" gap=${16}>
        ${modes.filter(m=>m.id===active).map(m => html`
          <${Box} gap=${8} key=${m.id}>
            <${Txt} bold>${m.name}</${Txt}>
            <${Txt} dim sm>${m.desc}</${Txt}>
          </${Box}>
          <${Pre} code style=${{fontSize:'11px',lineHeight:'1.6'}}>${skeletons[m.id]}</${Pre}>
        `)}
      </${Box}>
    </${Box}>
  `
}

// ── root ──────────────────────────────────────────────────────────────────────
function App() {
  const [section, setSection] = useState('overview')
  const views = { overview: SectionOverview, tokens: SectionTokens, layout: SectionLayout, components: SectionComponents, modes: SectionModes }
  const View = views[section] ?? SectionOverview

  return html`
    <${Box} f1>
      <${Topbar} section=${section} onSection=${setSection}/>
      <${View}/>
    </${Box}>
  `
}

render(html`<${App}/>`, document.getElementById('app'))
</script>
</body>
</html>
```
