document.addEventListener("DOMContentLoaded", function () {
  // Create scene, camera and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("background"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Enable high-resolution rendering
  renderer.setPixelRatio(window.devicePixelRatio);

  // Create cube
  const geometry = new THREE.BoxGeometry();
  const materials = [
    new THREE.MeshBasicMaterial({ color: 0x080808 }), // very dark grey
    new THREE.MeshBasicMaterial({ color: 0x101010 }), // very dark grey
    new THREE.MeshBasicMaterial({ color: 0x181818 }), // very dark grey
    new THREE.MeshBasicMaterial({ color: 0x202020 }), // very dark grey
    new THREE.MeshBasicMaterial({ color: 0x282828 }), // very dark grey
    new THREE.MeshBasicMaterial({ color: 0x303030 }), // very dark grey
  ];
  const cube = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  camera.position.z = 1;
  camera.position.x = 1;

  // Mouse variables
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0,
  };

  // Auto-rotate cube
  let autoRotate = true;
  const autoRotateSpeed = 0.001;

  // Mouse events
  renderer.domElement.addEventListener("mousedown", (event) => {
    isDragging = true;
    autoRotate = false;
  });

  renderer.domElement.addEventListener("mousemove", (event) => {
    const deltaMove = {
      x: event.offsetX - previousMousePosition.x,
      y: event.offsetY - previousMousePosition.y,
    };

    if (isDragging) {
      const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          toRadians(deltaMove.y * 1),
          toRadians(deltaMove.x * 1),
          0,
          "XYZ"
        )
      );

      cube.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        cube.quaternion
      );
    }

    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });

  renderer.domElement.addEventListener("mouseup", (event) => {
    isDragging = false;
    autoRotate = true;
  });

  const playPauseButton = document.getElementById("playPauseButton");
  playPauseButton.addEventListener("click", () => {
    autoRotate = !autoRotate;
    playPauseButton.innerHTML = autoRotate
      ? `<svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
      </svg>`
      : `<svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M320-200v-560l440 280-440 280Z" />
      </svg>`;
  });

  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate || isDragging) {
      cube.rotation.x += autoRotateSpeed;
      cube.rotation.y += autoRotateSpeed;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Helper function to convert degrees to radians
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
});
