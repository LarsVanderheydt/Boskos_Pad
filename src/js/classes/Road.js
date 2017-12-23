const Colors = require('../objects/Colors');
const loader = new THREE.OBJLoader();
const JSONloader = new THREE.JSONLoader();

class Road {
  constructor() {
    this.mesh = new THREE.Object3D();
    JSONloader.load("./js/models/road.json", geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.white
      });
      const m = new THREE.Mesh(geometry, mat);
      m.castShadow = m.receiveShadow = true;
      m.name = 'Road';
      m.position.y = 0.5;
      this.mesh.add(m);
    });

    // this.loadRoad("top");
    // this.loadRoad("bottom");
    // this.loadRoad("left");
    // this.loadRoad("right");
    // this.loadRoad("middle");
    this.loadRoad('borders');
  }

  loadRoad(url) {
    JSONloader.load(`./js/models/${url}.json`, geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.blue
      });

      const mesh = new THREE.Mesh(geometry, mat);

      mesh.castShadow = mesh.receiveShadow = true;
      const shape = new Goblin.MeshShape(
        mesh.geometry.vertices.map(vertex =>{
          return new Goblin.Vector3( vertex.x, vertex.y, vertex.z );
        }),
        mesh.geometry.faces.reduce(
          (faces, face) => {
            faces.push( face.a, face.b, face.c );
            return faces;
          },[]
        )
      );

      mesh.goblin = new Goblin.RigidBody(shape, 0);
      // mesh.goblin.position.y = 1;
      mesh.goblin.position.y = 0.5;
      // mesh.visible = false;

      exampleUtils.objects.push(mesh);
      exampleUtils.world.addRigidBody(mesh.goblin);
      this.mesh.add(mesh);
    });
  }
}

module.exports = Road;
