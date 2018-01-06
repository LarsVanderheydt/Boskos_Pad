const stopTrainAt = 100;

class Train {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.speed = 0.3;
    this.angle = -7 * (Math.PI / 180);
    this.pause = false;

    const texture = new THREE.TextureLoader().load('./js/models/train/Train_Texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/train/Train.obj', object => {
      object.scale.set(0.1, 0.1, 0.1);

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.castShadow = true;
      object.receiveShadow = true;

      object.rotation.y = this.angle + (Math.PI / 180);
      object.position.y = 1;

      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });
      this.mesh.add(object);
    });
  }

  move() {
    let moving = false;
    if (!this.pause) {
      if (this.mesh.position.z >= stopTrainAt) {
        this.pause = true;
        this.mesh.position.x = 43;
        this.mesh.position.z = -90;
        moving = false;
      } else {
        this.mesh.position.z += this.speed * Math.cos(this.angle);
        this.mesh.position.x += this.speed * Math.sin(this.angle);
        moving = true;
      }
    }
    return moving;
  }
}

module.exports = Train;
