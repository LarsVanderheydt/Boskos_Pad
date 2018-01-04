/*
  28/12/'17'
  Joystick:
    Red: Right
    Oranje: Up
    Wit: Down
    Zwart: Gnd
*/
const {remote} = require('electron');
const five = require('johnny-five');
const Colors = require('./objects/Colors');
const Timer = require('./classes/Timer');

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

const DriverGame = require('./classes/DriverGame');

// get all coordinates from all duplicate objects like trees, ...
const coordsTree = require('../assets/coords_tree.json');

const $timer = document.getElementById(`timer`);
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

let fogGame = "";
let gateGame = "";
let trainGame = "";
let nightTimeGame = "";
let driverGame = "";
let openGate = false;

let gameTimer = "";
let minutes = 0;
let seconds = 0;

let joystick = {};

let mousePos = {x: 0, y: 0};

const init = () => {
  exampleUtils.initialize();
  createScene();
  createLight();

  // // BEGIN STATE
  beginscreen = new BeginScreen();
  beginscreen.name = "Beginscreentext";

  // //

  // SECOND STATE
  duringscreen = new DuringScreen();
  duringscreen.name = "Duringscreentext";
  //

  // END STATE
  endscreen = new EndScreen();
  endscreen.name = "Endscreentext";
  setTimeout(() => {
    endscreen.hide();
  }, 1000);
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

  const startTrainAfter = 60000 * 2;
  setInterval(() => {
    if (car.x >= 30) {
      train.pause = false;
    }
  }, startTrainAfter);


  blimp = new Blimp();
  blimp.mesh.position.x = 200;
  blimp.mesh.position.z = -70;
  scene.add(blimp.mesh);

  plane = new Plane();
  plane.mesh.name = "sky";
  plane.mesh.position.x = -20;
  plane.mesh.position.z = -90;
  scene.add(plane.mesh);

  // start plane again after 4 min (when stopped)
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
      if (board.id === 'B') {

        // tilt switch game
        // gateGame = new GateGame({
        //   first: { btn: 8, led: 9 },
        //   second: { btn: 10, led: 11 },
        //   third: { btn: 12, led: 13 }
        // }, board, 4);

        nightTimeGame = new NightTimeGame({
          first: { btn: 7, led: 8 },
          second: { btn: 6, led: 9 },
          third: { btn: 5, led: 10 },
        }, board, "A0");

        // driverGame = new DriverGame([3, 4], [2, 5], board);
        // handleJoystick({right: 18, up: 17, down: 19}, board);
        // new five.B
      }

      if (board.id === 'A') {

        // sound sensor game
        // fogGame = new FogGame({
        //   first: { btn: 9, led: 8 },
        //   second: { btn: 11, led: 10 },
        //   third: { btn: 13, led: 12 }
        // }, board, "A3");
        //
        // trainGame = new TrainGame({
        //   first: { btn: 7, led: 6 },
        //   second: { btn: 5, led: 4 },
        //   third: { btn: 3, led: 2 }
        // }, board, {
        //   joystick: {x: "A5", y: "A4"},
        //   rgb: {r: 14, g: 15, b: 16}
        // });

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

const obstacles = [];
let startDriverGame = false;

let pushedTrain = false;
let pushedDark = false;
let pushedFog = false;

let openBarriers = false;
let turnLightOn = false;

let fogThickness = 0;
let addFog = false;
let showFinishScreen = false;
let showStartScreen = false;
let timeout = true;

const loop = () => {
  scene.fog = new THREE.Fog(Colors.fog, fogThickness, 700);

  if (addFog) {
    if (fogThickness <= 600) {
      fogThickness += 3;
    }
  }

  if (!addFog && fogThickness >= 0) {
    fogThickness -= 3;
  }



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
    scene.fog = new THREE.Fog(Colors.fog, 500 * (fogGame.level * 1.2), 700);
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
        scene.fog = new THREE.Fog(Colors.fog, 1000, 10000);
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

  if (car.m.goblin.position.x >= 43) {
    setTimeout(() => {
      barrier1.close();
      barrier2.close();
      train.move();
    }, 60000);

    //TODO: GATE TERUG open + MAAR 1 gate sluit ?
  }

  if (trainGame.complete){
   barrier1.close();
   barrier2.close();
   train.move();
  }



  //TODO: SCHERMEN TERUG REMOVEN !
  if (car.m.goblin.position.x >= 160){
  // if (car.m.goblin.position.x >= 20){
    showFinishScreen = true;
  }


  if (showFinishScreen) {
    gameTimer.stop();
    endscreen.show();
    car.stop = true;
    addFog = false;

    if (timeout) {
      setTimeout(() => {
        car.m.goblin.position.x = 0;
        car.mesh.position.x = 0;
        endscreen.hide();

        showFinishScreen = false;
        car.stop = false;
        beginscreen.show();

        seconds = 0;
        minutes = 0;
        gameTimer.reset(1000);
      }, 3000);
      timeout = false;
    }
  }




  exampleUtils.run();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

const startTimer = () => {

  gameTimer = new Timer(() => {
    let secString = "00:00";

    seconds < 60 ? seconds ++ : seconds = 0;

    if (seconds === 60) minutes ++;

    seconds < 10 ? secString = `0${seconds}` : secString = `${seconds}`;
    minutes < 10 ? minString = `0${minutes}` : minString = `${minutes}`;

    $timer.innerHTML = `${minString}:${secString}`;
  }, 1000);
}

let start = false;

window.addEventListener("keydown", function (e) {
    car.keys[e.keyCode] = true;

    // in a button press
    if (e.keyCode === 32) {
      if (start) {

        // scene.fog = new THREE.Fog(Colors.fog, 1000, 10000);
      } else {
        startTimer();
        beginscreen.hide();
        car.stop = false;
        addFog = true;

      }

      start = !start;
    }

});
window.addEventListener("keyup", function (e) {
    car.keys[e.keyCode] = false;
});

init();
