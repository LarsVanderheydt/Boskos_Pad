const Colors = require('../../objects/Colors');

class Tree {
  constructor(x, y) {
    this.speed = 0.2;
    this.angle = -45 * (Math.PI / 180);

    const scalarMultiplier = (Math.random() * (0.25 - 0.1)) + 0.05;
    let midPointVector = new THREE.Vector3();
    let vertexVector = new THREE.Vector3();
    let treeGeometry = new THREE.ConeGeometry(0.5, 1, 8, 6);
    let treeMaterial = new THREE.MeshStandardMaterial({color: Colors.treegreen});
    treeMaterial.flatShading = true;
    midPointVector = treeGeometry.vertices[0].clone();
    const currentTier = 0;

    const treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
    treeTop.castShadow = true;
    treeTop.receiveShadow = false;
    treeTop.position.y = 0.9;
    treeTop.rotation.y = (Math.random() * (Math.PI));

    const treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: Colors.lightbrown});
    trunkMaterial.flatShading = true;
    const treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
    treeTrunk.position.y = 0.25;

    this.mesh = new THREE.Object3D();
    this.mesh.add(treeTrunk, treeTop);
    this.mesh.scale.set(8, 8, 8);
    this.mesh.position.x = x;
    this.mesh.position.z = y
    this.mesh.position.y = 0;

    this.wind();
  }

  wind() {

    //HORIZONTAAL
    this.mesh.rotation.z += Math.cos(Date.now() * 0.0008) * Math.PI * 0.0005;
    //VERTICAAL
    this.mesh.rotation.x += Math.cos(Date.now() * 0.0008) * Math.PI * 0.0005;
    window.requestAnimationFrame(() => this.wind());

  }

}

module.exports = Tree;
