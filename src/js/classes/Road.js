const Colors = require('../objects/Colors');
class Road {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Road';

    this.firstStraight();
    this.firstDown();
    this.firstUp();

    this.mesh.position.x = -8.5;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  firstStraight() {
    const geom = new THREE.BoxGeometry(6, 4, 1, 2);
    // geom.applyMatrix(new THREE.Matrix4().translate(0, 0, 0));
    geom.mergeVertices();
    const l = geom.vertices.length;
    // geom.vertices[0].x = 0.5;

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue
    });
    const m = new THREE.Mesh(geom, mat);
    m.name = 'First Straight';
    this.mesh.add(m);
  }

  firstDown() {
    const geom = new THREE.BoxGeometry(6, 4, 1, 2);
    geom.mergeVertices();
    const l = geom.vertices.length;

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue
    });
    const m = new THREE.Mesh(geom, mat);
    m.name = 'First Down';

    m.position.x = 4.4;
    m.position.z = 2.1;

    m.rotation.y = -45 * Math.PI / 180;
    this.mesh.add(m);
  }

  firstUp() {
    const geom = new THREE.BoxGeometry(6, 4, 1, 2);
    geom.mergeVertices();
    const l = geom.vertices.length;

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.blue
    });
    const m = new THREE.Mesh(geom, mat);
    m.name = 'First Up';

    m.position.x = 4.4;
    m.position.z = -2.1;

    m.rotation.y = 45 * Math.PI / 180;
    this.mesh.add(m);
  }
}

module.exports = Road;
