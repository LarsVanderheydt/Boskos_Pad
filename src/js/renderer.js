const Colors = require('./objects/Colors');
const Floor = require('./classes/Floor');
const Water = require('./classes/Water');
const Car = require('./classes/Objects/Car');
const Train = require('./classes/Objects/Train');
const Tree = require('./classes/Objects/Tree');
const Road = require('./classes/Road');
const Blimp = require('./classes/Objects/Blimp');
const Plane = require('./classes/Objects/Plane');
const Kayak = require('./classes/Objects/Kayak');
const House1 = require('./classes/Objects/House1');
const Chalet = require('./classes/Objects/Chalet');

const Sky = require('./classes/Sky');
const Cloud = require('./classes/Cloud');

const FogGame = require('./classes/SaboteurGames/FogGame');
const SoundLvl = require('./classes/SaboteurGames/SoundLevelSensor');

// get all coordinates from all dubplicate objects like trees, ...
const coords = require('../assets/coords.json');

const five = require('johnny-five');
const boards = new five.Boards([ "A", "B" ]);

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
let train, cloud, sky, floor, water, car, tree, plane, kayak, house1, chalet;
let world;
// let controls, scene, camera, box, spline, counter = 0;

let analogJoystick;
let joystick = {};

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();

  // camera & render
  createScene();

  // light
  createLight();
  //controls = new THREE.TrackballControls(camera);

  train = new Train();
  //console.log(train.mesh.position.x);

  car = new Car();

  sky = new Sky();
  sky.mesh.position.y = 30;
  scene.add(sky.mesh);

  const trees = new THREE.Object3D();
  trees.name = "trees group";
  coords.trees.forEach(tree => {
    tree = new Tree(tree.x, tree.y);
    tree.mesh.name = 'tree';
    trees.add(tree.mesh);
  });
  scene.add(trees);

  blimp = new Blimp();
  blimp.mesh.position.x = 160;
  blimp.mesh.position.z = 150;
  scene.add(blimp.mesh);

  plane = new Plane();
  plane.mesh.position.x = -20;
  plane.mesh.position.z = -90;

  scene.add(plane.mesh);

  // start plane again after 3 min (when stopped)
  const startPlaneAfter = 60000 * 4;
  setInterval(() => {
    plane.pause = false;
  }, startPlaneAfter);

  kayak = new Kayak();
  kayak.mesh.position.x = 120;
  kayak.mesh.position.y = -39;
  kayak.mesh.position.z = -10;

  scene.add(kayak.mesh);

  house1 = new House1();
  scene.add(house1.mesh);

  chalet = new Chalet();
  scene.add(chalet.mesh);

  // board.on("ready", () => {
  //   analogJoystick = new five.Joystick({
  //     pins: ["A0", "A1"]
  //   });
  //
  //   const dir = {
  //     left: false,
  //     right: false,
  //     up: false,
  //     down: false
  //   }
  //
  //   joystick.right = new five.Button(8);
  //
  //   joystick.right.on("press", () => {
  //     dir.right = true;
  //     car.joystickPause = false;
  //     car.miniJoystickControl(dir);
  //   });
  //
  //   joystick.right.on("release", () => {
  //     dir.right = false;
  //     car.joystickPause = true;
  //     car.miniJoystickControl(dir);
  //   });
  //
  //   joystick.up = new five.Button(9);
  //
  //   joystick.up.on("press", () => {
  //     dir.up = true;
  //     car.joystickPause = false;
  //     car.miniJoystickControl(dir);
  //   });
  //
  //   joystick.up.on("release", () => {
  //     dir.up = false;
  //     car.joystickPause = true;
  //     car.miniJoystickControl(dir);
  //   });
  // });

  const secondSet = {
    first: {
      btn: 8,
      led: 11
    },
    second: {
      btn: 9,
      led: 12
    },
    third: {
      btn: 10,
      led: 13
    }
  }

  boards.on("ready", () => {
    boards.each(board => {

      if (board.id === 'A') {
        // sound sensor game
        const fogGame = new FogGame(secondSet, board, "A0");

        // const sound = new SoundLvl("A0");

        const loop = () => {

          if (fogGame.sound.level) {
            scene.fog = new THREE.Fog(0xf7d9aa, 500 * (fogGame.sound.level * 1.2), 700);
          }

          requestAnimationFrame(loop);
        }

        loop();
      }
      if (board.id === 'B') {

        // new SabGameS(secondSet, board);

      }
    });
  });

  floor = new Floor();
  water = new Water();
  // water.mesh.position.y = 4;

  // add the mesh of the water to the scene
  // scene.add(water.mesh);

  road = new Road(-7.5, -35.6);

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
  car.xboxControl(gp);
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

  // create scene
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
  shadowLight.position.set(120, 400, 280);

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
  car.arrowControl();
  // if (analogJoystick) {
  //   car.joystick(analogJoystick);
  // }
  train.moveBox();
  // cloud.float();
  sky.float();

  kayak.wiggle();

  setTimeout(() => {
    blimp.fly();
  }, 60000);
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
