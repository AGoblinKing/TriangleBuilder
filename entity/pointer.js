import BABYLON from 'babylonjs';
import Behavioral from '../lib/behavioral';
import FollowCursor from '../behavior/followcursor';

function Pointer(target) {
  Behavioral(target);
  target.addBehaviors(new FollowCursor());
  return target;
}

export default Pointer;
