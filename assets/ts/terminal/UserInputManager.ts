import { AutoTypeManager } from "./AutoTypeManager";
import { executeCommand } from "./commands";

class UserInputManager {
  private prompt: HTMLInputElement;
  private terminal: HTMLDivElement;
  private autoTypeManager: AutoTypeManager;
  private mirrorElement: HTMLDivElement;

  constructor(
    prompt: HTMLInputElement,
    terminal: HTMLDivElement,
    autoTypeManager: AutoTypeManager,
    mirrorElement: HTMLDivElement
  ) {
    this.prompt = prompt;
    this.terminal = terminal;
    this.autoTypeManager = autoTypeManager;
    this.mirrorElement = mirrorElement;
    this.initialize();
  }

  private createRipple() {
    const targetElement = document.querySelector(
      ".ripple-container"
    ) as HTMLElement;
    const size =
      Math.max(targetElement.offsetWidth, targetElement.offsetHeight) * 1.1;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.setProperty("--ripple-size", `${size}px`);
    targetElement.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  }

  private setPromptValue(value: string) {
    this.prompt.value = value;
    this.mirrorElement.textContent = value;
  }

  private handleBashCommand(command: string) {
    this.createRipple();
    const [cmd, ...args] = command.split(" ");
    const result = executeCommand(cmd as any, args);
    const formattedHelpText = result.replace(/\n/g, "<br/>");

    this.setPromptValue("");
    this.addToStdoutLog(command, formattedHelpText);
  }

  private addToStdoutLog(command: string, output: string) {
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

    const currentTab = document.querySelector(
      'button[role="tab"][aria-selected="true"]'
    )?.id;
    if (currentTab) this.updateBadge(currentTab !== "stdout");
  }

  private updateBadge(hasUnreadStdout: boolean) {
    const stdoutTab = document.querySelector("#stdout") as Element;
    const badge = stdoutTab.querySelector(".unread-badge") as Element;

    if (hasUnreadStdout) {
      if (!badge.classList.contains("show")) {
        badge.classList.add("show");
      } else {
        badge.classList.add("pulse");
        badge.addEventListener(
          "animationend",
          () => badge.classList.remove("pulse"),
          { once: true }
        );
      }
    } else {
      badge.classList.remove("show", "pulse");
    }
  }

  private switchTab(tabName: string) {
    if (tabName === "stdout") {
      const currentTab = document.querySelector(
        'button[role="tab"][aria-selected="true"]'
      )?.id;
      if (currentTab) this.updateBadge(currentTab !== "stdout");
    }
  }

  private initialize() {
    this.prompt.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" && !!this.prompt.value.trim()) {
        event.preventDefault();
        this.handleBashCommand(this.prompt.value.trim());
        this.setPromptValue("");
        this.autoTypeManager.stopAutoType();
      }
    });

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (event: Event) => {
        const tabName = (event.target as HTMLElement)?.getAttribute("data-tab");
        if (tabName) this.switchTab(tabName);
      });
    });

    this.prompt.addEventListener("focus", () => {
      this.autoTypeManager.stopAutoType();
    });

    this.prompt.addEventListener("blur", () => {
      this.autoTypeManager.startAutoType();
    });

    this.terminal.addEventListener("click", () => {
      this.prompt.focus();
    });

    this.prompt.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setPromptValue(target.value);
    });

    window.addEventListener("executeCommand", (event: Event) => {
      const customEvent = event as CustomEvent;
      const command = customEvent.detail.command;
      this.handleBashCommand(command);
    });
  }
}

export { UserInputManager };
