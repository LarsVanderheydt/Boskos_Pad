const Colors = require('../objects/Colors');

class Water {
  constructor() {
    const mat = new THREE.MeshPhongMaterial({
      color: 0x00aeff,
      emissive: 0x0023b9,
      shininess: 60,
      specular: 30,
      transparent: true
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
