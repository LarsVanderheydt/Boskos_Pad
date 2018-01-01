const Cloud = require('./Cloud');

class Sky {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.nClouds = 20;
    var stepAngle = Math.PI * 2 / this.nClouds;

    for (var i = 0; i < this.nClouds; i++) {
      var c = new Cloud();
      var a = stepAngle * i;
      var h = (Math.random() * 120) - 50;

      c.mesh.position.x = (Math.random() * 150);
      c.mesh.position.z = (Math.random() * 120) - 50;
      c.mesh.rotation.z = a + Math.PI / 2;

      var s = Math.random();
      c.mesh.scale.set(s, s, s);

      c.mesh.name = "cloud";
      this.mesh.add(c.mesh);
    }
  }

  float(object) {
    if (this.mesh.position.z <= 120) {
      this.mesh.position.x = Math.sin(Date.now() * 0.001) * Math.PI * 0.2;
      this.mesh.position.z += 0.02 * Math.PI * 0.2;
    }else{
      this.mesh.position.z = -150;
    }
  }
}
module.exports = Sky;
