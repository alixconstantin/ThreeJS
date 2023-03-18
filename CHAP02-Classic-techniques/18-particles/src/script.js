import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/2.png')




/**
 * Particles
 */

/**  simple sphere as particles
// Geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true
})
particlesMaterial.size = 0.02
particlesMaterial.sizeAttenuation = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
*/

// Geometry


const particlesGeometry = new THREE.BufferGeometry()
const count = 50000

const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
})
particlesMaterial.size = 0.02
particlesMaterial.sizeAttenuation = true
particlesMaterial.color = new THREE.Color('#ff88cc')

// We can also use the map property to put a texture on those particles.
// * particlesMaterial.map = particleTexture
// We need to activate transparency with transparent and use the texture on the alphaMap property instead of the map:
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

// Using alphaTest
// The alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the pixel according to that pixel's transparency.
// By default, the value is 0 meaning that the pixel will be rendered anyway. If we use a small value such as 0.001, the pixel won't be rendered if the alpha is 0:
// * particlesMaterial.alphaTest = 0.001
// This solution isn't perfect and if you watch closely, you can still see glitches, but it's already more satisfying.

// Using depthTest
// When drawing, the WebGL tests if what's being drawn is closer than what's already drawn.
// That is called depth testing and can be deactivated (you can comment the alphaTest):
// * particlesMaterial.depthTest = false
// While this solution seems to completely fix our problem,
// deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors.
// The particles might be drawn as if they were above the rest of the scene.
// If we draw a Cube, the particles will be visible through
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

// Using depthWrite
// As we said, the WebGL is testing if what's being drawn is closer than what's already drawn.
// The depth of what's being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write particles in that depth buffer (you can comment the depthTest):
particlesMaterial.depthWrite = false
// In our case, this solution will fix the problem with almost no drawback.
// Sometimes, other objects might be drawn behind or in front of the particles depending on many factors like the transparency, in which order you added the objects to your scene, etc.
// We saw multiple techniques, and there is no perfect solution. You'll have to adapt and find the best combination according to the project.


// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)











/**
 * Sizes
*/
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

/**
 * Camera
*/
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
*/
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