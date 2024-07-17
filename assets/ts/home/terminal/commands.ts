import { updateAccentColor } from "./updateAccentColor";
import { sendPing } from "../sendPing";

const pingCommand: CommandExecute = (args) => {
  try {
    sendPing(args.join(" "));
    return "Message sent to my phone";
  } catch (error) {
    return "Error sending message";
  }
};

const restoreCommand: CommandExecute = (args) => {
  const promptCharacter = localStorage.getItem("PS1");
  if (promptCharacter) exportCommand(["PS1=" + promptCharacter]);
  const bgColor = localStorage.getItem("ACCENT_COLOR");
  if (bgColor) exportCommand(["ACCENT_COLOR=" + bgColor]);
  return "Restored terminal settings";
};

const clearCommand: CommandExecute = (args) => {
  const stdoutLog = document.querySelector(".stdout-log");

  while (stdoutLog?.firstChild) {
    stdoutLog.removeChild(stdoutLog.firstChild);
  }

  return "Console cleared";
};

const lsCommand: CommandExecute = (args) => {
  return "file1.txt\nfile2.txt\nfile3.txt";
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

const dateCommand: CommandExecute = (args) => {
  return new Date().toString();
};

const whoamiCommand: CommandExecute = (args) => {
  return "Karson, Frontend Developer";
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

  if (arg.startsWith("ACCENT_COLOR=")) {
    const newColor = args.join(" ").slice(13).trim();

    const updateSuccessful = updateAccentColor(newColor);

    if (updateSuccessful) {
      return `Accent changed to ${newColor}`;
    }

    return "Invalid color. Please provide: #000000, rgb(0, 0, 0) or any valid css color.";
  }

  return "Invalid export command. Usage: export PS1=$, export ACCENT_COLOR=#";
};

const aboutCommand: CommandExecute = (args) => {
  return `I’m a passionate software engineer dedicated to crafting interfaces that delight users and make a difference. Currently, I’m a Software Engineer at <a href="https://www.jupiterone.com/"target="_blank">JupiterOne</a> , where I advocate for user experience and get to build impactful features every day.`;
};

const skillsCommand: CommandExecute = (args) => {
  if (args.includes("--languages")) {
    return "TypeScript, JavaScript, CSS";
  } else if (args.includes("-l")) {
    return "Frontend Development, React, UX Design, TypeScript, JavaScript, Node A11y, Agile, User-Centered Design";
  } else {
    return "Frontend Development, React, UX Design, TypeScript, JavaScript";
  }
};

const projectsCommand: CommandExecute = (args) => {
  return `Projects: `;
};

const educationCommand: CommandExecute = (args) => {
  return `<strong>B.S. Digital Marketing</strong>, <a href="https://www.uvu.edu/"target="_blank">Utah Valley University</a> (2010 - 2014)
    <strong>Software Engineering Immersive</strong> Flatiron School (2017)
  `;
};

const experienceCommand: CommandExecute = (args) => {
  return `<strong>Software Engineer, Applications</strong>, <a href="https://www.jupiterone.com/"target="_blank">JupiterOne</a> (October 2021 - Present)
    Natural Language Querying
    − Designed and developed the integration of generative AI into our search experience, converting natural language to our query language. Resulted in one of our highest adoption rates and helped accelerate platform time-to-value.
    − Implemented a vector database embedding cache, improving query response times and reducing operational costs.
    − Implemented Natural Language Processing (NLP) techniques including fuzzy matching and stop word filtering to enhance search precision.

    Design System Development
    − Spearheaded the development of JupiterOne’s design system, including creation of a comprehensive component library, design tokens, and theming system. Helping to streamline the development process and enabling engineers to focus on core feature development.
    − Crafted standardized-yet-customizable component APIs through a mix of composability, customization, and "component slots". Balanced flexibility with ease-of-use, allowing for customization without excessive rigidity. Leveraged standard naming conventions and JSDoc for streamlined development.
      `;
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
  ping: {
    execute: pingCommand,
    description: "Sends a message to the me",
    flags: {},
  },
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
  ls: {
    execute: lsCommand,
    description: "Lists all available files",
    flags: {},
  },
  about: {
    execute: aboutCommand,
    description: "Displays about information",
    flags: {},
  },
  help: {
    execute: helpCommand,
    description: "Shows help information about all commands",
    flags: {},
  },
  date: {
    execute: dateCommand,
    description: "Displays the current date and time",
    flags: {},
  },
  whoami: {
    execute: whoamiCommand,
    description: "Displays user information",
    flags: {},
  },
  skills: {
    execute: skillsCommand,
    description: "Lists all my skills",
    flags: {
      "--languages": "Lists programming languages I know",
      "-l": "Lists all my skills",
    },
  },
  projects: {
    execute: projectsCommand,
    description: "Lists all my projects",
    flags: {},
  },
  education: {
    execute: educationCommand,
    description: "Displays my educational background",
    flags: {},
  },
  experience: {
    execute: experienceCommand,
    description: "Displays my work experience",
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
  "You're not fooling anyone.",
  "Did you really think that would work?",
  "You must think you're pretty clever, huh?",
  "You must be new here.",
  "I'm sorry, Dave. I'm afraid I can't do that.",
  "You must be mistaken, this isn't a real terminal.",
  "That command is about as useful here as a chocolate teapot.",
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
