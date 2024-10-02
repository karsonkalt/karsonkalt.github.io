export const addScrambleEffect = () => {
  const className = "effect-scramble";
  const GLITCH_CHARACTERS = [
    "0",
    "1",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "+",
    "-",
    "*",
    "/",
    "=",
    ">",
    "<",
    "!",
    "?",
    "[",
    "]",
    "{",
    "}",
    "|",
    "&",
    "%",
    "~",
    "_",
    "$",
    "#",
    "@",
  ];
  const elements = document.getElementsByClassName(className);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const startScrambleEffect = (element: HTMLElement) => {
    const originalText = element.innerText;
    const originalTextArray = originalText.split(" ");
    const totalCharacters = originalText.length;
    let glitchingCharacters = Array.from(
      { length: totalCharacters },
      (_, i) => i
    );
    let count = 0;

    const interval = setInterval(() => {
      const newText = originalTextArray
        .map((word, wordIndex) =>
          word
            .split("")
            .map((char, charIndex) => {
              const globalIndex =
                originalTextArray.slice(0, wordIndex).join(" ").length +
                wordIndex +
                charIndex;
              if (glitchingCharacters.includes(globalIndex)) {
                return GLITCH_CHARACTERS[
                  Math.floor(Math.random() * GLITCH_CHARACTERS.length)
                ];
              }
              return char;
            })
            .join("")
        )
        .join(" ");

      element.innerText = newText;

      if (glitchingCharacters.length > 0) {
        // Adjust the rate at which characters stop glitching
        if (count % 4 === 0) {
          const randomIndex = Math.floor(
            Math.random() * glitchingCharacters.length
          );
          glitchingCharacters.splice(randomIndex, 1);
        }
      } else {
        clearInterval(interval);
      }

      count++;
    }, 60); // Decrease the interval time to make the glitch effect faster
  };

  if (prefersReducedMotion) {
    return;
  }
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i] as HTMLElement;
    startScrambleEffect(element);
  }
};
