const scale = 2;
let angle = 0;
let wiggleSpeed = 0.01;

class Kayak {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "Kayak";
    this.speed = 0.02;
    this.pause = false;

    const texture = new THREE.TextureLoader().load('./js/models/kayak/kayak_texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/kayak/kayak.obj', object => {
      object.scale.set(scale, scale, scale);

      // object.position.x = 130;
      // object.position.z = -5;

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.castShadow = true;
      object.receiveShadow = true;

      object.position.y = 40;
      object.rotation.y = -90;
      object.position.z = 0;

      // object.position.y = 2;

      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      this.mesh.add(object);
      //this.wiggle(object);
    });
  }

  wiggle(object) {
    this.mesh.rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.05;

    //requestAnimationFrame(() => this.wiggle(object));
  }
}

module.exports = Kayak;
