import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * Animate
 */
const tick = () =>
{
    // Update objects
    mesh.rotation.y += 0.01

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()

/**
 * Adaptation to the framerate
 * ( The Date.now() solution )
 * Because everyone can have different result from his framerate,
 * We need to adapt the animation to the framerate, we need to know how much time it's been since the last tick.
 * First, we need a way to measure time. In native JavaScript, you can use Date.now() to get the current timestamp:
 */
let time = Date.now()
//  to subtract the current timestamp to that of the previous frame to get what we can call the deltaTime and use this value when animating objects:

/**
 * Animate
*/

const tick = () =>
{
		// Time
    let currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    // Update objects
    mesh.rotation.y += 0.01 * deltaTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick() 

/**
 *  Adaptation to the framerate
 * ( Using Clock solution )
 *  in Three.js named Clock that will handle the time calculations.
 * You simply have to instantiate a Clock variable and use the built-in methods like getElapsedTime()
 * This method will return how many seconds have passed since the Clock was created.
 */

/**
 * Animate
*/
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // combine it with Math.sin(...) you can get a pretty good result:
    mesh.position.x = Math.cos(elapsedTime)
    mesh.position.y = Math.sin(elapsedTime)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
} // Another available method is getDelta(...), but you should not use it unless you know exactly what's going on in the Clock class code. Using it might mess with your animation

tick() 

/**
 * Adaptation to the framerate
 * ( Using library solution )
 * a very famous one is GSAP.
 * npm install gsap
 * import './style.css'
 * import * as THREE from 'three' 
 * can create what we call a tween (an animation from A to B) using gsap.to(...):
*/
import gsap from 'gsap'
/**
 * Animate
 */
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
// GSAP has a built-in requestAnimationFrame, so you don't need to update the animation by yourself
// if you want to see the cube moving, you need to keep doing the renders of your scene on each frame.

