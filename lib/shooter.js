const SlidingObject = require('./sliding_object');
const Util = require('./util');



class Shooter extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));
  }

  fire() {

  }
}

Shooter.COLOR = "#FF00BF";
Shooter.RADIUS = 15;
Shooter.VEL = 2;

const defaultOptions = {
  color: Shooter.COLOR,
  radius: Shooter.RADIUS,
  vel: Util.randomVec(Shooter.VEL)
};

module.exports = Shooter;
