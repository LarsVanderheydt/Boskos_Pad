const Colors = require('../objects/Colors');
const speed = 1;
let m, mixer;
let prevTime = Date.now();

class Car {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'Car';

    // instantiate a loader
    const loader = new THREE.JSONLoader();

    loader.load('./js/models/car.json', (geometry, materials) => {

      // geometry.applyMatrix( new THREE.Matrix4().makeTranslation( -2, 0, -42 ) );

      const material = new THREE.MeshLambertMaterial({
        morphTargets: true,
        color: Colors.blue
      });

      m = new THREE.Mesh(geometry, material);
      m.name = 'My Car';

      // m.geometry.center();
      // m.geometry.verticesNeedUpdate = true;

      this.mesh.add(m);

      //MIXER
      mixer = new THREE.AnimationMixer(m);

      const clip = THREE.AnimationClip.CreateFromMorphTargetSequence('ride', geometry.morphTargets, 30, true);
      this.ride = mixer.clipAction(clip);
      this.ride.clampWhenFinished = true;
      this.ride.setDuration(5);
      this.ride.setLoop(THREE.LoopOnce);
    });
  }

  animation(mesh) {
    if (mixer) {
      var time = Date.now();
      mixer.update((time - prevTime) * 0.001);
      prevTime = time;
    }
  }
}

module.exports = Car;
