console.log(`
▄▄▄   ▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄    ▄ 
█   █ █ █       █   ▄  █ █       █       █  █  █ █
█   █▄█ █   ▄   █  █ █ █ █  ▄▄▄▄▄█   ▄   █   █▄█ █
█      ▄█  █▄█  █   █▄▄█▄█ █▄▄▄▄▄█  █ █  █       █
█     █▄█       █    ▄▄  █▄▄▄▄▄  █  █▄█  █  ▄    █
█    ▄  █   ▄   █   █  █ █▄▄▄▄▄█ █       █ █ █   █
█▄▄▄█ █▄█▄▄█ █▄▄█▄▄▄█  █▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄█  █▄▄█
        
▄▄▄   ▄ ▄▄▄▄▄▄▄ ▄▄▄     ▄▄▄▄▄▄▄ 
█   █ █ █       █   █   █       █
█   █▄█ █   ▄   █   █   █▄     ▄█
█      ▄█  █▄█  █   █     █   █  
█     █▄█       █   █▄▄▄  █   █  
█    ▄  █   ▄   █       █ █   █  
█▄▄▄█ █▄█▄▄█ █▄▄█▄▄▄▄▄▄▄█ █▄▄▄█  
        
Hi there! 👋 I see you opened up the dev tools.

This site is powered by Jekyll and GitHub pages and is a simple interface for me to jot down my thoughts in markdown.

If you're interested in connecting, please reach out to me via LinkedIn at:
http://linkedin.com/in/kaltkarson
`);

const TAB_QUERY_SELECTOR = "[role='tab']";

const tabNodes = Array.from(document.querySelectorAll(TAB_QUERY_SELECTOR));

tabNodes.forEach((tab) => {
  tab.addEventListener("click", () => {
    history.replaceState(null, null, "#" + tab.id);
    applyChanges(tab);
  });
});

window.onhashchange = function () {
  const tab = document.querySelector(location.hash);
  if (tab) {
    applyChanges(tab);
  }
};

function applyChanges(tab) {
  tabNodes.forEach((item) => {
    const isSelected = item === tab;
    item.setAttribute("aria-selected", isSelected.toString());
    document
      .getElementById(item.getAttribute("aria-controls"))
      .setAttribute("aria-hidden", (!isSelected).toString());
  });
}

if (location.hash) {
  const tab = document.querySelector(location.hash);
  if (tab) {
    applyChanges(tab);
  }
}

// ScrollReveal().reveal(".post-link", {
//   distance: "10%",
//   origin: "bottom",
//   // reset: true,
// });

ScrollReveal().reveal("div.highlight", {
  delay: 100,
  distance: "5%",
  reset: true,
  origin: "bottom",
});
