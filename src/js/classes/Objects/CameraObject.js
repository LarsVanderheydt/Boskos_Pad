class CameraObject {
  constructor() {
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./js/models/camera/Camera.mtl', materials => {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('./js/models/camera/Camera.obj', object => {
        this.mesh = object;
        this.mesh.position.y = 20;
        this.mesh.rotation.y = 1.6;
        this.mesh.scale.set(3.68, 3.68, 3.68);
        scene.add(this.mesh);
      });

    });
  }
}


module.exports = CameraObject;
