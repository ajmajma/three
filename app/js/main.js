require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: { 'vendor/three': { exports: 'THREE' } }
}, [
    'vendor/three'
], function(THREE) {





/**
 * Three.js Particles expriment 0001
 * 
 * 
 * 
 * @author gary <garyconstable80@gmail.com>
 * @type type
 */ 



/**
 * utilis   
 * @type type
 */
function vectDist( v1, v2 ){
    
    v = {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
    }
    
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}



/**
 * 
 * @type type
 */
var config = {
    
    //particles
    totalParticles: 10000,
    particleSize: 0.5,
    particleSpeed: 0.05,
    
    //view / distance
    near: 0.1,
    far: 10000,
    
    //scene rotation
    x_rot:210,
    y_rot:135,
    z_pos:-263
}




/**
 * add some sliders to control x and y rotation and z position
 * @type type
 */
function degToRad( deg ){
    return deg * Math.PI / 180;
}

document.body.innerHTML += '<input type="range" id="x_rot" min="1" max="360">';
document.body.innerHTML += '<input type="range" id="y_rot" min="1" max="360">';
document.body.innerHTML += '<input type="range" id="z_pos" min="'+ ( 0 - config.far )+'" max="'+config.far+'" step="1">';

document.getElementById('x_rot').addEventListener("input", function() { 
    config.x_rot = degToRad(this.value);
});
document.getElementById('y_rot').addEventListener("input", function() { 
    config.y_rot = degToRad(this.value);
});
document.getElementById('z_pos').addEventListener("input", function() { 
    config.z_pos = this.value;
});




/**
 * window
 * @type @exp;window@pro;innerWidth
 */
var width = window.innerWidth;
var height = window.innerHeight;


/**
 * renderer
 * @type THREE.WebGLRenderer
 */
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);


/**
 * scene
 * @type THREE.Scene
 */
var scene = new THREE.Scene;


/**
 * camera position
 * @type THREE.PerspectiveCamera
 */
var camera = new THREE.PerspectiveCamera(45, width / height, config.near, config.far);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = config.z_pos;
scene.add(camera);


/**
 * skybox - our bounding cube
 * @type Number
 */
sSize = 500;
skyboxMesh  = new THREE.Mesh( new THREE.CubeGeometry( sSize, sSize, sSize, 1, 1, 1, null, true ), new THREE.MeshNormalMaterial() );




/**
 * create the particles
 * @type THREE.Geometry
 */
var particles = new THREE.Geometry;
var particleTexture = THREE.ImageUtils.loadTexture('/templates/particles/images/particle.png');
var particleMaterial = new THREE.ParticleBasicMaterial({ color: '#ffffff' });
var min = 0 - (sSize/2) ;

//attributes array
var px = [];

//create the particles
for (var p = 0; p < config.totalParticles; p++) {
    
    //create the particle
    var particle = new THREE.Vector3(
            Math.floor(Math.random() * sSize ) + min, 
            Math.floor(Math.random() * sSize ) + min, 
            Math.floor(Math.random() * sSize ) + min
    );
    
    //add the addition attributes to a sperate array
    var temp =  {
        angle: Math.floor(Math.random()*360) + 1,
        speed: config.particleSpeed
    }
    
    //push..
    px.push(temp);
    particles.vertices.push(particle);   
}

//create the particle system and add to scene
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
scene.add(particleSystem);


/**
 * add a point light
 * @type THREE.PointLight
 */
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
scene.add(pointLight);


/**
 * 
 * @returns {undefined}
 */
function render() {
    
    //annimation frame 
    requestAnimationFrame(render);
    
    
    //coliide against bounds of sky box
    function collide( x, y, angle){
        
        if ( x > (sSize/2) || x < (0 -(sSize/2)) ) {
            angle = 180 - angle;
        } else if ( y > sSize/2 || y < (0 -(sSize/2) )) {
            angle = 360 - angle;
        } 
        
        return angle;
    }
    
    //get new x and y 
    function update(angle, speed, x, y){
        
        radians = angle * Math.PI/ 180;
        
        ret = {
            x: x += Math.cos(radians) * speed,
            y: y += Math.sin(radians) * speed
        };
        
        return ret;
    }
    
    
    //loop through the particles
    for( var i=0; i<particleSystem.geometry.vertices.length;i++){
        
        //current x , y and z
        var p = particleSystem.geometry.vertices[i];
        
        //calculate the new angle
        px[i].angle = collide( p.x, p.y, px[i].angle );
        
        //calculat the new position
        var t  = update(px[i].angle, px[i].speed, p.x, p.y);
        
        //set the new position
        particleSystem.geometry.vertices[i].set( t.x, t.y, p.z );
        
        /*
        for(var j = 0; j<particleSystem.geometry.vertices.length; j++ ){
            
            var q = particleSystem.geometry.vertices[j];
            
            //draw lines
            if( vectDist(p, q) < 100 ){
                
                
                var material = new THREE.LineBasicMaterial({
                    color: 0x0000ff
                });
    
                var geometry = new THREE.Geometry();
                    geometry.vertices.push(new THREE.Vector3(p.x, p.y, p.z));
                    geometry.vertices.push(new THREE.Vector3(q.x, q.y, q.z));
                
                var line = new THREE.Line(geometry, material);
                scene.add( line );
            }
           
        }
         */
        
        
        //set the scene position
        particleSystem.rotation.x = config.x_rot;
        particleSystem.rotation.y = config.y_rot;
        particleSystem.position.z  = config.z_pos;
        
        //we need to tell it to update.
        particleSystem.geometry.verticesNeedUpdate = true;
    }
    
    //re-draw
    renderer.render(scene, camera);
}

//go..
render();






});
