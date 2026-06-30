import * as Matter from "matter-js";

const WORDS = [
  "TypeScript", "React", "D3.js", "GraphQL", "AWS", "Figma",
  "Storybook", "Vite", "Webpack", "Node.js", "CSS", "A11y",
  "React Flow", "Chromatic", "Cypress", "GitHub Actions",
  "Tailwind", "Design Tokens", "WCAG", "Monorepo",
  "REST", "WebSockets", "IAM", "Lambda", "S3",
  "IntersectionObserver", "View Transitions", "Canvas API",
  "Matter.js", "Zustand", "i18n", "SSR", "CORS",
];

export const initSkillsBin = (): void => {
  const bin = document.getElementById("skills-bin");
  const canvas = document.getElementById("skills-bin-canvas") as HTMLCanvasElement | null;
  if (!bin || !canvas) return;

  const dpr = window.devicePixelRatio || 1;

  const resize = () => {
    canvas.width = bin.clientWidth * dpr;
    canvas.height = bin.clientHeight * dpr;
  };
  resize();

  const ctx = canvas.getContext("2d")!;

  const engine = Matter.Engine.create({ gravity: { y: 1.8 } });
  const world = engine.world;

  const W = () => bin.clientWidth;
  const H = () => bin.clientHeight;
  const WALL = 40;

  const makeWalls = () => {
    Matter.World.clear(world, false);
    Matter.Engine.clear(engine);
    // floor
    Matter.World.add(world, Matter.Bodies.rectangle(W() / 2, H() + WALL / 2, W() * 4, WALL, { isStatic: true, label: "wall" }));
    // left
    Matter.World.add(world, Matter.Bodies.rectangle(-WALL / 2, H() / 2, WALL, H() * 4, { isStatic: true, label: "wall" }));
    // right
    Matter.World.add(world, Matter.Bodies.rectangle(W() + WALL / 2, H() / 2, WALL, H() * 4, { isStatic: true, label: "wall" }));
  };
  makeWalls();

  const bodies: Array<{ body: Matter.Body; label: string; fontSize: number }> = [];
  const used = new Set<string>();

  const nextWord = (): string => {
    const remaining = WORDS.filter((w) => !used.has(w));
    if (!remaining.length) used.clear();
    const pool = remaining.length ? remaining : WORDS;
    const word = pool[Math.floor(Math.random() * pool.length)];
    used.add(word);
    return word;
  };

  const spawnWord = (clickX: number) => {
    const word = nextWord();
    const fontSize = 11 + Math.random() * 6;
    const w = word.length * fontSize * 0.6 + 16;
    const h = fontSize + 12;
    const x = Math.max(w / 2 + 4, Math.min(W() - w / 2 - 4, clickX));
    const body = Matter.Bodies.rectangle(x, -h, w, h, {
      restitution: 0.25,
      friction: 0.6,
      frictionAir: 0.02,
      label: word,
    });
    Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 });
    Matter.World.add(world, body);
    bodies.push({ body, label: word, fontSize });
  };

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    spawnWord(e.clientX - rect.left);
  });

  // Draw loop
  const accentColor = () =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-color-link")
      .trim() || "#60a5fa";

  const borderColor = () =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--white-20")
      .trim() || "rgba(255,255,255,0.2)";

  const render = () => {
    Matter.Engine.update(engine, 1000 / 60);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = W();
    const h = H();

    // Border — left, right, bottom only
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = borderColor();
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h);
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.stroke();

    // Words
    const color = accentColor();
    bodies.forEach(({ body, label, fontSize }) => {
      const { x, y } = body.position;
      const angle = body.angle;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = `${fontSize}px "Ubuntu Mono", monospace`;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });

    ctx.restore();
    requestAnimationFrame(render);
  };
  render();

  // Resize
  window.addEventListener("resize", () => {
    resize();
    makeWalls();
  });
};
