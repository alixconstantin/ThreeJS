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
const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({
     color: 0xff0000,
     //wireframe : The wireframe will show the lines that delimit each triangle
     wireframe: true
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
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