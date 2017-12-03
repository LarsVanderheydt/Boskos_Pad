const Colors = require('../objects/Colors');

class Floor {
  constructor() {
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red
    });

    const m = exampleUtils.createPlane(1, 120, 65, 0, mat);
    m.receiveShadow = true;
    m.name = 'Floor';

    m.goblin.position.x = 90;

    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }
}

module.exports = Floor;
