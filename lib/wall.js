const RigidObject = require('./rigid_object.js');

class Wall extends RigidObject {
  constructor(options) {
    super(options);
  }
}

module.exports = Wall;
