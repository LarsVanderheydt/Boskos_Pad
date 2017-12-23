const Colors = require('../objects/Colors');

class Water {
  constructor() {
    const mat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: Colors.blue
    });

    const w = exampleUtils.createPlane(1, 10, 80, 0, mat);
    w.receiveShadow = true;
    w.name = 'Water';

    w.goblin.position.x = 120;
    // w.goblin.position.z = -5;

    w.castShadow = true;
    w.receiveShadow = true;
    scene.add(w);
  }
}

module.exports = Water;
