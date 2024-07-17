import { userInputManager } from "./terminal/index";

export const addPingButtonListener = () => {
  const pingButton = document.querySelector("#ping") as HTMLElement;

  pingButton.addEventListener("click", () => {
    if (window.location.hash !== "#console") {
      window.location.hash = "#console";
    }
    userInputManager.setPromptValue("ping ");
    const promptElement = document.querySelector(".prompt") as HTMLInputElement;
    promptElement.focus();
  });
};
