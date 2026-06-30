const CATEGORIES: { label: string; skills: string[] }[] = [
  { label: "TypeScript",       skills: ["keyof T", "infer R", "satisfies", "as const", "Partial<T>", "Omit<T,K>", "discriminated union", "type predicate", "ReturnType<T>"] },
  { label: "React",            skills: ["useCallback", "useMemo", "useRef<T>", "useTransition", "Suspense", "forwardRef", "memo()", "ErrorBoundary", "startTransition"] },
  { label: "D3 / Data Viz",    skills: ["d3.select()", "d3.join()", "d3.scaleLinear()", "d3.forceSimulation()", "d3.zoom()", "d3.transition()", "d3.hierarchy()", "treemap", "sankey"] },
  { label: "React Flow",       skills: ["useNodes()", "useEdges()", "useReactFlow()", "NodeTypes", "EdgeTypes", "rf.fitView()", "MiniMap", "rf.useStore()"] },
  { label: "Graph Theory",     skills: ["DAG", "BFS", "DFS", "force-directed", "ELK", "dagre", "shortest path", "adjacency list", "topological sort"] },
  { label: "CSS / Platform",   skills: ["@layer", "@container", ":has()", "@property", "view-transition-name", "oklch()", "subgrid", "content-visibility", "anchor-name"] },
  { label: "Design Systems",   skills: ["design token", "token alias", "headless", "compound", "Storybook", "Chromatic", "color ramp", "8pt grid", "semantic token"] },
  { label: "Figma",            skills: ["auto layout", "variants", "dev mode", "component set", "code connect", "figma variable", "base component", "boolean prop"] },
  { label: "AWS",              skills: ["Lambda", "S3", "IAM", "CloudFront", "API Gateway", "CDK", "CloudWatch", "EventBridge", "presigned URL"] },
  { label: "Git / CI",         skills: ["git worktree", "git rebase -i", "gh pr create", "GitHub Actions", "matrix strategy", "CODEOWNERS", "trunk-based", "DORA metrics"] },
  { label: "Architecture",     skills: ["SSR", "micro-frontend", "event-driven", "CQRS", "BFF", "monorepo", "islands arch", "module federation", "strangler fig"] },
  { label: "Performance",      skills: ["LCP", "INP", "CLS", "code splitting", "virtualization", "memoization", "lazy load", "debounce", "bundle analysis"] },
  { label: "Observability",    skills: ["OpenTelemetry", "Sentry", "Grafana", "structured log", "P95", "SLO", "error budget", "distributed tracing"] },
  { label: "a11y / i18n",      skills: ["aria-label", "aria-live", "focus-visible", "WCAG 2.1", "prefers-reduced-motion", "i18next", "RTL", "skip link"] },
];

export const initSkillsSort = () => {
  const bin     = document.getElementById("skills-bin");
  const btn     = document.getElementById("skills-sort-btn");
  const grid    = document.getElementById("skills-grid");
  const canvas  = bin?.querySelector("canvas") as HTMLCanvasElement | null;
  if (!bin || !btn || !grid) return;

  let sorted = false;

  const buildGrid = () => {
    grid.innerHTML = "";
    grid.className = "absolute inset-0 pt-8 px-4 pb-4 overflow-auto";

    const wrap = document.createElement("div");
    wrap.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;";

    CATEGORIES.forEach(({ label, skills }) => {
      const tile = document.createElement("div");
      tile.style.cssText = `
        border: 0.5px solid var(--white-20);
        border-radius: 4px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      `;

      const heading = document.createElement("p");
      heading.textContent = label;
      heading.style.cssText = "margin:0;font-size:0.625rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--white-50);";
      tile.appendChild(heading);

      const tags = document.createElement("div");
      tags.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;";
      skills.forEach(s => {
        const tag = document.createElement("span");
        tag.textContent = s;
        tag.style.cssText = `
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--accent-color-link);
          background: var(--white-05);
          border-radius: 2px;
          padding: 1px 5px;
          white-space: nowrap;
        `;
        tags.appendChild(tag);
      });
      tile.appendChild(tags);
      wrap.appendChild(tile);
    });

    grid.appendChild(wrap);
  };

  btn.addEventListener("click", () => {
    sorted = !sorted;
    if (sorted) {
      buildGrid();
      grid.style.display = "block";
      if (canvas) canvas.style.opacity = "0";
      btn.textContent = "Unsort";
    } else {
      grid.style.display = "none";
      if (canvas) canvas.style.opacity = "1";
      btn.textContent = "Sort";
    }
  });
};
