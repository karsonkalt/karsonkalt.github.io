const TAB_QUERY_SELECTOR = "[role='tab']";

const tabNodes = Array.from(document.querySelectorAll(TAB_QUERY_SELECTOR));

tabNodes.forEach((tab) => {
  tab.addEventListener("click", () => {
    history.replaceState(null, "", "#" + tab.id);
    applyChanges(tab);
  });
});

window.onhashchange = function () {
  const tab = document.querySelector(location.hash);
  if (tab) {
    applyChanges(tab);
  }
};

function applyChanges(clickedTab: Element) {
  updateBadge(clickedTab.getAttribute("id") === "stdout");

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
}

// duplicated from other
function updateBadge(hasUnreadStdout: boolean) {
  const stdoutTab = document.querySelector("#stdout");
  const badge = stdoutTab?.querySelector(".unread-badge");

  if (hasUnreadStdout) {
    badge?.classList.remove("show");
  }
}

if (location.hash) {
  const tab = document.querySelector(location.hash);
  if (tab) {
    applyChanges(tab);
  }
}
