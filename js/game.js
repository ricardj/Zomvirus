'use strict';

//The Physi.js must be included previously
Physijs.scripts.worker = '/js/libraries/physijs_worker.js';
Physijs.scripts.ammo = 'https://cdn.jsdelivr.net/npm/ammo-node@1.0.0/ammo.min.js';

var renderer;
var introLevel;
var mainLevel;

var soundtrack = new Audio();
soundtrack.src = "assets/sounds/ballistic.mp3";
var soundtrackPlaying = false;
var select1 = new Audio();
select1.src = "assets/sounds/select1.mp3";
var select2 = new Audio();
select2.src = "assets/sounds/select2.mp3";

var currentLevel = 0;
var renderMainLevel = true;
function render(){

	if (currentLevel == 0){
		introLevel.render();
	}
	if(currentLevel == 1){
		if(renderMainLevel){
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
	
	alert("Click here to activate the sound.");
	soundtrack.play();
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

	if(document.getElementById("new_game").innerHTML == "Reload"){
		mainLevel = null;
		mainLevel = new MainLevel(renderer);
	}else{
		currentLevel = 1;
	}
	mainLevel.startLevel();
	
}

document.getElementsByTagName("body")[0].onclick = function (){
	
	if(!soundtrackPlaying){
		
		soundtrackPlaying = true;
	}
	
}

init();

function updateCameraRotation(event){
	//mainLevel.mouseMove(event.clientX, event.clientY);
}