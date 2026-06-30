import * as Matter from "matter-js";
import { CHARS } from "./shared/chars";

document.addEventListener("DOMContentLoaded", () => initGutter());

const MIN_FONT = 11;
const MAX_FONT = 20;
const CONTENT_WIDTH = 800;
const WALL = 60; // static wall thickness

export const initGutter = () => {
  const bin = document.getElementById("skills-bin");
  if (!bin) return;

  const { Bodies, Body, Composite, Engine, Runner } = Matter;
  const dpr = window.devicePixelRatio || 1;

  // ── Canvas (fixed, viewport-sized) ─────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  };
  resize();

  // ── Physics engine (document-space CSS pixels, no dpr scaling) ─────────
  const engine = Engine.create({ gravity: { y: 2.2 } });

  const vw = () => window.innerWidth;
  const vh = () => window.innerHeight;
  const sy = () => window.scrollY;
  const gw = () => Math.max(0, (vw() - CONTENT_WIDTH) / 2);

  // Bin metrics in document space
  const binTop = () => bin.offsetTop;
  const binBottom = () => bin.offsetTop + bin.offsetHeight;
  const binLeft = () => bin.offsetLeft;
  const binRight = () => bin.offsetLeft + bin.offsetWidth;

  // ── Walls ───────────────────────────────────────────────────────────────
  const makeWalls = () => {
    const W = vw();
    const BT = binTop();
    const BB = binBottom();
    const BL = binLeft();
    const BR = binRight();
    const g = gw();
    const opts = { isStatic: true, label: "wall", render: { fillStyle: "transparent" } };

    const walls: Matter.Body[] = [
      // Bin floor
      Bodies.rectangle(W / 2, BB + WALL / 2, W * 4, WALL, opts),
      // Bin left wall
      Bodies.rectangle(BL - WALL / 2, (BT + BB) / 2, WALL, (BB - BT) * 3, opts),
      // Bin right wall
      Bodies.rectangle(BR + WALL / 2, (BT + BB) / 2, WALL, (BB - BT) * 3, opts),
      // Outer left wall (full page height)
      Bodies.rectangle(-WALL / 2, BB / 2, WALL, BB * 2, opts),
      // Outer right wall
      Bodies.rectangle(W + WALL / 2, BB / 2, WALL, BB * 2, opts),
    ];

    // Viewport corner bevels (small angled walls so off-screen clicks
    // get a nudge inward before the long funnel takes over)
    const BEVEL = 120;
    walls.push(
      Bodies.rectangle(BEVEL / 2, BEVEL / 2, BEVEL * 1.5, 10, { ...opts, angle: Math.PI / 4 }),
      Bodies.rectangle(W - BEVEL / 2, BEVEL / 2, BEVEL * 1.5, 10, { ...opts, angle: -Math.PI / 4 }),
    );

    // Funnel: angled walls from outer edges at top → bin walls at bin top
    // Only add when there are gutters wide enough to matter
    if (g > 40 && BT > 200) {
      // Left funnel wall: from (0, 0) → (BL, BT), represented as a tilted rect
      const lx = (0 + BL) / 2;
      const ly = (0 + BT) / 2;
      const llen = Math.sqrt(BL * BL + BT * BT);
      const lang = Math.atan2(BT, BL) - Math.PI / 2;
      walls.push(Bodies.rectangle(lx, ly, 10, llen, { ...opts, angle: lang }));

      // Right funnel wall: from (W, 0) → (BR, BT)
      const rx = (W + BR) / 2;
      const ry = (0 + BT) / 2;
      const rlen = Math.sqrt((W - BR) * (W - BR) + BT * BT);
      const rang = Math.atan2(BT, BR - W) - Math.PI / 2;
      walls.push(Bodies.rectangle(rx, ry, 10, rlen, { ...opts, angle: rang }));
    }

    return walls;
  };

  let walls = makeWalls();
  Composite.add(engine.world, walls);

  // ── Spawn ───────────────────────────────────────────────────────────────
  const isLightMode = () => {
    const cl = document.documentElement.classList;
    if (cl.contains("light")) return true;
    if (cl.contains("dark")) return false;
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  };

  const accentColor = () => {
    const prop = isLightMode() ? "--accent-color-link-light" : "--accent-color-link-dark";
    return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()
      || (isLightMode() ? "#1d4ed8" : "#60a5fa");
  };

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
    (body as any).charSize = fontSize;
    (body as any).charOpacity = 0.7 + Math.random() * 0.3;
    Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0.5 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
    Composite.add(engine.world, body);
  };

  // ── Render loop ─────────────────────────────────────────────────────────
  Runner.run(Runner.create(), engine);

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scroll = sy();
    const color = accentColor();

    Composite.allBodies(engine.world).forEach((body) => {
      if (body.isStatic) return;
      // Document-space → viewport-space → canvas-space
      const vx = body.position.x;
      const vy = body.position.y - scroll;
      if (vy < -60 || vy > vh() + 60) return; // off-screen, skip

      const size: number = (body as any).charSize ?? 14;
      const opacity: number = (body as any).charOpacity ?? 0.8;

      ctx.save();
      ctx.translate(vx * dpr, vy * dpr);
      ctx.rotate(body.angle);
      ctx.font = `${size * dpr}px "Ubuntu Mono", monospace`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(body.label, 0, 0);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  };
  draw();

  // ── Input ───────────────────────────────────────────────────────────────
  let holdInterval: ReturnType<typeof setInterval> | null = null;
  let lastDocX = 0;
  let lastDocY = 0;

  const isGutterClick = (clientX: number) =>
    gw() >= 60 && (clientX < gw() || clientX > vw() - gw());

  const isNarrowScreen = () => gw() < 60;

  const handleDown = (clientX: number, clientY: number) => {
    lastDocX = clientX;
    lastDocY = clientY + sy();
    spawnAt(lastDocX, lastDocY);
    holdInterval = setInterval(() => spawnAt(lastDocX, lastDocY), 130);
  };

  document.addEventListener("mousedown", (e) => {
    if (isNarrowScreen() || isGutterClick(e.clientX)) {
      handleDown(e.clientX, e.clientY);
    }
  });

  document.addEventListener("mousemove", (e) => {
    lastDocX = e.clientX;
    lastDocY = e.clientY + sy();
    if (holdInterval && !isNarrowScreen() && !isGutterClick(e.clientX)) {
      clearInterval(holdInterval);
      holdInterval = null;
    }
  });

  document.addEventListener("mouseup", () => {
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
  });

  // Touch support
  document.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    handleDown(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener("touchend", () => {
    if (holdInterval) { clearInterval(holdInterval); holdInterval = null; }
  });

  // ── Resize ──────────────────────────────────────────────────────────────
  window.addEventListener("resize", () => {
    resize();
    walls.forEach((w) => Composite.remove(engine.world, w));
    walls = makeWalls();
    Composite.add(engine.world, walls);
  });
};
