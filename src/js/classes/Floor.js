const Colors = require('../objects/Colors');

class Floor {
  constructor() {
    const mat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: Colors.green});

    const m = exampleUtils.createPlane(1, 100, 80, 0, mat);
    m.receiveShadow = true;
    m.name = 'Floor';

    m.goblin.position.x = 80;
    // m.goblin.position.z = -5;

    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }
}

module.exports = Floor;
