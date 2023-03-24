import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// For 3D physics, there are three main libraries:
// Ammo.js, Cannon.js, Oimo.js
// For 2D physics, there are many libraries, but here's the most popular:
// Matter.js, P2.js, Planck.js, Box2D.js
// We won't use a 2D library in this lesson, but the 2D library code would be very similar to a 3D library code. The main difference is the axes you have to update.
// npm install cannon
import CANNON, { Vec3 } from 'cannon'

// First, we need to create a Cannon.js World ( Physic World ):
/**
 * Physics
*/

const world = new CANNON.World()

// Better Performance, but can got bugs on object traveling too fast
world.broadphase = new CANNON.SAPBroadphase(world)

// Framerate improvement, material that doesnt got collision sleep until they got impacted
world.allowSleep = true

world.gravity.set(0, - 9.82, 0) // vector 3

// We can change the friction and bouncing behavior by setting a Material
// Material is just a reference, we should create one for each type of material ( plastic, concrete, jelly, etc. ) for exemple here :
// const concreteMaterial = new CANNON.Material('concrete')
// const plasticMaterial = new CANNON.Material('plastic')
const defaultMaterial = new CANNON.Material('default')

// Contact Material is the combination of 2 Materials, and how they should collide
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.01,
        restitution: 0.6// Bouncing
    }
)
world.addContactMaterial(defaultContactMaterial)



// * Sphere Physics
/* 1
// We need to create a Body, Bodies are object that will fall and collide with other bodies // Three(Mesh) <-> Physic(Bodies)
// First we need to create a Shape ( There are many available primitive shapes like Box, Cylinder, Plane, etc. )
const sphereShape = new CANNON.Sphere(0.5) // 0.5 as the Mesh Sphere
// Then we can create our Body and specify a mass and a position:
const sphereBody = new CANNON.Body({
    mass: 1, // weight
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
   // material: defaultMaterial
})
 
// Use applyLocalForce(...) to apply a small push on our SphereBody at the start 
sphereBody.applyLocalForce(new CANNON.Vec3(50, 0, 0), new CANNON.Vec3(0, 0, 0))

// Finally, we can add the Body to the world with addBody(...):
world.addBody(sphereBody)
*/

// * Floor Physics 
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0 // 0 because it wont move
floorBody.addShape(floorShape) // Or can be declared as shape: floorShape in the object
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) // Just for position the Floor Physic with the Floor Mesh
// floorBody.material = defaultMaterial

world.addBody(floorBody)

// We can also for Bouncing and friction do it globaly than on each Material if they are all same  :
world.defaultContactMaterial = defaultContactMaterial





/**
 * Debug
*/

const gui = new dat.GUI()
const debugObject = {}

debugObject.createSphere = () =>
{
    createSphere(   // createSphere (radius, position)
        Math.random() * 0.5, 
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}

debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
        )
    }

// Reset
debugObject.reset = () =>
{
    for(const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }
    
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createBox')
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'reset')

/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 2
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)
 */


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */

// an Array that will contain objects composed of the Mesh and the Body
const objectsToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})
const createSphere = (radius, position) => 
{
    // ThreeJS Mesh
    const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial)
    mesh.castShadow = true,
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position),
    scene.add(mesh)

    // Canon Js Body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save it in object to update
    objectsToUpdate.push({
        mesh,
        body
    })

} 

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5
})
const createBox = (width, height, depth, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 })


/**
 * Animate
 */
const clock = new THREE.Clock()
const oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    // console.log(deltaTime)

    // Update the physics World
    world.step( 1/60, deltaTime, 3)  // step( a fixed time step ( 60 fps), How much time passed since the last step, How much iterations the world can apply to catch up with a potential delay)
    
    for ( const object of objectsToUpdate )  // For apply Physics World on 3D World
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    /* 3 sphereBody.applyForce(new CANNON.Vec3(-0.5,0,0), sphereBody.position)

    sphere.position.x = sphereBody.position.x // Or we can writte 1 line : sphere.position.copy(sphereBody.position)
    sphere.position.y = sphereBody.position.y
    sphere.position.z = sphereBody.position.z */
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()