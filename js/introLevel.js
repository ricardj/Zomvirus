function randomVector3(xMin, xMax, yMin, yMax, zMin, zMax)
{
	return new THREE.Vector3( xMin + (xMax - xMin) * Math.random(),
		yMin + (yMax - yMin) * Math.random(), zMin + (zMax - zMin) * Math.random() );
}

var clock = new THREE.Clock();

function IntroLevel(renderer){
    
    //Some helpful variables
    var oThis = this;
    this.renderer = renderer;

    //We create the scene
    this.scene = new THREE.Scene();

    //We create the camera and add it to the scene
    this.camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth/ window.innerHeight,
        0.1, 1000);
    //-25.624143699727853, y: -24.329446240382218, z: -26.134919913518758
	this.camera.position.x = -25;
	this.camera.position.y = -24;
	this.camera.position.z = -26;
    //this.camera.lookAt(this.scene.position);

    // // Orbit Controls >
    // var controls = new THREE.OrbitControls( oThis.camera );
    // // I prefer to swap the mouse controls, but most examples out there don't:
    // controls.mouseButtons = {
    //     ORBIT: THREE.MOUSE.RIGHT,
    //     ZOOM: THREE.MOUSE.MIDDLE,
    //     PAN: THREE.MOUSE.LEFT
    // };
    // controls.enableDamping = true; // For that slippery Feeling
    // controls.dampingFactor = 0.12; // Needs to call update on render loop 
    // controls.rotateSpeed = 0.08; // Rotate speed
    // controls.autoRotate = false; // turn this guy to true for a spinning camera
    // controls.autoRotateSpeed = 0.08; // 30
    // controls.maxPolarAngle = Math.PI/2; // Don't let to go below the ground

    this.scene.add(this.camera);

    createLight();
    
    

    function createLight(){
        var lightColor = 0xffffff;
        var lights = [];

        for(var i = 0;i < 4; i++){
            var light = new THREE.DirectionalLight(lightColor,1);
            light.name = 'directional';
            lights.push(light);
        }

        var lightAltitude = 10;
        lights[0].position.set(100,lightAltitude,100);
        lights[0].position.set(-100,lightAltitude,-100);
        lights[0].position.set(-100,lightAltitude,100);
        lights[0].position.set(100,lightAltitude,-100);


        for(var i = 0; i < 4; i++){
            oThis.scene.add(lights[i]);
        }
      
        var ambientLight = new THREE.AmbientLight(0x000000);
        oThis.scene.add(ambientLight);
    }


    //Another try for particle system
    this.particleSystem = new THREE.GPUParticleSystem( {
        maxParticles: 250000
    } );
    this.scene.add(this.particleSystem );
    // options passed during each spawned
    this.options = {
        position: new THREE.Vector3(0,0,0),
        positionRandomness: 0,
        velocity: new THREE.Vector3(),
        velocityRandomness: 1,
        color: 0xaa88ff,
        colorRandomness: .2,
        turbulence: .5,
        lifetime: 2,
        size: 5,
        sizeRandomness: 100
    };
    this.spawnerOptions = {
        spawnRate: 15000,
        horizontalSpeed: 1.5,
        verticalSpeed: 1.33,
        timeScale: 0.2
    };


    //Load background texture
    var loader = new THREE.TextureLoader();
    loader.load('assets/images/background_1.jpg' , function(texture)
    {
        oThis.backgroundTexture = texture;
        oThis.scene.background = texture;  
    });


    //Render function
    this.delta = 0;
    this.tick = 0;
    this.render = function (){
        renderer.toneMappingExposure = 0.3*(Math.abs(Math.sin(this.delta/100))+  0.3);
        this.delta+=1;
        
        // this.particleSystem.rotation.y += 0.01;

        // var pCount = this.particleCount;
        // while (pCount--) {
      
        //   // get the particle
        //   var particle = this.particles.vertices[pCount];
        //   var particleSpeed =this.particlesSpeed[pCount];
      
        //   // check if we need to reset
        //   if (particle.y < -200) {
        //     particle.y = 200;
        //     particleSpeed.y = 0;
        //   }
      
        //   // update the velocity with
        //   // a splat of randomniz
        //   particleSpeed.y = Math.random() * 10;
      
        //   // and the position
        //   //this.particles.vertices[pCount].add(particleSpeed);
        //   this.particles.vertices[pCount].y += 20;
        // }
      
        // // flag to the particle system
        // // that we've changed its vertices.
        // this.particleSystem.geometry.__dirtyVertices = true;

        var delta = clock.getDelta() * this.spawnerOptions.timeScale;
        this.tick += delta;
        if ( this.tick < 0 ) this.tick = 0;
        if ( delta > 0 ) {
            this.options.position.x = Math.sin( this.tick * this.spawnerOptions.horizontalSpeed ) * 20;
            this.options.position.y = Math.sin( this.tick * this.spawnerOptions.verticalSpeed ) * 10;
            this.options.position.z = Math.sin( this.tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed ) * 5;
            for ( var x = 0; x < this.spawnerOptions.spawnRate * delta; x ++ ) {
                // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
                // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
                this.particleSystem.spawnParticle( this.options );
            }
        }
        this.particleSystem.update( this.tick );
        //console.log(this.camera.position);
       //x: -25.624143699727853, y: -24.329446240382218, z: -26.134919913518758
        renderer.render(this.scene,this.camera);
    }


}