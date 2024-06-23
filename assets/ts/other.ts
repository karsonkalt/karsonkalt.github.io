import { executeCommand } from "./terminal/commands";
import { AutoTypeOption, autoTypeOptions } from "./terminal/autoTypeOptions";

const CONFIG = {
  DELETE_SPEED: 100,
  FOCUS_TIMEOUT: 6000,
};

class TerminalSimulator {
  private abortController: AbortController | null;
  private focusTimeoutId: NodeJS.Timeout | null;
  private currentItemIndex: number;
  private currentText: string;
  private currentAutoTypeOption: AutoTypeOption;
  private terminal: HTMLDivElement;
  private prompt: HTMLInputElement;
  private mirrorElement: HTMLDivElement;

  constructor() {
    this.abortController = null;
    this.focusTimeoutId = null;
    this.currentItemIndex = 0;
    this.currentText = "";
    this.currentAutoTypeOption = autoTypeOptions[this.currentItemIndex];
    this.terminal = document.querySelector(".terminal") as HTMLDivElement;
    this.prompt = document.querySelector(".prompt") as HTMLInputElement;
    this.mirrorElement = document.querySelector(
      ".input-mirror"
    ) as HTMLDivElement;
    this.initialize();
  }

  private sleep(ms: number, signal: AbortSignal) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => resolve(true), ms);
      signal.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  }

  private createRipple() {
    const targetElement = document.querySelector(".ripple-container") as
      | HTMLElement
      | undefined;
    const size =
      Math.max(
        targetElement?.offsetWidth || 0,
        targetElement?.offsetHeight || 0
      ) * 1.1;

    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.setProperty("--ripple-size", `${size}px`);
    targetElement?.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  }

  private setPromptValue(value: any) {
    console.log("Setting prompt value:", value);
    this.prompt.value = String(value);
    this.mirrorElement.textContent = String(value);
  }

  private async startAutoType() {
    console.log("startAutoType called");
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();
    this.currentText = "";
    this.currentAutoTypeOption = autoTypeOptions[this.currentItemIndex];
    try {
      await this.autoType(this.abortController.signal);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("AutoType aborted");
      }
    }
  }

  private async autoType(signal: AbortSignal) {
    console.log("autoType called");

    for (let i = this.currentItemIndex; i < autoTypeOptions.length; i++) {
      this.currentItemIndex = i;
      this.currentAutoTypeOption = autoTypeOptions[this.currentItemIndex];
      this.currentText = "";
      console.log("Typing item:", this.currentAutoTypeOption);

      // Respect initial delay before starting to type the new item
      await this.sleep(this.currentAutoTypeOption.initialDelay, signal);

      for (let char of this.currentAutoTypeOption.input) {
        this.currentText += char;
        this.setPromptValue(this.currentText);
        await this.sleep(this.currentAutoTypeOption.typeSpeed, signal);
      }

      // Respect end action delay before executing or backspacing
      await this.sleep(this.currentAutoTypeOption.endActionDelay, signal);

      if (this.currentAutoTypeOption.execute) {
        this.handleBashCommand(this.currentAutoTypeOption.input);
      }

      if (this.currentAutoTypeOption.backspace) {
        await this.backspace(this.currentText.length, signal);
      } else {
        await this.moveToNextItem(signal);
      }
    }
  }

  private async backspace(length: number, signal: AbortSignal) {
    console.log("backspace called with length:", length);
    for (let i = length; i > 0; i--) {
      this.currentText = this.currentText.substring(0, i - 1);
      this.setPromptValue(this.currentText);
      await this.sleep(CONFIG.DELETE_SPEED, signal);
    }
  }

  private async moveToNextItem(signal: AbortSignal) {
    console.log("moveToNextItem called");
    await this.sleep(CONFIG.DELETE_SPEED, signal);
  }

  private handleBashCommand(command: string) {
    console.log("handleBashCommand called with command:", command);
    this.createRipple();
    const [cmd, ...args] = command.split(" ");
    const result = executeCommand(cmd as any, args);
    const formattedHelpText = result.replace(/\n/g, "<br/>");

    this.setPromptValue("");
    this.addToStdoutLog(command, formattedHelpText);
  }

  private addToStdoutLog(command: string, output: string) {
    console.log(
      "addToStdoutLog called with command and output:",
      command,
      output
    );
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
    console.log("updateBadge called with hasUnreadStdout:", hasUnreadStdout);
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
    console.log("switchTab called with tabName:", tabName);
    if (tabName === "stdout") {
      const currentTab = document.querySelector(
        'button[role="tab"][aria-selected="true"]'
      )?.id;
      if (currentTab) this.updateBadge(currentTab !== "stdout");
    }
  }

  private stopAutoType() {
    console.log("stopAutoType called");
    this.setPromptValue("");
    if (this.focusTimeoutId) clearTimeout(this.focusTimeoutId);
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private resetFocusTimeout() {
    console.log("resetFocusTimeout called");
    if (this.focusTimeoutId) clearTimeout(this.focusTimeoutId);
    this.focusTimeoutId = setTimeout(() => {
      if (!document.activeElement?.isEqualNode(this.prompt)) {
        this.startAutoType();
      }
    }, CONFIG.FOCUS_TIMEOUT);
  }

  private initialize() {
    this.prompt.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" && !!this.prompt.value.trim()) {
        event.preventDefault();
        this.handleBashCommand(this.prompt.value.trim());
        this.setPromptValue("");
        this.stopAutoType();
      }
    });

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", (event: Event) => {
        const tabName = (event.target as HTMLElement)?.getAttribute("data-tab");
        if (tabName) this.switchTab(tabName);
      });
    });

    this.prompt.addEventListener("focus", () => {
      console.log("Prompt focused");
      this.stopAutoType();
    });

    this.prompt.addEventListener("blur", () => {
      console.log("Prompt blurred");
      this.resetFocusTimeout();
    });

    this.terminal.addEventListener("click", () => {
      if (!document.activeElement?.isEqualNode(this.prompt)) {
        this.prompt.focus();
      }
    });

    this.prompt.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setPromptValue(target.value);
    });

    if (autoTypeOptions.length) {
      this.startAutoType();
    }
  }
}

new TerminalSimulator();
