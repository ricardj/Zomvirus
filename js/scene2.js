'use strict';

//The Physi.js must be included previously
Physijs.scripts.worker = '/js/libraries/physijs_worker.js';
Physijs.scripts.ammo = 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';

var renderer;
var scene;                  //THREE and PHYSYjs scene
var updatable_assets = [];  //for calling our own update function
var camera;                 //The main camera
var environment;            //Skybox
var car;                    //The player

//Assets
function Car(){
  this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
  this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  this.mesh = new Physijs.BoxMesh( this.geometry, this.material, 1000 );
  this.mesh.position.set(0, 10, 0);
  this.mesh.__dirtyPosition = true; //To be able to update the speed
  this.mesh.__dirtyRotation = true; //To be able to update the rotation
  this.camera = camera;

  this.camera_offset = new THREE.Object3D();
  this.camera_offset.position.set(0, 30, -32);
  this.camera_target = new THREE.Object3D();
  this.camera_target.position.set(0,0,20);
  this.mesh.add(this.camera_target);
  this.mesh.add(this.camera_offset);

  this.lookAtVector = new THREE.Vector3(0,0,0);
  this.update = function(){
    
    var new_camera_position = new THREE.Vector3();
    new_camera_position.setFromMatrixPosition(this.camera_offset.matrixWorld);
    this.camera.position.lerp(new_camera_position,0.2);
    
    var new_camera_target = new THREE.Vector3();
    new_camera_target.setFromMatrixPosition(this.camera_target.matrixWorld);
    this.camera.lookAt(new_camera_target);

  }

  //Add listeners and controls to the car
  var oThis = this;
  window.addEventListener('keydown',function(e){
    switch(e.key) {
      case "w":
        /*
        var speed = oThis.mesh.getLinearVelocity();
        
        var matrix = new THREE.Matrix4();
        matrix.extractRotation( oThis.mesh.matrix );
        var direction = new THREE.Vector3( 0, 1, 0 );
        direction.applyMatrix4 ( matrix );
        
        speed.add(direction.addScalar(2))
        oThis.mesh.setLinearVelocity(speed);
        */
        oThis.mesh.translateZ(20);
        break;
      case "a":
        var angle = oThis.mesh.getAngularVelocity();
        angle.y += 2;
        oThis.mesh.setAngularVelocity(angle);
        break;
      case "d":
        var angle = oThis.mesh.getAngularVelocity();
        angle.y -= 2;
        oThis.mesh.setAngularVelocity(angle);
        break;
      case "s":
        break;
    }
  });

}

function Platform(){
  this.update = function(){};
}

function Environment(){
  this.geometry = new THREE.SphereGeometry(90, 32, 32);
  this.material = new THREE.MeshBasicMaterial();
  this.material.map = THREE.ImageUtils.loadTexture('assets/galaxy_starfield.png');

  this.material.side = THREE.BackSide;
  this.material.depthTest = false;
	this.material.depthWrite = false;

  this.mesh = new THREE.Mesh(this.geometry,this.material);
  
  this.update = function(){
    var newPosition = car.mesh.position;
    this.mesh.position.set(newPosition.x,newPosition.y,newPosition.z);
  }
  
}

function render(){

  scene.simulate();
  
  var e;
  for (e in updatable_assets){
    updatable_assets[e].update();
  }

  
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
    60,
    window.innerWidth/ window.innerHeight,
    0.1, 1000);
  camera.position.x = 0;
  camera.position.y =  20;
  camera.position.z = -40;

  camera.lookAt( scene.position );

  //scene.add(camera);
  //cameraControl = new THREE.OrbitControls(camera);
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
  environment = new Environment();

  updatable_assets.push(environment);
  scene.add(environment.mesh);
}

function createCar(){
  car = new Car();

  updatable_assets.push(car);
  scene.add(car.mesh);
}

function init() {

  //scene = new THREE.Scene();
  scene = new Physijs.Scene();

  createRenderer();
  createCamera();
  createEnvironment();

  //We create the car wich is the player
  createCar();


  //We create the plane under him
  createPlatform();

  var gridHelper = new THREE.GridHelper(100, 100 );
  scene.add( gridHelper );
  //scene.add( new THREE.AxesHelper() );

  //We set the camera behind
  //We set some light
  createLight();
  
  document.getElementById( 'viewport' ).appendChild( renderer.domElement );

  render();
}

init();
