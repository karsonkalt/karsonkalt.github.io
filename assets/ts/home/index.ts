import { addGithubStatus } from "./githubStatus";
import { addTabs } from "./tabs";
import { addTerminal } from "./terminal/index";
import { addPingButtonListener } from "./addPingButtonListener";
import { loadLocalStorage } from "./loadLocalStorage";
import { addCopyButtons } from "./addCopyButtons";

document.addEventListener("DOMContentLoaded", () => {
  addTabs();
  addTerminal();
  addGithubStatus();
  addPingButtonListener();
  loadLocalStorage();
  addCopyButtons();
});
