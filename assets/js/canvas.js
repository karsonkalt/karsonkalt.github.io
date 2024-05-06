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

    cube.rotation.x += 0.001;
    cube.rotation.y += 0.001;

    renderer.render(scene, camera);
  }

  animate();
});
