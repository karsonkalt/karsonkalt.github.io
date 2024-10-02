import { insertThemeButton } from "./home/themeButton";

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

insertThemeButton();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  document.addEventListener("scroll", () => {
    const wrapper = document.querySelector(".wrapper") as HTMLElement;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / scrollHeight;

    const vh = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );

    const vh50 = vh * 0.5;

    const offset = scrollPercent * -vh50;

    wrapper?.style.setProperty("--gradient-top-offset", `${offset}px`);
  });
}
