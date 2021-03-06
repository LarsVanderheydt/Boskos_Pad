window.exampleUtils = (function() {
  var renderer,
    camera,
    controls,
    world,
    stats;

  var objects = [];

  var startGoblin = function() {
    exampleUtils.world = world = new Goblin.World(new Goblin.SAPBroadphase(), new Goblin.NarrowPhase(), new Goblin.IterativeSolver());
    exampleUtils.world.addListener('stepStart', displayContacts);
  };

  var displayContacts = (function() {
    var contacts = [],
      sphere = new THREE.SphereGeometry(0.2),
      material = new THREE.MeshNormalMaterial(),
      normal_material = new THREE.LineBasicMaterial({color: 0x00ff00});

    return function() {
      while (contacts.length) {
        exampleUtils.scene.remove(contacts.pop());
      }

      if (exampleUtils.show_contacts === false) {
        return;
      }

      var manifold = exampleUtils.world.narrowphase.contact_manifolds.first;
      while (manifold) {
        for (var i = 0; i < manifold.points.length; i++) {
          var mesh = new THREE.Mesh(sphere, material);
          mesh.position.copy(manifold.points[i].contact_point);
          exampleUtils.scene.add(mesh);
          contacts.push(mesh);

          var normal_geometry = new THREE.Geometry();
          normal_geometry.vertices.push(mesh.position.clone());
          normal_geometry.vertices.push(new THREE.Vector3().copy(manifold.points[i].contact_normal).add(mesh.position));
          var normal = new THREE.Line(normal_geometry, normal_material);
          exampleUtils.scene.add(normal);
          contacts.push(normal);
        }
        manifold = manifold.next_manifold;
      }
    };
  })();

  return {
    objects: objects,
    scene: null,
    renderer: null,
    world: null,
    show_contacts: false,
    ontick: null,

    initialize: function() {
      startGoblin();
    },

    render: function() {
      var i,
        object;
      for (i = 0; i < objects.length; i++) {
        object = objects[i];
        object.position.set(object.goblin.position.x, object.goblin.position.y, object.goblin.position.z);
        object.quaternion.set(object.goblin.rotation.x, object.goblin.rotation.y, object.goblin.rotation.z, object.goblin.rotation.w);
      }
    },

    run: function() {
      world.step(1 / 60);
      exampleUtils.render();
    },

    withinEpsilon: function(value, expected) {
      return Math.abs(value - expected) <= Goblin.EPSILON;
    },

    createSphere: function(radius, mass, material) {
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), material);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      sphere.goblin = new Goblin.RigidBody(new Goblin.SphereShape(radius), mass);

      objects.push(sphere);
      exampleUtils.scene.add(sphere);
      world.addRigidBody(sphere.goblin);

      return sphere;
    },

    createBox: function(half_width, half_height, half_length, mass, material) {
      var box = new THREE.Mesh(new THREE.BoxGeometry(half_width * 2, half_height * 2, half_length * 2), material);
      box.castShadow = true;
      box.receiveShadow = true;
      box.goblin = new Goblin.RigidBody(new Goblin.BoxShape(half_width, half_height, half_length), mass);

      objects.push(box);
      world.addRigidBody(box.goblin);

      return box;
    },

    createCylinder: function(radius, half_height, mass, material) {
      var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, half_height * 2), material);
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      cylinder.goblin = new Goblin.RigidBody(new Goblin.CylinderShape(radius, half_height), mass);

      objects.push(cylinder);
      exampleUtils.scene.add(cylinder);
      world.addRigidBody(cylinder.goblin);

      return cylinder;
    },

    createCone: function(radius, half_height, mass, material) {
      var cone = new THREE.Mesh(new THREE.CylinderGeometry(0, radius, half_height * 2), material);
      cone.castShadow = true;
      cone.receiveShadow = true;
      cone.goblin = new Goblin.RigidBody(new Goblin.ConeShape(radius, half_height), mass);

      objects.push(cone);
      exampleUtils.scene.add(cone);
      world.addRigidBody(cone.goblin);

      return cone;
    },

    createPlane: function(orientation, half_width, half_length, mass, material) {
      var plane = new THREE.Mesh(new THREE.BoxGeometry(
        orientation === 1 || orientation === 2
        ? half_width * 2
        : 0.01,
      orientation === 0
        ? half_width * 2
        : (
          orientation === 2
          ? half_length * 2
          : 0.01),
      orientation === 0 || orientation === 1
        ? half_length * 2
        : 0.01), material);
      plane.castShadow = true;
      plane.receiveShadow = true;
      plane.goblin = new Goblin.RigidBody(
      //new Goblin.PlaneShape( orientation, half_width, half_length ),
      new Goblin.BoxShape(
        orientation === 1 || orientation === 2
        ? half_width
        : 0.005,
      orientation === 0
        ? half_width
        : (
          orientation === 2
          ? half_length
          : 0.005),
      orientation === 0 || orientation === 1
        ? half_length
        : 0.005), mass);

      objects.push(plane);
      //exampleUtils.scene.add( plane );
      world.addRigidBody(plane.goblin);

      return plane;
    },

    createConvex: function(vertices, mass, material) {
      var convex = new THREE.Mesh(new THREE.ConvexGeometry(vertices.map(function(vertex) {
        return new THREE.Vector3(vertex.x, vertex.y, vertex.z);
      })), material);
      convex.castShadow = true;
      convex.receiveShadow = true;

      convex.goblin = new Goblin.RigidBody(new Goblin.ConvexShape(vertices), mass);

      objects.push(convex);
      exampleUtils.scene.add(convex);
      world.addRigidBody(convex.goblin);

      return convex;
    },

    createMaterial: function(name, repeat_x, repeat_y) {
      var def = exampleUtils.materials[name],
        map = THREE.ImageUtils.loadTexture('textures/' + def.diffuse),
        normalMap,
        specularMap,
        material_def = {
          shininess: 0
        };

      map.repeat.x = repeat_x;
      map.repeat.y = repeat_y;
      map.wrapS = map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = renderer.getMaxAnisotropy();
      material_def.map = map;

      if (def.normal) {
        normalMap = THREE.ImageUtils.loadTexture('textures/' + def.normal, THREE.RepeatWrapping);
        normalMap.repeat.x = repeat_x;
        normalMap.repeat.y = repeat_y;
        normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.anisotropy = renderer.getMaxAnisotropy();
        material_def.normalMap = normalMap;
      }

      if (def.specular) {
        specularMap = THREE.ImageUtils.loadTexture('textures/' + def.specular, THREE.RepeatWrapping);
        specularMap.repeat.x = repeat_x;
        specularMap.repeat.y = repeat_y;
        specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
        specularMap.anisotropy = renderer.getMaxAnisotropy();
        material_def.specularMap = specularMap;
        material_def.shininess = def.shininess;
      }

      var material = new THREE.MeshPhongMaterial(material_def);

      if (def.normal_scale) {
        material.normalScale.set(def.normal_scale, def.normal_scale);
      }

      if (def.metal) {
        material.metal = true;
      }

      return material;
    }
  };
})();
