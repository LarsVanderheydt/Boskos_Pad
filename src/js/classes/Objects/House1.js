const scale = 5;

class House1 {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "House1";

    const texture = new THREE.TextureLoader().load('./js/models/house1/house1_texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/house1/house1.obj', object => {
      object.scale.set(scale, scale, scale);

      object.position.x = -1;
      object.position.y = 3.2;
      object.position.z = -5;

      object.rotation.y = 100.5;

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

module.exports = House1;
