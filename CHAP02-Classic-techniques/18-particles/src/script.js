import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
/**
 * Creating particles is like creating a Mesh
 * a Geometry ( BufferGeometry )
 * a Material ( PointsMaterial )
 * a Points instance ( instead of a Mesh )
 * https://www.kenney.nl/assets/particle-pack ( pack of png particles )
 */

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
    sizeAttenuation: true // If its close it look bigger, if its far it look smaller
})
particlesMaterial.size = 0.02
particlesMaterial.sizeAttenuation = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
*/

// Geometry


const particlesGeometry = new THREE.BufferGeometry()
const count = 500000

const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
})
particlesMaterial.size = 0.02
particlesMaterial.sizeAttenuation = true
// particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.vertexColors = true

// We can also use the map property to put a texture on those particles.
// * particlesMaterial.map = particleTexture
// We need to activate transparency with transparent and use the texture on the alphaMap property instead of the map:
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

// Using alphaTest
// The alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the pixel according to that pixel's transparency.
// By default, the value is 0 meaning that the pixel will be rendered anyway. If we use a small value such as 0.001, the pixel won't be rendered if the alpha is 0:
// * particlesMaterial.alphaTest = 0.001 // solution but not best quality, can have some low black line
// This solution isn't perfect and if you watch closely, you can still see glitches, but it's already more satisfying.

// Using depthTest
// When drawing, the WebGL tests if what's being drawn is closer than what's already drawn.
// That is called depth testing and can be deactivated (you can comment the alphaTest):
// * particlesMaterial.depthTest = false // good solution if is only particles on scene, and all of same color
// While this solution seems to completely fix our problem,
// deactivating the depth testing might create bugs if you have other objects in your scene or particles with different colors.
// The particles might be drawn as if they were above the rest of the scene.
// If we draw a Cube, the particles will be visible through
/** 
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)
*/
// Using depthWrite
// As we said, the WebGL is testing if what's being drawn is closer than what's already drawn.
// The depth of what's being drawn is stored in what we call a depth buffer.
// Instead of not testing if the particle is closer than what's in this depth buffer, we can tell the WebGL not to write particles in that depth buffer (you can comment the depthTest):
particlesMaterial.depthWrite = false
// In our case, this solution will fix the problem with almost no drawback.
// Sometimes, other objects might be drawn behind or in front of the particles depending on many factors like the transparency, in which order you added the objects to your scene, etc.
// We saw multiple techniques, and there is no perfect solution. You'll have to adapt and find the best combination according to the project.

// Blending

// Currently, the WebGL draws the pixels one on top of the other. 
// By changing the blending property, we can tell the WebGL not only to draw the pixel, but also to add the color of that pixel to the color of the pixel already drawn.
// That will have a saturation effect that can look amazing.
// To test that, simply change the blending property to THREE.AdditiveBlending (keep the depthWrite property):
particlesMaterial.blending = THREE.AdditiveBlending
// The particles in front of the cube fade away
// But be careful, this effect will impact the performances, and you won't be able to have as many particles as before at 60fps.

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
    
    // Animate all particles
    // * particles.rotation.y =  elapsedTime * 0.02
    // Another solution would be to update each vertex position separately. This way, vertices can have different trajectories.
    // We only want the vertices to move up and down, meaning that we are going to update the y axis only
    // Because the position attribute is a one dimension array, we have to go through it 3 by 3 and only update the second value which is the y coordinate.
    // The easiest way to simulate waves movement is to use a simple sinus.
    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3 
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x) // i3 + 1 for get the Y on X / Y / Z
    }
    particlesGeometry.attributes.position.needsUpdate = true 
    // You should get beautiful waves of particles. Unfortunately, you should avoid this technique.
    // if we have 20000 particles, we are going through each one, calculating a new position, and updating the whole attribute on each frame
    // That can work with a small number of particles, but we want millions of particles.

    // ! To update these millions of particles on each frame with a good framerate, we need to create our own material with our own shaders.
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()