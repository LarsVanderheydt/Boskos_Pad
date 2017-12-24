let box, spline, counter = 0;

let tangent = new THREE.Vector3();
const axis = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);

class Train {
  constructor() {
    //controls = new THREE.TrackballControls(camera, render.domElement);

    let numPoints = 50;

    spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 200, 0),
      new THREE.Vector3(150, 150, 0),
      new THREE.Vector3(150, 50, 0),
      new THREE.Vector3(250, 100, 0),
      new THREE.Vector3(250, 300, 0)
    ]);

    let material = new THREE.LineBasicMaterial({color: 0xff00f0});

    let geometry = new THREE.Geometry();
    let splinePoints = spline.getPoints(numPoints);

    for (let i = 0; i < splinePoints.length; i++) {
      geometry.vertices.push(splinePoints[i]);
    }

    let line = new THREE.Line(geometry, material);
    //line.add(line);

    geometry = new THREE.BoxGeometry(5, 40, 4);
    material = new THREE.MeshBasicMaterial({color: 0xff0000});

    box = new THREE.Mesh(geometry, material);
    //box.add(box);

  }
  moveBox() {
    if (counter <= 1) {
      box.position.copy(spline.getPointAt(counter));

      tangent = spline.getTangentAt(counter).normalize();

      axis.crossVectors(up, tangent).normalize();

      let radians = Math.acos(up.dot(tangent));

      box.quaternion.setFromAxisAngle(axis, radians);

      counter += 0.005
    } else {
      counter = 0;
    }
  }
}
module.exports = Train;
