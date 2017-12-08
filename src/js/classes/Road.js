const Colors = require('../objects/Colors');
const loader = new THREE.OBJLoader();
const JSONloader = new THREE.JSONLoader();

class Road {
  constructor() {
    this.mesh = new THREE.Object3D();

    JSONloader.load("./js/models/road/ground.json", geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.white
      });
      const m = new THREE.Mesh(geometry, mat);
      m.name = 'Road';
      m.position.y = -1.3;



      scene.add(m);
    });

    this.loadRoad("top");
    this.loadRoad("bottom");
    this.loadRoad("left");
    this.loadRoad("right");
    this.loadRoad("middle");

    scene.add(this.mesh);
  }

  loadRoad(url) {
    JSONloader.load(`./js/models/road/${url}.json`, geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.blue
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.name = 'mesh';

      mesh.castShadow = mesh.receiveShadow = true;
      scene.add(mesh);
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
      mesh.goblin.position.y = -1.3;

      exampleUtils.objects.push(mesh);
      exampleUtils.world.addRigidBody(mesh.goblin);
      scene.add(mesh);
    });
  }
}

module.exports = Road;
