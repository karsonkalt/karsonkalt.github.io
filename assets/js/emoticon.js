const INIT_WAIT = 500;

const items = [
  {
    text: "add --tab stdout",
    execute: true,
    backspace: false,
    wait: 1000,
    type: 100,
  },
  {
    text: "add --tab blog",
    execute: true,
    backspace: false,
    wait: 1000,
    type: 100,
  },
  {
    text: "add --tab notes",
    execute: true,
    backspace: false,
    wait: 1000,
    type: 100,
  },
  {
    text: "echo Hi, I'm Karson ツ",
    execute: true,
    backspace: false,
    wait: 6000,
    type: 120,
  },
  {
    text: 'about',
    execute: true,
    backspace: false,
    wait: 3000,
    type: 120
  },
  {
    text: 'experience',
    execute: true,
    backspace: false,
    wait: 3000,
    type: 120,
  },
  {
    text: 'skills --lanugages',
    execute: true,
    backspace: false,
    wait: 3000,
    type: 120,
  },
  {
    text: 'education',
    execute: true,
    backspace: false,
    wait: 3000,
    type: 120,
  },
  { text: "help", execute: true, backspace: false, wait: 3000, type: 200 },
  { text: "(✿◠‿◠)", execute: false, backspace: true, wait: 4000, type: 200 },
  { text: "whoami", execute: true, backspace: false, wait: 4000, type: 200 },
  { text: "(^-^)/", execute: false, backspace: true, wait: 4000, type: 200 },
  { text: "skills", execute: true, backspace: false, wait: 5000, type: 200 },
  { text: "(☉ ‿ ⚆)", execute: false, backspace: true, wait: 4000, type: 200 },
  { text: "date", execute: true, backspace: false, wait: 4000, type: 200 },
  {
    text: "echo Hello World!",
    execute: true,
    backspace: false,
    wait: 4000,
    type: 200,
  },
  {
    text: "(づ｡◕‿‿◕｡)づ",
    execute: false,
    backspace: true,
    wait: 4000,
    type: 200,
  },
  {
    text: "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
    execute: false,
    backspace: true,
    wait: 4000,
    type: 200,
  },
  { text: "(◉‿◉)つ", execute: false, backspace: true, wait: 1000, type: 200 },
];

let autoTypeActive = true;

(function () {
  const terminal = document.querySelector(".terminal");
  const prompt = document.querySelector(".prompt");
  const mirrorElement = document.querySelector(".input-mirror");

  const INTRO_DELAY = 1500;
  const DELETE_SPEED = 100;
  const FOCUS_TIMEOUT = 6000;

  let focusTimeoutId;
  let currentItemIndex = 0;

  const setPromptValue = (value) => {
    prompt.value = String(value);
    mirrorElement.textContent = value;
  };

  // Optionally, handle initial value if needed
  setPromptValue(prompt.value);

  let currentText = "";
  let targetItem = items[currentItemIndex];

  function startAutoType() {
    autoTypeActive = true;
    currentText = "";
    targetItem = items[currentItemIndex];
    autoType();
  }

  function autoType() {
    if (autoTypeActive) {
      if (currentText.length < targetItem.text.length) {
        currentText += targetItem.text[currentText.length];
        setPromptValue(currentText);
        setTimeout(autoType, targetItem.type);
      } else {
        if (targetItem.execute) {
          handleBashCommand(targetItem.text);
        }
        if (targetItem.backspace) {
          setTimeout(
            () => backspace(currentText.length),
            items[currentItemIndex].backspace
          );
        } else {
          moveToNextItem();
        }
      }
    }
  }

  function backspace(length) {
    if (length > 0) {
      currentText = currentText.substring(0, length - 1);
      setPromptValue(currentText);
      setTimeout(() => backspace(length - 1), DELETE_SPEED);
    } else {
      moveToNextItem();
    }
  }

  function moveToNextItem() {
    currentItemIndex = (currentItemIndex + 1) % items.length;
    setTimeout(startAutoType, items[currentItemIndex].wait);
  }

  // Handle the Enter key to submit or do something
  prompt.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents submitting the form
      handleBashCommand(event.target.value);
      setPromptValue("");
      autoTypeActive = false;
    }
  });

  function handleBashCommand(command) {
    const [cmd, ...args] = command.split(" ");
  
    const result = executeCommand(cmd, args);
    const formattedHelpText = result.replace(/\n/g, "<br/>");
  
    setPromptValue("");
      addToStdoutLog(command, formattedHelpText);
  }
  
  function addToStdoutLog(command, output) {
    const tabPanels = document.querySelector(".tab-panels");
    const ul = tabPanels.querySelector(".tab-panel-content");
    const li = document.createElement("li");
    const timestamp = new Date().toLocaleTimeString();
  
    li.innerHTML = `
      <div class="stdout-entry">
        <div class="stdout-entry-wrapper">
        <span class="stdout-timestamp">${timestamp}</span>
        <span class="stdout-command">${command}</span>
        <div class="stdout-output">${output}</div>
        </div>
      </div>
    `;
  
    // Insert the new stdout entry at the top
    ul.insertBefore(li, ul.firstChild);
  }

  const commandsThatWouldBeSillyToSupport = {
    cd: { execute: snarkyResponse },
    rm: { execute: snarkyResponse },
    sudo: { execute: snarkyResponse },
    mv: { execute: snarkyResponse },
    chmod: { execute: snarkyResponse },
    chown: { execute: snarkyResponse },
  };

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

  function resetFocusTimeout() {
    clearTimeout(focusTimeoutId);
    focusTimeoutId = setTimeout(() => {
      if (!document.activeElement.isEqualNode(prompt)) {
        startAutoType();
      }
    }, FOCUS_TIMEOUT);
  }

  // Restart auto-type if input is not focused for more than 6 seconds
  prompt.addEventListener("blur", resetFocusTimeout);

  prompt.addEventListener("focus", () => {
    clearTimeout(focusTimeoutId);
    autoTypeActive = false;
  });

  // Focus prompt when clicking on the terminal
  terminal.addEventListener("click", () => {
    prompt.focus();
  });

  prompt.addEventListener("input", (e) => {
    setPromptValue(e.target.value);
  });

  items.length && setTimeout(startAutoType, INIT_WAIT);
})();

// TODOS
// instead of revealing parts of the html, have an add command that creates tabs,
// the autotype will run a few at the beginniing to reveal them. there is also an output tab

// track the last time they were on this page, dont run every time, if it's been over X time then skip
// add a log of commands and arrow up/ arrow down goes through them
