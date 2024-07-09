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

  const ensureContrast = (rgbColor: string): string => {
    const [r, g, b] = rgbColor.match(/\d+/g)!.map(Number);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (luminance <= 0.5) {
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      return `rgb(${Math.max(0, r - 100)}, ${Math.max(0, g - 100)}, ${Math.max(
        0,
        b - 100
      )})`;
    }
  };

  const finalColor = ensureContrast(rgbNewColor);

  document.documentElement.style.setProperty("--accent-color", finalColor);

  return true;
};
