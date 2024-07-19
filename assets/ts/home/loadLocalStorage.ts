import { updateAccentColor } from "./updateAccentColor";

export const loadLocalStorage = () => {
  const bgColor = localStorage.getItem("ACCENT_COLOR");
  if (bgColor) updateAccentColor(bgColor);
};
