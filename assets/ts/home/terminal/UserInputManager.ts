class UserInputManager {
  private prompt: HTMLInputElement;
  private terminal: HTMLDivElement;
  private mirrorElement: HTMLDivElement;
  private handleCommand: (command: string) => void;

  constructor(
    terminal: HTMLDivElement,
    handleCommand: (command: string) => void
  ) {
    this.terminal = terminal;
    this.prompt = terminal.querySelector(".prompt") as HTMLInputElement;
    this.mirrorElement = terminal.querySelector(
      ".input-mirror"
    ) as HTMLDivElement;
    this.handleCommand = handleCommand;
    this.initialize();
  }

  private initialize() {
    this.prompt.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" && !!this.prompt.value.trim()) {
        event.preventDefault();
        this.handleCommand(this.prompt.value.trim());
        this.createRipple();
        this.setPromptValue("");
      }
    });

    this.terminal.addEventListener("click", () => {
      this.prompt.focus();
    });

    this.prompt.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setPromptValue(target.value);
    });
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

  public setPromptValue(value: string) {
    this.prompt.value = value;
    this.mirrorElement.textContent = value;
  }

  public focus() {
    this.prompt.focus();
  }
}

export { UserInputManager };
