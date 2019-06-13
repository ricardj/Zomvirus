'use strict';

//The Physi.js must be included previously
Physijs.scripts.worker = '/js/libraries/physijs_worker.js';
Physijs.scripts.ammo = 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';

var renderer;
var introLevel;
var mainLevel;

var currentLevel = 0;
function render(){

	if (currentLevel == 0){
		introLevel.render();
	}
	if(currentLevel == 1){
		mainLevel.render();
	}
	
	requestAnimationFrame(render)
  
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
}

function init() {
	createRenderer();
	//createIntroLevel();
	introLevel = new IntroLevel(renderer);
	mainLevel = new MainLevel(renderer);
  	document.getElementById( 'viewport' ).appendChild( renderer.domElement );
  	render();
}



document.getElementById('new_game').onclick = function() {
	//We set all the interface to invisible
	document.getElementById('interface').style = "display:none";

	//We change the level.
	currentLevel = 1;
}

init();

function updateCameraRotation(event){
	//mainLevel.mouseMove(event.clientX, event.clientY);
}