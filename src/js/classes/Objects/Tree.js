const Colors = require('../../objects/Colors');
let t;
const tree = {};

class Tree {
  constructor(x, y) {
    const sides = 8;
    const tiers = 6;
    const scalarMultiplier = (Math.random() * (0.25 - 0.1)) + 0.05;
    let midPointVector = new THREE.Vector3();
    let vertexVector = new THREE.Vector3();
    let treeGeometry = new THREE.ConeGeometry(0.5, 1, sides, tiers);
    let treeMaterial = new THREE.MeshStandardMaterial({color: 0x33ff33});
    treeMaterial.flatShading = true;
    //const offset;
    midPointVector = treeGeometry.vertices[0].clone();
    const currentTier = 0;
    //const vertexIndex;

    const treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
    treeTop.castShadow = true;
    treeTop.receiveShadow = false;
    treeTop.position.y = 0.9;
    treeTop.rotation.y = (Math.random() * (Math.PI));

    const treeTrunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    const trunkMaterial = new THREE.MeshStandardMaterial({color: 0x886633});
    trunkMaterial.flatShading = true;
    const treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
    treeTrunk.position.y = 0.25;
    this.mesh = new THREE.Object3D();
    this.mesh.add(treeTrunk);
    this.mesh.add(treeTop);
    this.mesh.scale.set(8, 8, 8);
    this.mesh.position.x = x;
    this.mesh.position.z = y
    this.mesh.position.y = 1;
    //this.t.name = 'Tree'
    //scene.add(this.mesh);
  }
}

module.exports = Tree;
