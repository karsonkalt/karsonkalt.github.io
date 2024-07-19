import { executeCommand } from "./commands";
import { UserInputManager } from "./UserInputManager";

const consoleDrawer = document.querySelector("#console-drawer") as HTMLElement;
const terminal = consoleDrawer.querySelector(".terminal") as HTMLDivElement;

export const consoleInputManager = new UserInputManager(
  terminal,
  handleBashCommand
);

function handleBashCommand(command: string) {
  const [cmd, ...args] = command.split(" ");
  const result = executeCommand(cmd as any, args);
  const formattedHelpText = result.replace(/\n/g, "<br/>");

  addToStdoutLog(command, formattedHelpText);
}

function addToStdoutLog(command: string, output: string) {
  const tabPanels = document.querySelector(".tab-panels") as Element;
  const ul = tabPanels.querySelector(".stdout-log") as Element;
  const li = document.createElement("li") as Element;

  li.innerHTML = `
    <div class="stdout-entry">
      <div class="stdout-entry-wrapper">
        <span class="stdout-command">${command}</span>
        <div class="stdout-output">${output}</div>
      </div>
    </div>
  `;

  ul.insertBefore(li, ul.firstChild);
}

export const addTerminal = () => {
  handleBashCommand("help");
};
