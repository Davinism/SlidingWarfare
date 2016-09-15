const SlidingObject = require('./sliding_object');
const RigidObject = require('./rigid_object');
const Util = require('./util');
const Bullet = require('./bullet');

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

class Shooter extends SlidingObject {
  constructor(options) {
    super(Object.assign(defaultOptions, options));

    this.theta = Math.atan(this.vel[0] / this.vel[1]);
    this.rotation = options.rotation;
    this.selected = options.selected;
  }

  draw(ctx) {
    ctx.fillStyle = this.selected ? "#FEF900" : this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
    ctx.moveTo(this.pos[0], this.pos[1]);
    ctx.lineTo(
      this.pos[0] + this.radius * Math.cos(this.rotation),
      this.pos[1] + this.radius * Math.sin(this.rotation)
    );
    ctx.stroke();

  }

  fire() {
    const norm = [Math.cos(this.rotation), Math.sin(this.rotation)];

    const bulletVel = [
      this.vel[0] + Bullet.SPEED * Math.cos(this.rotation),
      this.vel[1] + Bullet.SPEED * Math.sin(this.rotation)
    ];

    const bullet = new Bullet({
      pos: this.pos,
      vel: bulletVel,
      game: this.game
    });

    this.game.addBullet(bullet);
  }

  power(impulse) {
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  }

  spin(jolt) {
    if (this.rotation + jolt > 2 * Math.PI) {
      this.rotation = this.rotation + jolt - (2 * Math.PI);
    } else if (this.rotation + jolt < 0) {
      this.rotation = (2 * Math.PI) + this.rotation + jolt;
    } else {
      this.rotation = this.rotation + jolt;
    }
  }

  collideWithSlidingObject(slidingObject) {
    if (slidingObject instanceof Bullet) {
      this.game.remove(this);
    } else if (slidingObject instanceof Shooter) {
      const initialVel = [slidingObject.vel[0], slidingObject.vel[1]];
      slidingObject.vel = [
        slidingObject.vel[0] * -1,
        slidingObject.vel[1] * -1
      ];
      window.setTimeout(() => {
        this.vel = [initialVel[0], initialVel[1]];
      }, 10);
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

Shooter.COLOR = "#FF00BF";
Shooter.RADIUS = 15;
Shooter.VEL = 10;

const defaultOptions = {
  color: Shooter.COLOR,
  radius: Shooter.RADIUS,
  vel: Util.randomVec(Shooter.VEL),
  rotation: 0,
  selected: false
};

module.exports = Shooter;
