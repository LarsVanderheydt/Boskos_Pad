const stopBlimpAt = -10;

class Blimp {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "Blimp";
    this.speed = 0.02;
    this.angle = -160 * (Math.PI / 180);
    this.pause = false;

    const texture = new THREE.TextureLoader().load('./js/models/blimp/Blimp_Texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/blimp/Blimp.obj', object => {
      object.scale.set(1.5, 1.5, 1.5);

      object.children.forEach(obj => {
        obj.castShadow = true;
        obj.receiveShadow = true;
      });

      object.castShadow = true;
      object.receiveShadow = true;

      object.rotation.y = this.angle + (Math.PI / 180);
      object.position.y = 40;

      object.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.material = material;
        }
      });

      this.mesh.add(object);
    });
  }

  fly() {
    if (!this.pause) {
      if (this.mesh.position.x <= stopBlimpAt) {
        this.pause = true;
        this.mesh.position.x = -20;
        this.mesh.position.z = -90;
      } else {
        this.mesh.position.z += this.speed * Math.sin(-this.angle);
        this.mesh.position.x += this.speed * Math.cos(-this.angle);
      }
    }
  }
}

module.exports = Blimp;
