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

const addCommand: CommandExecute = (args) => {
  const addIndex = args.indexOf("--tab");
  if (addIndex !== -1 && args[addIndex + 1]) {
    const tabName = args[addIndex + 1];
    if (["stdout", "blog", "notes"].includes(tabName)) {
      return showTab(tabName);
    } else {
      return `Error: Tab "${tabName}" cannot be added. Only "stdout", "blog", and "about" can be added.`;
    }
  } else {
    return "Usage: tab --add <name>";
  }
};

const exportCommand: CommandExecute = (args) => {
  const arg = args[0];

  // Handle PS1
  if (arg.startsWith("PS1=")) {
    const newPromptCharacter = arg.slice(4).trim();
    const promptElements = document.querySelectorAll(".system-prompt");
    promptElements.forEach((el) => {
      el.textContent = newPromptCharacter;
    });
    return `Prompt character changed to ${newPromptCharacter}`;
  }

  if (arg.startsWith("BG_COLOR=")) {
    const newColor = args.join(" ").slice(9).trim();
    // Validate the hex color
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(newColor);
    if (!isValidHex) {
      return "Invalid hex color format";
    }

    const ensureContrast = (hex: string): string => {
      // Convert hex to RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (luminance <= 0.5) {
        // If luminance is already low enough for good contrast with white text, return the color as is
        return hex;
      } else {
        // If not, darken the color to ensure contrast
        // This is a simple approach; for more accuracy, consider a more sophisticated algorithm
        return `#${Math.max(0, r - 100)
          .toString(16)
          .padStart(2, "0")}${Math.max(0, g - 100)
          .toString(16)
          .padStart(2, "0")}${Math.max(0, b - 100)
          .toString(16)
          .padStart(2, "0")}`;
      }
    };

    const darkenColor = (hex: string, factor: number): string => {
      // Parse the hex color to get RGB components
      const red = parseInt(hex.slice(1, 3), 16);
      const green = parseInt(hex.slice(3, 5), 16);
      const blue = parseInt(hex.slice(5, 7), 16);

      // Darken each component by the factor
      const darkenedRed = Math.round(red * factor);
      const darkenedGreen = Math.round(green * factor);
      const darkenedBlue = Math.round(blue * factor);

      // Convert each component back to hex and return the formatted color
      return `#${darkenedRed.toString(16).padStart(2, "0")}${darkenedGreen
        .toString(16)
        .padStart(2, "0")}${darkenedBlue.toString(16).padStart(2, "0")}`;
    };

    // Ensure the final color has enough contrast for white text
    const finalColor = ensureContrast(newColor);

    const wrapper = document.querySelector(".wrapper");
    const linearGradient = `linear-gradient(30deg, #000 0%, ${darkenColor(
      finalColor,
      0.7
    )} 70%, ${finalColor} 100%)`;
    //@ts-ignore
    if (wrapper) wrapper.style.background = linearGradient;
    return `Background changed to ${newColor}`;
  }

  return ""; // No error message if the argument doesn't match any condition
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
  const positions: ("topLeft" | "bottomRight")[] = ["topLeft", "bottomRight"];
  for (let i = 0; i < 2; i++) {
    setTimeout(() => echo(text, positions[i % 2]), i * 2000); // Adjust timing for staggered appearance
  }
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
  add: {
    execute: addCommand,
    description: "Adds content to the website",
    flags: {
      "--tab": "Adds a tab",
    },
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
  ping: { execute: snarkyResponse },
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
