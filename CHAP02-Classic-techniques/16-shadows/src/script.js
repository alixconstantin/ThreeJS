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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')


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

// * SpotLight ( shadows )
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)

spotLight.castShadow = true

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)
// * As you can see, shadows don't merge nicely. They are handled independently, and, unfortunately, there is not much to do about it.
// * But we can improve the shadow quality using the same techniques that we used for the directional light. ( mapSize)
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
// * Because we are now using a SpotLight, internally, Three.js is using a PerspectiveCamera.
// * That means that instead of the top, right, bottom, and left properties, we must change the fov property.
// * Try to find an angle as small as possible without having the shadows cropped:
spotLight.shadow.camera.fov = 30

spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

gui.add(spotLight.shadow.camera, 'near', 0, 10);
gui.add(spotLight.shadow.camera, 'far', 0, 10);
spotLightCameraHelper.visible = false


// * PointLight

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3)

pointLight.castShadow = true

pointLight.position.set(- 1, 1, 0)
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)

// * As you can see, the camera helper is a PerspectiveCamera (like for the SpotLight) but facing downward.
// * That is due to how Three.js handles shadow maps for the PointLight.
// * Because the point light illuminates in every direction, Three.js will have to render each of the 6 directions to create a cube shadow map.
// * The camera helper you see is the camera's position in the last of those 6 renders (which is downward).
// * * Doing all those renders can generate performance issues. Try to avoid having too much PointLight with shadows enabled.
// * The only properties you can tweak here are the mapSize, near and far
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
pointLightCameraHelper.visible = false

// * Baking shadows

// * Three.js shadows can be very useful if the scene is simple, but it might otherwise become messy.
// * A good alternative is baked shadows. We talk about baked lights in the previous lesson and it is exactly the same thing. Shadows are integrated into textures that we apply on materials.
// * Instead of commenting all the shadows related lines of code, we can simply deactivate them in the renderer and on each light:
directionalLight.castShadow = false
// ...
spotLight.castShadow = false
// ...
pointLight.castShadow = false
// ...
// renderer.shadowMap.enabled = false
// * Now we can load a shadow texture located in /static/textures/bakedShadow.jpg using the classic TextureLoader.
/**
 * const textureLoader = new THREE.TextureLoader()
 * const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
 * 
 * const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        map: bakedShadow
    })
)
 */
// * You should see a nice blurred, and realistic fake shadow.
// *  The main problem is that it's not dynamic, and if the sphere or the lights moves, the shadows won't.


// * Baking shadows alternative !

// * A less realistic but more dynamic solution would be to use a more simple shadow under the sphere and slightly above the plane.
// * The texture is a simple halo. The white part will be visible and the black part will be invisible.
// * Then, we move that shadow with the sphere.
// * First, let's remove the previous baked shadow by putting back the MeshStandardMaterial on the plane:
/**
 * const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
 */
// * Then, we can load a basic shadow texture located in /static/textures/simpleShadow.jpg.
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')





/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
material.wireframe = true
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */

/**
 * 
*/
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
       // map: bakedShadow
    })
    )
    
    const sphereShadow = new THREE.Mesh(
       new THREE.PlaneGeometry(1.5, 1.5),
       new THREE.MeshBasicMaterial({
           color: 0x000000,
           transparent: true,
           alphaMap: simpleShadow
       })
    )
    sphereShadow.rotation.x = - Math.PI * 0.5
    sphereShadow.position.y = plane.position.y + 0.01
    
    scene.add(sphere, sphereShadow, plane)
    
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

// * There you go, a not so realistic but very performant shadow.
// * If you're going to animate the sphere, you can simply animate the shadow accordingly and change its opacity depending on the elevation of the sphere:
/**
 * const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // ...
}

tick()
 */


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



renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap




/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()