const Colors = require('./objects/Colors');

const Floor = require('./classes/Floor');
const Road = require('./classes/Road');
const Car = require('./classes/Car');

const five = require('johnny-five');
const board = new five.Board();
let game;

const Readable = require('stream').Readable;
class MyStream extends Readable {
  constructor(opts) {
    super(opts);
  }
  _read() {}
}

// hook in our stream
process.__defineGetter__('stdin', () => {
  if (process.__stdin)
    return process.__stdin;
  process.__stdin = new MyStream();
  return process.__stdin;
});

let hemisphereLight, shadowLight, ambientLight;
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
let floor, car;
let mousePos = {x: 0, y: 0};

const init = () => {
  // camera & render
  createScene();
  scene.name = 'Scene';

  // const controls = new THREE.OrbitControls( camera );
  // light
  createLight();

  // objects
  // document.addEventListener(`mousemove`,  handleMouseMove, false);

  floor = new Floor();
  floor.name = 'Floor';
  scene.add(floor.mesh);

  car = new Car();
  car.mesh.position.x = 79;
  car.mesh.position.y = 2;
  // car.mesh.position.z = -0.5;
  car.mesh.position.z = 41;
  car.mesh.rotation.y = 9.36;
  car.name = 'Car';
  scene.add(car.mesh);

  road = new Road();
  scene.add(road.mesh);

  loop();
}

// const handleMouseMove = e => {
//   const tx = -1 + (e.clientX / WIDTH) *2;
//   const ty = 1 - (e.clientY / HEIGHT) *2;
//   mousePos = {x: tx, y: ty};
// }

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // create scene and fog
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  // create camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 10;
  nearPlane = 1;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView, aspectRatio, nearPlane, farPlane
  );

  camera.position.y = 500;
  camera.position.z = 85;
  // camera.rotation.x = -90 * Math.PI / 180;
  camera.rotation.x = -80 * Math.PI / 180;

  // create renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setSize(WIDTH, HEIGHT);

  // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
  renderer.shadowMap.Type = THREE.PCFShadowMap;
  renderer.shadowMap.enabled = true;

  container = document.querySelector('.world');
  container.appendChild(renderer.domElement);
  window.scene = scene;
  window.addEventListener(`resize`, handleWindowResize, false);
}

const handleWindowResize = () => {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

const createLight = () => {
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  hemisphereLight.name = 'hemisphere Light';

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);
  ambientLight.name = 'Ambient Light';

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.name = 'Shadow Light';
  // direction of light
  shadowLight.position.set(150, 350, 350);

  // allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // shadowLight.shadow.mapSize.width = 1024; // default is 512
  // shadowLight.shadow.mapSize.height = 1024; // default is 512

  scene.add(shadowLight);
  scene.add(hemisphereLight);
  scene.add(ambientLight);
}

const normalize = (v, vmin, vmax, tmin, tmax) => {
  const nv = Math.max(Math.min(v,vmax), vmin);
  const dv = vmax-vmin;
  const pc = (nv-vmin)/dv;
  const dt = tmax-tmin;
  const tv = tmin + (pc*dt);
  return tv;
}

window.addEventListener(`keydown`, e => {
  switch (e.key) {
    case 'ArrowLeft':
    if (car.ride.getEffectiveTimeScale() === 0) car.ride.reset();
    car.ride.timeScale = 1;
    car.ride.play();
      break;

    case 'ArrowRight':
    car.ride.timeScale = -1;
      break;
    default:

  }
}, true);


const loop = () => {
  car.animation(car.mesh);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

init();
