import chroma from "chroma-js";

export const updateAccentColor = (inputColor: string): boolean => {
  try {
    if (!isValidColor(inputColor)) {
      return false;
    }

    const accentColor = getAdjustedAccentColor(chroma(inputColor));
    const accentColorContrast = getContrastColor(accentColor);
    const accentDecoration = isLightColor(accentColorContrast)
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
  } else if (luminance > 0.75) {
    color = color.luminance(0.75);
  }

  // Ensure color is vibrant but not fully saturated
  const saturation = color.get("hsl.s");
  return color.set("hsl.s", Math.min(saturation, 0.85));
};

const getContrastColor = (accentColor: chroma.Color): chroma.Color => {
  // Generate a fully vibrant version of the accent color
  let vibrantColor = accentColor.set("hsl.s", 1);

  const MIN_CONTRAST = 1.75;

  // Ensure the vibrant color meets the 3 contrast ratio against the accent color
  if (
    chroma.contrast(vibrantColor, accentColor) >= MIN_CONTRAST
    // && chroma.contrast(vibrantColor, "black") >= 4.5
  ) {
    return vibrantColor;
  }

  // Adjust the lightness to find a suitable contrast color
  const lightnessSteps = 10;
  const lightnessIncrement = 1 / lightnessSteps;

  for (let i = 1; i <= lightnessSteps; i++) {
    const lightenedColor = vibrantColor.set(
      "hsl.l",
      vibrantColor.get("hsl.l") + lightnessIncrement * i
    );
    if (
      chroma.contrast(lightenedColor, accentColor) >= MIN_CONTRAST
      // && chroma.contrast(lightenedColor, "black") >= 4.5
    ) {
      return lightenedColor;
    }
  }

  // If no suitable color is found, return the original vibrant color
  return vibrantColor;
};

const isLightColor = (color: chroma.Color): boolean => {
  return color.luminance() > 0.75;
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
