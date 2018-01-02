const Colors = require('../../objects/Colors');

class Barrier {
  constructor(x, y, z) {
    this.mesh = new THREE.Object3D();

    const barMat = new THREE.MeshBasicMaterial( {color: Colors.red} );
    const barGeom = new THREE.BoxGeometry(1, 1, 8);
    this.bar = new THREE.Mesh(barGeom, barMat);
    this.bar.position.y = 0.24;
    this.bar.position.z = 1.5;
    barGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -1.5));
    this.bar.castShadow = true;
    this.bar.receiveShadow = true;
    this.bar.rotation.x = 1.8;

    const footMat = new THREE.MeshBasicMaterial( {color: Colors.brownDark} );
    const footGeom = new THREE.BoxGeometry(2, 6, 1);
    const foot = new THREE.Mesh(footGeom, footMat);
    foot.position.y = -1.64;
    foot.position.z = 1.7;
    foot.castShadow = true;
    foot.receiveShadow = true;

    this.mesh.name = 'Barrier';
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;

    this.mesh.add(this.bar);
    this.mesh.add(foot);

    const mat = new THREE.MeshPhongMaterial({color: Colors.red});

    this.barrierBox = exampleUtils.createBox( 2, 2, 3, 0, mat);

    this.barrierBox.goblin.position.y = 4;
    this.barrierBox.goblin.linear_velocity.y = -2;

    this.barrierBox.goblin.position.x = x + 1;
    this.barrierBox.goblin.position.y = y;
    this.barrierBox.goblin.position.z = z + 5;

    this.barrierBox.goblin.name = 'Gate';
    this.barrierBox.visible = false;
    scene.add(this.barrierBox);
  }

  open() {
    let open = false;
    if (this.bar.rotation.x <= 1.8) {
      this.bar.rotation.x += 0.01;
      this.barrierBox.goblin.position.z += 0.03;
      open = false;
    } else {
      open = true;
    }

    return open;
  }

  close() {
    let closed = false;
    if (this.bar.rotation.x >= 0) {
      this.bar.rotation.x -= 0.01;
      this.barrierBox.goblin.position.z -= 0.03;
      closed = false;
    } else {
      closed = true;
    }

    return closed;
  }
}

module.exports = Barrier;
