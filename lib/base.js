const RigidObject = require('./rigid_object.js');

class Base extends RigidObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }
}

Base.HEIGHT = 50;
Base.WIDTH = 50;

const defaultOptions = {
  height: Base.HEIGHT,
  width: Base.WIDTH
};

module.exports = Base;
