//Some globals for the level

var playerPosition = new THREE.Vector3(); //Used by the enemies to followw the player


var rotWorldMatrix;

// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setFromRotationMatrix(object.matrix);
}


var character = null;
function Character (){
    this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.mesh = new Physijs.BoxMesh( this.geometry, this.material, 1000 );
    this.mesh.position.set(0, 10, 0);
    
    this.handleCollision = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        console.log("The mesh is colliding");
        if(other_object.name ==  "enemy"){
            console.log("Dammit! the enemy killed me");
        }
    }

    this.mesh.addEventListener( 'collision', this.handleCollision );

    this.lookAtVector = new THREE.Vector3(0,0,0);
    this.update = function(){
        
        playerPosition.setFromMatrixPosition( this.mesh.matrixWorld );
    }
}


function Enemy() {

    this.geometry = new THREE.ConeGeometry( 10,15, 32 );
    var texture = new THREE.TextureLoader().load( "assets/images/zombie_1.jpg" );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );
    this.material =new THREE.MeshStandardMaterial({
        map: texture
    });

    this.mesh = new Physijs.ConvexMesh(this.geometry, this.material, 3000);
    this.mesh.name = "enemy";
    
    
    this.mesh.position.set(20,0,10);
    //rotateAroundWorldAxis(this.mesh, new THREE.Vector3(1,1,0), 45 * Math.PI/180);
    
    this.update = function(){
        
        this.mesh.rotateY(0.2 * Math.PI/180);
        this.mesh.__dirtyRotation = true;
        
        var matrix = new THREE.Matrix4();
        matrix.extractRotation( this.mesh.matrix );
        var direction = new THREE.Vector3( 1, 0, 0 );
        direction.applyMatrix4( matrix );

        
        var newPosition = new THREE.Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
        direction = playerPosition.sub(newPosition);
        direction.normalize();
        direction.y = 0;
        direction.multiplyScalar(0.10);
        newPosition.add(direction);
        this.mesh.position.set(newPosition.x,newPosition.y,newPosition.z);
        this.mesh.__dirtyPosition = true;

    }
    character = this;

}


function Environment(){
    this.geometry = new THREE.SphereGeometry(90, 32, 32);
    this.material = new THREE.MeshBasicMaterial();
    this.material.map = THREE.ImageUtils.loadTexture('assets/images/galaxy_starfield.png');
  
    this.material.side = THREE.BackSide;
    this.material.depthTest = false;
    this.material.depthWrite = false;
  
    this.mesh = new THREE.Mesh(this.geometry,this.material);

    this.update = function(){
        
    }
}

function MainLevel(renderer){
    


    var oThis = this;
    this.renderer = renderer;
    
    this.scene = new Physijs.Scene();
    this.scene.updateMatrixWorld(true);
    
    this.updatable_assets = [];

    oThis.scale = 1;
    oThis.mouseX = 0;
    oThis.mouseY = 0;
    
    createLight();
    createCamera();
    createEnvironment();
    createCharacter();
    createPlatform();
    createEnemies();
    
    this.render = function() {
        
        
        var e;
        for (e in this.updatable_assets){
            this.updatable_assets[e].update();
        }
        
        this.scene.simulate();
        this.renderer.render(this.scene,this.camera);
    }

    function createCamera (){
        //puede que esta linea haya que canviarla
  
        //Camera one
        oThis.camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth/ window.innerHeight,
          0.1, 1000);
      //  oThis.camera.rotation.order = "YXZ"; // this is not the default

        oThis.camera.position.x = 0;
        oThis.camera.position.y =  0;
        oThis.camera.position.z = 0;
      
        oThis.camera.lookAt( oThis.scene.position );

        //camera 2
        // Orbit Controls >
        var controls = new THREE.OrbitControls( oThis.camera );
        // I prefer to swap the mouse controls, but most examples out there don't:
        controls.mouseButtons = {
            ORBIT: THREE.MOUSE.RIGHT,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.LEFT
        };
        controls.enableDamping = true; // For that slippery Feeling
        controls.dampingFactor = 0.12; // Needs to call update on render loop 
        controls.rotateSpeed = 0.08; // Rotate speed
        controls.autoRotate = false; // turn this guy to true for a spinning camera
        controls.autoRotateSpeed = 0.08; // 30
        controls.maxPolarAngle = Math.PI/2; // Don't let to go below the ground
        // < Orbit Controls

      
    }
      
    function createPlatform(){
        var texture = new THREE.TextureLoader().load( "assets/images/baldosa_1.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        var geometry = new THREE.PlaneGeometry(200,200);
        var material = new THREE.MeshStandardMaterial({
          map: texture
        });
      
        material.side = THREE.DoubleSide;
      
        var platform = new Physijs.BoxMesh(
          geometry,
          material
        );
      
        platform.rotation.x = Math.PI / 2;
      
        oThis.scene.add(platform);
    }
      
      
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
      
    function createEnvironment(){
        oThis.environment = new Environment();
      
        oThis.updatable_assets.push(oThis.environment);
        
    }
      
    function createCharacter(){
        oThis.character = new Character();
        oThis.character.mesh.add(oThis.environment.mesh);
        oThis.updatable_assets.push(oThis.character);
        oThis.scene.add(oThis.character.mesh);
    }
    
    function createEnemies(){
        for (var i = 0; i < 5; i ++){
            var p = Math.floor(Math.random() * 100);
            var enemy = new Enemy();
            enemy.mesh.position.set(p,0,p);
            oThis.updatable_assets.push(enemy);
            oThis.scene.add(enemy.mesh);
        }
        
    }
}



MainLevel.prototype.mouseMove = function(x, y ) {
   // console.log(this.mouseX);
    this.mouseX = - ( x / this.renderer.domElement.clientWidth ) * 2 + 1;
    this.mouseY = - ( y / this.renderer.domElement.clientHeight ) * 2 + 1;

    this.camera.rotation.x = this.mouseY / this.scale;
    this.camera.rotation.y = this.mouseX / this.scale;
    console.log(this.mouseX);


}


window.addEventListener("keydown", function(e){
    if(character){
        //alert("a");
      switch(e.key){
        case'w':
          head.position += (head)
        case'a':
          head.rotation.y += 0.01;
          break;
        case'd':
          head.rotation.y -= 0.01;
          break;
      }
    }
  });


  

