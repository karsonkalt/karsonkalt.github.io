interface Palette {
  // RGB triple for the gradient accent color (dark, vivid)
  base: [number, number, number];
  // Link text colors — pre-validated for 4.5:1 contrast
  darkLink: string;       // readable on dark bg
  lightLink: string;      // readable on light bg
  darkLinkHover: string;
  lightLinkHover: string;
}

// Curated palette — each entry looks great as a gradient and has
// accessible link colors for both dark and light modes.
export const PALETTE: Palette[] = [
  { base: [30, 80, 180],   darkLink: "#60a5fa", lightLink: "#1d4ed8", darkLinkHover: "#93c5fd", lightLinkHover: "#1e40af" },
  { base: [100, 40, 200],  darkLink: "#a78bfa", lightLink: "#5b21b6", darkLinkHover: "#c4b5fd", lightLinkHover: "#4c1d95" },
  { base: [0, 120, 120],   darkLink: "#2dd4bf", lightLink: "#0f766e", darkLinkHover: "#5eead4", lightLinkHover: "#115e59" },
  { base: [170, 20, 60],   darkLink: "#f87171", lightLink: "#b91c1c", darkLinkHover: "#fca5a5", lightLinkHover: "#991b1b" },
  { base: [150, 80, 0],    darkLink: "#fbbf24", lightLink: "#92400e", darkLinkHover: "#fcd34d", lightLinkHover: "#78350f" },
  { base: [0, 110, 60],    darkLink: "#34d399", lightLink: "#065f46", darkLinkHover: "#6ee7b7", lightLinkHover: "#064e3b" },
  { base: [60, 40, 180],   darkLink: "#818cf8", lightLink: "#3730a3", darkLinkHover: "#a5b4fc", lightLinkHover: "#312e81" },
  { base: [160, 0, 80],    darkLink: "#f472b6", lightLink: "#9d174d", darkLinkHover: "#f9a8d4", lightLinkHover: "#831843" },
];

export const updateAccentColor = (palette: Palette): void => {
  const root = document.documentElement;
  root.style.setProperty("--accent-color-base",          palette.base.join(", "));
  root.style.setProperty("--accent-color-link-dark",     palette.darkLink);
  root.style.setProperty("--accent-color-link-light",    palette.lightLink);
  root.style.setProperty("--accent-color-link-dark-hover",  palette.darkLinkHover);
  root.style.setProperty("--accent-color-link-light-hover", palette.lightLinkHover);
};
