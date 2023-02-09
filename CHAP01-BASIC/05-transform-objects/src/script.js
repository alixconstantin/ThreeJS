import * as THREE from 'three'
/*
There are 4 properties to transform objects in our scene :
    - position (to move the object)
    - scale (to resize the object)
    - rotation (to rotate the object)
    - quaternion (to also rotate the object; more about that later) 
All classes that inherit from the Object3D class possess those properties
like PerspectiveCamera or Mesh and classes that we haven't covered yet.
*/

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Position
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

mesh.position.x = 0.7;
mesh.position.y = - 0.6;
mesh.position.z = 1;
scene.add(mesh); 
// Can update all 3 at once by using mesh.position.set(0.7, -0.6, 1);

/**
 * Scale
 * scale is also a Vector3. By default, x, y and z are equal to 1, meaning that the object has no scaling applied.
 * If you put 0.5 as a value, the object will be half of its size on this axis, and if you put 2 as a value, it will be twice its original size on this axis.
 */
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 3.5
// same possibility mesh.scale.set(x, y, z);



/**
 * Axes Helper
 * 
 * The AxesHelper will display 3 lines corresponding to the x, y and z axes,
 * each one starting at the center of the scene and going in the corresponding direction.
 * To create the AxesHelper, instantiate it and add it to the scene right after instantiating that scene.
 * You can specify the length of the lines as the only parameter. We are going to use 2:
 * 
 * The green line corresponds to the y axis.
 * The red line corresponds to the x axis
 * and there is a blue line corresponding to the z axis but we can't see it because it's perfectly aligned with the camera.
 */
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)



/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z=5;
scene.add(camera);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);