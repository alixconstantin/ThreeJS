import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * How to implement Dat.GUI
 * npm install lil-gui
 * import * as dat from 'lil-gui'
 * for instantiate Dat.GUI : 
 * const gui = new dat.GUI()
 * There are different types of elements you can add to that panel:
 * Range —for numbers with minimum and maximum value
 * Color —for colors with various formats
 * Text —for simple texts
 * Checkbox —for booleans (true or false)
 * Select —for a choice from a list of values
 * Button —to trigger functions
 * Folder —to organize your panel if you have too many elements
 */



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
*/
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
 * Debug
*/
const gui = new dat.GUI()
// To add an element to the panel, you must use gui.add(...).
// The first parameter is an object and the second parameter is the property of that object you want to tweak
gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
gui.add(mesh, 'visible')
gui.add(material, 'wireframe')

// Just for press "h" for hidde/Show the debugger control panel
window.addEventListener('keydown', (event) =>
{
    if(event.key === 'h')
    {
        if(gui._hidden)
        gui.show()
        else
        gui.hide()
    }
})

gui
.addColor(material, 'color')
.onChange(() =>
{
    material.color.set(material.color)
})

// For add a button " spin " in the control pannel, that make rotation effect when click on it
const parameters = {
    spin: () =>
    {
        gsap.to(mesh.rotation, { duration: 2, y: mesh.rotation.y + Math.PI * 2 })
    }
}
    gui
    .add(parameters, 'spin')




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