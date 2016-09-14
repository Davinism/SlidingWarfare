const SlidingObject = require('./sliding_object');
const Util = require('./util');

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

class Shooter extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));

    this.rotation = 0;
  }

  fire() {

  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

  rotate(timeDelta) {
    
  }

  // collideWithRigidObject(otherObject) {
  //
  // }
}

Shooter.COLOR = "#FF00BF";
Shooter.RADIUS = 15;
Shooter.VEL = 10;

const defaultOptions = {
  color: Shooter.COLOR,
  radius: Shooter.RADIUS,
  vel: Util.randomVec(Shooter.VEL)
};

module.exports = Shooter;
