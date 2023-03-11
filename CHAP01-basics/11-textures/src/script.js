import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 * 
 * Color (or albedo)
 * The albedo texture is the most simple one. It'll only take the pixels of the texture and apply them to the geometry.
 * 
 * Alpha
 * The alpha texture is a grayscale image where white will be visible, and black won't.
 * 
 * Height
 * The height texture is a grayscale image that will move the vertices to create some relief.
 * You'll need to add subdivision if you want to see it.
 * 
 * Normal
 * The normal texture will add small details. It won't move the vertices, but it will lure the light
 * into thinking that the face is oriented differently.
 * Normal textures are very useful to add details with good performance because you don't need to subdivide the geometry.
 * 
 * Ambient occlusion
 * The ambient occlusion texture is a grayscale image that will fake shadow in the surface's crevices.
 * While it's not physically accurate, it certainly helps to create contrast.
 * 
 * Metalness
 * The metalness texture is a grayscale image that will specify which part is metallic (white)
 * and non-metallic (black). This information will help to create reflection.
 * 
 * Roughness
 * The roughness is a grayscale image that comes with metalness, and that will specify which
 * part is rough (white) and which part is smooth (black). This information will help to
 * dissipate the light. A carpet is very rugged, and you won't see the light reflection on it, while
 * the water's surface is very smooth, and you can see the light reflecting on it. Here, the wood
 * is uniform because there is a clear coat on it.
 * 
 * **PBR**
 * Those textures (especially the metalness and the roughness) follow what we call PBR
 * principles. PBR stands for Physically Based Rendering. It regroups many techniques that
 * tend to follow real-life directions to get realistic results.
 * While there are many other techniques, PBR is becoming the standard for realistic renders,
 * and many software, engines, and libraries are using it.
 * 
 */

/**
 * LoadingManager can be use to mutualize the events,
 * it's useful if we want to know the global loading progress or be informed when everything is loaded
 * Like to load a bar to 0 to 100% before render all the 3D Scene
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// const textureLoader = new THREE.TextureLoader()
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const colorTexture = textureLoader.load(
    '/textures/minecraft.png',
    () =>
    {
        console.log('textureLoader: loading finished')
    },
    () =>
    {
        console.log('textureLoader: loading progressing')
    },
    () =>
    {
        console.log('textureLoader: loading error')
    }
)

// We can alternate the direction with : 
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping

// Transforming the texture 

// the texture use the repeat property, which is a Vector2, meaning that it has x and y properties.
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3

// changing these will simply offset the UV coordinates
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

// you can rotate the texture using the rotation property, which is a simple number corresponding to the angle in radians
// colorTexture.rotation = Math.PI * 0.25

// to change the pivot of that rotation, you can do it using the center, may useful for rotation
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

// Minification filter
// The minification filter happens when the pixels of texture are smaller than the pixels of the
// render. In other words, the texture is too big for the surface, it covers.
// You can change the minification filter of the texture using the minFilter property.
// There are 6 possible values: THREE.NearestFilter , THREE.LinearFilter , THREE.NearestMipmapNearestFilter
//  THREE.NearestMipmapLinearFilter , THREE.LinearMipmapNearestFilter , THREE.LinearMipmapLinearFilter
// The default is THREE.LinearMipmapLinearFilter. If you are not satisfied with how your texture looks, you should try the other filters.

// Only use the mipmaps for the minFilter property. If you are using the minfFilter to THREE.NearestFilter, you don't need the mipmaps, and you can deactivate them with :
colorTexture.generateMipmaps = false

colorTexture.minFilter = THREE.NearestFilter

// for a little texture on a big Surface for no be blurry
colorTexture.magFilter = THREE.NearestFilter
// Nearest filter is the better for performances

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/**
 * Texture format and optimisation
 * 
 * When you are preparing your textures, you must keep 3 crucial elements in mind:
 *      The weight
 *      The size (or the resolution)
 *      The data
 * 
 * 
 * The weight
 * 
 * Don't forget that the users going to your website will have to download those textures.
 * You can use most of the types of images we use on the web like .jpg (lossy compression but usually lighter) or .png (lossless compression but usually heavier).
 * Try to apply the usual methods to get an acceptable image but as light as possible. You can use compression websites like **TinyPNG** (also works with jpg) or any software.
 * 
 * 
 * The size
 * 
 * Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight.
 * And like your hard drive, the GPU has storage limitations.
 * It's even worse because the automatically generated mipmapping increases the number of pixels that have to be stored.
 * Try to reduce the size of your images as much as possible.
 * If you remember what we said about the mipmapping, Three.js will produce a half smaller version of the texture repeatedly until it gets a 1x1 texture.
 * Because of that, your texture width and height must be a power of 2. That is mandatory so that Three.js can divide the size of the texture by 2.
 * Some examples: 512x512, 1024x1024 or 512x2048
 * 512, 1024 and 2048 can be divided by 2 until it reaches 1.
 * If you are using a texture with a width or height different than a power of 2 value
 * Three.js will try to stretch it to the closest power of 2 number, which can have visually poor results, and you'll also get a warning in the console.
 * 
 * 
 * The Data
 * 
 * We haven't tested it yet, because we have other things to see first, but textures support transparency. As you may know, jpg files don't have an alpha channel, so you might prefer using a png.
 * Or you can use an alpha map, as we will see in a future lesson.
 * If you are using a normal texture (the purple one), you will probably want to have the exact values for each pixel's red, green, and blue channels, or you might end up with visual glitches.
 * For that, you'll need to use a png because its lossless compression will preserve the values.
 * 
 */

/**
 * Where to find textures
 * few ideas : 
 * poliigon.com
 * 3dtextures.me
 * arroway-textures.ch
 */

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
console.log(geometry.attributes)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
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