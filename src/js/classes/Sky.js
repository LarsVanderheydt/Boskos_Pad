const Cloud = require('./Cloud');

class Sky {
  constructor() {
    // Create an empty container
    this.mesh = new THREE.Object3D();

    // choose a number of clouds to be scattered in the sky
    this.nClouds = 20;

    // To distribute the clouds consistently,
    // we need to place them according to a uniform angle
    var stepAngle = Math.PI * 2 / this.nClouds;

    // create the clouds
    for (var i = 0; i < this.nClouds; i++) {
      var c = new Cloud();

      // set the rotation and the position of each cloud;
      // for that we use a bit of trigonometry
      var a = stepAngle * i; // this is the final angle of the cloud
      var h = (Math.random() * 120) - 50; // this is the distance between the center of the axis and the cloud itself

      // Trigonometry!!! I hope you remember what you've learned in Math :)
      // in case you don't:
      // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
      //c.mesh.position.y = Math.sin(a) * h;
      c.mesh.position.x = (Math.random() * 150) ;

      // rotate the cloud according to its position
      c.mesh.rotation.z = a + Math.PI / 2;

      // for a better result, we position the clouds
      // at random depths inside of the scene
      c.mesh.position.z = (Math.random() * 120) - 50;

      // we also set a random scale for each cloud
      var s = Math.random();
      c.mesh.scale.set(s, s, s);

      // do not forget to add the mesh of each cloud in the scene
      this.mesh.add(c.mesh);

    }
  }
  float(object) {
  if (this.mesh.position.z <= 120) {

    this.mesh.position.x = Math.sin(Date.now() * 0.001) * Math.PI * 0.2;

    this.mesh.position.z += 0.02 * Math.PI * 0.2;
    console.log(this.mesh.position.z);
  }else{
    this.mesh.position.z = -150;
  }


    //requestAnimationFrame(() => this.wiggle(object));+= this.speed * Math.sin(this.angle);
  }
}
module.exports = Sky;
