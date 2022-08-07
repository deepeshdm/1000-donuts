
/*
Author - Deepesh Mhatre
Github Link - https://github.com/deepeshdm
Date - 6/8/2022
*/

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// Scene
const scene = new THREE.Scene()

const sizes = { width: window.innerWidth, height: window.innerHeight }

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = -0.4
camera.position.z = 12
scene.add(camera)

// Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: false  // Make background transparent
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Lights
const light1 = new THREE.DirectionalLight(0xFFFFFF, 1.5);
const light2 = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(light1);
scene.add(light2);


// Orbit Control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;

//---------------------------------------------------------

// Adding Responsiveness

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//---------------------------------------------------------

// Objects

const geometry = new THREE.TorusGeometry(0.5, 0.4, 20, 45);

// textures
const loader = new THREE.TextureLoader()
const texture1 = loader.load('/textures/donut1.jpg');
const texture2 = loader.load('/textures/donut2.jpg');
const texture3 = loader.load('/textures/donut3.jpg');

// materials
const meshcolor = 0xCEC3FE
const material1 = new THREE.MeshPhongMaterial({ color: meshcolor, shininess: 100, map: texture1 });
const material2 = new THREE.MeshPhongMaterial({ color: meshcolor, shininess: 100, map: texture2 });
const material3 = new THREE.MeshPhongMaterial({ color: meshcolor, shininess: 100, map: texture3 });

// generate random donuts 
const num_of_donuts = 1300

for (let i = 0; i < num_of_donuts; i++) {

    // randomly select material
    const materials = [material1, material2, material3]
    const material = materials[Math.floor(Math.random() * materials.length)]
    const torus = new THREE.Mesh(geometry, material);

    // position randomly
    torus.position.x = (Math.random() - 0.5) * 50
    torus.position.y = (Math.random() - 0.5) * 50
    torus.position.z = (Math.random() - 0.5) * 50

    // rotate randomly
    torus.rotation.x = Math.random() * Math.PI
    torus.rotation.y = Math.random() * Math.PI

    // size donuts randomly
    const size = Math.random() * 1.3
    torus.scale.set(size, size, size)

    scene.add(torus);
    // console.log(i)
}

//---------------------------------------------------------

// 3D Text

// Load the font
const fontLoader = new THREE.FontLoader();
fontLoader.load('./fonts/helvetiker_regular.typeface.json', function (font) {

    // Add matcap to the 3D text
    const matcap = loader.load('/textures/matcap3.jpeg');
    const material = new THREE.MeshMatcapMaterial({ color: 0xD2B4DE, matcap: matcap });
    const geometry = new THREE.TextBufferGeometry('DEEPESH MHATRE', {
        font: font,
        size: 2,
        height: 0.7,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 6
    });

    geometry.center() // center the 3D text at (0,0,0)
    const textObj = new THREE.Mesh(geometry, material);

    // Move text close to camera
    textObj.position.z = 2.2
    textObj.rotation.z = 0.09
    scene.add(textObj)

});


//---------------------------------------------------------

// Add Sound 

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/sounds/ambience.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.9 );
	sound.play();
});

//---------------------------------------------------------

// Animation loop 

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();
