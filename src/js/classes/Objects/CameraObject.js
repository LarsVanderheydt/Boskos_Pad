const Colors = require('../../objects/Colors');

class CameraObject {
  constructor() {

  //   //camera = new Camera();
  //   //scene.add(camera.mesh);
  //   const Imgloader = new THREE.ImageLoader();
  //
  // // load a image resource
  // Imgloader.load(
  // 	// resource URL
  // 	'assets/arrow.png',
  //
  // 	// onLoad callback
  // 	function ( image ) {
  // 		// use the image, e.g. draw part of it on a canvas
  // 		let canvas = document.createElement( 'canvas' );
  // 		let context = canvas.getContext( '2d' );
  // 		context.drawImage( image, 100, 100 );
  //     scene.add(Imgloader);
  // 	});

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
