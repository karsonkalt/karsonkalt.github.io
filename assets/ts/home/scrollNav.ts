export const initScrollNav = (): void => {
  const nav = document.getElementById("section-nav");
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll<HTMLButtonElement>("[data-section]"));
  const sections = tabs
    .map((t) => document.getElementById(t.dataset.section!))
    .filter(Boolean) as HTMLElement[];

  const select = document.getElementById("section-select") as HTMLSelectElement | null;
  const selectText = document.getElementById("section-select-text");

  // Map section id → display label
  const sectionLabel: Record<string, string> = {
    "section-writing": "Writing",
    "section-projects": "Projects",
    "section-artifacts": "Artifacts",
  };

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const navH = nav.getBoundingClientRect().height;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const setActive = (id: string) => {
    tabs.forEach((t) => {
      const active = t.dataset.section === id;
      t.setAttribute("aria-selected", String(active));
      t.classList.toggle("scroll-tab--active", active);
    });
    if (select && select.value !== id) select.value = id;
    if (selectText) selectText.textContent = sectionLabel[id] ?? id;
  };

  // Click → smooth scroll (desktop tabs)
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => scrollTo(tab.dataset.section!));
  });

  // Select → smooth scroll (mobile)
  select?.addEventListener("change", () => scrollTo(select.value));

  // Scroll-spy via IntersectionObserver
  // We watch each section with a rootMargin that fires when the section
  // top crosses ~30% from the top of the viewport (so the active tab
  // leads the scroll slightly rather than lagging).
  const observed = new Map<HTMLElement, boolean>();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        observed.set(e.target as HTMLElement, e.isIntersecting);
      });

      // Find the first intersecting section (top → bottom order)
      const active = sections.find((s) => observed.get(s));
      if (active) setActive(active.id);
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }
  );

  sections.forEach((s) => {
    observed.set(s, false);
    io.observe(s);
  });

  // Back-to-top button
  const backToTop = document.getElementById("back-to-top");
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Sticky: add bg/shadow + reveal back-to-top once nav is pinned
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;height:1px;width:1px;pointer-events:none;";
  nav.parentElement?.insertBefore(sentinel, nav);
  const stickyObs = new IntersectionObserver(
    ([e]) => {
      const stuck = !e.isIntersecting;
      nav.classList.toggle("scroll-nav--stuck", stuck);
      if (backToTop) {
        backToTop.style.opacity = stuck ? "1" : "0";
        backToTop.style.pointerEvents = stuck ? "auto" : "none";
      }
    },
    { threshold: 0 }
  );
  stickyObs.observe(sentinel);

  // Initialise with the first section active
  if (sections[0]) setActive(sections[0].id);
};
