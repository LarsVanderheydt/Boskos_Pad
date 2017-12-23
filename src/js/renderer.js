const Colors = require('./objects/Colors');

const Floor = require('./classes/Floor');
const Water = require('./classes/Water');
const Car = require('./classes/Car');
const Tree = require('./classes/Tree');
const Road = require('./classes/Road');
const Plane = require('./classes/Plane');
const Kayak = require('./classes/Kayak');

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
let floor, water, car, tree, plane, kayak;
let world;

let joystick;

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();
  console.log(exampleUtils.world);

  // camera & render
  createScene();

  // light
  createLight();

  car = new Car();

  tree = new Tree(10, 10);
  new Tree(15, 17);
  new Tree(6, 17);
  new Tree(3, 8);
  new Tree(-2, 12);
  new Tree(10, 24);
  new Tree(19, 23);
  new Tree(2, 24);
  new Tree(-3, 18);

  new Tree(100, -47);
  new Tree(80, -40);
  new Tree(95, -41);
  new Tree(88, -40);
  new Tree(78, -47);
  new Tree(86, -48);
  new Tree(94, -50);

  new Tree(104, 80);
  new Tree(135, 80);

  new Tree(104, 60);
  new Tree(135, 60);

  new Tree(104, 40);
  new Tree(135, 40);

  // new Tree(104, 20);
  // new Tree(135, 20);

  new Tree(104, 0);
  new Tree(135, 0);

  // new Tree(104, -20);
  // new Tree(135, -20);

  new Tree(104, -40);
  new Tree(135, -40);

  new Tree(104, -60);
  new Tree(135, -60);

  new Tree(104, -80);
  new Tree(135, -80);


  plane = new Plane();
  plane.mesh.position.x = -20;
  plane.mesh.position.z = -90;

  scene.add(plane.mesh);

  const startPlaneAfter = 20000;
  setInterval(() => {
    plane.pause = false;
  }, startPlaneAfter);

  kayak = new Kayak();
  kayak.mesh.position.x = 120;
  kayak.mesh.position.y = -40;
  kayak.mesh.position.z = -10;

  scene.add(kayak.mesh);

  board.on("ready", () => {
    joystick = new five.Joystick({
      pins: ["A0", "A1"]
    });
  });

  console.log("ik ben een boom op positie " + tree.mesh.position.x + " " + tree.mesh.position.y + " " + tree.mesh.position.z);

  floor = new Floor();
  water = new Water();
  road = new Road();

  if (canGame() === true) {
    window.addEventListener(`gamepadconnected`, connected());
    window.addEventListener(`gamepaddisconnected`, disconnected());

    const checkGP = window.setInterval(() => {
      if (navigator.getGamepads()[0]) {
        if(!hasGP) connected();
      } else {
        disconnected();
      }
    }, 500);
  }

  loop();
}

/* GAMEPAD */

const reportOnGamepad = () => {
  const gp = navigator.getGamepads()[0];
  // use gamepad
  car.joystickControl(gp);
}

const canGame = () => "getGamepads" in navigator;

const connected = () => {
  hasGP = true;
  repGP = window.setInterval(reportOnGamepad, 30);
}

const disconnected = () => {
  hasGP = false;
  window.clearInterval(repGP);
}

/**********************************/


const createScene = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // create scene and fog
  scene = new THREE.Scene();
  scene.name = 'Scene';

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
  camera.rotation.x = -80 * Math.PI / 180;

  // create renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
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

const loop = () => {
  car.moveCar();
  if (joystick) {
    car.joystick(joystick);
    console.log(joystick.x);
  }
  kayak.wiggle();
  plane.fly();
  exampleUtils.run();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", function (e) {
    car.keys[e.keyCode] = true;
});
window.addEventListener("keyup", function (e) {
    car.keys[e.keyCode] = false;
});

init();
