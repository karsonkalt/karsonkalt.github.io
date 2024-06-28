import { AutoTypeManager } from "./AutoTypeManager";
import { UserInputManager } from "./UserInputManager";

const prompt = document.querySelector(".prompt") as HTMLInputElement;
const mirrorElement = document.querySelector(".input-mirror") as HTMLDivElement;
const terminal = document.querySelector(".terminal") as HTMLDivElement;

const autoTypeManager = new AutoTypeManager(prompt, terminal, mirrorElement);

const userInputManager = new UserInputManager(
  prompt,
  terminal,
  autoTypeManager,
  mirrorElement
);

document.addEventListener("DOMContentLoaded", () => {
  userInputManager.handleBashCommand("restore", false);
});
