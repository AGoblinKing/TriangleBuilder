import BABYLON from 'babylonjs';
import keycode from 'keycode';
import Behavioral from './lib/behavioral';
import FollowCursor from './behavior/followcursor';

class App {
  constructor(canvas) {
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.cam = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), this.scene);
    this.cam.setTarget(BABYLON.Vector3.Zero());
    this.cam.attachControl(canvas, false);
    // this.cam.applyGravity = true;

    this.scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());
    this.createScene();
    this.engine.runRenderLoop(this.update.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  createScene() {
    // weird huh? they add a ref to scene auto
    const pointer = BABYLON.Mesh.CreateSphere('pointer1', 16, 0.5, this.scene);
    pointer.material = new BABYLON.StandardMaterial('pointermat', this.scene);
    pointer.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

    Behavioral(pointer).addBehaviors(new FollowCursor());
    this.scene.workerCollisions = true;
    this.scene.collisionsEnabled = true;
    this.cam.checkCollisions = true;
    this.cam.keysUp.push(keycode('w'));
    this.cam.keysDown.push(keycode('s'));
    this.cam.keysLeft.push(keycode('a'));
    this.cam.keysRight.push(keycode('d'));
    this.cam.ellipsoid = new BABYLON.Vector3(1, 1, 1);
    // Creation of a triangular lines mesh
    const myLines = BABYLON.Mesh.CreateLines('itsName', [
      new BABYLON.Vector3(-5, 5, 5),
      new BABYLON.Vector3(5, 5, 5),
      new BABYLON.Vector3(0, 5, -5),
      new BABYLON.Vector3(-5, 5, 5)
    ], this.scene);

    // And here is how it is colored green...
    myLines.color = new BABYLON.Color3(0, 1, 0);
    // auto attaches.
    new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    /*
    const ground = BABYLON.Mesh.CreateGround('ground1', 1000, 1000, 2, this.scene);
    ground.checkCollisions = true; */
  }

  onResize() {
    this.engine.resize();
  }

  update(delta) {
    Behavioral.update(delta);
    this.scene.render();
  }
}

const app = new App(document.getElementById('renderTarget'));
