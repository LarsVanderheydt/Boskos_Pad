const Colors = require('../objects/Colors');
const speed = 1;

class Car {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Car';
    
    const geom = new THREE.BoxGeometry(5, 5, 5);
    const mat = new THREE.MeshPhongMaterial({color: Colors.brown}),

    const m = new THREE.BoxGeometry(geom, mat);

    m.castShadow = true;
    m.receiveShadow = true;

    m.position.set(106, 10, 164);

    window.addEventListener(`keydown`, e => {
      console.log(x);
      if (e.key === 'ArrowLeft') {
        m.position.x -= speed;
      } else if (e.key === 'ArrowUp') {
        m.position.z -= speed;
      } else if (e.key === 'ArrowRight') {
        m.position.x += speed;
      } else if (e.key === 'ArrowDown') {
        m.position.z += speed;
      }
    }, true);

    // const object = scene.getObjectByName('Floor');
    // scene.add(m);
    this.mesh.add(m);
  }

}

module.exports = Car;
