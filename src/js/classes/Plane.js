const stopPlaneAt = 100;

class Plane {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.speed = 0.2;
    this.angle = -45 * (Math.PI/180);
    this.pause = false;

    const texture = new THREE.TextureLoader().load('./js/models/airplane/Airplane_Texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/airplane/Airplane.obj', object => {
        object.scale.set(0.01, 0.01, 0.01);

        object.children.forEach(obj => {
          obj.castShadow = true;
          obj.receiveShadow = true;
        });

        object.castShadow = true;
        object.receiveShadow = true;

        object.rotation.y = this.angle + (90 * (Math.PI/180));
        object.position.y = 40;

        object.traverse(child => {
          if ( child instanceof THREE.Mesh ) {
            child.material = material;
          }
        });
        this.mesh.add(object);
    });
  }

  fly() {
    if (!this.pause) {
      if (this.mesh.position.z >= stopPlaneAt) {
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

module.exports = Plane;
