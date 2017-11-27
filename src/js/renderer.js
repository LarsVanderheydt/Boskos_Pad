const Colors = require('./objects/Colors');

const Floor = require('./classes/Floor');
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
let floor;
let mousePos = {x: 0, y: 0};

const init = () => {
  // camera & render
  createScene();

  // light
  createLight();

  // const loader = new THREE.ObjectLoader().load("./js/models/track.json",
  // (geometry, materials) => {
  //   const material = new THREE.MultiMaterial(materials);
  //   mesh = new THREE.Mesh(geometry, material);
  //   scene.add(mesh);
  // });

  // objects
  // document.addEventListener(`mousemove`,  handleMouseMove, false);

  // instantiate a loader
  const loader = new THREE.OBJLoader();
  //
  // // load a resource
  loader.load(
    // resource URL
    './js/models/svg_track.obj',
    // called when resource is loaded
    object => {
      // object.name = 'Object';
      // object.position.set(2.4, 1.54, -3.4);
      object.position.x = 11.84;
      object.position.y = 1.1;
      object.position.z = 6.66;

      object.rotation.y = 9.36;

      object.scale.x = 9.12;
      object.scale.y = 9.12;
      object.scale.z = 9.12;

      for (let i = 0; i < 5; i++) {
        object.children[i].material.color.setHex(0x555555);
      }

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.children[5].material.color.setHex(0xCBBFBD);

      object.castShadow = true;
      object.receiveShadow = true;

      scene.add(object);
     },
     // called when loading is in progresses
     xhr => {
       console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
     },

     // called when loading has errors
     error => {
       console.error( 'An error happened' );
     }
  );



  floor = new Floor();
  floor.name = 'Floor';
  scene.add(floor.mesh);
  scene.name = 'Scene';

  // road = new Road();
  // scene.add(road.mesh);
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

  // pos of camera
  // camera.position.x = 0;
  // camera.position.y = 100;
  // camera.position.z = 200;

  camera.position.y = 79;
  camera.position.z = 14;
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
  shadowLight.position.set(5.5, 7.6, 7);

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

const loop = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

init();
