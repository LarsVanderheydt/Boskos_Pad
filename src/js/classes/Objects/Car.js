/*

JOYSTICK:

VRx: A0
VRy: A1

*/

const Colors = require('../../objects/Colors');
let m;

class Car {
  constructor() {
    this.velY = 0;
    this.velX = 0;
    this.speed = 0.01;
    this.friction = 0.1;
    this.keys = [];
    this.angle = 0;
    this.joystickPause = false;
    this.stop = false;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./js/models/car/car.mtl', materials => {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('./js/models/car/car.obj', object => {
        this.mesh = object;
        this.mesh.position.y = 2;
        this.mesh.rotation.y = 1.6;
        this.mesh.scale.set(3.68, 3.68, 3.68);
        scene.add(this.mesh);
      });

    });

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      fog: false
    });

    this.m = exampleUtils.createBox( 1.5, 1, 1, 100, mat );

    this.m.goblin.castShadow = true;
    this.m.goblin.receiveShadow = true;

    this.m.goblin.position.y = 2;
    this.m.goblin.linear_velocity.y = -2;
    this.m.visible = false;

    this.m.name = 'Car';
    scene.add(this.m);
  }

  arrowControl() {
    if (this.stop) return;

    if (this.keys[38]) {
      if (this.velY > -this.speed) {
        this.velY -= 2.5;
        this.angle = 0.50;
      }
    }

    if (this.keys[40]) {
      if (this.velY < this.speed) {
        this.velY += 2.5;
        this.angle = -0.50;
      }
    }

    if (this.keys[39]) {
      if (this.velX > -this.speed) {
        this.velX ++;
        this.angle = 0;
      }
    }

    if (this.keys[37]) {
      if (this.velX < this.speed) {
        this.velX --;
        this.angle = 0;
      }
    }

    this.move();
  }

  miniJoystickControl(dir) {
    console.log("INSIDE JOYSTICK");
    console.log(dir);
    console.log(this.stop);
    if (this.stop) return;

    this.velX = 0;
    this.velY = 0;
    const speed = 1;

    if (dir.right === true && dir.up === false && dir.down === false) {
      this.velX = speed;
      this.angle = 0;
    }

    if (dir.up === true && dir.right === false && dir.left === false) {
      this.velY = -speed;
      this.angle = 0.50;
    }

    if (dir.down === true && dir.right === false && dir.left === false) {
      this.velY = speed;
      this.angle = -0.50;
    }

    this.move();
    if (this.joystickPause === true) return;
    requestAnimationFrame(() => this.miniJoystickControl(dir));
  }

  move() {
    //console.log("MOVE");
    this.velY *= this.friction;
    this.velX *= this.friction;

    this.m.goblin.position.x += this.velX;
    this.m.goblin.position.z += this.velY;

    const mapToDegrees = this.map(this.angle, 1, -1, 180, -180);

    const radians = mapToDegrees * (Math.PI/180);
    // this.m.goblin.rotation.y = radians;
    if (this.mesh) {
      this.mesh.position.z = this.m.goblin.position.z;
      this.mesh.position.x = this.m.goblin.position.x;
      this.mesh.rotation.y = radians + 1.6;
    }
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}

module.exports = Car;
