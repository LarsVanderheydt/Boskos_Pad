const Colors = require('../../objects/Colors');

class Cloud {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geom = new THREE.SphereGeometry(4, 10, 10);
    const mat = new THREE.MeshPhongMaterial({color: Colors.white, transparent: true, opacity: 0.6});

    const nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {

      let m = new THREE.Mesh(geom, mat);
      m.position.x = i * 2;
      m.position.z = Math.random() * 5;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;

      const s = Math.random() * .9;
      m.scale.set(s, s, s);
      m.castShadow = false;
      m.receiveShadow = false;

      this.mesh.add(m);
    }
  }
}

module.exports = Cloud;
