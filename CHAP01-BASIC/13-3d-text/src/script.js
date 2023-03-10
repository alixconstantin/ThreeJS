import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// * We are going to use the TextBufferGeometry class, but we also need a particular font format called typeface
// * can convert your font with converters like this one: https://gero3.github.io/facetype.js/

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
const matcapTexture = textureLoader.load('/textures/matcaps/7.png')

const material = new THREE.MeshMatcapMaterial({matcap:matcapTexture})

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        const textGeometry = new TextGeometry(
            'Tsuki Hanoi',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 10,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 8,
            }
        )
        // * Three.js easily calculate if the object is on the screen, and if not, the object won't even be rendered. That is called frustum culling. ( but it's not the subject of this lesson )
        // * bounding to know the size of the geometry and recenter it. By default, Three.js is using sphere bounding
        textGeometry.computeBoundingBox()
       
        // * Instead of moving the mesh, we are going to move the whole geometry.
        // * This way, the mesh will still be in the center of the scene, but the text geometry will also be centered inside our mesh.
        // * To do this, we can use the translate(...) method on our geometry
        textGeometry.translate(
            - textGeometry.boundingBox.max.x * 0.5,
            - textGeometry.boundingBox.max.y * 0.5,
            - textGeometry.boundingBox.max.z * 0.5
        )
        // * Also can do it with a simple : textGeometry.center()
        // * The point of doing it was to learn about boundings and frustum culling

        

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
    }
    )
    // * This loader works like the TextureLoader.
    // * Creating a text geometry is long and hard for the computer.
    // * Avoid doing it too many times and keep the geometry as low poly as possible by reducing the curveSegments and bevelSegments properties.

    // * For add 100 donuts

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

    for(let i = 0; i < 100; i++)
{
    const donut = new THREE.Mesh(donutGeometry, material)
    
    // * They will be all at the same position and look like one
    // * So for add some randomness for their position : 
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    // * for random rotation
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    // * for random scale 
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()