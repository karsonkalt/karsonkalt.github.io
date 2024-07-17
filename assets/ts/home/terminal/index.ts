import { UserInputManager } from "./UserInputManager";

export const addTerminal = () => {
  const prompt = document.querySelector(".prompt") as HTMLInputElement;
  const mirrorElement = document.querySelector(
    ".input-mirror"
  ) as HTMLDivElement;
  const terminal = document.querySelector(".terminal") as HTMLDivElement;

  const userInputManager = new UserInputManager(
    prompt,
    terminal,
    mirrorElement
  );

  userInputManager.handleBashCommand("restore", false); // TODO I dont like this
  userInputManager.handleBashCommand("help", true);
};
