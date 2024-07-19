import { closeDrawer, openDrawer } from "./openDrawer";

export const addTabs = () => {
  const TAB_QUERY_SELECTOR = "[role='tab']";

  const tabNodes = Array.from(document.querySelectorAll(TAB_QUERY_SELECTOR));
  const consoleDrawer = document.querySelector("#console-drawer") as Element;
  const promptElement = document.querySelector(".prompt") as HTMLInputElement;

  tabNodes.forEach((tab) => {
    tab.addEventListener("click", () => {
      history.pushState(null, "", tab.id);
      applyChanges(tab);
    });
  });
  window.onhashchange = function () {
    if (location.hash) {
      const tab = document.querySelector(location.hash);
      if (tab) {
        applyChanges(tab);
      }
    }
  };

  function applyChanges(clickedTab: Element) {
    tabNodes.forEach((tab) => {
      const isSelected = tab === clickedTab;
      tab.setAttribute("aria-selected", isSelected.toString());

      const tabPanelId = tab.getAttribute("aria-controls");
      const tabPanel = document.getElementById(tabPanelId || "");

      if (!tabPanel) {
        return;
      }

      if (isSelected) {
        tabPanel.removeAttribute("hidden");
      } else {
        tabPanel.setAttribute("hidden", "");
      }
    });

    if (clickedTab.getAttribute("id") === "console") {
      openDrawer(consoleDrawer);
      promptElement.focus();
    } else {
      closeDrawer(consoleDrawer);
      promptElement.blur();
    }
  }

  if (location.hash) {
    const tab = document.querySelector(location.hash);
    if (tab) {
      applyChanges(tab);
    }
  }
};

document.addEventListener("keydown", function (event) {
  if (event.key === "/") {
    event.preventDefault();
    history.pushState(null, "", "console");
  }
});
