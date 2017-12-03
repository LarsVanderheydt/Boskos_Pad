const Colors = require('../objects/Colors');
const loader = new THREE.OBJLoader();
const JSONloader = new THREE.JSONLoader();

class Road {
  constructor() {
    JSONloader.load("./js/models/road/ground.json", geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.white
      });
      const m = new THREE.Mesh(geometry, mat);
      m.name = 'Road';
      m.position.y = -1.40;
      scene.add(m);
    });

    this.loadRoad("./js/models/road/top.json");
    this.loadRoad("./js/models/road/bottom.json");
    this.loadRoad("./js/models/road/left.json");
    this.loadRoad("./js/models/road/right.json");
    this.loadRoad("./js/models/road/middle.json");
  }

  loadRoad(url) {
    JSONloader.load(url, geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.blue
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.name = 'mesh';

      mesh.castShadow = mesh.receiveShadow = true;
      scene.add(mesh);
      var shape = new Goblin.MeshShape(
        mesh.geometry.vertices.map(function( vertex ){
          return new Goblin.Vector3( vertex.x, vertex.y, vertex.z );
        }),
        mesh.geometry.faces.reduce(
          function( faces, face ) {
            faces.push( face.a, face.b, face.c );
            return faces;
          },[]
        )
      );

      mesh.goblin = new Goblin.RigidBody(shape, 0);
      mesh.goblin.position.y = 1;

      exampleUtils.objects.push(mesh);
      scene.add(mesh);
      exampleUtils.world.addRigidBody(mesh.goblin);
    });
  }
}

module.exports = Road;
