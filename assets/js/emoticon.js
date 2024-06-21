import {
  executeCommand,
} from './commands.js';

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
    let currentTab = 'stdout'; // Track the current tab
    let hasUnreadStdout = false; // Track unread count for stdout tab
  
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

      let currentTab = document.querySelector('button[role="tab"][aria-selected="true"]').id;
  
      // Update unread count and show badge if not viewing stdout
      updateBadge(currentTab !== 'stdout');
    }
  
    function updateBadge(hasUnreadStdout) {
      const stdoutTab = document.querySelector('#stdout');
      const badge = stdoutTab.querySelector('.unread-badge');
    
      if (hasUnreadStdout) {
        if (!badge.classList.contains('show')) {
          // Add the 'show' class if the badge is not already visible
          badge.classList.add('show');
          // Remove the 'pulse' class if it exists to reset the animation state
          badge.classList.remove('pulse');
        } else {
          // If the badge is already visible, add the 'pulse' class to trigger the pulse animation
          badge.classList.add('pulse');
          // Remove the 'pulse' class after the animation completes
          setTimeout(() => badge.classList.remove('pulse'), 200);
        }
      } else {
        // Remove the 'show' and 'pulse' classes to hide the badge
        badge.classList.remove('show', 'pulse');
      }
    }
  
    // Handle tab switching
    function switchTab(tabName) {
      currentTab = tabName;
      if (tabName === 'stdout') {
        unreadCount = 0;
        updateBadge();
      }
      // Handle showing/hiding tab content here
    }
  
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (event) => {
        const tabName = event.target.getAttribute('data-tab');
        switchTab(tabName);
      });
    });
  
    // Initialize badge
    updateBadge();
  
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
