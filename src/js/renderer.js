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

const BeginScreen = require('./classes/ScreenState/BeginScreen');
const DuringScreen = require('./classes/ScreenState/DuringScreen');
const EndScreen = require('./classes/ScreenState/EndScreen');
const CameraObject = require('./classes/Objects/CameraObject')

const Floor = require('./classes/SceneFloor/Floor');
const Water = require('./classes/SceneFloor/Water');
const Road = require('./classes/SceneFloor/Road');
const Sky = require('./classes/SceneFloor/Sky');
const Cloud = require('./classes/SceneFloor/Cloud');
const Tracks = require('./classes/SceneFloor/Tracks');
const Flower = require('./classes/SceneFloor/Flower');

const Car = require('./classes/Objects/Car');
const Train = require('./classes/Objects/Train');
const Tree = require('./classes/Objects/Tree');
const Blimp = require('./classes/Objects/Blimp');
const Plane = require('./classes/Objects/Plane');
const Kayak = require('./classes/Objects/Kayak');
const House1 = require('./classes/Objects/House');
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
let train, cloud, tracks, sky, floor, water, car, tree, flower, plane, kayak, house1, chalet, gate, barrier, cameraObject;
let world;

let fogGame = "";
let gateGame = "";
let trainGame = "";
let nightTimeGame = "";
let openGate = false;

let joystick = {};

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();
  createScene();
  createLight();

  // // BEGIN STATE
  // beginscreen = new BeginScreen();
  // beginscreen.name = "Beginscreentext";
  // //

  // SECOND STATE
  //duringscreen = new DuringScreen();
  //duringscreen.name = "Duringscreentext";

  //

  // END STATE
  //endscreen = new EndScreen();
  //endscreen.name = "Beginscreentext";
  //


  //TODO: WIL NIET TOEVOEGEN
  // cameraObject = new CameraObject();
  // scene.add(cameraObject.mesh)

  car = new Car();
  car.name = "Car";

  sky = new Sky();
  sky.mesh.name = "sky";
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
  train.mesh.name = "Train";
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
  plane.mesh.name = "sky";
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

  barrier = new Barrier(31, 2, -31);
  scene.add(barrier.mesh);

  barrier = new Barrier(23, 2, 34);
  scene.add(barrier.mesh);

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
          nightTimeGame.goDark = false;
          light();
        });

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
  if (nightTimeGame.goDark) {
    if (hemisphereLight.intensity >= -0.9) {
      console.log('dark');
      hemisphereLight.intensity -= 0.01;
    }
  }
}

const light = () => {
  if (!nightTimeGame.goDark) {
    if (hemisphereLight.intensity <= 0.9) {
      console.log('light');
      hemisphereLight.intensity += 0.01;
    }
  }
  requestAnimationFrame(light);
}

const handleJoystick = ({right, up, down}) => {
  const dir = {
    left: false,
    right: false,
    up: false,
    down: false
  }

  joystick.right = new five.Button({pin: 7, invert: true});
  joystick.up = new five.Button({pin: 6, invert: true});
  joystick.down = new five.Button({pin: 5, invert: true});

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

  scene = new THREE.Scene();
  scene.name = 'Scene';

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
  hemisphereLight = new THREE.HemisphereLight(Colors.grey ,Colors.black, .9);
  hemisphereLight.name = 'hemisphere Light';

  ambientLight = new THREE.AmbientLight(Colors.ambient, .5);
  ambientLight.name = 'Ambient Light';

  shadowLight = new THREE.DirectionalLight(Colors.white, .9);
  shadowLight.name = 'Shadow Light';
  shadowLight.position.set(120, 400, 280);
  shadowLight.castShadow = true;
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
  //console.log(car.m.goblin.position.x);
  car.arrowControl();

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

  if (fogGame.level !== 0) {
    scene.fog = new THREE.Fog(Colors.fog, 500 * (fogGame.level * 1.2), 700);
  } else {
    scene.fog = new THREE.Fog(Colors.fog, 1000, 10000);
  }

  if (car.m.goblin.position.x >= 43) {
    setTimeout(() => {
      barrier.close();
      train.move();
    }, 60000);

    //TODO: GATE TERUG open + MAAR 1 gate sluit ?
  }

  if (trainGame.complete){
   barrier.close();
   train.move();
  }

  if (nightTimeGame.goDark === true) dark();


  //TODO: SCHERMEN TERUG REMOVEN !

  // if (car.m.goblin.position.x < 1){
  //   beginscreen = new BeginScreen();
  //   console.log("beginscreen");
  //
  // } else
  if (car.m.goblin.position.x >= 1 && car.m.goblin.position.x <= 9){
    duringscreen = new DuringScreen();
    console.log("during screen");

  } else if (car.m.goblin.position.x >= 10){
    endscreen = new EndScreen();
    console.log("end screen");
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
