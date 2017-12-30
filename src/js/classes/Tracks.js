const Colors = require('../objects/Colors');
let t;
const tracks = {};
let boardXpos = 0.6;

class Tracks {
  constructor() {

    let tracksGeometry = new THREE.BoxGeometry(180, 0.1 ,0.5, 1, 1);
    let tracksMaterial = new THREE.MeshStandardMaterial({color: 0x8a8a8a});
    tracksMaterial.flatShading = true;

    const tracksOne = new THREE.Mesh(tracksGeometry, tracksMaterial);
    tracksOne.castShadow = true;
    tracksOne.receiveShadow = false;
    tracksOne.position.x = 1;
    tracksOne.position.y = 0.5;
    tracksOne.rotation.y = 1.45;

    const tracksTwo = new THREE.Mesh(tracksGeometry, tracksMaterial);
    tracksTwo.castShadow = true;
    tracksTwo.receiveShadow = false;
    tracksTwo.position.x = 3;
    tracksTwo.position.y = 0.5;
    tracksTwo.rotation.y = 1.45;

    const tracksBoardGeometry = new THREE.BoxGeometry(4, 0.6, 0.8,1,1,1);
    const boardMaterial = new THREE.MeshStandardMaterial({color: 0x886633});
    boardMaterial.flatShading = true;

    this.mesh = new THREE.Object3D();

    for (let i = 0; i < 150; i++) {
      const tracksBoard = new THREE.Mesh(tracksBoardGeometry, boardMaterial);
      tracksBoard.position.y = 0.6;
      tracksBoard.position.z =  (i*Math.PI/2) - 150;
      tracksBoard.position.x =  -(i*Math.PI/16.2) + 20.5;
      this.mesh.add(tracksBoard);
    }

    //this.mesh = new THREE.Object3D();
    //this.mesh.add(tracksBoard.mesh);
    this.mesh.add(tracksOne);
    this.mesh.add(tracksTwo);
    this.mesh.position.x = 30;
    this.mesh.position.z = 0;
    this.mesh.position.y = 0;

    //this.t.name = 'Tracks'
    scene.add(this.mesh);
  }
}

module.exports = Tracks;
