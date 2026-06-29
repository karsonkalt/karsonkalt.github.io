import { loadLocalStorage } from "./loadLocalStorage";
import { addGlareEffect } from "./addGlareEffect";
import { addM110Effect } from "./addM110Effect";

document.addEventListener("DOMContentLoaded", () => {
  loadLocalStorage();
  addGlareEffect();
  addM110Effect();
});
