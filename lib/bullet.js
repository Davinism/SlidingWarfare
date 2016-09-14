const SlidingObject = require('./sliding_object');
const Util = require('./util');

class Bullet extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }


}

Bullet.COLOR = "#000";
Bullet.RADIUS = 5;
Bullet.SPEED = 20;

const defaultOptions = {
  color: Bullet.COLOR,
  radius: Bullet.RADIUS
};

module.exports = Bullet;
