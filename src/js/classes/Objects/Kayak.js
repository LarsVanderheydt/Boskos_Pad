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
      object.scale.set(2, 2, 2);

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.castShadow = true;
      object.receiveShadow = true;

      object.position.y = 40;
      object.rotation.y = -90;
      object.position.z = 0;

      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      this.mesh.add(object);
    });
  }

  wiggle(object) {
    this.mesh.rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.05;
  }
}

module.exports = Kayak;
