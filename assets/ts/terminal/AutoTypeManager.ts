import { AutoTypeOption, autoTypeOptions } from "./autoTypeOptions";

class AutoTypeManager {
  private abortController: AbortController | null = null;
  private currentItemIndex: number = 0;
  private currentText: string = "";
  private currentAutoTypeOption: AutoTypeOption =
    autoTypeOptions[this.currentItemIndex];
  private prompt: HTMLInputElement;
  private mirrorElement: HTMLDivElement;
  private deleteSpeed: number = 100;
  private terminal: HTMLDivElement;

  constructor(
    prompt: HTMLInputElement,
    terminal: HTMLDivElement,
    mirrorElement: HTMLDivElement
  ) {
    this.prompt = prompt;
    this.mirrorElement = mirrorElement;
    this.terminal = terminal;
    this.startAutoType();
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

  private setPromptValue(value: string) {
    this.prompt.value = value;
    this.mirrorElement.textContent = value;
  }

  public async startAutoType() {
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
        // console.log("AutoType aborted");
      }
    }
  }

  private async autoType(signal: AbortSignal) {
    for (let i = this.currentItemIndex; i < autoTypeOptions.length; i++) {
      this.currentItemIndex = i;
      this.currentAutoTypeOption = autoTypeOptions[this.currentItemIndex];
      this.currentText = "";

      await this.sleep(this.currentAutoTypeOption.initialDelay, signal);

      for (let char of this.currentAutoTypeOption.input) {
        this.currentText += char;
        this.setPromptValue(this.currentText);
        await this.sleep(this.currentAutoTypeOption.typeSpeed, signal);
      }

      await this.sleep(this.currentAutoTypeOption.endActionDelay, signal);

      if (this.currentAutoTypeOption.execute) {
        this.executeCommand(this.currentAutoTypeOption.input);
      }

      if (this.currentAutoTypeOption.backspace) {
        await this.backspace(this.currentText.length, signal);
      } else {
        await this.moveToNextItem(signal);
      }
    }
  }

  private async backspace(length: number, signal: AbortSignal) {
    for (let i = length; i > 0; i--) {
      this.currentText = this.currentText.substring(0, i - 1);
      this.setPromptValue(this.currentText);
      await this.sleep(this.deleteSpeed, signal);
    }
  }

  private async moveToNextItem(signal: AbortSignal) {
    await this.sleep(this.deleteSpeed, signal);
  }

  private executeCommand(command: string) {
    const event = new CustomEvent("executeCommand", {
      detail: { command },
    });
    window.dispatchEvent(event);
  }

  public stopAutoType() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }
}

export { AutoTypeManager };
