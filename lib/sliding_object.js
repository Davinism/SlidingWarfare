const Util = require('./util');
const RigidObject = require('./rigid_object');

const NORMAL_FRAME_TIME_DELTA = 1000/60;
const FRICTIONAL_CONSTANT = 0.015;

class SlidingObject {
  constructor(options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
    this.vel = options.vel;
    this.radius = options.radius;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();

  }

  adjustXVelocity(velComponent) {
    if (velComponent > 0 && velComponent > FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta))) {
      return velComponent - (FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta)));
    } else if (velComponent < 0 && velComponent < -1 * FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta))) {
      return velComponent + (FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta)));
    } else {
      return 0;
    }
  }

  adjustYVelocity(velComponent) {
    if (velComponent > 0 && velComponent > FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta))) {
      return velComponent - (FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta)));
    } else if (velComponent < 0 && velComponent < -1 * FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta))) {
      return velComponent + (FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta)));
    } else {
      return 0;
    }
  }

  move(timeDelta) {
    this.handleBoundaries(this.pos);

    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;

    this.theta = Math.atan(this.vel[0] / this.vel[1]);

    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
    this.vel = [this.adjustXVelocity(this.vel[0]), this.adjustYVelocity(this.vel[1])];
  }

  checkOutOfBounds(pos) {
    if ((pos[0] - this.radius) <= 0 ){
       return {coord: "X", low: true};

     } else if ((pos[0] + this.radius) >= this.game.dimX()){
       return {coord: "X", low: false};

     } else if ((pos[1] - this.radius) <= 0){
       return {coord: "Y", low: true};

     } else if ((pos[1] + this.radius) >= this.game.dimY()) {
       return {coord: "Y", low: false};

     }
  }

  handleBoundaries(pos) {
    let outOfBounds = this.checkOutOfBounds(pos);

    if (outOfBounds) {
      if (outOfBounds.coord === "X") {
        if (outOfBounds.low) {
          this.vel[0] = this.vel[0] < 0 ? this.vel[0] * -1 : this.vel[0];
        } else {
          this.vel[0] = this.vel[0] > 0 ? this.vel[0] * -1 : this.vel[0];
        }
      } else if (outOfBounds.coord === "Y") {
        if (outOfBounds.low) {
          this.vel[1] = this.vel[1] < 0 ? this.vel[1] * -1 : this.vel[1];
        } else {
          this.vel[1] = this.vel[1] > 0 ? this.vel[1] * -1 : this.vel[1];
        }
      }
    }
  }

  isCollidedWithRigidObject(rigidObject) {
    let half = { x: rigidObject.width / 2, y: rigidObject.height / 2 };
    let center = {
      x: this.pos[0] - (rigidObject.pos[0] + half.x),
      y: this.pos[1] - (rigidObject.pos[1] + half.y)
    };

    let side = {
      x: Math.abs(center.x) - half.x,
      y: Math.abs(center.y) - half.y
    };

    if (side.x > this.radius || side.y > this.radius) {
      return false;
    }
    if (side.x < 0 || side.y < 0) {
      return true;
    }

    return (side.x * side.x + side.y * side.y) < (this.radius * this.radius);
  }

  collideWithRigidObject(rigidObject) {
    let half = { x: rigidObject.width / 2, y: rigidObject.height / 2 };
    let center = {
      x: this.pos[0] - (rigidObject.pos[0] + half.x),
      y: this.pos[1] - (rigidObject.pos[1] + half.y)
    };

    let side = {
      x: Math.abs(center.x) - half.x,
      y: Math.abs(center.y) - half.y
    };

    if (side.x < 0 || side.y < 0) {

      if (Math.abs(side.x) < this.radius && side.y < 0) {
        this.vel[0] = this.vel[0] * -1;
        return null;
      }
      if (Math.abs(side.y) < this.radius && side.x < 0) {
        this.vel[1] = this.vel[1] * -1;
        return null;
      }
    }

    let bounce = side.x * side.x + side.y * side.y < this.radius * this.radius;

    if (bounce) {

      // if (Math.abs(this.theta) < Math.PI / 4 + 0.001 && Math.abs(this.theta) > Math.PI / 4 - 0.001) {
      //   this.vel = [this.vel[0] * -1, this.vel[1] * -1];
      // } else {
        // let magnitude = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
        // let angle = Math.PI / 2 - Math.abs(this.theta);
        //
        // let xSign = 0, ySign = 0;
        //
        // if (this.vel[0] < 0) {
        //   xSign = -1;
        // } else if (this.vel[0] > 0) {
        //   xSign = 1;
        // }
        //
        // if (this.vel[1] < 0) {
        //   ySign = -1;
        // } else if (this.vel[1] > 0) {
        //   ySign = 1;
        // }
        //
        // this.vel = [xSign * magnitude * Math.sin(angle), ySign * magnitude * Math.cos(angle)];
        // this.theta = Math.atan(this.vel[0] / this.vel[1]);
      // }
      // let norm = Math.sqrt(side.x * side.x + side.y * side.y);
      this.vel = [this.vel[0] * -1, this.vel[1] * -1];
      return null;
    }
  }

  isCollidedWithSlidingObject(slidingObject) {
    const centerDist = Util.dist(this.pos, slidingObject.pos);
    return centerDist < (this.radius + slidingObject.radius);
  }

  isCollidedWithObject(object) {
    if (object instanceof SlidingObject) {
      return this.isCollidedWithSlidingObject(object);
    } else if (object instanceof RigidObject) {
      return this.isCollidedWithRigidObject(object);
    }
  }

}

module.exports = SlidingObject;
