import BABYLON from 'babylonjs';
import keycode from 'keycode';

const wheelSpeed = 0.1;

let count = 0;
let material;

class FollowCursor {
  addVertex(position) {
    const vnum = this.vdata.positions.length / 3;

    this.vdata.positions.push(position.x, position.y, position.z);
    if (this.vdata.positions.length > 6) {
      this.vdata.indices.push(this.vMarkers[0].vindex, this.vMarkers[1].vindex, vnum);
      this.vdata.applyToMesh(this.mesh, false);
    }
  }

  added() {
    // eww should abstract this
    this.scene = this.entity.getScene();

    if (!material) {
      material = new BABYLON.StandardMaterial('redWireframeMaterial', this.scene);
      material.backFaceCulling = false;
      material.ambientColor = new BABYLON.Color3(1, 1, 1);
    }

    this.entity.parent = this.scene.activeCamera;
    this.entity.position = new BABYLON.Vector3(0, 0, 5);
    window.addEventListener('wheel', (evt) => {
      this.entity.position.z += evt.deltaY * wheelSpeed;
    });

    window.addEventListener('keydown', (evt) => {
      if (evt.keyCode === keycode('e')) {
        this.addVertex(this.entity.getAbsolutePosition());
      }
    });

    this.setupTrackingSpheres();
  }

  // oh hey lets try to find the closest vertixes
  update() {
    // this will suck for big meshes, but we can do it less
    const v3 = new BABYLON.Vector3();
    const distances = [];

    for (let i = 0; i < this.vdata.positions.length; i += 3) {
      v3.x = this.vdata.positions[i];
      v3.y = this.vdata.positions[i + 1];
      v3.z = this.vdata.positions[i + 2];
      distances.push({
        x: v3.x,
        y: v3.y,
        z: v3.z,
        i: i / 3,
        d: BABYLON.Vector3.Distance(v3, this.entity.getAbsolutePosition())
      });
    }

    distances.sort((a, b) => a.d - b.d);
    distances.slice(0, 2).forEach((vert, i) => {
      this.vMarkers[i].position.copyFromFloats(vert.x, vert.y, vert.z);
      this.vMarkers[i].vindex = vert.i;
    });
  }

  setupTrackingSpheres() {
    this.mesh = new BABYLON.Mesh('customMesh' + count, this.scene);
    this.mesh.material = material;
    this.vdata = new BABYLON.VertexData();
    this.vdata.positions = [];
    this.vdata.indices = [];

    this.vMarkers = [
      this.entity.clone(),
      this.entity.clone()
    ];

    // increase custom mesh marker
    count++;
  }
}

export default FollowCursor;
