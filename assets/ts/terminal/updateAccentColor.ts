const calculateRGBColor = (colorString: string): string => {
  const tempElement = document.createElement("div");
  document.body.appendChild(tempElement);
  tempElement.style.backgroundColor = colorString;
  const rgbColor = window.getComputedStyle(tempElement).backgroundColor;
  document.body.removeChild(tempElement);
  return rgbColor;
};

export const updateAccentColor = (newColor: string) => {
  const rgbNewColor = calculateRGBColor(newColor);

  if (rgbNewColor === "") {
    return false;
  }

  localStorage.setItem("ACCENT_COLOR", rgbNewColor);

  const ensureContrastAndMinimumBrightness = (rgbColor: string): string => {
    const [r, g, b] = rgbColor.match(/\d+/g)!.map(Number);

    const MIN_BRIGHTNESS = 50;

    const adjustedR = Math.max(MIN_BRIGHTNESS, r - 100);
    const adjustedG = Math.max(MIN_BRIGHTNESS, g - 100);
    const adjustedB = Math.max(MIN_BRIGHTNESS, b - 100);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance > 0.5) {
      return `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
    } else {
      return `rgb(${Math.max(50, r)}, ${Math.max(50, g)}, ${Math.max(50, b)})`;
    }
  };

  const finalColor = ensureContrastAndMinimumBrightness(rgbNewColor);

  document.documentElement.style.setProperty("--accent-color", finalColor);

  return true;
};
