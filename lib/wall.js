const RigidObject = require('./rigid_object.js');

class Wall extends RigidObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }
}

Wall.COLOR = "#CCC";
Wall.HEIGHT = 50;
Wall.WIDTH = 50;

const defaultOptions = {
  color: Wall.COLOR,
  height: Wall.HEIGHT,
  width: Wall.WIDTH
};

module.exports = Wall;
