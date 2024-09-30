export const addGlareEffect = (
  intensityFactor: number = 0.4,
  tiltFactor: number = 15
) => {
  // Select the element with the class "glare"
  const glare = document.querySelector(".glare") as HTMLElement;
  const container = glare.parentElement as HTMLElement; // Assuming the container is the parent element

  // Function to update the glare and tilt effect
  const updateEffect = (dx: number, dy: number) => {
    // Get the width and height of the container element
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Calculate the angle of the position relative to the center of the container
    const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

    // Calculate the intensity of the glare based on the position
    const intensity = Math.min(
      intensityFactor, // Use the intensityFactor to control the maximum intensity
      Math.max(
        0,
        intensityFactor -
          Math.sqrt(dx * dx + dy * dy) / (Math.sqrt(w * w + h * h) / 2)
      )
    );

    // Update the glare element's background style to create the glare effect
    if (glare) {
      glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${intensity}) 0%, rgba(255,255,255,0) 80%)`;
    }

    // Calculate the tilt angles
    const tiltX = (dy / h) * tiltFactor;
    const tiltY = (dx / w) * -tiltFactor;

    // Apply the 3D tilt effect to the container
    if (container) {
      container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
  };

  container.addEventListener("mouseenter", () => {
    container.classList.add("mousemove");
  });

  container.addEventListener("mousemove", (ev) => {
    const rect = container.getBoundingClientRect();

    // Calculate the difference between the mouse position and the center of the container element
    const dy = ev.clientY - (rect.top + container.clientHeight / 2);
    const dx = ev.clientX - (rect.left + container.clientWidth / 2);

    // Update the effect based on mouse position
    updateEffect(dx, dy);
  });

  // Reset the tilt effect when the mouse leaves the container
  container.addEventListener("mouseleave", () => {
    container.classList.remove("mousemove");
    container.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });

  // Add an event listener for device orientation on mobile phones

  // if (window.matchMedia("(max-width: 767px)").matches) {
  if (true) {
    if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: PermissionState) => {
          if (response == "granted") {
            let initialBeta: number | null = null;
            let initialGamma: number | null = null;

            window.addEventListener("deviceorientation", (event) => {
              console.log(event);
              if (initialBeta === null) {
                initialBeta = event.beta || 0;
              }
              if (initialGamma === null) {
                initialGamma = event.gamma || 0;
              }

              const dy = (event.beta || 0) - initialBeta;
              const dx = (event.gamma || 0) - initialGamma;

              // Update the effect based on device orientation
              updateEffect(dx, dy);
            });
          }
        })
        .catch(console.error);
    }
  }
};
