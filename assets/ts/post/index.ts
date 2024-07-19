import chroma from "chroma-js";
import { addCopyButtons } from "./addCopyButtons";

const generateRandomAccentColor = () => {
  const randomColor = chroma.random().darken(1).hex();
  const rgbString = chroma(randomColor).rgb().join(", ");
  document.documentElement.style.setProperty("--accent-color-base", rgbString);
};

document.addEventListener("DOMContentLoaded", () => {
  generateRandomAccentColor();
  addCopyButtons();
});
