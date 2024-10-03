import { addGithubStatus } from "./githubStatus";
import { addTabs } from "./tabs";
import { addTerminal } from "./terminal/index";
import { loadLocalStorage } from "./loadLocalStorage";
import { addGlareEffect } from "./addGlareEffect";
import { addM110Effect } from "./addM110Effect";

document.addEventListener("DOMContentLoaded", () => {
  addTabs();
  addTerminal();
  addGithubStatus();
  loadLocalStorage();
  addGlareEffect();
  addM110Effect();
});

document
  .getElementById("my-stack-link")
  ?.addEventListener("click", function (event) {
    console.log("clicked");
    event.preventDefault();
    document.getElementById("my-stack")?.scrollIntoView({ behavior: "smooth" });
  });
