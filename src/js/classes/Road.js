const Colors = require('../objects/Colors');
class Road {
  constructor() {
    const loader = new THREE.OBJLoader();

    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Road';
    // load a resource
    loader.load(
      // resource URL
      './js/models/svg_track.obj',
      // called when resource is loaded
      object => {
        // object.name = 'Object';
        // object.position.set(2.4, 1.54, -3.4);
        object.position.x = 80.74;
        object.position.y = 1.1;
        object.position.z = 40;

        object.rotation.y = 9.36;

        object.scale.x = 62.74;
        object.scale.y = 62.74;
        object.scale.z = 62.74;

        for (let i = 0; i < 5; i++) {
          object.children[i].material.color.setHex(0x555555);
        }

        object.children.forEach(obj => {
          obj.castShadow = true;
          obj.receiveShadow = true;
        });

        object.children[5].material.color.setHex(0xCBBFBD);

        object.castShadow = true;
        object.receiveShadow = true;

        this.mesh.add(object);
       },
       // called when loading is in progresses
       xhr => {
         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
       },

       // called when loading has errors
       error => {
         console.error( 'An error happened' );
       }
    );
  }
}

module.exports = Road;
