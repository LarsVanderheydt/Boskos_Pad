const Colors = require('../objects/Colors');
let m;
let speed = 0.6;
const car = {};

class Car {
  constructor() {
    const geom = new THREE.BoxGeometry(5, 2, 3);
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red
    });

    // this.m = exampleUtils.createBox( 3, 1, 2, 1, mat );
    this.m = exampleUtils.createBox( 1.5, 1, 1, 100, mat );
    // this.m = new THREE.Mesh(geom, mat);

    // this.m.castShadow = true;
    // this.m.receiveShadow = true;

    this.m.goblin.position.y = 7;
    // this.m.goblin.linear_velocity.y = 15;
    this.m.goblin.linear_velocity.y = 2;

    this.m.name = 'Car';
    scene.add(this.m);
  }

  controls(e) {
    // console.log(this.m);
    this.m.__dirtyPosition = true;
    if (e.key === 'ArrowLeft') {
      this.m.goblin.position.x -= speed;
      // this.m.position.x -= speed;
    } else if (e.key === 'ArrowUp') {
      this.m.goblin.position.z -= speed;
    } else if (e.key === 'ArrowRight') {
      this.m.goblin.position.x += speed;

    } else if (e.key === 'ArrowDown') {
      this.m.goblin.position.z += speed;
    }

  }
}

module.exports = Car;
