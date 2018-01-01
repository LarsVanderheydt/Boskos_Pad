const Colors = require('../../objects/Colors');

class Water {
  constructor() {
    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue,
      emissive: Colors.darkblue,
      specular: Colors.white,
      shininess: 100,
      specular: 30,
      transparent: true,
    });

    const w = exampleUtils.createPlane(1, 10, 80, 0, mat);
    w.receiveShadow = true;
    w.name = 'Water';
    w.position.y = 1;

    w.goblin.position.x = 120;
    w.goblin.position.y = 0.4;

    w.castShadow = true;
    w.receiveShadow = true;
    scene.add(w);
  }
}

module.exports = Water;
