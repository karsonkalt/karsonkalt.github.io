import { AutoTypeManager } from "./AutoTypeManager";
import { UserInputManager } from "./UserInputManager";

const CONFIG = {
  DELETE_SPEED: 100,
  FOCUS_TIMEOUT: 6000,
};

const prompt = document.querySelector(".prompt") as HTMLInputElement;
const mirrorElement = document.querySelector(".input-mirror") as HTMLDivElement;
const terminal = document.querySelector(".terminal") as HTMLDivElement;

const autoTypeManager = new AutoTypeManager(
  prompt,
  mirrorElement,
  CONFIG.DELETE_SPEED,
  CONFIG.FOCUS_TIMEOUT
);
const userInputManager = new UserInputManager(
  prompt,
  terminal,
  autoTypeManager
);
