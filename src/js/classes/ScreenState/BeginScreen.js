const Colors = require('../../objects/Colors');

class BeginScreen {
  constructor() {

    const loader = new THREE.FontLoader();

    loader.load('assets/fonts/Open_Sans_Regular.json', function(font) {

      let TextMaterial = new THREE.MeshBasicMaterial({color: Colors.black});
      let Title = "BOSCO'S PAD";
      let TitleTextGeometry = new THREE.TextGeometry(Title, {
        font: font,
        size: 10,
        height: 1,
        curveSegments: 20
      });

      TitleTextGeometry.computeBoundingBox();
      let TitleTextMesh = new THREE.Mesh(TitleTextGeometry, TextMaterial);

      TitleTextMesh.position.x = 40;
      TitleTextMesh.position.z = -15;
      TitleTextMesh.position.y = 45;
      TitleTextMesh.rotation.x = -1.6;

      let SubOne = "Het Festival gaat bijna beginnen!";
      let SubOneTextGeometry = new THREE.TextGeometry(SubOne, {
        font: font,
        size: 5,
        height: 1,
        curveSegments: 20
      });

      SubOneTextGeometry.computeBoundingBox();
      let SubOneTextMesh = new THREE.Mesh(SubOneTextGeometry, TextMaterial);

      SubOneTextMesh.position.x = 40;
      SubOneTextMesh.position.z = 0;
      SubOneTextMesh.position.y = 45;
      SubOneTextMesh.rotation.x = -1.6;

      let SubTwo = "Rij zo snel mogelijk naar JEF filmfestival !";
      let SubTwoTextGeometry = new THREE.TextGeometry(SubTwo, {
        font: font,
        size: 4,
        height: 1,
        curveSegments: 20
      });

      SubTwoTextGeometry.computeBoundingBox();
      let SubTwoTextMesh = new THREE.Mesh(SubTwoTextGeometry, TextMaterial);

      SubTwoTextMesh.position.x = 37.5;
      SubTwoTextMesh.position.z = 10;
      SubTwoTextMesh.position.y = 45;
      SubTwoTextMesh.rotation.x = -1.6;

      let Start = "Druk op een knop om te beginnen";
      let StartTextGeometry = new THREE.TextGeometry(Start, {
        font: font,
        size: 3,
        height: 1,
        curveSegments: 20
      });

      StartTextGeometry.computeBoundingBox();
      let StartTextMesh = new THREE.Mesh(StartTextGeometry, TextMaterial);

      StartTextMesh.position.x = 50;
      StartTextMesh.position.z = 40;
      StartTextMesh.position.y = 45;
      StartTextMesh.rotation.x = -1.6;

      scene.add(TitleTextMesh, SubOneTextMesh, SubTwoTextMesh, StartTextMesh);
    });
  }
}

module.exports = BeginScreen;
