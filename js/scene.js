var renderer;
var scene;
var camera;

function init() {

  scene = new THREE.Scene();

  render();
}

function render(){
  console.log("Request animation frame for render");
  //renderer.render(scene, camera);

  requestAnimationFrame(render);
}

//init();
