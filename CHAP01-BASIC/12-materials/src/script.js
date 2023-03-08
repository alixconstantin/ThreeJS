import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Materials are used to put a color on each visible pixel of the geometries.
 * The algorithms that decide on the color of each pixel are written in programs called shaders.
 * Writing shaders is one of the most challenging parts of WebGL and Three.js, but
 * Three.js has many built-in materials with pre-made shaders.
 * 
 * MeshBasicMaterial, which applies a uniform color or a texture on our geometry.
 */


/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 0.5);
light.position.x = 2;
light.position.y = 3;
light.position.z = 4;
scene.add(light);

/**
 * Objects
 */

// * MESH BASIC MATERIAL 
// const material = new THREE.MeshBasicMaterial()

// * The map property will apply a texture on the surface of the geometry:
// material.map = doorColorTexture

// * The color property will apply a uniform color on the surface of the geometry. When you are changing the color property directly, you must instantiate a Color class.
// material.color = new THREE.Color('#ff0000')

// ! Combining color and map will tint the texture with the color

// * The wireframe property will show the triangles that compose your geometry with a thin line of 1px regardless of the distance of the camera
// material.wireframe = true

// * The opacity property controls the transparency but, to work, you should set the transparent property to true
// * to inform Three.js that this material now supports transparency:
// material.transparent = true
// material.opacity = 0.5

// * Now that the transparency is working, we can use the alphaMap property to control the
// * transparency with a texture :
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// * The side property lets you decide which side of a face is visible. By default, the front side is visible (THREE.FrontSide)
// * but you can show the backside instead (THREE.BackSide) or both (THREE.DoubleSide):
// material.side = THREE.DoubleSide
// * Try to avoid using THREE.DoubleSide because rendering both sides means having twice more triangles to render.

// material.flatShading = true



// * MESH NORMAL MATERIAL

// * The MeshNormalMaterial displays a nice purple, blueish, greenish color
// * Normals are information encoded in each vertex that contains the direction of the outside of the face.
// * If you displayed those normals as arrows, you would get straight lines comings out of each vertex that composes your geometry.
// * You can use Normals for many things like calculating how to illuminate the face or how the environment should reflect or refract on the geometries' surface.
// * When using the MeshNormalMaterial, the color will just display the normal relative's orientation to the camera.
// * If you rotate around the sphere, you'll see that the color is always the same, regardless of which part of the sphere you're looking at.
// const material = new THREE.MeshNormalMaterial()

// * flatShading will flatten the faces, meaning that the normals won't be interpolated between the vertices.
// material.flatShading = true


// * MESH MATCAP MATERIAL

// * MeshMatcapMaterial is a fantastic material because of how great it can look while being very performant.
// * For it to work, the MeshMatcapMaterial needs a reference texture that looks like a sphere.
// * The material will then pick colors on the texture according to the normal orientation relative to the camera.
// * To set that reference matcap texture, use the matcap property:
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture
// * The meshes will appear illuminated, but it's just a texture that looks like it.
// * The only problem is that the illusion is the same regardless of the camera orientation. Also, you cannot update the lights because there are none.
// * There is also this vast list of matcaps: https://github.com/nidorx/matcaps
// * You can also create your own matcaps using a 3D software by rendering a sphere in front of the camera in a square image.
// *  Finally, you can try to make a matcap in 2D software like Photoshop.


// * MESH DEPT MATERIAL

// * The MeshDepthMaterial will simply color the geometry in white if it's close to the camera's near value and in black if it's close to the far value of the camera:
// const material = new THREE.MeshDepthMaterial()
// * You can use this material for special effects where you need to know how far the pixel is from the camera.


// * MESH LAMBER MATERIAL

// * The MeshLambertMaterial is the first material reacting to light
// * MeshLambertMaterial supports the same properties as the MeshBasicMaterial but also some properties related to lights.
// * The MeshLambertMaterial is the most performant material that uses lights. Unfortunately, the parameters aren't convenient
// * and you can see strange patterns on the geometry if you look closely at rounded geometries like the sphere.
// const material = new THREE.MeshLambertMaterial()


// * MESH PHONG MATERIAL

// * The MeshPhongMaterial is very similar to the MeshLambertMaterial, but the strange patterns are less visible
// * and you can also see the light reflection on the surface of the geometry:
// const material = new THREE.MeshPhongMaterial()
// * MeshPhongMaterial is less performant than MeshLambertMaterial.

// * You can control the light reflection with the shininess property. The higher the value, the shinier the surface.
// * You can also change the color of the reflection by using the specular property:
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff)



// * MESH TOON MATERIAL

// * The MeshToonMaterial is similar to the MeshLambertMaterial in terms of properties but with a cartoonish style:
// const material = new THREE.MeshToonMaterial()

// * the cartoon effect doesn't work anymore. That is because the gradient texture we used is tiny, and the pixels of that texture are blended
// * To fix this, we can simply change the minFilter and magFilter to THREE.NearestFilter
// * Using THREE.NearestFilter means that we are not using the mip mapping, we can deactivate it
// gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter

// * By default, you only get a two parts coloration (one for the shadow and one for the light). To add more steps to the coloration,
// * you can use the gradientMap property and use the gradientTexture we loaded at the start :
// material.gradientMap = gradientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0
// material.roughness = 1
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture

// const material = new THREE.MeshPhysicalMaterial()
// material.metalness = 0
// material.roughness = 1
// gui.add(material, 'metalness').min(0).max(1).step(0.0001)
// gui.add(material, 'roughness').min(0).max(1).step(0.0001)
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.05
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.clearcoat = 1
// material.clearcoatRoughness = 0

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
material.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;
scene.add(sphere, plane, torus);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
