const Colors = require('./objects/Colors');

const Floor = require('./classes/Floor');
const Car = require('./classes/Car');
const Road = require('./classes/Road');

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

board.on("ready", () => {
  const myLed = new LedClass(13);
  myLed.blinking(500);
});

let hemisphereLight, shadowLight, ambientLight;
let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
let floor, car;
let world;

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();
  // camera & render
  createScene();
  // var controls = new THREE.OrbitControls( camera );
  // light
  createLight();

  car = new Car();
  floor = new Floor();
  road = new Road();

  // scene.add(road.mesh);
  scene.name = 'Scene';

  loop();
}

const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // create scene and fog
  scene = new THREE.Scene();
  // scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  // create camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 10;
  nearPlane = 1;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView, aspectRatio, nearPlane, farPlane
  );

  camera.position.y = 600;
  camera.position.z = 100;
  camera.position.x = 80;
  // camera.position.z = 200;
  // camera.rotation.x = -90 * Math.PI / 180;
  camera.rotation.x = -80 * Math.PI / 180;

  // create renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // set size of renderer
  renderer.setSize(WIDTH, HEIGHT);

  // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
  renderer.shadowMap.Type = THREE.PCFShadowMap;

  // shadow rendering
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
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  hemisphereLight.name = 'hemisphere Light';

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);
  ambientLight.name = 'Ambient Light';
  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
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

const loop = () => {
  exampleUtils.run();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

window.addEventListener(`keydown`, e => {
  car.controls(e);
}, true);


init();
