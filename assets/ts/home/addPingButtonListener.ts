import {
  addRecedeClass,
  closeDrawer,
  openDrawer,
  removeRecedeClass,
} from "./openDrawer";
import { sendPing } from "./sendPing";
import { UserInputManager } from "./terminal/UserInputManager";

const mainElement = document.querySelector("main") as HTMLElement;

const pingDrawer = document.querySelector("#ping-drawer") as HTMLElement;
const terminal2 = pingDrawer.querySelector(".terminal") as HTMLDivElement;

const handlePingInput = (message: string) => {
  sendPing(message);
  closeDrawer(pingDrawer);
  removeRecedeClass(mainElement);
};

const pingInputManager = new UserInputManager(terminal2, handlePingInput);

export const addPingButtonListener = () => {
  const pingButton = document.querySelector("#ping") as Element;
  const pingDrawer = document.querySelector("#ping-drawer") as Element;

  pingButton.addEventListener("click", () => {
    addRecedeClass(mainElement);
    openDrawer(pingDrawer);
    pingInputManager.focus();

    const closeDrawerOnClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!pingDrawer.contains(target)) {
        closeDrawer(pingDrawer); // Assuming you have a closeDrawer function
        removeRecedeClass(mainElement);
        document.removeEventListener("click", closeDrawerOnClickOutside, true);
      }
    };

    document.addEventListener("click", closeDrawerOnClickOutside, true);
  });
};
