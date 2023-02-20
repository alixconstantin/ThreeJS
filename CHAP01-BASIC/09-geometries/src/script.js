import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * All the built-in geometries we are going to see inherit from the BufferGeometry class.
 * This class has many built in methods like translate(...), rotateX(...), normalize(),
 */


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
//const geometry = new THREE.BoxGeometry(1, 1, 1, 2,2,  2)
/**
 * The BoxGeometry has 6 parameters:
 * width: The size on the x axis
 * height: The size on the y axis
 * depth: The size on the z axis
 * widthSegments: How many subdivisions in the x axis
 * heightSegments: How many subdivisions in the y axis
 * depthSegments: How many subdivisions in the z axis
 * The more subdivisions we add, the less we can distinguish the faces. But keep in mind that too many vertices and faces will affect performances.
 */
const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({
     color: 0xff0000,
     //wireframe : The wireframe will show the lines that delimit each triangle
     wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Creating own buffer geometryxz
// Create an empty BufferGeometry
const geometryy = new THREE.BufferGeometry()
// To add vertices to a BufferGeometry you must start with a Float32Array.
// its native JS, only store floats, fixed length, easier to handle for the computer
// To create a Float32Array, you can specify its length and then fill it later: 
const positionsArray = new Float32Array(9)

// First vertice
positionsArray[0] = 0 // x
positionsArray[1] = 0 // y
positionsArray[2] = 0 // z

// Second vertice
positionsArray[3] = 0 // x
positionsArray[4] = 1 // etc.
positionsArray[5] = 0

// Third vertice
positionsArray[6] = 1
positionsArray[7] = 0
positionsArray[8] = 0

// Or you can pass an array:

const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])
// Before you can send that array to the BufferGeometry, you have to transform it into a BufferAttribute
// The first parameter corresponds to your typed array and the second parameter corresponds to how much values make one vertex attribute.
// To read this array, we have to go 3 by 3 because a vertex position is composed of 3 values (x, y and z):
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// We can add this attribute to our BufferGeometry using the setAttribute(...) method.
// The first parameter is the name of this attribute and the second parameter is the value:
geometry.setAttribute('position', positionsAttribute)

/**
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()

// Create a Float32Array containing the vertices position (3 by 3)
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])

// Create the attribute and name it 'position'
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionsAttribute)
 */

/**
 * We can also create a bunch of random triangles:
 * 
 // Create an empty BufferGeometry
 * const geometry = new THREE.BufferGeometry()
 //  Create 50 triangles (450 values)
 *  const count = 50
 * const positionsArray = new Float32Array(count * 3 * 3)
 * for(let i = 0; i < count * 3 * 3; i++)
 * {
 *      positionsArray[i] = (Math.random() - 0.5) * 4
 * }
 // Create the attribute and name it 'position'
 * const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
 * geometry.setAttribute('position', positionsAttribute)
 * 
 // count * 3 * 3 because We need 50 triangles. Each triangle is composed of 3 vertices and each vertex is composed of 3 values (x, y, and z).
 */

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()