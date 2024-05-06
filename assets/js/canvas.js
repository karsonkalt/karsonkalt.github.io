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
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // dark grey
    new THREE.MeshPhongMaterial({ color: 0x444444 }), // medium dark grey
    new THREE.MeshPhongMaterial({ color: 0x555555 }), // medium grey
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // medium light grey
    new THREE.MeshPhongMaterial({ color: 0x444444 }), // light grey
    new THREE.MeshPhongMaterial({ color: 0x333333 }), // very light grey
  ];

  const cube = new THREE.Mesh(geometry, materials);

  // Add a light source
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  cube.rotation.x = Math.random() * 2 * Math.PI;
  cube.rotation.y = Math.random() * 2 * Math.PI;

  scene.add(cube);

  camera.position.z = 1;
  camera.position.x = 0.5;

  // Add this after setting the initial renderer size
  window.addEventListener("resize", function () {
    console.log("resized");
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.002;
    cube.rotation.y += 0.002;

    renderer.render(scene, camera);
  }

  animate();
});
