class House {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "House";

    const texture = new THREE.TextureLoader().load('./js/models/house/House_Texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/house/House.obj', object => {
      object.scale.set(5, 5, 5);

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

module.exports = House;
