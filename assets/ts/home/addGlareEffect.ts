export const addGlareEffect = (
  intensityFactor: number = 0.4,
  tiltFactor: number = 15
) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const glare = document.querySelector(".glare") as HTMLElement | null;
  if (!glare) return;
  const container = glare.parentElement as HTMLElement;
  if (!container) return;

  const updateEffect = (dx: number, dy: number) => {
    const w = container.clientWidth;
    const h = container.clientHeight;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
    const intensity = Math.min(
      intensityFactor,
      Math.max(
        0,
        intensityFactor -
          Math.sqrt(dx * dx + dy * dy) / (Math.sqrt(w * w + h * h) / 2)
      )
    );

    glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${intensity}) 0%, rgba(255,255,255,0) 80%)`;

    const tiltX = (dy / h) * tiltFactor;
    const tiltY = (dx / w) * -tiltFactor;
    container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  container.addEventListener("mouseenter", () => {
    // Snap immediately while tracking
    container.style.transition = "none";
  });

  container.addEventListener("mousemove", (ev) => {
    const rect = container.getBoundingClientRect();
    const dy = ev.clientY - (rect.top + container.clientHeight / 2);
    const dx = ev.clientX - (rect.left + container.clientWidth / 2);
    updateEffect(dx, dy);
  });

  container.addEventListener("mouseleave", () => {
    // Ease back to rest
    container.style.transition = "transform 600ms cubic-bezier(0.23, 1, 0.32, 1)";
    container.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    glare.style.background = "none";
  });

  if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
    (DeviceMotionEvent as any)
      .requestPermission()
      .then((response: PermissionState) => {
        if (response === "granted") {
          let initialBeta: number | null = null;
          let initialGamma: number | null = null;

          window.addEventListener("deviceorientation", (event) => {
            if (initialBeta === null) initialBeta = event.beta || 0;
            if (initialGamma === null) initialGamma = event.gamma || 0;

            const dy = (event.beta || 0) - initialBeta;
            const dx = (event.gamma || 0) - initialGamma;
            updateEffect(dx, dy);
          });
        }
      })
      .catch(console.error);
  }
};
