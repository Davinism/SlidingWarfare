const SlidingObject = require('./sliding_object');
const Util = require('./util');



class Shooter extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }

  fire() {

  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
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
