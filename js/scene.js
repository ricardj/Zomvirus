var renderer;
var scene;
var camera;


function render(){
  console.log("Request animation frame for render");
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
}

function createCamera (){
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/ window.innerHeight,
    0.1, 1000);
  camera.position.x = 15;
  camera.position.y =  16;
  camera.position.z = 13;
  camera.lookAt(scene.position);
}

function createBox(){
  var boxGeometry = new THREE.BoxGeometry(6,4,6);
  var boxMaterial = new THREE.MeshLambertMaterial({
    color: "red"
  });

  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.castShadow = true;

  scene.add(box);

}

function createPlane() {
  var planeGeometry = new THREE.PlaneGeometry(20,20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color : 0xcccccc
  });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.y = -2;
  scene.add(plane);
}

function createLight(){
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10,20,20);
  spotLight.shadow.camera.near = 20;
  spotLight.shadow.camera.far = 50;
  spotLight.castShadow = true;
  scene.add(spotLight);
}


function init() {

  scene = new THREE.Scene();
  createRenderer();
  createCamera();
  createBox();
  createLight();
  createPlane();
  render();
}

init();
