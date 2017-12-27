const Colors = require('../../objects/Colors');
const JSONloader = new THREE.JSONLoader();
const gateSpeed = 0.01;
class Gate {
  constructor(xPos, zPos, yRot) {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "Gate";

    this.load("./js/models/gate/gate.json", "right");
    this.load("./js/models/gate/pilar.json", "pilar");

    this.mesh.position.x = xPos;
    this.mesh.position.z = zPos;
    this.mesh.rotation.y = yRot;

    const mat = new THREE.MeshPhongMaterial({
      color: Colors.red
    });

    this.rightBox = exampleUtils.createBox( 2, 5, 2, 0, mat );

    this.rightBox.goblin.position.y = 4;
    this.rightBox.goblin.linear_velocity.y = -2;

    this.rightBox.goblin.position.x = xPos + 4.5;
    this.rightBox.goblin.position.z = zPos - 0.3;
    this.rightBox.goblin.rotation.y = yRot;

    this.rightBox.goblin.name = 'Gate';
    this.rightBox.visible = false;
    scene.add(this.rightBox);


    this.leftBox = exampleUtils.createBox( 2, 5, 2, 0, mat );

    this.leftBox.goblin.position.y = 4;
    this.leftBox.goblin.linear_velocity.y = -2;

    this.leftBox.goblin.position.x = xPos - 4.5;
    this.leftBox.goblin.position.z = zPos - 0.3;
    this.leftBox.goblin.rotation.y = yRot;

    this.leftBox.goblin.name = 'Gate';
    this.leftBox.visible = false;
    scene.add(this.leftBox);
  }

  load(url, name) {
    JSONloader.load(url, geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.brown
      });

      const m = new THREE.Mesh(geometry, mat);
      m.castShadow = m.receiveShadow = true;
      m.name = name;

      this.mesh.add(m);

      // make the left pillar with same geom & mat of right one
      if (name !== "pilar") {
        m.position.z = 2.45;
      } else {
        const leftPillar = new THREE.Mesh(geometry, mat);
        leftPillar.castShadow = leftPillar.receiveShadow = true;
        leftPillar.name = 'pilar';
        leftPillar.position.z = -6.5;
        this.mesh.add(leftPillar);
      }

      if (name === "right") {
        const leftGate = new THREE.Mesh(geometry, mat);
        leftGate.castShadow = leftGate.receiveShadow = true;
        leftGate.name = "left"
        leftGate.position.z = -2.45;
        leftGate.rotation.y = 179.14;
        this.mesh.add(leftGate);
      }
    });
  }

  close() {
    let closed = false;

    if (this.mesh.children.length !== 0) {
      this.mesh.children.forEach(mesh => {

        if (mesh.name === 'right') {
          if (mesh.position.z >= 0) {
            mesh.position.z -= gateSpeed;
            this.rightBox.goblin.position.x -= gateSpeed;
          }
        }

        if (mesh.name === "left") {
          if (mesh.position.z <= 0) {
            mesh.position.z += gateSpeed;
            this.leftBox.goblin.position.x += gateSpeed;
            closed = false;
          } else {
            closed = true;
          }
        }

      })
    }

    return closed;
  }

  open() {
    let open = true;

    if (this.mesh.children.length !== 0) {
      this.mesh.children.forEach(mesh => {

        if (mesh.name === 'right') {
          if (mesh.position.z <= 2.45) {
            mesh.position.z += gateSpeed;
            this.rightBox.goblin.position.x += gateSpeed;
          }
        }

        if (mesh.name === "left") {
          if (mesh.position.z >= -2.45) {
            mesh.position.z -= gateSpeed;
            this.leftBox.goblin.position.x -= gateSpeed;
            open = true;
          } else {
            open = false;
          }
        }

      })
    }

    return open;
  }
}

module.exports = Gate;
