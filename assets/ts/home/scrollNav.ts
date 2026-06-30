export const initScrollNav = (): void => {
  const nav = document.getElementById("section-nav");
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll<HTMLButtonElement>("[data-section]"));
  const sections = tabs
    .map((t) => document.getElementById(t.dataset.section!))
    .filter(Boolean) as HTMLElement[];

  const setActive = (id: string) => {
    tabs.forEach((t) => {
      const active = t.dataset.section === id;
      t.setAttribute("aria-selected", String(active));
      t.classList.toggle("scroll-tab--active", active);
    });
  };

  // Click → smooth scroll
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.dataset.section!);
      if (!target) return;
      // offset for sticky nav height
      const navH = nav.getBoundingClientRect().height;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

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

  // Sticky: add bg/shadow once the nav itself is pinned to top
  // A sentinel div placed just above the nav triggers this.
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;height:1px;width:1px;pointer-events:none;";
  nav.parentElement?.insertBefore(sentinel, nav);
  const stickyObs = new IntersectionObserver(
    ([e]) => nav.classList.toggle("scroll-nav--stuck", !e.isIntersecting),
    { threshold: 0 }
  );
  stickyObs.observe(sentinel);

  // Initialise with the first section active
  if (sections[0]) setActive(sections[0].id);
};
