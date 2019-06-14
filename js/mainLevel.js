//Some globals for the level

var playerPosition = new THREE.Vector3(); //Used by the enemies to followw the player
var renderer;         //Used by the camera fps and the main level
var scene;
var id = 1;



function FirstPersonCamera(){

    var oThis = this;
    this.ttj = 100;//time to jum
    this.collider;
    this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth/ window.innerHeight,
        0.1, 1000);

    this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 0;
    
    
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.canJump = false;
    this.prevTime = performance.now();
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.controls;

    this.controls = new THREE.PointerLockControls(this.camera);


    this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.collider = new Physijs.BoxMesh( this.geometry, this.material, 1000 );
    this.collider.position.set(this.camera.position.x, 30, this.camera.position.z);


    /*this.get("mesh").object.addEventListener("ready", function(){
        this.get("mesh").object.setAngularFactor(new THREE.Vector3(0, 0, 0));
    });*/



    renderer.domElement.addEventListener( 'click', function () {
        oThis.controls.lock();
    }, false );
    
    this.checkCollision = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        //console.log("The mesh is colliding");
        if(other_object.name ==  "enemy"){
            alert("I will find you");
        }
    }

    this.collider.addEventListener( 'collision', this.checkCollision );

    this.onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                oThis.moveForward = true;
                break;
            case 37: // left
            case 65: // a
                oThis.moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                oThis.moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                oThis.moveRight = true;
                break;
            case 32: // space
                oThis.canJump = true;
                break;
        }
    };
    this.onKeyUp = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                oThis.moveForward = false;
                break;
            case 37: // left
            case 65: // a
                oThis.moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                oThis.moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                oThis.moveRight = false;
                break;
            case 32: // space
                oThis.canJump = false;
                break;
        }
    };

    

    document.addEventListener( 'keydown', this.onKeyDown, false );
    document.addEventListener( 'keyup', this.onKeyUp, false );

    this.update = function (){
        var dir = new THREE.Vector3();
        oThis.camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        var newPosition = new THREE.Vector3(oThis.collider.position.x,oThis.collider.position.y,oThis.collider.position.z);

        if(oThis.moveForward){
                       
            newPosition.add(dir);
            oThis.collider.position.set(newPosition.x,newPosition.y,newPosition.z);

        }
        if(oThis.moveBackward){
            newPosition.sub(dir);
            oThis.collider.position.set(newPosition.x,newPosition.y,newPosition.z);

        }
        var axis = new THREE.Vector3( 0, 1, 0 );

        if(oThis.moveLeft){
            var angle = Math.PI / 2;
            dir.applyAxisAngle( axis, angle );
            newPosition.add(dir);
            oThis.collider.position.set(newPosition.x,newPosition.y,newPosition.z);
        }
        if(oThis.moveRight){
            var angle = -Math.PI / 2;
            dir.applyAxisAngle( axis, angle );
            newPosition.add(dir);
            oThis.collider.position.set(newPosition.x,newPosition.y,newPosition.z);
        }
        if(oThis.canJump && oThis.ttj < 0){
            oThis.collider.applyCentralImpulse(new THREE.Vector3(0,20000,0))
            oThis.ttj = 200;
        }

        var oPos = oThis.collider.position;

        oThis.camera.position.set(oPos.x, oPos.y + 5, oPos.z);
        
        
        oThis.collider.__dirtyPosition = true;


        var time = performance.now();
        var delta = ( time - this.prevTime ) / 1000;
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
        this.direction.x = Number( this.moveLeft ) - Number( this.moveRight );
        
        oThis.canJump = false;
        this.prevTime = time;
        oThis.ttj -= 1;
    }

}



function Character (){
    this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.mesh = new Physijs.BoxMesh( this.geometry, this.material, 1000 );
    this.mesh.position.set(0, 30, 0);
    
    this.handleCollision = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        //console.log("The mesh is colliding");
        if(other_object.name ==  "enemy"){
            //console.log("Dammit! the enemy killed me");
        }
    }

    this.mesh.addEventListener( 'collision', this.handleCollision );

    this.lookAtVector = new THREE.Vector3(0,0,0);
    this.update = function(){
        playerPosition.setFromMatrixPosition( this.mesh.matrixWorld );
    }

    
}

function Enemy(id) {
    var oThis = this;
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
    this.mesh.lives = 3;
    this.mesh.id = id;
    this.mesh.position.set(20,0,10);

    this.handleCollision = function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
        //console.log("The mesh is colliding");
        if(other_object.name ==  "bullet"){
            //console.log("Dammit! the enemy killed me");
            oThis.mesh.lives -=1;
            console.log(oThis.mesh.lives);
            if(oThis.mesh.lives <= 0){
                scene.remove(oThis.mesh);
            }
        }
    }

    this.mesh.addEventListener( 'collision', this.handleCollision );



    
    this.update = function(){
        
        this.mesh.rotateY(0.2 * Math.PI/180);
        this.mesh.__dirtyRotation = true;
        
        var matrix = new THREE.Matrix4();
        matrix.extractRotation( this.mesh.matrix );
        var direction = new THREE.Vector3( 1, 0, 0 );
        direction.applyMatrix4( matrix );

        
        var newPosition = new THREE.Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
        var playerPositionCopy = new THREE.Vector3();
        playerPositionCopy.copy(playerPosition);
        direction = playerPositionCopy.sub(newPosition);
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
    this.material.map = THREE.ImageUtils.loadTexture('assets/images/skybox_1.jpg');
  
    this.material.side = THREE.BackSide;
    this.material.depthTest = false;
    this.material.depthWrite = false;
  
    this.mesh = new THREE.Mesh(this.geometry,this.material);

    this.update = function(){
        
    }
}


function BulletManager(level){
    var oThis = this;
    this.pressed = false;
    this.shooting = false;
    this.canShoot = 15;

    this.bullets = [];
    this.mainLevel = level;
    this.burstShoot = 1;

    this.addBullet = function (){
        /*let bullet = new THREE.Mesh(
            new THREE.SphereGeometry(20,20,20),
            new THREE.MeshBasicMaterial({color:0xffffff})
            
        );*/
       
        /** ***************************************************/

        var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );

        var ballMass = 35;
        var ballRadius = 0.4; 
        var bullet = new Physijs.SphereMesh( 
            new THREE.SphereGeometry( ballRadius, 10, 10 ), 
            ballMaterial,
            ballMass
        );
        bullet.name= "bullet";
        /*bullet.addEventListener('collision', function(object){
            console.log("hello world"); // NOT FIRING
        });*/

        let c = oThis.mainLevel.camera;
        bullet.position.set(

            c.position.x,
            c.position.y,
            c.position.z
        );
        let dir = new THREE.Vector3(); ;
        c.getWorldDirection(dir);

        
        bullet.castShadow = true;
        bullet.receiveShadow = true;


        this.bullets.push(bullet);                
        scene.add(bullet);
        bullet.setLinearVelocity( new THREE.Vector3( dir.x * 100, dir.y * 100 , dir.z *100 ) ); 

    }

    this.shoot = function(){

        if(oThis.shooting == false){
            oThis.burstShoot = 1;
            oThis.shooting = true;
        }
    }
    this.cancelShoot = function(){
        oThis.shooting = false;
        oThis.canShoot = 15;
        //oThis.burstShoot = 1;


    }

    document.addEventListener( 'mousedown', this.shoot, false );
    document.addEventListener( 'mouseup', this.cancelShoot, false );


    this.update = function(){
        if(oThis.shooting && oThis.burstShoot <= 3 && oThis.canShoot <= 0){
            this.addBullet();
            oThis.burstShoot += 1;
            oThis.canShoot = 15;
            
         //   shooting = false;
        }
        oThis.canShoot -= 1;
    }
}

function MainLevel(foreignRenderer){
    var oThis = this;
    renderer = foreignRenderer;
    this.renderer = foreignRenderer;
    this.bullets = [];    

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3( 0, -20, 0 ))
    scene.fog = new THREE.Fog( 0x000000, 0, 200 );
    scene.updateMatrixWorld(true);
    
    this.updatable_assets = [];

    oThis.scale = 1;
    oThis.mouseX = 0;
    oThis.mouseY = 0;
    
    createLight();
    createCamera();
    createEnvironment();
    createCharacter();
    createPlatform();
    //createFloor();
    createEnemies();
    createBulletManager();
    this.render = function() {
        
        var e;
        for (e in this.updatable_assets){
            this.updatable_assets[e].update();
        }
        scene.updateMatrixWorld(true);
        scene.simulate();
        this.renderer.render(scene,this.camera);
    }

    function createBulletManager(){
        var bulletManager = new BulletManager(oThis);
        this.bulletManager = bulletManager;
        oThis.updatable_assets.push(bulletManager);

    }

    function createCamera (){
  
        //Free camera
        /*
            oThis.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth/ window.innerHeight,
            0.1, 1000);
            //oThis.camera.rotation.order = "YXZ"; // this is not the default

            oThis.camera.position.x = 0;
            oThis.camera.position.y = 10;
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
        */

        //fps camera
        var fps_camera =new FirstPersonCamera(); 
        oThis.camera = fps_camera.camera;
        scene.add(fps_camera.collider);
        //oThis.fps = fps.camera;
        oThis.updatable_assets.push(fps_camera);
    }
      
    function createPlatform(){
        var texture = new THREE.TextureLoader().load( "assets/images/baldosa_1.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );

        var geometry = new THREE.PlaneGeometry(1000,1000);
        var material = new THREE.MeshStandardMaterial({
          map: texture
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
            scene.add(lights[i]);
        }
      
        var ambientLight = new THREE.AmbientLight(0x000000);
        scene.add(ambientLight);
    }
      
    function createEnvironment(){
        oThis.environment = new Environment();
      
        oThis.updatable_assets.push(oThis.environment);
        
    }
      
    function createCharacter(){
        oThis.character = new Character();
        //oThis.character.mesh.add(oThis.environment.mesh);
        oThis.updatable_assets.push(oThis.character);
        scene.add(oThis.character.mesh);
    }

    
    function createEnemies(){
        for (var i = 0; i < 5; i ++){
            var p = Math.floor(Math.random() * 100);
            var enemy = new Enemy(id);
            enemy.mesh.position.set(p,0,p);
            oThis.updatable_assets.push(enemy);
            scene.add(enemy.mesh);
            id += 1;
        }
    }

    function createFloor(){
        //We readd the mesh
        loader = new THREE.OBJLoader();

        loader.load('assets/models/nivel4.obj', function(object){

            //mesh file may contain many meshes
            //In this cas it only contaons one
            var box = 40;
            var i = 0;
            ///console.log(object);
            object.traverse(function(child){      //Traverse gets through all meshes applying the callbacl
                if(child instanceof THREE.Mesh){
                    //child.material = material;
                    console.log(child);
                    child.receiveShadow = true;
                    child.castShadow = true;
                    head = child;
                    if(child.name != "Object001" && i < box){
                        i++;
                        var element = new Physijs.BoxMesh(child.geometry,child.material,0);
                        element.position.y;
                        scene.add(element);
                    }
                    
                }
            });
            // console.log(object);
            // var child = object.children[0];
            // console.log(child);
            // var element = new Physijs.BoxMesh(child.geometry,child.material);
            // oThis.scene.add(element);
            
        });

    }
}