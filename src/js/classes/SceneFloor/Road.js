const Colors = require('../../objects/Colors');
const JSONloader = new THREE.JSONLoader();

class Road {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.mesh = new THREE.Object3D();
    JSONloader.load("./js/models/road.json", geometry => {
      const mat = new THREE.MeshPhongMaterial({
        color: Colors.white
      });
      const m = new THREE.Mesh(geometry, mat);
      m.castShadow = m.receiveShadow = true;
      m.name = 'Road';
      m.position.y = 0.5;
      m.position.x = this.x;
      m.position.z = this.z;
      scene.add(m);
    });

    this.loadRoad('borders');
    scene.add(this.mesh);
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
      mesh.goblin.position.y = 0.5;
      mesh.goblin.position.x = this.x;
      mesh.goblin.position.z = this.z;
      mesh.visible = false;

      exampleUtils.objects.push(mesh);
      exampleUtils.world.addRigidBody(mesh.goblin);
      scene.add(mesh);
    });
  }
}

module.exports = Road;
