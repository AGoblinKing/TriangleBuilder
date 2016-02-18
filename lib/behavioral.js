const behaviors = [];

function Behavioral(obj) {
  if (obj.behaviors) {
    return obj;
  }

  obj.behaviors = [];
  obj.addBehaviors = (...behaviorArgs) => {
    behaviorArgs.forEach((behavior) => {
      behavior.entity = obj;
      behaviors.push(behavior);
      if (typeof behavior.added === 'function') {
        behavior.added(obj);
      }
    });
  };

  obj.removeBehaviors = (...behaviorArgs) => {
    behaviorArgs.forEach((behavior) => {
      behaviors.splice(behaviors.indexOf(behavior), 1);
      obj.behaviors.splice(obj.behaviors.indexOf(behavior), 1);
      if (typeof behavior.removed === 'function') {
        behavior.removed(obj);
      }
    });
  };

  return obj;
}

Behavioral.update = (delta) => {
  behaviors.forEach((behavior) => {
    if (typeof behavior.update === 'function') {
      behavior.update(delta);
    }
  });
};

export default Behavioral;
