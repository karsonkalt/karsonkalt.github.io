import { updateAccentColor } from "./terminal/updateAccentColor";

export const insertThemeButton = () => {
  const themeButton = document.createElement("input");
  themeButton.id = "theme-button";
  themeButton.type = "color";
  const themeButtonWrapper = document.createElement("div");
  themeButtonWrapper.id = "theme-button-wrapper";
  document
    .querySelector("main")
    ?.insertAdjacentElement("afterend", themeButtonWrapper);
  themeButtonWrapper.appendChild(themeButton);

  themeButtonWrapper.style.backgroundColor = "var(--accent-color)";

  themeButton.onchange = () => {
    themeButtonWrapper.style.backgroundColor = "var(--accent-color)";
    updateAccentColor(themeButton.value);
  };
};
