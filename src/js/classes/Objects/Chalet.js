const scale = 0.011;

class Chalet {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "Chalet";

    const texture = new THREE.TextureLoader().load('./js/models/chalet/Chalet_texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/chalet/Chalet.obj', object => {
      object.scale.set(scale, scale, scale);

      object.position.x = 160;
      //object.position.y = 3.2;
      object.position.z = -7;

      object.rotation.y = 3.15;

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.castShadow = true;
      object.receiveShadow = true;

      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      this.mesh.add(object);
    });
  }
}

module.exports = Chalet;
