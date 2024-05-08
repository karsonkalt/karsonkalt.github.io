document.addEventListener("DOMContentLoaded", function () {
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

  renderer.setPixelRatio(window.devicePixelRatio);

  const geometry = new THREE.BoxGeometry();
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // dark grey
    new THREE.MeshPhongMaterial({ color: 0x444444 }), // medium dark grey
    new THREE.MeshPhongMaterial({ color: 0x555555 }), // medium grey
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // medium light grey
    new THREE.MeshPhongMaterial({ color: 0x444444 }), // light grey
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // very light grey
  ];

  const cube = new THREE.Mesh(geometry, materials);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  cube.rotation.x = Math.random() * 2 * Math.PI;
  cube.rotation.y = Math.random() * 2 * Math.PI;

  scene.add(cube);

  camera.position.z = 1;
  camera.position.x = 0.5;

  let autoRotate = true;

  window.addEventListener("resize", function () {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  function animate() {
    requestAnimationFrame(animate);

    if (autoRotate) {
      cube.rotation.x += 0.002;
      cube.rotation.y += 0.002;
    }

    renderer.render(scene, camera);
  }

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

  animate();
});
