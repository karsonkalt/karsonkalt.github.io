export type AutoTypeOption = {
  input: string;
  execute: boolean;
  backspace: boolean;
  typeSpeed: number;
  initialDelay: number;
  endActionDelay: number;
};

const getRandomBGColor = () => {
  const BG_COLORS = ["#1C4590", "#163E70", "#0F5C8C", "#134F5C", "#0D4B4E"];
  return BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
};

const getRandomPromptCharacter = () => {
  const PROMPT_CHARACTERS = ["$", "%", "🐸", "💥"];
  return PROMPT_CHARACTERS[
    Math.floor(Math.random() * PROMPT_CHARACTERS.length)
  ];
};

export const autoTypeOptions: AutoTypeOption[] = [
  {
    input: "echo Hi, I'm Karson ツ",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: "help",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 1000,
    endActionDelay: 1000,
  },
  {
    input: "whoami",
    execute: true,
    backspace: false,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 1000,
  },
  {
    input: "about",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: "experience",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: `export BG_COLOR=${getRandomBGColor()}`,
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 0,
    endActionDelay: 1000,
  },
  {
    input: "skills",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: "(✿◠‿◠)",
    execute: false,
    backspace: true,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 2000,
  },
  {
    input: "education",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: `export PS1=${getRandomPromptCharacter()}`,
    execute: true,
    backspace: false,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 1000,
  },
  {
    input: "(^-^)/",
    execute: false,
    backspace: true,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 2000,
  },
  // {
  //   input: "(☉ ‿ ⚆)",
  //   execute: false,
  //   backspace: true,
  //   typeSpeed: 200,
  //   initialDelay: 4000,
  //   endActionDelay: 2000,
  // },
  // {
  //   input: "(づ｡◕‿‿◕｡)づ",
  //   execute: false,
  //   backspace: true,
  //   typeSpeed: 200,
  //   initialDelay: 4000,
  //   endActionDelay: 2000,
  // },
  {
    input: "(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧",
    execute: false,
    backspace: true,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 3000,
  },
  // {
  //   input: "(◉‿◉)つ",
  //   execute: false,
  //   backspace: true,
  //   typeSpeed: 200,
  //   initialDelay: 1000,
  //   endActionDelay: 2000,
  // },
];
