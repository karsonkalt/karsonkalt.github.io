export const addTabs = () => {
  const tabNodes = Array.from(document.querySelectorAll<HTMLElement>("[role='tab']"));

  function applyChanges(clickedTab: Element) {
    tabNodes.forEach((tab) => {
      const isSelected = tab === clickedTab;
      tab.setAttribute("aria-selected", isSelected.toString());

      const panelId = tab.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      if (isSelected) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  }

  tabNodes.forEach((tab) => {
    tab.addEventListener("click", () => {
      history.pushState(null, "", `#${tab.id}`);
      applyChanges(tab);
    });
  });

  window.onpopstate = () => {
    const hash = window.location.hash.substring(1);
    const tab = hash ? document.getElementById(hash) : null;
    if (tab) applyChanges(tab);
  };

  // Apply initial hash if present
  const initialHash = window.location.hash.substring(1);
  const initialTab = initialHash ? document.getElementById(initialHash) : null;
  if (initialTab) applyChanges(initialTab);
};
