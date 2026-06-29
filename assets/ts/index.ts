import { PALETTE, updateAccentColor } from "./home/updateAccentColor";

// ─── Dropdown overlay — blocks background while any menu is open ──────────────
const overlay = document.createElement("div");
overlay.style.cssText = "position:fixed;inset:0;z-index:9;display:none;cursor:default;";
document.body.appendChild(overlay);

const closeAllDropdowns = () => {
  (document.activeElement as HTMLElement)?.blur();
  overlay.style.display = "none";
};

overlay.addEventListener("click", closeAllDropdowns);

document.querySelectorAll<HTMLElement>(".dropdown-menu").forEach((menu) => {
  menu.addEventListener("focusin", () => {
    overlay.style.display = "block";
  });
  menu.addEventListener("focusout", (e) => {
    if (!menu.contains(e.relatedTarget as Node)) {
      overlay.style.display = "none";
    }
  });
});

// Dismiss on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});

// ─── Theme toggle ─────────────────────────────────────────────────────────────
const html = document.documentElement;

const applyTheme = (theme: "dark" | "light" | "system") => {
  html.classList.remove("dark", "light");
  if (theme !== "system") html.classList.add(theme);
  if (theme === "system") localStorage.removeItem("theme");
  else localStorage.setItem("theme", theme);
};

const toggleTheme = () => {
  const stored = localStorage.getItem("theme") as "dark" | "light" | null;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effectivelyDark = stored === "dark" || (!stored && systemDark);
  applyTheme(effectivelyDark ? "light" : "dark");
};

document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);

console.log(`
Hi there! 👋 I see you opened up the dev tools.

This site is powered by Jekyll and GitHub Pages.

If you're interested in connecting, reach out at:
https://linkedin.com/in/kaltkarson
`);

// ─── Accent color palette cycling ────────────────────────────────────────────
const PALETTE_KEY = "palette-index";

const getStoredIndex = (): number => {
  const stored = localStorage.getItem(PALETTE_KEY);
  const idx = stored !== null ? parseInt(stored, 10) : Math.floor(Math.random() * PALETTE.length);
  return idx % PALETTE.length;
};

let currentIndex = getStoredIndex();
localStorage.setItem(PALETTE_KEY, String(currentIndex));

const applyPalette = (index: number) => {
  updateAccentColor(PALETTE[index]);
  const dot = document.getElementById("swatch-dot") as HTMLElement | null;
  if (dot) {
    const [r, g, b] = PALETTE[index].base;
    dot.style.background = `rgb(${r}, ${g}, ${b})`;
  }
};

applyPalette(currentIndex);

document.getElementById("color-swatch")?.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % PALETTE.length;
  localStorage.setItem(PALETTE_KEY, String(currentIndex));
  applyPalette(currentIndex);
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  document.addEventListener("scroll", () => {
    const wrapper = document.querySelector(".wrapper") as HTMLElement;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const offset = (scrollTop / scrollHeight) * -(window.innerHeight * 0.5);
    wrapper?.style.setProperty("--gradient-top-offset", `${offset}px`);
  });
}
