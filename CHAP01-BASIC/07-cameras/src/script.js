import * as THREE from 'three'
/**
 * The ArrayCamera is used to render your scene multiple times by using multiple cameras.
 * Each camera will render a specific area of the canvas.
 * You can imagine this looking like old school console multiplayer games where we had to share a split-screen.
 */

/**
 * StereoCamera
 * The StereoCamera is used to render the scene through two cameras that mimic the eyes in order to create
 * what we call a parallax effect that will lure your brain into thinking that there is depth.
 * You must have the adequate equipment like a VR headset or red and blue glasses to see the result.
 */

/**
 * CubeCamera
 * The CubeCamera is used to get a render facing each direction (forward, backward, leftward, rightward, upward, and downward) to create a render of the surrounding.
 * You can use it to create an environment map for reflection or a shadow map. We'll talk about those later.
 */

/**
 * OrthographicCamera
 * The OrthographicCamera is used to create orthographic renders of your scene without perspective.
 * It's useful if you make an RTS game like Age of Empire. Elements will have the same size on the screen regardless of their distance from the camera.
 */

/**
 * PerspectiveCamera
 * The PerspectiveCamera is the one we already used and simulated a real-life camera with perspective.
 * We are going to focus on the OrthographicCamera and the PerspectiveCamera.
 */

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = - (event.clientY / sizes.height - 0.5)
})
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Scene
const scene = new THREE.Scene()



// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
// const camera = new THREE.PerspectiveCamera(Vertical vision angle in degrees, sizes.width / sizes.height)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
// Ortho Camera
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)

//camera.position.x = 2
//camera.position.y = 2
camera.position.z = 4
camera.lookAt(mesh.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
   // mesh.rotation.y = elapsedTime;
   
    // Update camera
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)
    
    camera.lookAt(mesh.position)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()