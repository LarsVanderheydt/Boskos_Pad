const Colors = require('../objects/Colors');
let m;

class Car {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.velY = 0;
    this.velX = 0;
    this.speed = 0.05;
    this.friction = 0.1;
    this.keys = [];
    this.angle = 0;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    // const geom = new THREE.BoxGeometry(5, 2, 3);
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red
    });

    this.m = exampleUtils.createBox( 1.5, 1, 1, 100, mat );

    this.m.goblin.castShadow = true;
    this.m.goblin.receiveShadow = true;

    this.m.goblin.position.y = 2;
    this.m.goblin.linear_velocity.y = -2;
    // this.m.goblin.setGravity(0, -10, 0);
    // this.m.goblin.restitution = 0.3;

    this.m.name = 'Car';
    scene.add(this.m);
  }

  joystickControl(gp) {
    if (gp.axes[1] <= -0.1) {
      if (this.velY > -this.speed) {
        this.velY --;
      }
    }

    if (gp.axes[1] >= 0.1) {
      if (this.velY < this.speed) {
        this.velY ++;
      }
    }

    if (gp.axes[0] >= 0.1) {
      if (this.velX > -this.speed) {
        this.velX ++;
      }
    }

    if (gp.axes[0] <= -0.1) {
      if (this.velX < this.speed) {
        this.velX --;
      }
    }

    if (gp.axes[1] || gp.axes[1]) {
      this.angle = -gp.axes[1];
    }

    // this.move();
  }


  moveCar() {
    if (this.keys[38]) {
      if (this.velY > -this.speed) {
        this.velY --;
      }
    }

    if (this.keys[40]) {
      if (this.velY < this.speed) {
        this.velY ++;
      }
    }

    if (this.keys[39]) {
      if (this.velX > -this.speed) {
        this.velX ++;
      }
    }

    if (this.keys[37]) {
      if (this.velX < this.speed) {
        this.velX --;
      }
    }

    this.move();
  }

  move() {
    this.velY *= this.friction;
    this.m.goblin.position.z += this.velY;
    this.velX *= this.friction;
    this.m.goblin.position.x += this.velX;


    const mapToDegrees = this.map(this.angle, 1, -1, 30, -30);

    const radians = mapToDegrees * (Math.PI/180);
    this.m.goblin.rotation.y = radians;
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }
}

module.exports = Car;
