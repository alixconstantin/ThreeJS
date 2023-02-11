import * as THREE from 'three';
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
 * The direction of each axis is purely arbitrary, and it can vary according to the environment.
 * we usually consider that : 
 *      - the y axis is going upward
 *      - the z axis is going backward
 *      - the x axis is going to the right.
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'blue' });
const mesh = new THREE.Mesh(geometry, material);

mesh.position.x = 0.7;
mesh.position.y = - 0.6;
mesh.position.z = 1;
scene.add(mesh); 
// Can update all 3 at once by using mesh.position.set(0.7, -0.6, 1);
// You can normalize its values (meaning that you will reduce the length of the vector to 1 unit but preserve its direction):
//console.log(mesh.position.normalize())

/**
 * Scale
 * scale is also a Vector3. By default, x, y and z are equal to 1, meaning that the object has no scaling applied.
 * If you put 0.5 as a value, the object will be half of its size on this axis, and if you put 2 as a value, it will be twice its original size on this axis.
 */
mesh.scale.x = 2;
mesh.scale.y = 0.25;
mesh.scale.z = 1.5;
// same possibility mesh.scale.set(x, y, z);


/**
 * Rotation
 * The rotation property also has x, y, and z properties, but instead of a Vector3, it's a Euler.
 * When you change the x, y, and z properties of a Euler, you can imagine putting a stick through your object's center in the axis's direction and then rotating that object on that stick.
 *       - If you spin on the x axis, you can imagine that you are rotating the wheels of a car you'd be in.
 *       - If you spin on the y axis, you can picture it like a carousel.
 *       - And if you rotate on the z axis, you can imagine that you are rotating the propellers in front of an aircraft you'd be in.
 *      If you want to achieve half a rotation, you'll have to write something like 3.14159... Y
 *      ou probably recognize that number as π. In native JavaScript, you can end up with an approximation of π using Math.PI.
 */
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;
mesh.rotation.z = Math.PI * 0.25;
/**
 * when you combine those rotations, you might end up with strange results.
 * Because, while you rotate the x axis, you also change the other axes' orientation. The rotation applies in the following order: x, y, and then z.
 * That can result in weird behaviors like one named gimbal lock when one axis has no more effect, all because of the previous ones.
 * We can change this order by using the reorder(...) method object.rotation.reorder('YXZ')
 * While Euler is easier to understand, this order problem can cause issues. And this is why most engines and 3D softwares use another solution named Quaternion.
 */


/**
 * You can combine the position, the rotation (or quaternion), and the scale in any order. The result will be the same. It's equivalent to the state of the object.
 */


/**
 * Scene graph
 * 
 * At some point, you might want to group things. Let's say you are building a house with walls, doors, windows, a roof, bushes, etc.
 * When you think you're done, you become aware that the house is too small, and you have to re-scale each object and update their positions.
 * A good alternative would be to group all those objects into a container and scale that container.
 * You can do that with the Group class.
 * Instantiate a Group and add it to the scene. Now, when you want to create a new object, you can add it to the Group you just created using the add(...)
 * method rather than adding it directly to the scene.
 * Because the Group class inherits from the Object3D class, it has access to the previously-mentioned properties and methods like
 * position, scale, rotation, quaternion, and lookAt.
 */

const group = new THREE.Group()
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube1.position.x = - 1.5
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube2.position.x = 0
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cube3.position.x = 1.5
group.add(cube3)



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
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);



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
//You can get the distance from another Vector3 (make sure to use this code after creating the camera):
//console.log(mesh.position.distanceTo(camera.position))


/**
 * lookAt(...) 
 * Object3D instances have an excellent method named lookAt(...) that lets you ask an object to look at something.
 * The object will automatically rotate its -z axis toward the target you provided. No complicated maths needed.
 * Can use it to rotate the camera toward an object, orientate a cannon to face an enemy, or move the character's eyes to an object.
 * The parameter is the target and must be a Vector3.
 */
camera.lookAt(new THREE.Vector3(0, - 1, 0));
// camera.lookAt(mesh.position) will look at the center of the mesh


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);