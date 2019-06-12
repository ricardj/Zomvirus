var character = null;
function Character (){
    this.geometry = new THREE.BoxGeometry( 10, 10, 10 );
    this.material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    this.mesh = new Physijs.BoxMesh( this.geometry, this.material, 1000 );
    this.mesh.position.set(0, 10, 0);
    this.mesh.__dirtyPosition = true; //To be able to update the speed
    this.mesh.__dirtyRotation = true; //To be able to update the rotation
    this.lookAtVector = new THREE.Vector3(0,0,0);
    this.update = function(){
        
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
    this.updatable_assets = [];

    oThis.scale = 1;
    oThis.mouseX = 0;
    oThis.mouseY = 0;
    
    createLight();
    createCamera();
    createEnvironment();
    createCharacter();
    createPlatform()
    
    this.render = function() {
        
        this.scene.simulate();
        
        var e;
        for (e in this.updatable_assets){
            this.updatable_assets[e].update();
        }
        
        this.renderer.render(this.scene,this.camera);
    }

    function createCamera (){
        //puede que esta linea haya que canviarla
  
        oThis.camera = new THREE.PerspectiveCamera(
          60,
          window.innerWidth/ window.innerHeight,
          0.1, 1000);
      //  oThis.camera.rotation.order = "YXZ"; // this is not the default

        oThis.camera.position.x = 0;
        oThis.camera.position.y =  0;
        oThis.camera.position.z = 0;
      
        oThis.camera.lookAt( oThis.scene.position );
      
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
      
        oThis.scene.add(platform);
    }
      
      
    function createLight(){
      
        var directionalLight = new THREE.DirectionalLight(0xffffff,1);
        directionalLight.position.set(100,10,-50);
        directionalLight.name = 'directional';
        oThis.scene.add(directionalLight);
      
        var ambientLight = new THREE.AmbientLight(0x111111);
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


  

