import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
// list of popular formats : OBJ, FBX, STL, PLY, COLLADA, 3DS, GLTF

// GLTF ( is becoming a standard and should cover most of the needs )
// It supports very different sets of data.
// You can obviously have data like the geometries and the materials but you can also have data like cameras, lights, scene graph, animations, skeletons, morphing and even multiple scene.
// It also supports various file formats like json, binary, embed textures.
// If you merely need a geometry, you better use another format like OBJ, FBX, STL, or PLY.
// You should test different formats on every project to see if you have all the data you need, if the file isn't too heavy, how long it takes to uncompress the information if it's compressed, etc.
// The GLTF team also provides various models from a simple triangle to realistic models and things like animations, morphings, clearcoat materials, etc.
// https://github.com/KhronosGroup/glTF-Sample-Models

// Choosing
// If you want to be able to alter the textures or the coordinates of the lights after exporting, you better go for the glTF-default.
// ( it also presents the advantage of loading the different files separately, resulting in a load speed improvement.)
// If you want only one file per model and don't care about modifying the assets, you better go for glTF-Binary.

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// then we can instantiate it like we did for the TextureLoader:
/**
 * Models
*/
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)
//gltfLoader.setDRACOLoader(dracoLoader)

/**
 * All we want is to get our duck in the scene. We have multiples ways of doing it:

Add the whole scene in our scene. We can do that because even if its name is scene, it's in fact a Group.
Add the children of the scene to our scene and ignore the unused PerspectiveCamera.
Filter the children before adding to the scene to remove the unwanted objects like the PerspectiveCamera.
Add only the Mesh but end up with a duck that could be wrongly scaled, positioned or rotated.
Open the file in a 3D software and remove the PerspectiveCamera then export it again.

Because our model structure is simple, we will add the Object3D to our scene, and ignore the unused PerspectiveCamera inside. In future lessons, we will add the whole scene as one object:
 */
/*
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)
*/ 

// Draco ( Malfoy )

// the Draco version can be much lighter than the default version.
// Compression is applied to the buffer data (typically the geometry). It doesn't matter if you are using the default glTF, the binary glTF or the embedded glTF.
// It's not even exclusive to glTF, and you can use it with other formats. But both glTF and Draco got popular simultaneously, so the implementation went faster with glTF exporters.
 
// After copy/past the draco file in the Static ( it was at Node/Three/exemples/jsm/libs/draco)

/**
 * When to use the Draco compression
While you might think that the Draco compression is a win-win situation, it is not. Yes, the geometries are lighter, but first, you have to load the DRACOLoader class and the decoder.
 Secondly, it takes time and resources for your computer to decode a compressed file that can result in a short freeze at the start of the experience, even if we are using a worker and Web Assembly code.
You'll have to adapt and decide what the best solution is. If you only have one model with a 100kB geometry, you probably don't need Draco.
 But if you have many MB of models to load and don't care about some freezes at the start of the experience, you might need the Draco compression.


dracoLoader.load(
    '/models/Duck/glTF-Draco/Duck.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)
 */

// ANIMATION 
let mixer = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {   
        gltf.scene.position.y = 0.2
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
        // Handle the animation
        // If you look at the loaded gltf object, you can see a property named animations containing multiple AnimationClip.
        // These AnimationClip cannot be used easily. We first need to create an AnimationMixer.
        // An AnimationMixer is like a player associated with an object that can contain one or many AnimationClips. 
        // The idea is to create one for each object that needs to be animated.
        // Inside the success function, create a mixer and send the gltf.scene as parameter:
        mixer = new THREE.AnimationMixer(gltf.scene)
        // We can now add the AnimationClips to the mixer with the clipAction(...) method. Let's start with the first animation:
        const action = mixer.clipAction(gltf.animations[2])
        // This method returns a AnimationAction, and we can finally call the play() method on it:
        action.play()
    }
    )
    



    
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
 * Floor
 */
const texture = new THREE.TextureLoader().load('/1.jpeg');

const floor = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1, 10), // Utiliser une géométrie de "Box" avec une hauteur de 1
    new THREE.MeshMatcapMaterial({
      matcap: texture,
     
    })
  );
floor.receiveShadow = true
floor.scale.set(0.7, 0.265, 0.945)
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
camera.position.set(7.5, 4, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if(mixer)
    {
        mixer.update(deltaTime)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()