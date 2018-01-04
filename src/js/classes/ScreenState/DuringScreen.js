const Colors = require('../../objects/Colors');
let OneTextMesh, TwoTextMesh, ThreeTextMesh, FourTextMesh = "";

class DuringScreen {
  constructor() {
    const loader = new THREE.FontLoader();

    loader.load('assets/fonts/Open_Sans_Regular.json', function(font) {

      let TextMaterial = new THREE.MeshBasicMaterial({color: Colors.black, transparent: true, opacity: 0.5});
      let text = `SABOTEER`;
      let TextGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 3,
        height: 1,
        curveSegments: 20
      });
      TextGeometry.computeBoundingBox();

      OneTextMesh = new THREE.Mesh(TextGeometry, TextMaterial);
      OneTextMesh.position.x = 5;
      OneTextMesh.position.z = -30;
      OneTextMesh.position.y = 45;

      OneTextMesh.rotation.x = -1.6;
      OneTextMesh.rotation.z = -1.55;

      TwoTextMesh = new THREE.Mesh(TextGeometry, TextMaterial);
      TwoTextMesh.position.x = 5;
      TwoTextMesh.position.z = 15;
      TwoTextMesh.position.y = 45;

      TwoTextMesh.rotation.x = -1.6;
      TwoTextMesh.rotation.z = -1.55;

      ThreeTextMesh = new THREE.Mesh(TextGeometry, TextMaterial);
      ThreeTextMesh.position.x = 155;
      ThreeTextMesh.position.z = -10;
      ThreeTextMesh.position.y = 45;

      ThreeTextMesh.rotation.x = -1.6;
      ThreeTextMesh.rotation.z = 1.55;

      FourTextMesh = new THREE.Mesh(TextGeometry, TextMaterial);
      FourTextMesh.position.x = 155;
      FourTextMesh.position.z = 35;
      FourTextMesh.position.y = 45;

      FourTextMesh.rotation.x = -1.6;
      FourTextMesh.rotation.z = 1.55;

      scene.add(OneTextMesh, TwoTextMesh, ThreeTextMesh, FourTextMesh);
    });
  }

  hide() {
    OneTextMesh.visble = false;
    TwoTextMesh.visble = false;
    ThreeTextMesh.visble = false;
    FourTextMesh.visble = false;
  }


}

module.exports = DuringScreen;
