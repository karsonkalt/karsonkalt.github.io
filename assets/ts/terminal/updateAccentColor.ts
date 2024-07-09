import chroma from "chroma-js";

export const updateAccentColor = (inputColor: string): boolean => {
  try {
    if (!isValidColor(inputColor)) {
      return false;
    }

    const accentColor = getAdjustedAccentColor(chroma(inputColor));
    const accentColorContrast = getContrastColor(accentColor);
    const accentDecoration = hasLowSaturation(accentColorContrast)
      ? "underline"
      : "none";

    setColorsInLocalStorage(accentColor, accentColorContrast);
    setColorsInCSS(accentColor, accentColorContrast, accentDecoration);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isValidColor = (color: string): boolean => {
  return chroma.valid(color);
};

const getAdjustedAccentColor = (color: chroma.Color): chroma.Color => {
  // Adjust luminance to avoid too black or too white
  const luminance = color.luminance();
  if (luminance < 0.25) {
    color = color.luminance(0.25);
  } else if (luminance > 0.5) {
    color = color.luminance(0.5);
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
    accentColor = chroma(
      colorOptions[Math.floor(Math.random() * colorOptions.length)]
    );
  }

  const vibrantColor = accentColor.set("hsl.s", 1);
  vibrantColor.set("hsl.l", 0.75);

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
  accentColorContrast: chroma.Color
): void => {
  const cssAccentColor = accentColor.hex();
  const cssAccentContrastColor = accentColorContrast.hex();

  localStorage.setItem("ACCENT_COLOR", cssAccentColor);
  localStorage.setItem("LINK_COLOR", cssAccentContrastColor);
};

const setColorsInCSS = (
  accentColor: chroma.Color,
  accentColorContrast: chroma.Color,
  accentDecoration: string
): void => {
  const cssAccentColor = accentColor.hex();
  const cssAccentContrastColor = accentColorContrast.hex();

  document.documentElement.style.setProperty("--accent-color", cssAccentColor);
  document.documentElement.style.setProperty(
    "--accent-color-contrast",
    cssAccentContrastColor
  );
  document.documentElement.style.setProperty(
    "--accent-decoration",
    accentDecoration
  );
};
