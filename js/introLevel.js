function IntroLevel(renderer){
    
    //We create the scene
    this.scene = new THREE.Scene();

    //We create the camera and add it to the scene
    this.camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth/ window.innerHeight,
		0.1, 1000);
	this.camera.position.x = 0;
	this.camera.position.y =  20;
	this.camera.position.z = -40;
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.renderer = renderer;

    this.render = function (){
        
        renderer.render(this.scene,this.camera);
    }
}