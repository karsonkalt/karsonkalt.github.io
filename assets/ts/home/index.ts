import { loadLocalStorage } from "./loadLocalStorage";
import { addGlareEffect } from "./addGlareEffect";
import { addM110Effect } from "./addM110Effect";
import { initScrollNav } from "./scrollNav";
import { initSkillsSort } from "./skillsSort";

document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  addGlareEffect();
  addM110Effect();
  initScrollNav();
  initSkillsSort();
});
