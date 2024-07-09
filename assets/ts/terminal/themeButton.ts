import { updateAccentColor } from "./updateAccentColor";

export const insertThemeButton = () => {
  const themeButton = document.createElement("input");
  themeButton.id = "theme-button";
  themeButton.type = "color";
  const themeButtonWrapper = document.createElement("div");
  themeButtonWrapper.id = "theme-button-wrapper";
  document.querySelector("main")?.appendChild(themeButtonWrapper);
  themeButtonWrapper.appendChild(themeButton);

  const accentColor =
    localStorage.getItem("ACCENT_COLOR") ||
    getComputedStyle(document.documentElement).getPropertyValue(
      "--accent-color"
    );

  themeButtonWrapper.style.backgroundColor = accentColor; // initialize

  themeButton.onchange = () => {
    themeButtonWrapper.style.backgroundColor = themeButton.value;
    updateAccentColor(themeButton.value);
  };
};
