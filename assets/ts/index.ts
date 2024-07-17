import { insertThemeButton } from "./home/terminal/themeButton";

console.log(`
▄▄▄   ▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄   ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄    ▄ 
█   █ █ █       █   ▄  █ █       █       █  █  █ █
█   █▄█ █   ▄   █  █ █ █ █  ▄▄▄▄▄█   ▄   █   █▄█ █
█      ▄█  █▄█  █   █▄▄█▄█ █▄▄▄▄▄█  █ █  █       █
█     █▄█       █    ▄▄  █▄▄▄▄▄  █  █▄█  █  ▄    █
█    ▄  █   ▄   █   █  █ █▄▄▄▄▄█ █       █ █ █   █
█▄▄▄█ █▄█▄▄█ █▄▄█▄▄▄█  █▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄█  █▄▄█
        
▄▄▄   ▄ ▄▄▄▄▄▄▄ ▄▄▄     ▄▄▄▄▄▄▄ 
█   █ █ █       █   █   █       █
█   █▄█ █   ▄   █   █   █▄     ▄█
█      ▄█  █▄█  █   █     █   █  
█     █▄█       █   █▄▄▄  █   █  
█    ▄  █   ▄   █       █ █   █  
█▄▄▄█ █▄█▄▄█ █▄▄█▄▄▄▄▄▄▄█ █▄▄▄█  
        
Hi there! 👋 I see you opened up the dev tools.

This site is powered by Jekyll and GitHub pages and is a simple interface for me to jot down my thoughts in markdown.

If you're interested in connecting, please reach out to me via LinkedIn at:
http://linkedin.com/in/kaltkarson
`);

function copyToClipboard(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function createCopyButton(divElement: HTMLDivElement) {
  const button = document.createElement("button");
  button.innerHTML = `
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="16" height="16" fill="currentColor">
  <defs><style>.cls-637647fac3a86d32eae6f204-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs>
  <polygon class="cls-637647fac3a86d32eae6f204-1" points="16.77 8.18 16.77 22.5 3.41 22.5 3.41 5.32 16.77 5.32 16.77 8.18"></polygon>
  <polyline class="cls-637647fac3a86d32eae6f204-1" points="16.77 18.68 20.59 18.68 20.59 4.36 20.59 1.5 7.23 1.5 7.23 5.32"></polyline></svg>
  `;
  button.classList.add("copy-button");

  button.addEventListener("click", () => {
    const codeElement = divElement.querySelector("code");
    if (codeElement) {
      copyToClipboard(codeElement.innerText);
      button.innerHTML = `
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="16" height="16" fill="currentColor">
      <defs><style>.cls-6374f8d9b67f094e4896c627-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs>
      <polyline class="cls-6374f8d9b67f094e4896c627-1" points="6.27 12 10.09 15.82 17.73 8.18"></polyline>
      </svg>
      `;
    }
  });

  divElement.style.position = "relative";
  divElement.appendChild(button);
}

document
  .querySelectorAll<HTMLDivElement>("div.highlight")
  .forEach((divElement) => {
    createCopyButton(divElement);
  });

insertThemeButton();
