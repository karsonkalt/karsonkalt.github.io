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
  
  function snarkyResponse() {
    const randomIndex = Math.floor(Math.random() * snarkyResponses.length);
    return snarkyResponses[randomIndex];
  }
  
  const commandsThatWouldBeSillyToSupport = {
    cd: { execute: snarkyResponse },
    rm: { execute: snarkyResponse },
    sudo: { execute: snarkyResponse },
    mv: { execute: snarkyResponse },
    chmod: { execute: snarkyResponse },
    chown: { execute: snarkyResponse },
  };
  
  const commands = {
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
      flags: {}
    },
    stop: {
      execute: stopCommand,
      description: "Stops the auto-type",
      flags: {},
    },
    help: {
      execute: helpCommand,
      description: "Shows help information about all commands",
      flags: {},
    },
    compgen: {
      execute: compgenCommand,
      description: "Generates auto completions for a word",
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
  };
  
  function executeCommand(cmd, args) {
    if (cmd in commandsThatWouldBeSillyToSupport) {
      return commandsThatWouldBeSillyToSupport[cmd].execute(args);
    }
    if (commands[cmd]) {
      return commands[cmd].execute(args);
    } else {
      return `Command not found: ${cmd}`;
    }
  }
  
  function clearCommand(args) {
    outputElement.innerHTML = "";
    return "";
  }
  
  function echoCommand(args) {
    return args.join(" ");
  }
  
  function lsCommand(args) {
    return "file1.txt\nfile2.txt\nfile3.txt";
  }
  
  function stopCommand(args) {
    autoTypeActive = false;
    return "AutoType stopped";
  }
  
  function helpCommand(args) {
    let helpText = "Available commands:\n";
  
    for (const [commandName, command] of Object.entries(commands)) {
      helpText += `- ${commandName}: ${command.description}\n`;
  
      for (const [flagName, flagDescription] of Object.entries(command.flags)) {
        helpText += `  - ${flagName}: ${flagDescription}\n`;
      }
    }
  
    // Replace newline characters with <br/>
    const formattedHelpText = helpText.replace(/\n/g, "<br/>");
  
    return formattedHelpText;
  }
  
  function compgenCommand(args) {
    return Object.keys(commands).join("\n");
  }
  
  function dateCommand(args) {
    return new Date().toString();
  }
  
  function whoamiCommand(args) {
    return "Karson, Frontend Developer";
  }
  
  function showTab(tabName) {
    const tab = document.querySelector(`#${tabName}`);
    if (tab) {
      tab.removeAttribute("hidden");
      return `Tab "${tabName}" is now visible.`;
    } else {
      return `Error: Tab "${tabName}" does not exist.`;
    }
  }
  
  function addCommand(args) {
    const addIndex = args.indexOf("--tab");
    if (addIndex !== -1 && args[addIndex + 1]) {
      const tabName = args[addIndex + 1];
      console.log(tabName)
      if (["stdout", "blog", "notes"].includes(tabName)) {
        return showTab(tabName);
      } else {
        return `Error: Tab "${tabName}" cannot be added. Only "stdout", "blog", and "about" can be added.`;
      }
    } else {
      return "Usage: tab --add <name>";
    }
  }
  
  function exportCommand(args) {
    if (args.length !== 1 || !args[0].startsWith("PS1=")) {
      return "Usage: export PS1='<new_prompt_character>'";
    }
  
    // Extract the new prompt character
    const newPromptCharacter = args[0].slice(4).trim();
  
    // Set the new prompt character
    const promptElements = document.querySelectorAll(".system-prompt");
    promptElements.forEach((el) => {
      el.textContent = newPromptCharacter;
    });
  
    return `Prompt character changed to ${newPromptCharacter}`;
  }
  
  function aboutCommand(args) {
    return `I’m a passionate software engineer dedicated to crafting interfaces that delight users and make a difference. Currently, I’m a Software Engineer at <a href="https://www.jupiterone.com/"target="_blank">JupiterOne</a> , where I advocate for user experience and get to build impactful features every day.`;
  }
  
  function skillsCommand(args) {
    if (args.includes("--languages")) {
      return "Languages: TypeScript, JavaScript, CSS";
    } else if (args.includes("-l")) {
      return "Skills: Frontend Development, React, UX Design, TypeScript, JavaScript, Node A11y, Agile, User-Centered Design";
    } else {
      return "Skills: Frontend Development, React, UX Design, TypeScript, JavaScript";
    }
  }
  
  function projectsCommand(args) {
    return `Projects: `;
  }
  
  function educationCommand(args) {
    return `
  Education:
    - **B.S. Digital Marketing**, Utah Valley University (2010 - 2014)
    - **Flatiron School**, Software Engineering Immersive (2017)
  `;
  }
  
  function experienceCommand(args) {
    return `
  Experience:
  1. **Senior Software Engineer Applications**, JupiterOne (2024 - Present)
    - TBD
  
  2. **Software Engineer**, JupiterOne (2018 - 2024)
    - TBD
  `;
  }
  
  export {
    executeCommand,
  };
