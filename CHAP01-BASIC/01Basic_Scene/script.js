//  4 Element to get started :
//      1) A Scene that will contain objects
//      2) Some objects obviously
//      3) A camera
//      4) a Renderer 

// 1 ) A Scene that will contain objects
const scene = new THREE.Scene();

// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red'});

// Mesh is a composant of a geometry and a material
const mesh = new THREE.Mesh(geometry, material)

// Add it to the Scene
scene.add(mesh);


// 3 ) The Camera , this one is really the must logical one, if stuff got closer it appear bigger etc.

// its the size of the scene
const sizes = {
    width: 800,
    height:600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height );
camera.position.z = 5;
camera.position.x = 2;
camera.position.y =2;
scene.add(camera);

// 4 ) a Renderer 
// Connection with the canvas and the renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
// method will automatically resize our <canvas> accordingly
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

// To transform an object, we can use Position, rotation, Scale
// Here we use the position, because its black screen because camera is inside the cube
// The The position property is an object with three relevant properties: x, y and z.
// By default, Three.js considers the forward/backward axis to be z.

