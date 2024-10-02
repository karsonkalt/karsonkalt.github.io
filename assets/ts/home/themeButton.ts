import { updateAccentColor } from "./updateAccentColor";

const icon =
  '<svg class="icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" stroke="currentColor" fill="none"><rect class="cls-63763c42c3a86d32eae6f145-1" x="7.54" y="5.07" width="13.81" height="8.98" transform="translate(10.99 -7.41) rotate(45)"></rect><path class="cls-63763c42c3a86d32eae6f145-1" d="M16.15,17.62,14.6,19.17a2,2,0,0,1-2.76,0l-2-2L5,21.89a2.08,2.08,0,0,1-1.47.61h0A2.07,2.07,0,0,1,1.5,20.43h0A2.08,2.08,0,0,1,2.11,19L6.87,14.2l-2-2a2,2,0,0,1,0-2.76L6.38,7.85Z"></path><line class="cls-63763c42c3a86d32eae6f145-1" x1="15.66" y1="4.43" x2="11.27" y2="8.83"></line></svg>';

export const insertThemeButton = () => {
  const themeButton = document.createElement("input");
  themeButton.id = "theme-button";
  themeButton.type = "color";
  const themeButtonWrapper = document.createElement("div");
  themeButtonWrapper.id = "theme-button-wrapper";

  // insert a svg with class .icon
  themeButtonWrapper.insertAdjacentHTML("beforeend", icon);

  document
    .querySelector("main")
    ?.insertAdjacentElement("afterend", themeButtonWrapper);
  themeButtonWrapper.appendChild(themeButton);

  themeButton.onchange = () => {
    updateAccentColor(themeButton.value);
  };
};
