'use strict';

//The Physi.js must be included previously
Physijs.scripts.worker = '/js/libraries/physijs_worker.js';
Physijs.scripts.ammo = 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';

var renderer;
var introLevel;
var mainLevel;

var soundtrack = new Audio();
var soundtrackPlaying = false;
var select1 = new Audio();
select1.src = "assets/sounds/select1.mp3";
var select2 = new Audio();
select2.src = "assets/sounds/select2.mp3";

var currentLevel = 0;
function render(){

	if (currentLevel == 0){
		introLevel.render();
	}
	if(currentLevel == 1){
		if(mainLevel != null){
			mainLevel.render();
		}
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


document.getElementById("new_game").onmouseover = function(){
	select1.play();
}

document.getElementById('new_game').onclick = function() {
	//We set all the interface to invisible
	document.getElementById('title').style = "display:none";
	document.getElementById('menu').style = "display:none";
	
	select2.play();

	//We change the level.
	
	if(currentLevel == 1){
		mainLevel=null;
		mainLevel = new MainLevel(renderer)
	}else{
		currentLevel = 1;
	}
	mainLevel.startLevel();
	
}

document.getElementsByTagName("body")[0].onclick = function (){
	
	if(!soundtrackPlaying){
		soundtrack.src = "assets/sounds/ballistic.mp3";
		soundtrack.play();
		soundtrackPlaying = true;
	}
	
}

init();

function updateCameraRotation(event){
	//mainLevel.mouseMove(event.clientX, event.clientY);
}