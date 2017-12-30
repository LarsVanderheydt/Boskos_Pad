const Colors = require('../objects/Colors');

class Cloud {
  constructor() {
    // Create an empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();

    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    const geom = new THREE.SphereGeometry(4, 10, 10);

    // create a material; a simple white material will do the trick
    // const mat = new THREE.MeshPhongMaterial({color: Colors.white, transparent: true, opacity: 0.6});
    const mat = new THREE.MeshPhongMaterial({color: Colors.white});
    

    // duplicate the geometry a random number of times
    const nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {

      // create the mesh by cloning the geometry
      let m = new THREE.Mesh(geom, mat);

      // set the position and the rotation of each cube randomly
      m.position.x = i * 2;
      //  m.position.y = Math.random() * 5;
      m.position.z = Math.random() * 5;
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;

      // set the size of the cube randomly
      const s = Math.random() * .9;
      m.scale.set(s, s, s);

      // allow each cube to cast and to receive shadows
      m.castShadow = false;
      m.receiveShadow = false;

      // add the cube to the container we first created
      this.mesh.add(m);
    }
  }

  // float(object) {
  //    this.mesh.position.x = Math.sin(Date.now() * 0.001) * Math.PI * 0.05;
  //   requestAnimationFrame(() => this.wiggle(object));
  // }
}

module.exports = Cloud;
