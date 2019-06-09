

//The Physi.js must be included previously
Physijs.scripts.worker = '/js/libraries/physijs_worker.js';
Physijs.scripts.ammo = 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';

var renderer;
var scene;
var camera;
var cameraControl;
var player;

function render(){

  scene.simulate();
  cameraControl.update();


  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
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
  camera.lookAt(player.position);

  cameraControl = new THREE.OrbitControls(camera);
}

function createPlatform(){

  var geometry = new THREE.PlaneGeometry(20,20);

  var material = new THREE.MeshToonMaterial({
    color : 0xff8800
  });
  material.side = THREE.DoubleSide;

  var platform = new Physijs.BoxMesh(
    geometry,
    material
  );

  platform.rotation.x = Math.PI / 2;

  scene.add(platform);
}


function createLight(){

  var directionalLight = new THREE.DirectionalLight(0xffffff,1);
  directionalLight.position.set(100,10,-50);
  directionalLight.name = 'directional';
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);
}

function createEnvironment(){
  var envGeometry = new THREE.SphereGeometry(90, 32, 32);
  var envMaterial = new THREE.MeshBasicMaterial();
  envMaterial.map = THREE.ImageUtils.loadTexture('assets/galaxy_starfield.png');

  envMaterial.side = THREE.BackSide;

  var mesh = new THREE.Mesh(envGeometry, envMaterial);
  scene.add(mesh);

}

function createCar(){
  var geometry = new THREE.BoxGeometry( 10, 10, 1 );
  var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  var car = new THREE.Mesh( geometry, material );


  car.position.set(0, 10, 0);

  player = car;
  //player.add(camera);

  scene.add(car);
}

function init() {

  //scene = new THREE.Scene();
  scene = new Physijs.Scene();

  createRenderer();

  //We create the car wich is the player
  createCar();

  createCamera();

  //We create the plane under him
  createPlatform();
  //We set the camera behind
  //We set some light
  createLight();
  createEnvironment();
  /*
  //createBox();
  //createPlane();
  //createEarth();
  //createClouds();
  createHead();
  */
  document.body.appendChild(renderer.domElement);

  render();
}

init();
