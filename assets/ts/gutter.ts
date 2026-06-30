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
    updateBinUI();
  };

  const ORGANIZE_THRESHOLD = 8;
  const updateBinUI = () => {
    const count = Composite.allBodies(engine.world).filter(b => !b.isStatic).length;
    const hint = document.getElementById("skills-hint") as HTMLElement | null;
    const btn  = document.getElementById("skills-sort-btn") as HTMLElement | null;
    if (hint) hint.style.opacity = count === 0 ? "1" : "0";
    if (btn) {
      const ready = count >= ORGANIZE_THRESHOLD;
      btn.style.opacity = ready ? "1" : "0";
      btn.style.pointerEvents = ready ? "auto" : "none";
    }
  };
  updateBinUI();

  // ── rAF loop: tick engine + draw ────────────────────────────────────────
  let last = performance.now();
  const draw = (now: number) => {
    const delta = Math.min(now - last, 32);
    last = now;
    Engine.update(engine, delta);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sy = window.scrollY;
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
  // Category map: word → category label
  const CATEGORIES: { label: string; words: string[] }[] = [
    { label: "TypeScript",     words: ["keyof T","infer R","as const","satisfies","readonly","T extends U","T[keyof T]","[K in keyof T]","T & U","T | U","asserts","override","abstract","namespace","declare","is T","never","unknown","unique symbol","Partial<T>","Omit<T,K>","Pick<T,K>","Record<K,V>","Extract<T,U>","Exclude<T,U>","NonNullable<T>","Awaited<T>","ReturnType<T>","Parameters<T>","InstanceType<T>","Required<T>","Readonly<T>","Mutable<T>","DeepPartial<T>","PropsWithChildren","ComponentProps<T>","nullish coalescing","optional chaining","type narrowing","discriminated union","type predicate","assertion fn","satisfies T","non-null assertion","const assertion"] },
    { label: "React",          words: ["useCallback","useMemo","useRef<T>","useState<T>","useEffect","useContext","useReducer","useDeferredValue","useTransition","useId","forwardRef","memo()","Suspense","ErrorBoundary","lazy()","startTransition","VariantProps","cva()","cn()","data-slot","queryKey","qc.invalidateQueries()","qc.prefetchQuery()","qc.setQueryData()","qc.select()","pageInfo","useMutation","useSuspense","useInfiniteQuery","graphqlQueryOptions","mutationKey","tq.staleTime","tq.gcTime","tq.placeholderData","tq.refetchOnMount","tq.throwOnError","tq.networkMode"] },
    { label: "D3 / Data Viz",  words: ["d3.select()","d3.selectAll()","d3.enter()","d3.exit()","d3.join()","d3.append()","d3.datum()","d3.data()","d3.scaleLinear()","d3.scaleBand()","d3.scaleOrdinal()","d3.scaleLog()","d3.scaleTime()","d3.scaleSqrt()","d3.extent()","d3.max()","d3.min()","d3.sum()","d3.rollup()","d3.group()","d3.bin()","d3.histogram()","d3.line()","d3.area()","d3.arc()","d3.pie()","d3.curveCatmullRom","d3.curveMonotoneX","d3.curveBasis","d3.forceSimulation()","d3.forceManyBody()","d3.forceLink()","d3.forceCenter()","d3.forceCollide()","d3.forceX()","d3.zoom()","d3.drag()","d3.brush()","d3.axisBottom()","d3.treemap()","d3.hierarchy()","d3.pack()","d3.cluster()","d3.sankey()","d3.chord()","d3.ribbon()","d3.interpolate()","d3.interpolateRgb()","d3.quantize()","d3.transition()","d3.ease()","d3.easeElastic","sel.attr()","sel.style()","sel.call()","sel.on('click')","treemap","sunburst","heatmap","sankey","chord","voronoi","hexbin","contour","streamgraph","zoomable","pannable","brushable","linked views","overview+detail","focus+context","semantic zoom","WebGL renderer","Canvas 2D","SVG layer","quadtree","spatial index","R-tree","kdtree","path morphing","shape tweening","FLIP animation"] },
    { label: "React Flow",     words: ["useNodes()","useEdges()","useReactFlow()","onNodesChange","onEdgesChange","onConnect","NodeTypes","EdgeTypes","Handle","Position","MiniMap","Controls","Background","RF.addEdge()","RF.applyNodeChanges()","RF.applyEdgeChanges()","rf.fitView()","rf.getViewport()","rf.setCenter()","RF.MarkerType","RF.ConnectionMode","RF.PanOnScrollMode","rf.useStore()","rf.useNodeId()","rf.useUpdateNodeInternals()","LaidOutNode","ElkLayout","GraphCanvas","LaidOutEdge","J1QL","parseJ1QL","EntityTarget","QueryResult"] },
    { label: "Graph Theory",   words: ["DAG","BFS","DFS","topological sort","adjacency list","force-directed","hierarchical layout","ELK","dagre","graph vertex","graph edge","node degree","node centrality","shortest path","Dijkstra","A*","cycle detection","connected components","spanning tree","bipartite","graph in-degree","graph out-degree","source node","sink node","Neptune","graph DB","Neo4j","Cypher","Gremlin","index","query plan","N+1","connection pool","read replica","sharding"] },
    { label: "CSS / Platform", words: ["@layer","@property","@container",":has()","@scope","@starting-style","light-dark()","oklch()","color-mix()","text-wrap:balance","text-wrap:pretty","svh","dvh","lh","anchor-name","position-anchor","field-sizing","content-visibility","scrollbar-gutter","scrollbar-color","subgrid","container-type","@supports","view-transition-name","::view-transition","startViewTransition","@view-transition","::view-transition-group","navigation:auto","::view-transition-old","::view-transition-new","WebAssembly","WASM","Canvas API","WebGL","WebGPU","ResizeObserver","IntersectionObserver","MutationObserver","requestAnimationFrame","PerformanceObserver","Web Workers","SharedArrayBuffer","Atomics","Clipboard API","Drag & Drop API","Pointer Events","BroadcastChannel","structuredClone","AbortController"] },
    { label: "Design Systems", words: ["design token","token alias","semantic token","primitive","component API","prop contract","slot pattern","compound","controlled","uncontrolled","headless","polymorphic","as prop","asChild","Radix slot","render prop","forward ref","display name","story","argTypes","Storybook CSF","autodocs","play function","interactions","Chromatic snapshot","visual regression","baseline","breaking change","deprecation","migration guide","versioning","CHANGELOG","peer dep","bundle analysis","tree-shakeable","side-effect free","ESM","CJS","color ramp","type scale","spacing scale","grid system","8pt grid","4pt grid","optical alignment","rhythm","elevation","shadow token","motion token","duration","easing token","z-index scale","breakpoint token","icon system","icon grid","keyline","padding zone","accessibility token","focus ring","contrast ratio","light mode token","dark mode token","high contrast","figma variable","mode","collection","publish styles","code connect","storybook link","dev handoff","contribution guide","governance model","RFC","DACI","design review","ship criteria","acceptance"] },
    { label: "Figma",          words: ["auto layout","variants","tokenize","constraints","dev mode","detach","overlay","component set","instance swap","exposed props","slot","fill container","hug contents","base component","boolean prop"] },
    { label: "Design / UX",    words: ["Fitts","Hick","Gestalt","affordance","signifier","mental model","F-pattern","progressive","Doherty","cognitive load","chunking","5-second test","error prevention","recognition","flexibility"] },
    { label: "AWS",            words: ["Lambda","S3","CloudFront","API Gateway","DynamoDB","SQS","SNS","EventBridge","Step Functions","ECS","EC2","RDS","Aurora","ElastiCache","Secrets Manager","IAM","IAM Role","IAM Policy","AssumeRole","STS","presigned URL","S3 lifecycle","CloudWatch","X-Ray","VPC","CIDR","security group","NACLs","ALB","Cognito","ACM","Route53","WAF","Shield","CDK","SAM","CloudFormation","Terraform"] },
    { label: "Protocols",      words: ["REST","GraphQL","gRPC","WebSocket","SSE","CORS","preflight","OPTIONS","CSRF","XSS","JWT","OAuth2","PKCE","mTLS","OIDC","HTTP/2","HTTP/3","QUIC","TLS 1.3","idempotent","rate limit","backoff","retry","pagination","cursor","offset","Content-Type","Authorization:","Bearer","ETag","Cache-Control","tRPC","WebSockets"] },
    { label: "Architecture",   words: ["microservices","monorepo","monolith","modular monolith","service mesh","sidecar","BFF","API gateway","event-driven","event sourcing","CQRS","saga pattern","pub/sub","message queue","dead letter queue","idempotency key","distributed tracing","correlation ID","circuit breaker","bulkhead","retry with backoff","blue/green","canary deploy","feature flag","A/B test","strangler fig","anti-corruption layer","hexagonal","domain model","bounded context","aggregate root","eventual consistency","CAP theorem","two-phase commit","colocation","code splitting","tree shaking","dead code","SSR","SSG","ISR","RSC","streaming","hydration","edge runtime","middleware","optimistic UI","stale-while-revalidate","cache invalidation","micro-frontend","module federation","islands arch","component-driven","atomic design","design tokens"] },
    { label: "Git / CI",       words: ["git worktree","git rebase -i","git stash pop","git bisect","git reflog","git log --oneline","git diff HEAD~1","git cherry-pick","git fetch --prune","--force-with-lease","git blame","git shortlog","gh pr create","gh pr merge","gh pr view","gh run watch","gh issue list","CODEOWNERS",".gitattributes","squash & merge","nx affected","changesets","semantic versioning","GitHub Actions","workflow","matrix build","lint-staged","husky","pre-commit","trunk-based","DORA metrics","lead time","MTTR","deploy freq","workflow_dispatch","matrix strategy","concurrency group","cancel-in-progress","actions/cache@v4","job needs:","environment secrets","OIDC token","id-token: write","reusable workflow","composite action","step outputs","gh workflow run","status check","branch protection"] },
    { label: "Bash / Zsh",     words: ["#!/bin/zsh","set -euo pipefail","$?","$!","$()","${:-}","2>&1",">/dev/null","&&","||","| grep","| awk","| xargs","| sort -u","| jq '.'","| head -n","chmod +x","source ~/.zshrc","alias","export PATH","for f in","if [[ -z","trap","read -r"] },
    { label: "Performance",    words: ["LCP","INP","CLS","FID","TTFB","FCP","bundle analysis","lazy load","prefetch","preload","memoization","virtualization","windowing","debounce","throttle","requestIdleCallback","paint hold","layout thrash","composite layer","vite.config.ts","defineConfig()","rollupOptions","manualChunks","chunk splitting","vendor chunk","dynamic import()","import.meta.env","import.meta.glob","optimizeDeps","vite.resolve.alias","ssr.noExternal","content hash","immutable cache","Cache-Control:immutable","service worker","workbox precache","cache busting","304 Not Modified","modulepreload","prefetch hint"] },
    { label: "Observability",  words: ["OpenTelemetry","tracing","span","trace ID","Sentry","Datadog","NewRelic.noticeError()","Grafana","NR.addPageAction()","NR.setCustomAttribute()","structured log","log level","alert fatigue","P50","P95","P99","SLA","SLO","SLI","error budget","least privilege","zero trust","RBAC","ABAC","supply chain","SBOM","CVE","CVSS","patch","secrets rotation","key management","HSM","pen test","threat model","STRIDE"] },
    { label: "Packages",       words: ["Tailwind","Vite","webpack","esbuild","Turbopack","Storybook","Chromatic","Cypress","Playwright","Vitest","React Query","Zustand","Jotai","Zod","Radix UI","shadcn/ui","Framer Motion","D3","Three.js","Matter.js","Figma","PostCSS","Biome","ESLint","Prettier","Jekyll","GitHub Pages","Vercel","Netlify","npm workspaces","npm publish","npm link","npm pack","package.json exports","conditional exports","peer dependencies","npm overrides","publishConfig","prepublishOnly","npm provenance"] },
    { label: "a11y / i18n",    words: ["aria-label","aria-live","aria-describedby","role=","focus-visible","prefers-reduced-motion","WCAG 2.1","axe-core","screen reader","tab order","skip link","i18next","Intl.DateTimeFormat","Intl.NumberFormat","locale","RTL","pluralization","ICU MessageFormat"] },
  ];

  const wordToCategory = new Map<string, string>();
  CATEGORIES.forEach(({ label, words }) => words.forEach(w => wordToCategory.set(w, label)));

  let isSorted = false;
  let sortOverlay: HTMLDivElement | null = null;

  const enterSort = () => {
    const bodies = Composite.allBodies(engine.world).filter(b => !b.isStatic);
    if (!bodies.length) return;

    // Stop physics
    engine.gravity.y = 0;
    bodies.forEach(body => {
      (body as any).collisionFilter = { mask: 0 };
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
    });

    // Group by category
    const groups = new Map<string, Matter.Body[]>();
    bodies.forEach(body => {
      const cat = wordToCategory.get(body.label) ?? "Other";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(body);
    });

    // Build overlay DOM — measure layout to size the bin
    const overlay = document.createElement("div");
    overlay.style.cssText = "position:absolute;inset:0;padding:28px 20px 20px;overflow:visible;pointer-events:none;";

    const PAD = 20;
    const WORD_GAP = 5;
    const CAT_GAP = 16;
    const LABEL_H = 14;
    const binR = bin.getBoundingClientRect();
    const BW = binR.width;

    // Word elements keyed by body, positioned at canvas origin initially
    const wordEls = new Map<Matter.Body, HTMLSpanElement>();
    let totalH = 28; // top padding

    groups.forEach((groupBodies, catName) => {
      // Category label
      const lbl = document.createElement("p");
      lbl.textContent = catName;
      lbl.style.cssText = `
        margin:0 0 6px;font-size:9px;font-weight:700;letter-spacing:0.13em;
        text-transform:uppercase;color:var(--white-40);
        transform:translateX(-24px);opacity:0;
        transition:transform 400ms cubic-bezier(0.23,1,0.32,1),opacity 300ms ease;
      `;
      overlay.appendChild(lbl);
      totalH += LABEL_H + 6;

      // Word row container (flex-wrap)
      const row = document.createElement("div");
      row.style.cssText = `display:flex;flex-wrap:wrap;gap:${WORD_GAP}px;margin-bottom:${CAT_GAP}px;`;

      groupBodies.forEach(body => {
        const fontSize = (body as any).charSize ?? 14;
        const span = document.createElement("span");
        span.textContent = body.label;
        span.style.cssText = `
          font-family:var(--font-mono,"Ubuntu Mono",monospace);
          font-size:${fontSize}px;
          color:var(--accent-color-link);
          opacity:0;
          transition:opacity 300ms ease, transform 500ms cubic-bezier(0.23,1,0.32,1);
          display:inline-block;
          will-change:transform;
        `;
        row.appendChild(span);
        wordEls.set(body, span);
      });

      overlay.appendChild(row);
      // Rough height per row (will be measured after mount)
      totalH += Math.ceil(groupBodies.length / Math.floor(BW / 80)) * 24 + CAT_GAP;
    });

    bin.appendChild(overlay);
    sortOverlay = overlay;

    // After mount: FLIP — record final positions, start from canvas positions
    requestAnimationFrame(() => {
      // Walls already match bin height (set by syncBinHeight)

      wordEls.forEach((span, body) => {
        // Final position of span relative to viewport
        const spanR = span.getBoundingClientRect();
        // Current canvas position (viewport space)
        const fromX = body.position.x - window.scrollX;
        const fromY = body.position.y - window.scrollY;
        // Delta from final to current (FLIP: set transform to offset, then remove)
        const dx = fromX - (spanR.left + spanR.width / 2);
        const dy = fromY - (spanR.top + spanR.height / 2);
        span.style.transform = `translate(${dx}px,${dy}px) rotate(${body.angle}rad)`;
        span.style.opacity = "0.9";
      });

      // Hide canvas words (they'll overlap otherwise)
      canvas.style.opacity = "0";
      canvas.style.transition = "opacity 200ms";

      // Animate labels in
      requestAnimationFrame(() => {
        overlay.querySelectorAll("p").forEach((lbl, i) => {
          setTimeout(() => {
            (lbl as HTMLElement).style.transform = "translateX(0)";
            (lbl as HTMLElement).style.opacity = "1";
          }, i * 30);
        });

        // Animate words to final position
        wordEls.forEach((span) => {
          requestAnimationFrame(() => {
            span.style.transform = "translate(0,0) rotate(0rad)";
          });
        });
      });
    });
  };

document.getElementById("skills-sort-btn")?.addEventListener("click", () => {
    if (isSorted) return;
    isSorted = true;
    const btn = document.getElementById("skills-sort-btn")!;
    btn.style.display = "none";
    enterSort();
  });

  // ── Pre-size bin to match organized layout height ───────────────────────
  const measureOrganizedHeight = (): number => {
    const probe = document.createElement("div");
    probe.style.cssText = `
      position:fixed;left:-9999px;top:0;
      width:${bin.getBoundingClientRect().width}px;
      padding:28px 20px 20px;
      visibility:hidden;pointer-events:none;
    `;
    CATEGORIES.forEach(({ label, words }) => {
      const lbl = document.createElement("p");
      lbl.textContent = label;
      lbl.style.cssText = "margin:0 0 6px;font-size:9px;font-weight:700;";
      probe.appendChild(lbl);
      const row = document.createElement("div");
      row.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px;";
      words.forEach(w => {
        const span = document.createElement("span");
        span.textContent = w;
        span.style.cssText = "font-family:'Ubuntu Mono',monospace;font-size:13px;white-space:nowrap;";
        row.appendChild(span);
      });
      probe.appendChild(row);
    });
    document.body.appendChild(probe);
    const h = probe.scrollHeight + 32;
    probe.remove();
    return h;
  };

  const syncBinHeight = () => {
    bin.style.height = measureOrganizedHeight() + "px";
    walls.forEach(w => Composite.remove(engine.world, w));
    walls = makeWalls();
    Composite.add(engine.world, walls);
  };

  syncBinHeight();

  // ── Resize ──────────────────────────────────────────────────────────────
  window.addEventListener("resize", () => {
    resizeCanvas();
    syncBinHeight();
  });
};
