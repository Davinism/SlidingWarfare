const NORMAL_FRAME_TIME_DELTA = 1000/60;
const FRICTIONAL_CONSTANT = 0.01;

class SlidingObject {
  constructor(options) {
    this.pos = options.pos;
    this.color = options.color;
    this.game = options.game;
    this.vel = options.vel;
    this.radius = options.radius;
    this.theta = Math.atan(this.vel[0] / this.vel[1]);
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
    console.log(this.checkOutOfBounds(this.pos));

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

}

module.exports = SlidingObject;
