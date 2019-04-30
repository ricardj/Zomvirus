var renderer;
var scene;
var camera;
var cameraControl;


function render(){
  console.log("Request animation frame for render");
  renderer.render(scene, camera);

  cameraControl.update();
  scene.getObjectByName('earth').rotation.y += 0.005;


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
  camera.position.x = 90;
  camera.position.y =  32;
  camera.position.z = 32;
  camera.lookAt(scene.position);

  cameraControl = new THREE.OrbitControls(camera);
}

function createBox(){
  var boxGeometry = new THREE.BoxGeometry(6,4,6);
/**
  var boxMaterial = new THREE.MeshLambertMaterial({
    color: "red"
  });
*/
  var boxMaterial = createEarthMaterial();
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

function createEarthMaterial() {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/earthmap2k.jpg', function(image){
    earthTexture.image = image;
    earthTexture.needsUpdate = true;

  });

  var earthMaterial = new THREE.MeshBasicMaterial();
  earthMaterial.map = earthTexture;

  return earthMaterial;
}

function createEarth(){
  var sphereGeometry = new THREE.SphereGeometry(15,30,30);
  var sphereMaterial = createEarthMaterial();
  var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  earthMesh.name = 'earth';
  scene.add(earthMesh);
}

function init() {

  scene = new THREE.Scene();
  createRenderer();
  createCamera();
  //createBox();
  //createPlane();
  createEarth();
  createLight();
  document.body.appendChild(renderer.domElement);
  render();
}

init();
