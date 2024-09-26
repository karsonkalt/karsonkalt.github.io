import { updateAccentColor } from "../updateAccentColor";

const restoreCommand: CommandExecute = (args) => {
  const promptCharacter = localStorage.getItem("PS1");
  if (promptCharacter) exportCommand(["PS1=" + promptCharacter]);
  const bgColor = localStorage.getItem("ACCENT_COLOR");
  if (bgColor) bgcolorCommand([bgColor]);
  return "Restored terminal settings";
};

const clearCommand: CommandExecute = (args) => {
  const stdoutLog = document.querySelector(".stdout-log");

  while (stdoutLog?.firstChild) {
    stdoutLog.removeChild(stdoutLog.firstChild);
  }

  return "Console cleared";
};

const helpCommand: CommandExecute = (args) => {
  let helpText = "Available commands:\n";

  for (const [commandName, command] of Object.entries(supportedCommands)) {
    helpText += `- ${commandName}: ${command.description}\n`;
    for (const [flagName, flagDescription] of Object.entries(command.flags)) {
      helpText += `  - ${flagName}: ${flagDescription}\n`;
    }
  }

  // Replace newline characters with <br/>
  const formattedHelpText = helpText.replace(/\n/g, "<br/>");

  return formattedHelpText;
};

const exportCommand: CommandExecute = (args) => {
  const arg = args[0];

  const addToLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  // Handle PS1
  if (arg.startsWith("PS1=")) {
    const newPromptCharacter = arg.slice(4).trim();
    const promptElements = document.querySelectorAll(".system-prompt");
    promptElements.forEach((el) => {
      el.textContent = newPromptCharacter;
    });
    addToLocalStorage("PS1", newPromptCharacter);
    return `Prompt character changed to ${newPromptCharacter}`;
  }

  return "Invalid export command. Usage: export PS1=$";
};

const bgcolorCommand: CommandExecute = (args) => {
  const newColor = args.join(" ").trim();
  const updateSuccessful = updateAccentColor(newColor);

  if (updateSuccessful) {
    return `Accent changed to ${newColor}`;
  }

  return "Invalid color. Please provide: #000000, rgb(0, 0, 0) or any valid css color.";
};

const snarkyResponse: CommandExecute = () => {
  const randomIndex = Math.floor(Math.random() * snarkyResponses.length);
  return snarkyResponses[randomIndex];
};

function showTab(tabName: string) {
  const tab = document.querySelector(`#${tabName}`);
  if (tab) {
    tab.removeAttribute("hidden");
    return `Tab "${tabName}" is now visible.`;
  } else {
    return `Error: Tab "${tabName}" does not exist.`;
  }
}

const echoCommand: CommandExecute = (args) => {
  createEchoes(args.join(" "));
  return `Echo effect triggered for ${args.join(" ")}`;
};

function echo(text: string, position: "topLeft" | "bottomRight") {
  const oval = document.createElement("div");
  oval.classList.add("oval");
  oval.innerText = text;

  // Common styles for the oval
  // oval.style.position = "fixed";
  oval.style.display = "flex";
  oval.style.alignItems = "center";
  oval.style.justifyContent = "center";
  oval.style.zIndex = "500";

  // Apply the position-specific styles
  if (position === "topLeft") {
    oval.style.left = "50px";
    oval.style.top = "50px";
  } else {
    oval.style.right = "50px";
    oval.style.bottom = "50px";
    oval.style.backgroundColor = "#001349";
    oval.style.color = "#9a9a9a";
  }

  // Append the oval to the body
  document.body.appendChild(oval);

  // Add a class for animation and styles, if needed
  oval.classList.add("oval-animate");

  // Remove the oval from the DOM after the animation ends
  oval.addEventListener("animationend", () => {
    document.body.removeChild(oval);
  });
}

// Function to create multiple ovals with the same text
function createEchoes(text: string) {
  echo(text, "topLeft");
}

export type Command = {
  execute: CommandExecute;
  flags?: { [flag: string]: string };
  description?: string;
};

interface CommandExecute {
  (args: string[]): string;
}

export type Commands = {
  [command: string]: Command;
};

const supportedCommands = {
  clear: {
    execute: clearCommand,
    description: "Clears the terminal screen",
    flags: {},
  },
  echo: {
    execute: echoCommand,
    description: "Prints back the input received",
    flags: {},
  },

  help: {
    execute: helpCommand,
    description: "Shows help information about all commands",
    flags: {},
  },
  bgcolor: {
    execute: bgcolorCommand,
    description: "Changes the background color",
    flags: {},
  },
  export: {
    execute: exportCommand,
    description: "Exports a variable",
    flags: {},
  },
  restore: {
    execute: restoreCommand,
    description: "Restores terminal settings",
    flags: {},
  },
} satisfies Commands;

const invalidCommands = {
  cd: { execute: snarkyResponse },
  rm: { execute: snarkyResponse },
  sudo: { execute: snarkyResponse },
  mv: { execute: snarkyResponse },
  chmod: { execute: snarkyResponse },
  chown: { execute: snarkyResponse },
  mkdir: { execute: snarkyResponse },
  ls: { execute: snarkyResponse },
  cat: { execute: snarkyResponse },
  ps: { execute: snarkyResponse },
  top: { execute: snarkyResponse },
  vi: { execute: snarkyResponse },
  nano: { execute: snarkyResponse },
  exit: { execute: snarkyResponse },
  man: { execute: snarkyResponse },
  grep: { execute: snarkyResponse },
  find: { execute: snarkyResponse },
  ping: { execute: snarkyResponse },
  pwd: { execute: snarkyResponse },
  df: { execute: snarkyResponse },
  du: { execute: snarkyResponse },
  curl: { execute: snarkyResponse },
  wget: { execute: snarkyResponse },
  ifconfig: { execute: snarkyResponse },
};

type InvalidCommandOptions = keyof typeof invalidCommands;
type SupportedCommandOptions = keyof typeof supportedCommands;

export type CommandOptions =
  | keyof typeof supportedCommands
  | keyof typeof invalidCommands;

const snarkyResponses = [
  "Nice try, but this isn't a real terminal!",
  "Did you really think that would work?",
  "You must think you're pretty clever, huh?",
  "I'm sorry, Dave. I'm afraid I can't do that.",
];

const executeCommand = (cmd: string, args: string[]) => {
  if (cmd in invalidCommands) {
    return invalidCommands[cmd as InvalidCommandOptions].execute(args);
  }
  if (cmd in supportedCommands) {
    cmd = cmd as SupportedCommandOptions;
    return supportedCommands[cmd as SupportedCommandOptions].execute(args);
  } else {
    return `Command not found: ${cmd}`;
  }
};

export { executeCommand };
