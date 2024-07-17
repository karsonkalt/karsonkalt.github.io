import { UserInputManager } from "./UserInputManager";

const prompt = document.querySelector(".prompt") as HTMLInputElement;
const mirrorElement = document.querySelector(".input-mirror") as HTMLDivElement;
const terminal = document.querySelector(".terminal") as HTMLDivElement;

export const userInputManager = new UserInputManager(
  prompt,
  terminal,
  mirrorElement
);

export const addTerminal = () => {
  userInputManager.handleBashCommand("restore", false); // TODO I dont like this
  userInputManager.handleBashCommand("help", true);
};
