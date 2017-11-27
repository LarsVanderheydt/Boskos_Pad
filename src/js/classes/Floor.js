const Colors = require('../objects/Colors');

class Floor {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Floor';
    const geom = new THREE.BoxGeometry(80, 2, 20);

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red
    });

    const m = new THREE.Mesh(geom, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.name = 'Floor';
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.add(m);
  }
}

module.exports = Floor;