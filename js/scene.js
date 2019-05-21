var renderer;
var scene;
var camera;
var cameraControl;

var head = undefined;

function render(){
  //console.log("Request animation frame for render");
  renderer.render(scene, camera);

  cameraControl.update();

  //scene.getObjectByName('earth').rotation.y += 0.005;
  //scene.getObjectByName('clouds').rotation.y += 0.003;

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

  /*
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10,20,20);
  spotLight.shadow.camera.near = 20;
  spotLight.shadow.camera.far = 50;
  spotLight.castShadow = true;
  scene.add(spotLight);
*/

  var directionalLight = new THREE.DirectionalLight(0xffffff,1);
  directionalLight.position.set(100,10,-50);
  directionalLight.name = 'directional';
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);
}

function createEarthMaterial() {
  var earthTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/earthmap2k.jpg', function(image){
    earthTexture.image = image;
    earthTexture.needsUpdate = true;

  });

  var earthNormalTexture  = new THREE.Texture();
  loader.load('assets/earth_normalmap_flat2k.jpg', function (image){
    earthNormalTexture.image = image;
    earthNormalTexture.needsUpdate = true;
  });


  var earthSpecularTexture= new THREE.Texture();
  loader.load('assets/earthspec2k.jpg', function (image){
    earthSpecularTexture.image = image;
    earthSpecularTexture.needsUpdate = true;
  });


  var earthMaterial = new THREE.MeshPhongMaterial();
  earthMaterial.map = earthTexture;
  earthMaterial.normalMap = earthNormalTexture;
  earthMaterial.normalScale = new THREE.Vector2(1.0,1.0);
  earthMaterial.specularMap = earthSpecularTexture;
  earthMaterial.specular = new THREE.Color(0x262626);

  return earthMaterial;
}

function createEarth(){
  var sphereGeometry = new THREE.SphereGeometry(15,30,30);
  var sphereMaterial = createEarthMaterial();
  var earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  earthMesh.name = 'earth';
  scene.add(earthMesh);
}

function createCloudsMaterial(){
  var cloudsTexture = new THREE.Texture();
  var loader = new THREE.ImageLoader();
  loader.load('assets/fair_clouds_1k.png', function(image){
    cloudsTexture.image = image;
    cloudsTexture.needsUpdate = true;
  });
  var cloudMaterial =  new THREE.MeshPhongMaterial();
  cloudMaterial.map = cloudsTexture;
  cloudMaterial.transparent = true;
  return cloudMaterial;
}

function createClouds () {
  var sphereGeometry = new THREE.SphereGeometry(15.1,30,30);
  var sphereMaterial = createCloudsMaterial();
  var cloudsMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  cloudsMesh.name = 'clouds';
  scene.add(cloudsMesh);
}

function createEnvironment(){
  var envGeometry = new THREE.SphereGeometry(90, 32, 32);
  var envMaterial = new THREE.MeshBasicMaterial();
  envMaterial.map = THREE.ImageUtils.loadTexture('assets/galaxy_starfield.png');

  envMaterial.side = THREE.BackSide;

  var mesh = new THREE.Mesh(envGeometry, envMaterial);
  scene.add(mesh);

}


//We load LEE
function createHead(){
  var material = new THREE.MeshPhongMaterial();
  loader = new THREE.OBJLoader();

  loader.load('assets/lee.obj', function(object){

    //mesh file may contain many meshes
    //In this cas it only contaons one
    object.traverse(function(child){      //Traverse gets through all meshes applying the callbacl
      if(child instanceof THREE.Mesh){
        child.material = material;
        child.receiveShadow = true;
        child.castShadow = true;
        child.name ="lee";
        head = child;
      }
    });
    scene.add(object);
  });

}

function init() {

  scene = new THREE.Scene();
  createRenderer();
  createCamera();
  //createBox();
  //createPlane();
  //createEarth();
  //createClouds();
  createHead();
  createLight();
  createEnvironment();

  document.body.appendChild(renderer.domElement);

  render();
}

init();

window.addEventListener('keydown', function(e){
  switch (e.key) {
    case "a":
      if(head)
        head.rotation.y += 0.05;
      break;
    case "d":
      if(head)
        head.rotation.y -= 0.05;
      break;
    default:

  }
});
