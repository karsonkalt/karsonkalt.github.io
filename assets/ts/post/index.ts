import chroma from "chroma-js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("this ran");
  const generateRandomAccentColor = () => {
    const randomColor = chroma.random().darken(1).hex();
    const rgbString = chroma(randomColor).rgb().join(", ");
    document.documentElement.style.setProperty(
      "--accent-color-base",
      rgbString
    );
  };
  generateRandomAccentColor();
});
