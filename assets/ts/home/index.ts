import { loadLocalStorage } from "./loadLocalStorage";
import { addGlareEffect } from "./addGlareEffect";
import { addM110Effect } from "./addM110Effect";
import { initScrollNav } from "./scrollNav";
import { initSkillsBin } from "./skillsBin";

document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  addGlareEffect();
  addM110Effect();
  initScrollNav();
  initSkillsBin();
});
