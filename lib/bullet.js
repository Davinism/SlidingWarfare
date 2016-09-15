const SlidingObject = require('./sliding_object');
const RigidObject = require('./rigid_object');
const Util = require('./util');
const Shooter = require('./shooter');

class Bullet extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }

  collideWithRigidObject(rigidObject) {
    this.game.remove(this);
  }

  collideWithSlidingObject(slidingObject) {
    // if (slidingObject instanceof Shooter) {
      this.game.remove(slidingObject);
    // } else if (slidingObject instanceof Bullet){
    //   this.game.remove(slidingObject);
    //   this.game.remove(this);
    // }
  }

  handleBoundaries(pos) {
    let outOfBounds = this.checkOutOfBounds(pos);

    if (outOfBounds) {
      this.game.remove(this);
    }
  }

  collideWithObject(object) {
    if (object instanceof SlidingObject) {
      this.collideWithSlidingObject(object);
    } else if (object instanceof RigidObject) {
      this.collideWithRigidObject(object);
    }
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
