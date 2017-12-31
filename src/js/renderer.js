/*
  28/12/'17'
  Joystick:
    Red: Right
    Oranje: Up
    Wit: Down
    Zwart: Gnd
*/
const five = require('johnny-five');
const Colors = require('./objects/Colors');

const BeginScreen = require('./classes/BeginScreen');
const DuringScreen = require('./classes/DuringScreen');
const EndScreen = require('./classes/EndScreen');
const CameraObject = require('./classes/Objects/CameraObject')

const Floor = require('./classes/Floor');
const Flower = require('./classes/Objects/Flower');
const Water = require('./classes/Water');
const Road = require('./classes/Road');
const Sky = require('./classes/Sky');
const Cloud = require('./classes/Cloud');
const Tracks = require('./classes/Tracks');

const Car = require('./classes/Objects/Car');
const Train = require('./classes/Objects/Train');
const Tree = require('./classes/Objects/Tree');
const Blimp = require('./classes/Objects/Blimp');
const Plane = require('./classes/Objects/Plane');
const Kayak = require('./classes/Objects/Kayak');
const House1 = require('./classes/Objects/House1');
const Chalet = require('./classes/Objects/Chalet');
const Gate = require('./classes/Objects/Gate');
const Barrier = require('./classes/Objects/Barrier');

// saboteur games
/*
  note: duplicates off game classes for solid use of all leds
  -- one class and 2 instances = leds will fail to work normaly --
*/
const FogGame = require('./classes/SaboteurGames/FogGame');
const GateGame = require('./classes/SaboteurGames/GateGame');
const TrainGame = require('./classes/SaboteurGames/TrainGame');
const NightTimeGame = require('./classes/SaboteurGames/NightTimeGame');

const DriverGame = require('./classes/DriverGame');

// get all coordinates from all duplicate objects like trees, ...
const coordsTree = require('../assets/coords_tree.json');

const boards = new five.Boards(["B", "A"]);

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
let train, cloud, tracks, sky, floor, water, car, tree, flower, plane, kayak, house1, chalet, gate, barrier1, barrier2, cameraObject;
let world;
// let controls, scene, camera, box, spline, counter = 0;

let fogGame = "";
let gateGame = "";
let trainGame = "";
let nightTimeGame = "";
let driverGame = "";
let openGate = false;

let joystick = {};

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();

  // camera & render
  createScene();

  // light
  createLight();

  // BEGIN STATE
  //beginscreen = new BeginScreen();
  //

  // SECOND STATE
  //duringscreen = new DuringScreen();
  //

  // END STATE
  //endscreen = new EndScreen();
  //

  //cameraObject = new CameraObject();

  car = new Car();

  sky = new Sky();
  sky.mesh.position.y = 30;
  scene.add(sky.mesh);

  const trees = new THREE.Object3D();
  trees.name = "trees group";
  coordsTree.trees.forEach(tree => {
    tree = new Tree(tree.x, tree.y);
    tree.mesh.name = 'tree';
    trees.add(tree.mesh);
  });
  scene.add(trees);

  tracks = new Tracks();
  scene.add(tracks.mesh);

  train = new Train();
  train.mesh.position.x = 43;
  train.mesh.position.z = -90;
  scene.add(train.mesh);

  const startTrainAfter = 80000 * 4;
  setInterval(() => {
    train.pause = false;
  }, startTrainAfter);


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

  gate = new Gate(86.18, -24.10, 89.50);
  scene.add(gate.mesh);

  gate = new Gate(101.18, 14.10, 89.50);
  scene.add(gate.mesh);

  barrier1 = new Barrier(31, 2, -31);
  scene.add(barrier1.mesh);

  barrier2 = new Barrier(23, 2, 34);
  scene.add(barrier2.mesh);

  boards.on("ready", () => {
    boards.each(board => {
      if (board.id === 'A') {

        // tilt switch game
        // gateGame = new GateGame({
        //   first: { btn: 8, led: 9 },
        //   second: { btn: 10, led: 11 },
        //   third: { btn: 12, led: 13 }
        // }, board, 4);

        nightTimeGame = new NightTimeGame({
          first: { btn: 8, led: 9 },
          second: { btn: 10, led: 11 },
          third: { btn: 12, led: 13 },
        }, board, "A0");

        new five.Button({pin: 8, board}).on("press", () => {
          // nightTimeGame.goDark = false;
          // light();
          fogGame.level = 0;
        });

        handleJoystick({right: 18, up: 17, down: 19}, board);

        driverGame = new DriverGame([3, 4], [2, 5], board);
      }

      if (board.id === 'B') {
        // sound sensor game
        fogGame = new FogGame({
          first: { btn: 7, led: 4 },
          second: { btn: 17, led: 2 },
          third: { btn: 18, led: 19 }
        }, board, "A2");

        trainGame = new TrainGame({
          first: { btn: 8, led: 11 },
          second: { btn: 9, led: 12 },
          third: { btn: 10, led: 13 }
        }, board, {
          joystick: {x: "A0", y: "A1"},
          rgb: {r: 3, g: 5, b: 6}
        });

      }
    });
  });

  const flowers = new THREE.Object3D();
  flowers.name = "flowers group";

  for (let i = 0; i < 55; i++) {
    flower = new Flower();
    flower.mesh.name = 'flower';
    flower.mesh.scale.set(0.04, 0.04, 0.04);
    flower.mesh.rotation.x = 1.5;
    flowers.add(flower.mesh);
  }
  scene.add(flowers);

  floor = new Floor();
  water = new Water();
  road = new Road(-7.5, -35.6);

  loop();
}

const dark = () => {
  let dark = false;
  if (nightTimeGame.goDark) {
    if (hemisphereLight.intensity >= -0.9) {
      hemisphereLight.intensity -= 0.01;
    } else {
      dark = true;
    }
  }

  return dark;
}

const light = () => {
  let light = false;
  if (!nightTimeGame.goDark) {
    if (hemisphereLight.intensity <= 0.9) {
      hemisphereLight.intensity += 0.01;
      light = false;
    } else {
      light = true;
      turnLightOn = false;
    }
  }

  return light;
}

const handleJoystick = ({right, up, down}, board) => {
  const dir = {
    left: false,
    right: false,
    up: false,
    down: false
  }

  joystick.right = new five.Button({pin: right, invert: true, board});
  joystick.up = new five.Button({pin: up, invert: true, board});
  joystick.down = new five.Button({pin: down, invert: true, board});

  joystick.right.on("press", () => {
    dir.right = true;
    car.joystickPause = false;
    car.miniJoystickControl(dir);
  });

  joystick.right.on("release", () => {
    dir.right = false;
    car.joystickPause = true;
    car.miniJoystickControl(dir);
  });

  joystick.up.on("press", () => {
    dir.up = true;
    car.joystickPause = false;
    car.miniJoystickControl(dir);
  });

  joystick.up.on("release", () => {
    dir.up = false;
    car.joystickPause = true;
    car.miniJoystickControl(dir);
  });

  joystick.down.on("press", () => {
    dir.down = true;
    car.joystickPause = false;
    car.miniJoystickControl(dir);
  });

  joystick.down.on("release", () => {
    dir.down = false;
    car.joystickPause = true;
    car.miniJoystickControl(dir);
  });
}

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

const obstacles = [];
let startDriverGame = false;

let pushedTrain = false;
let pushedDark = false;
let pushedFog = false;

let openBarriers = false;
let turnLightOn = false;


const loop = () => {
  car.arrowControl();

  setTimeout(() => {
    train.move();
  }, 60000);
  // cloud.float();
  sky.float();
  kayak.wiggle();

  setTimeout(() => {
    blimp.fly();
  }, 60000);
  plane.fly();







  if (gateGame.closeGate && !gateGame.closed) {

    gateGame.closed = gate.close();

  } else {
    gateGame.closeGate = false;
  }


  if (!gateGame.closeGate && gateGame.closed && openGate) {
    gateGame.closed = gate.open();
  } else {
    openGate = false;
  }








  // close barriers and push the obstacle to the array
  if (trainGame.complete === true) {
    if (!pushedTrain) {
      obstacles.push('Train');
      pushedTrain = true;
      startDriverGame = true;
    }
    if (!barrier1.close() && !barrier2.close() && !openBarriers) {
      barrier1.close();
      barrier2.close();
    } else {
      trainGame.complete = false;
      trainGame.reset();
    }
  }

  // open the barriers when driver completed the game
  if (openBarriers) {
    const open1 = barrier1.open();
    const open2 = barrier2.open();
    if (open1 && open2) {
      openBarriers = false;
    }
  }

  if (nightTimeGame.goDark === true) {
    if (!pushedDark && dark()) {
      obstacles.push('Dark');
      pushedDark = true;
    }
    dark();
  }

  if (turnLightOn) {
    light();
  }


  if (fogGame.level > 0 && !fogGame.noFog) {
    if (!pushedFog) {
      obstacles.push('Fog');
      pushedFog = true;
    }
    scene.fog = new THREE.Fog(0xf7d9aa, 500 * (fogGame.level * 1.2), 700);
  }


  // to do every obstacle one by one check the first in the row and disable that one
  if (obstacles.length >= 1) {
    startDriverGame = true;
    // driverGame.gameStarted = false;

    if (driverGame.complete === true) {
      startDriverGame = false;
      driverGame.reset();

      switch (obstacles[0]) {
        case 'Train':
        openBarriers = true;
        obstacles.shift();
        pushedTrain = false;
        driverGame.complete = false;

        setTimeout(() => {
          trainGame.fullReset();
        }, 1000);
          break;

        case 'Dark':
        nightTimeGame.goDark = false;
        turnLightOn = true;

        setTimeout(() => {
          nightTimeGame.fullReset();
        }, 1000);

        obstacles.shift();
        pushedDark = false;
        driverGame.complete = false;
          break;

        case 'Fog':
        scene.fog = new THREE.Fog(0xf7d9aa, 1000, 10000);
        obstacles.shift();
        pushedFog = false;
        driverGame.complete = false;
        fogGame.noFog = true;
        setTimeout(() => {
          fogGame.fullReset();
        }, 1000);

          break;
      }
    }

    // start the drivers game
    if (!driverGame.gameStarted && startDriverGame) {
      if (driverGame) {
        driverGame.start();
      }

      startDriverGame = false;
      driverGame.complete = false;
    }
  } else {
    startDriverGame = false;
    driverGame.gameStarted = false;
  }









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
