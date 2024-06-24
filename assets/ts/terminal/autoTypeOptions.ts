export type AutoTypeOption = {
  input: string;
  execute: boolean;
  backspace: boolean;
  typeSpeed: number;
  initialDelay: number;
  endActionDelay: number;
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
    input:
      "export BG_COLOR=linear-gradient(30deg, #000 0%, #0c0c2c 70%, #1c4590 100%)",
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
    input: "education",
    execute: true,
    backspace: false,
    typeSpeed: 120,
    initialDelay: 3000,
    endActionDelay: 1000,
  },
  {
    input: "export PS1=🐸",
    execute: true,
    backspace: false,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 1000,
  },
  // {
  //   input: "(✿◠‿◠)",
  //   execute: false,
  //   backspace: true,
  //   typeSpeed: 200,
  //   initialDelay: 4000,
  //   endActionDelay: 2000,
  // },
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
  {
    input: "(づ｡◕‿‿◕｡)づ",
    execute: false,
    backspace: true,
    typeSpeed: 200,
    initialDelay: 4000,
    endActionDelay: 2000,
  },
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
