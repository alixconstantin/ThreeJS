import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

// *  MeshLambertMaterial, MeshPhongMaterial, MeshToonMaterial, MeshStandardMaterial react to the light


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

// * The AmbientLight

// * The AmbientLight applies omnidirectional lighting on all geometries of the scene.
// * The first parameter is the color and the second parameter is the intensity
// * Ambiant light can be used as fake the light bounce.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity', 0, 100, 1 )
scene.add(ambientLight)



// * DirectionalLight

// * The DirectionalLight will have a sun-like effect as if the sun rays were traveling in parallel.
// * The first parameter is the color and the second parameter is the intensity
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
scene.add(directionalLight)
// * By default, the light will seems to come from above.



// * HemisphereLight

// * The HemisphereLight is similar to the AmbientLight but with a different color from the sky than the color coming from the ground.
// * Faces facing the sky will be lit by one color while another color will lit faces facing the ground.
// * The first parameter is the color corresponding to the sky color, the second parameter is the groundColor and the third parameter is the intensity
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)



// * PointLight

// * The PointLight is almost like a lighter. The light source is infinitely small, and the light spreads uniformly in every direction.
// * The first parameter is the color and the second parameter is the intensity
const pointLight = new THREE.PointLight(0xffffff, 0.5)
// * We can move it like any object:
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
// * By default, the light intensity doesn't fade. But you can control that fade distance and how fast it is fading using the distance and decay properties.
// * You can set those in the parameters of the class as the third and fourth parameters, or in the properties of the instance:
// * ex : const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)


// * RectAreaLight

// * The RectAreaLight works like the big rectangle lights you can see on the photoshoot set.
// * It's a mix between a directional light and a diffuse light.
// * The first parameter is the color, the second parameter is the intensity, the third parameter is width of the rectangle, and the fourth parameter is its height
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
scene.add(rectAreaLight)
// * The RectAreaLight only works with MeshStandardMaterial and MeshPhysicalMaterial.
// * You can then move the light and rotate it. To ease the rotation, you can use the lookAt(...) method that we saw in a previous lesson:
rectAreaLight.position.set(- 1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())



// * SpotLight 

// * The SpotLight works like a flashlight. It's a cone of light starting at a point and oriented in a direction. Here the list of its parameters:
/**
 * color: the color
 * intensity: the strength
 * distance: the distance at which the intensity drops to 0
 * angle: how large is the beam
 * penumbra: how diffused is the contour of the beam
 * decay: how fast the light dims
 * 
 * Rotating our SpotLight is a little harder.
 * The instance has a property named target, which is an Object3D.
 * The SpotLight is always looking at that target object. But if you try to change its position, the SpotLight won't budge:
 * spotLight.target.position.x = - 0.75
 * That is due to our target not being in the scene. Simply add the target to the scene, and it should work:
 * scene.add(spotLight.target)
 */
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)



// * Performances ! 

/**
 * Lights are great and can be realistic if well used. The problem is that lights can cost a lot when it comes to performance.
 * The GPU will have to do many calculations like the distance from the face to the light, how much that face is facing the light, if the face is in the spot light cone, etc.
 * Try to add as few lights as possible and try to use the lights that cost less.
 * 
 *  Minimal cost: AmbientLight, HemisphereLight
 *  Moderate cost: DirectionalLight, PointLight
 *  High cost: SpotLight, RectAreaLight
 */


// * ! Baking !

/**
 * A good technique for lighting is called baking.
 * The idea is that you bake the light into the texture.
 * This can be done in a 3D software.
 * Unfortunately, you won't be able to move the lights, because there are none and you'll probably need a lot of textures.
 * A good example is Three.js Journey home page
 */


// * Helpers !

/**
 * Positioning and orienting the lights is hard. To assist us, we can use helpers. Only the following helpers are supported:
 * HemisphereLightHelper
 * DirectionalLightHelper
 * PointLightHelper
 * RectAreaLightHelper
 * SpotLightHelper
 */

// * To use them, simply instantiate those classes. Use the corresponding light as a parameter, and add them to the scene.
// * The second parameter enables you to change the helper's size:

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// * The RectAreaLightHelper must import it  like Orbit Controls :
// * import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
// * Then : 
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)





/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()