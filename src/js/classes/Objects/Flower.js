const Colors = require('../../objects/Colors');
let f;
let petalCore;
let petalColors = [Colors.pink, Colors.blue, Colors.red];
const flower = {};

class Flower {
  constructor() {

	this.mesh = new THREE.Object3D();

	const geomPetalCore = new THREE.BoxGeometry(10,10,10,1,1,1);
	const matPetalCore = new THREE.MeshPhongMaterial({color:Colors.pink});
	petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
	petalCore.castShadow = false;
	petalCore.receiveShadow = true;

	const petalColor = petalColors [Math.floor(Math.random()*3)];

	const geomPetal = new THREE.BoxGeometry( 15,20,5,1,1,1 );
	const matPetal = new THREE.MeshBasicMaterial( { color:petalColor});
	geomPetal.vertices[5].y-=4;
	geomPetal.vertices[4].y-=4;
	geomPetal.vertices[7].y+=4;
	geomPetal.vertices[6].y+=4;
	geomPetal.translate(12.5,0,3);

		let petals = [];
		for(let i=0; i<4; i++){

			petals[i]=new THREE.Mesh(geomPetal,matPetal);
			petals[i].rotation.z = i*Math.PI/2;
			petals[i].castShadow = true;
			petals[i].receiveShadow = true;
		}

	petalCore.add(petals[0],petals[1],petals[2],petals[3]);
	petalCore.position.y = 25;
	petalCore.position.z = 3;
	this.mesh.add(petalCore);

  this.mesh.position.x = Math.floor((Math.random() * 50) - 10);
  this.mesh.position.z = Math.floor((Math.random() * 25) + 1);
  this.mesh.position.y = 1;

}
  }

module.exports = Flower;
