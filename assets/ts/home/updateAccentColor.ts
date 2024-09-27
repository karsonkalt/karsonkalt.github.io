import chroma from "chroma-js";

// let currentHue = 0;
// const HUE_INCREMENT = 1; // Adjust this value to control the speed of the transition
// const UPDATE_INTERVAL = 250; // Update interval in milliseconds

// const startRainbowTransition = (inputColor: string) => {
//   setInterval(() => {
//     currentHue = (currentHue + HUE_INCREMENT) % 360;
//     const colorWithNewHue = chroma(inputColor).set("hsl.h", currentHue).hex();
//     updateAccentColor(colorWithNewHue);
//   }, UPDATE_INTERVAL);
// };

// startRainbowTransition("#ff0000");

export const updateAccentColor = (inputColor: string): boolean => {
  try {
    if (!isValidColor(inputColor)) {
      return false;
    }

    const accentColor = getAdjustedAccentColor(chroma(inputColor));
    const linkColor = getContrastColor(accentColor);
    const linkHoverColor = getHoverColor(accentColor);
    const linkDecoration = hasLowSaturation(linkColor) ? "underline" : "none";

    setColorsInLocalStorage(
      accentColor,
      linkColor,
      linkHoverColor,
      linkDecoration
    );
    setColorsInCSS(accentColor, linkColor, linkHoverColor, linkDecoration);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getHoverColor = (color: chroma.Color): chroma.Color => {
  if (color.luminance() < 0.95) {
    return color.brighten(0.5);
  } else {
    return color.darken(0.05);
  }
};

const isValidColor = (color: string): boolean => {
  return chroma.valid(color);
};

const getAdjustedAccentColor = (color: chroma.Color): chroma.Color => {
  const minLuminance = 0.15;
  const maxLuminance = 0.85;

  const luminance = color.luminance();
  if (luminance < minLuminance) {
    color = color.luminance(minLuminance);
  } else if (luminance > maxLuminance) {
    color = color.luminance(maxLuminance);
  }

  // Ensure color is vibrant but not fully saturated
  const saturation = color.get("hsl.s");
  return color.set("hsl.s", Math.min(saturation, 0.85));
};

const getContrastColor = (accentColor: chroma.Color): chroma.Color => {
  // Check if the color is totally grey
  if (accentColor.get("hsl.s") === 0) {
    // Return a vibrant link-friendly color like teal blue
    const colorOptions = ["#00796b", "#00acc1", "#1976d2", "#2196f3"];
    const chromaColor = chroma(
      colorOptions[Math.floor(Math.random() * colorOptions.length)]
    );
    return chromaColor.set("hsl.s", 1);
  }

  const vibrantColor = accentColor.set("hsl.s", 1);
  vibrantColor.set("hsl.l", 0.5);

  const MIN_CONTRAST = 1.75;

  // Ensure the vibrant color meets the 3 contrast ratio against the accent color
  if (chroma.contrast(vibrantColor, accentColor) >= MIN_CONTRAST) {
    return vibrantColor;
  }

  // Adjust the lightness to find a suitable contrast color
  const lightnessSteps = 20;
  const lightnessIncrement = 1 / lightnessSteps;

  for (let i = 1; i <= lightnessSteps; i++) {
    const lightenedColor = vibrantColor.set(
      "hsl.l",
      vibrantColor.get("hsl.l") + lightnessIncrement * i
    );
    if (chroma.contrast(lightenedColor, accentColor) >= MIN_CONTRAST) {
      return lightenedColor;
    }
  }

  // If no suitable color is found, return the original vibrant color
  return vibrantColor;
};

const hasLowSaturation = (color: chroma.Color): boolean => {
  const saturation = color.get("hsl.s");
  // Adjusting the condition to focus on low saturation to include all shades of grey and white.
  return saturation < 0.2;
};

const setColorsInLocalStorage = (
  accentColor: chroma.Color,
  linkColor: chroma.Color,
  linkHoverColor: chroma.Color,
  linkDecoration: string
): void => {
  localStorage.setItem("ACCENT_COLOR", rgbString(accentColor));
  localStorage.setItem("LINK_COLOR", rgbString(linkColor));
  localStorage.setItem("LINK_COLOR_HOVER", rgbString(linkHoverColor));
  localStorage.setItem("LINK_DECORATION", linkDecoration);
};

const setColorsInCSS = (
  accentColor: chroma.Color,
  linkColor: chroma.Color,
  linkHoverColor: chroma.Color,
  linkDecoration: string
): void => {
  document.documentElement.style.setProperty(
    "--accent-color-base",
    formatAccentColor(accentColor)
  );
  document.documentElement.style.setProperty(
    "--accent-color-link",
    rgbString(linkColor)
  );
  document.documentElement.style.setProperty(
    "--accent-color-link-hover",
    rgbString(linkHoverColor)
  );
  document.documentElement.style.setProperty(
    "--link-decoration",
    linkDecoration
  );
};

const formatAccentColor = (color: chroma.Color): string => {
  return color.rgb().join(", ");
};

const rgbString = (color: chroma.Color): string => {
  return "rgb(" + color.rgb().join(", ") + ")";
};
