class Kayak {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.speed = 0.010;
    this.angle = -45 * (Math.PI/180);
    this.pause = false;

    const texture = new THREE.TextureLoader().load('./js/models/kayak/Kayak_Texture.png');
    const material = new THREE.MeshBasicMaterial({map: texture});
    const loader = new THREE.OBJLoader();

    loader.load('./js/models/kayak/Kayak.obj', object => {
        object.scale.set(2.5,2.5,2.5);

        object.children.forEach(obj => {
          obj.castShadow = true;
          // obj.receiveShadow = true;
        });

        object.castShadow = true;
        object.receiveShadow = true;

        object.position.y = 40;
        object.rotation.y = -90;
        object.position.z = 0;

        object.traverse(child => {
          if ( child instanceof THREE.Mesh ) {
            child.material = material;
          }
        });

        this.mesh.add(object);
    });
  }

  wiggle() {
    //HEEN EN WEER
     this.mesh.rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.05;
    //ROND DRAAIE
  }
}

module.exports = Kayak;
