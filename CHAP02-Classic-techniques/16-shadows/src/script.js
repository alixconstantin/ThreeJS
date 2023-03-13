import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// * he back of the objects are indeed in the dark, and this is called the core shadow.
// * What we are missing is the drop shadow, where objects create shadows on the other objects.


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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)

directionalLight.castShadow = true

scene.add(directionalLight)


/**
 * Shadows
 * 
 * to activate the shadow maps on the renderer
 * renderer.shadowMap.enabled = true
 * Then, we need to go through each object of the scene and decide if
 * the object can cast a shadow with the castShadow property
 * and if the object can receive shadow with the receiveShadow property.
 * exemple : sphere.castShadow = true / plane.receiveShadow = true
 * Finally, activate the shadows on the light with the castShadow property.
 * 
 * Only the following types of lights support shadows : PointLight, DirectionalLight, SpotLight
 * 
 * Shadow map optimisations
 * 
 * By default, the shadow map size is only 512x512 for performance reasons.
 * We can improve it but keep in mind that you need a power of 2 value for the mipmapping
 */
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024


// * we must define a near and a far.
// * It won't really improve the shadow's quality, but it might fix bugs where you can't see the shadow or where the shadow appears suddenly cropped.
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6



// * To help us debug the camera and preview the near and far, we can use a CameraHelper with the camera used for the shadow map
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

// * Amplitude

// * With the camera helper we just added, we can see that the camera's amplitude is too large.
// * Because we are using a DirectionalLight, Three.js is using an OrthographicCamera.
// * The smaller the values, the more precise the shadow will be. But if it's too small, the shadows will just be cropped.
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2

directionalLightCameraHelper.visible = false

// * Blur

// * You can control the shadow blur with the radius property:
// * This technique doesn't use the proximity of the camera with the object. It's just a general and cheap blur.
directionalLight.shadow.radius = 5



// * Shadow map algorithm

// * Different types of algorithms can be applied to shadow maps:
// * THREE.BasicShadowMap: Very performant but lousy quality
// * THREE.PCFShadowMap: Less performant but smoother edges
// * THREE.PCFSoftShadowMap: Less performant but even softer edges
// * THREE.VSMShadowMap: Less performant, more constraints, can have unexpected results
// * To change it, update the renderer.shadowMap.type property. 
// * The default is THREE.PCFShadowMap but you can use THREE.PCFSoftShadowMap for better quality.
// * -> renderer.shadowMap.type = THREE.PCFSoftShadowMap
// * Be aware that the radius property doesn't work with THREE.PCFSoftShadowMap. You'll have to choose.

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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



renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap




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