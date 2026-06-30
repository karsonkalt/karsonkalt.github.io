import * as Matter from "matter-js";
import { CHARS } from "./shared/chars";

document.addEventListener("DOMContentLoaded", () => initGutter());

const MIN_FONT = 11;
const MAX_FONT = 20;
const CONTENT_WIDTH = 800;
const WALL = 60;

export const initGutter = () => {
  const bin = document.getElementById("skills-bin");
  if (!bin) return;

  const { Bodies, Body, Composite, Engine } = Matter;
  const dpr = window.devicePixelRatio || 1;

  // ── Canvas: fixed, viewport-sized ──────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.id = "gutter-canvas";
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resizeCanvas();

  // ── Engine (no Runner — we tick manually in rAF) ────────────────────────
  const engine = Engine.create({ gravity: { y: 2.2 } });

  // ── Document-space helpers ──────────────────────────────────────────────
  // getBoundingClientRect() + scrollY = true document position
  const docRect = () => {
    const r = bin.getBoundingClientRect();
    const sy = window.scrollY;
    return {
      top:    r.top    + sy,
      bottom: r.bottom + sy,
      left:   r.left,
      right:  r.right,
      width:  r.width,
    };
  };

  const vw = () => window.innerWidth;
  const gw = () => Math.max(0, (vw() - CONTENT_WIDTH) / 2);

  // ── Build static walls ──────────────────────────────────────────────────
  const makeWalls = () => {
    const { top: BT, bottom: BB, left: BL, right: BR } = docRect();
    const W = vw();
    const S     = { isStatic: true, label: "wall", render: { fillStyle: "transparent" } };
    const FLARE = 300; // px each flare extends at 45°

    return [
      // Bin floor
      Bodies.rectangle(W / 2, BB + WALL / 2, W * 4, WALL, S),
      // Bin side walls — exact bin height
      Bodies.rectangle(BL - WALL / 2, (BT + BB) / 2, WALL, BB - BT, S),
      Bodies.rectangle(BR + WALL / 2, (BT + BB) / 2, WALL, BB - BT, S),
      // 45° flares from bin top corners extending upward/outward
      Bodies.rectangle(BL - FLARE / 2, BT - FLARE / 2, 8, FLARE * Math.SQRT2, { ...S, angle: -Math.PI / 4 }),
      Bodies.rectangle(BR + FLARE / 2, BT - FLARE / 2, 8, FLARE * Math.SQRT2, { ...S, angle:  Math.PI / 4 }),
    ];
  };

  let walls = makeWalls();
  Composite.add(engine.world, walls);

  // ── Colour helpers ──────────────────────────────────────────────────────
  const isLight = () => {
    const cl = document.documentElement.classList;
    if (cl.contains("light")) return true;
    if (cl.contains("dark")) return false;
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  };
  const accentColor = () => {
    const prop = isLight() ? "--accent-color-link-light" : "--accent-color-link-dark";
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()
      || (isLight() ? "#1d4ed8" : "#60a5fa");
  };

  // ── Spawn ───────────────────────────────────────────────────────────────
  const spawnAt = (docX: number, docY: number) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    const fontSize = MIN_FONT + Math.random() * (MAX_FONT - MIN_FONT);
    const w = char.length * fontSize * 0.58 + 12;
    const h = fontSize + 8;

    const body = Bodies.rectangle(docX, docY, w, h, {
      restitution: 0.3,
      friction: 0.55,
      frictionAir: 0.018,
      label: char,
      render: { fillStyle: "transparent" },
    });
    (body as any).charSize    = fontSize;
    (body as any).charOpacity = 0.7 + Math.random() * 0.3;

    Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0.5 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
    Composite.add(engine.world, body);
  };

  // ── rAF loop: tick engine + draw ────────────────────────────────────────
  let last = performance.now();
  const draw = (now: number) => {
    const delta = Math.min(now - last, 32);
    last = now;
    Engine.update(engine, delta);
    if (typeof tickSort === "function") tickSort();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sy    = window.scrollY;
    const color = accentColor();
    const vh    = window.innerHeight;

    Composite.allBodies(engine.world).forEach((body) => {
      if (body.isStatic) return;
      // Document-space y → viewport y
      const vx = body.position.x;
      const vy = body.position.y - sy;
      if (vy < -80 || vy > vh + 80) return;

      const size: number    = (body as any).charSize    ?? 14;
      const opacity: number = (body as any).charOpacity ?? 0.8;

      ctx.save();
      ctx.translate(vx * dpr, vy * dpr);
      ctx.rotate(body.angle);
      ctx.font         = `${size * dpr}px "Ubuntu Mono", monospace`;
      ctx.fillStyle    = color;
      ctx.globalAlpha  = opacity;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(body.label, 0, 0);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  // ── Input ───────────────────────────────────────────────────────────────
  let holdInterval: ReturnType<typeof setInterval> | null = null;
  let lastDocX = 0;
  let lastDocY = 0;

  const startSpawn = (clientX: number, clientY: number) => {
    lastDocX = clientX;
    lastDocY = clientY + window.scrollY;
    spawnAt(lastDocX, lastDocY);
    holdInterval = setInterval(() => spawnAt(lastDocX, lastDocY), 130);
  };

  window.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).closest("button, a, input, select, [role='button']")) return;
    startSpawn(e.clientX, e.clientY);
  });
  window.addEventListener("mousemove", (e) => {
    lastDocX = e.clientX;
    lastDocY = e.clientY + window.scrollY;
  });
  window.addEventListener("mouseup", () => {
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
  });

  // Touch
  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startSpawn(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener("touchend", () => {
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
  });

  // ── Sort ────────────────────────────────────────────────────────────────
  let sortTargets: Map<Matter.Body, { x: number; y: number }> | null = null;
  let isSorted = false;

  const calcTargets = () => {
    const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);
    const { left: BL, top: BT, width: BW } = docRect();
    const PAD = 20;
    const GAP = 6;
    let cx = BL + PAD;
    let cy = BT + PAD + 24; // leave room for Skills label
    let rowH = 0;
    const targets = new Map<Matter.Body, { x: number; y: number }>();

    bodies.forEach(body => {
      const fontSize = (body as any).charSize ?? 14;
      const w = body.label.length * fontSize * 0.58 + 12;
      const h = fontSize + 8;
      if (cx + w > BL + BW - PAD && cx > BL + PAD) {
        cx = BL + PAD;
        cy += rowH + GAP;
        rowH = 0;
      }
      targets.set(body, { x: cx + w / 2, y: cy + h / 2 });
      cx += w + GAP;
      rowH = Math.max(rowH, h);
    });
    return targets;
  };

  // Lerp bodies to targets each frame when sorted
  const tickSort = () => {
    if (!sortTargets) return;
    engine.gravity.y = 0;
    Composite.allBodies(engine.world).forEach(body => {
      if (body.isStatic) return;
      const t = sortTargets!.get(body);
      if (!t) return;
      const dx = t.x - body.position.x;
      const dy = t.y - body.position.y;
      Body.setPosition(body, { x: body.position.x + dx * 0.12, y: body.position.y + dy * 0.12 });
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngle(body, body.angle * 0.85);
      Body.setAngularVelocity(body, 0);
    });
  };

  // Wire sort button
  document.getElementById("skills-sort-btn")?.addEventListener("click", () => {
    isSorted = !isSorted;
    const btn = document.getElementById("skills-sort-btn")!;
    if (isSorted) {
      sortTargets = calcTargets();
      engine.gravity.y = 0;
      btn.textContent = "Unsort";
    } else {
      sortTargets = null;
      engine.gravity.y = 2.2;
      btn.textContent = "Sort";
    }
  });

  // ── Resize ──────────────────────────────────────────────────────────────
  window.addEventListener("resize", () => {
    resizeCanvas();
    walls.forEach((w) => Composite.remove(engine.world, w));
    walls = makeWalls();
    Composite.add(engine.world, walls);
  });
};
