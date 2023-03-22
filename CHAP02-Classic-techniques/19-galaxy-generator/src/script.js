import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { BufferGeometry } from 'three'

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
 * Galaxy
 */

const parameters = 
{
    count           : 471500,
    size            : 0.004,
    radius          : 7.47,
    branches        : 12,
    spin            : 0.994,
    randomness      : 0.746,
    randomnessPower : 10,
    insideColor     : '#2e62ff',
    outsideColor    : '#2effe7'
}

let geometry = null
let material = null
let points   = null

const generateGalaxy = () => 
{   
    // Destroy Galaxy, piou piou
    if ( points !== null )
    {
        geometry.dispose() // The dispose() method tells Three.js that the object is no longer in use and it can free up the memory allocated for that object.
        material.dispose() // Because its sometimes still allowed in memory, its better for performances 
        scene.remove(points)
    }
    
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3) // * 3 for X, Y, Z, each particle need 3 coordinate value 
    const colors = new Float32Array(parameters.count * 3) 
    
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    
    for ( let i = 0; i < parameters.count ; i++)
    {

        const i3 = i * 3
        
        // Particles position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin 
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        
        // Color 
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3    ] =  mixedColor.r
        colors[i3 + 1] =  mixedColor.g
        colors[i3 + 2] =  mixedColor.b


        if ( i < 20 )
        {
            console.log(i, branchAngle)
        }
        positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX // X
        positions[i3 + 1] = randomY // Y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ // Z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // 3 tell how much values per Array, so 3 for the X, Y , Z
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))       // 3 value R G B 
    /**
     * Material
    */
    material = new THREE.PointsMaterial({
       size: parameters.size,               // particles Size
       sizeAttenuation: true,               // Closer get Bigger, Far get little, perspective bro
       depthWrite: false,                   // Will be in Front of other objects, not throught, true is by default
       blending: THREE.AdditiveBlending,    // The colors of the object are added to the colors of other objects, which can create a bright light or emission effect.
       vertexColors: true
    })
    
    points = new THREE.Points(geometry,material)
    scene.add(points)
}
generateGalaxy()

// Tweaks ( Control Pannel )
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.011).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)






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
camera.position.x = 3
camera.position.y = 3
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

    // Update controls
    controls.update()

    // Rotation Galaxy
    // points.rotations.y * elapsedTime
    points.rotation.y = elapsedTime*0.08

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()