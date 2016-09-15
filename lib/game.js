const Shooter = require('./shooter');
const Wall = require('./wall');
const Bullet = require('./bullet');

class Game {
  constructor() {
    this.shooters = [];
    this.walls = [];
    this.bullets = [];

    this.addShooters = this.addShooters.bind(this);

    this.addShooters();
    this.addWalls();
  }

  addShooters() {
    // for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
      this.shooters.push(new Shooter({pos: [300, 300], vel:[0, 0], game: this}));
      this.shooters.push(new Shooter({pos: [100, 100], vel:[0, 0], game: this, color: "#00F"}));
    // }
  }

  addWalls() {
    for (let i = 0; i < Game.NUM_WALLS; i++) {
      this.walls.push(
        new Wall(
          {pos: [(Game.DIM_X - Wall.WIDTH) * Math.random(),
            (Game.DIM_Y - Wall.HEIGHT) * Math.random()],
            game: this}
        )
        // new Wall({pos: [375, 375], game: this})
      );
    }
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  allObjects() {
    return [].concat(this.shooters, this.walls, this.bullets);
  }

  allSlidingObjects() {
    return [].concat(this.shooters, this.bullets);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, 800, 800);
    this.allObjects().forEach( object => object.draw(ctx) );
  }

  moveObjects(delta) {
    this.shooters.concat(this.bullets).forEach( (slidingObject) => {
      slidingObject.move(delta);
    });
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  remove(object) {
    if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof Shooter) {
      this.shooters.splice(this.shooters.indexOf(object), 1);
    }
  }

  dimX() {
    return Game.DIM_X;
  }

  dimY() {
    return Game.DIM_Y;
  }

  checkCollisions() {
    for (let i = 0; i < this.allObjects().length; i++) {
      for (let j = 0; j < this.allSlidingObjects().length; j++) {
        let skipIndex = this.allObjects().indexOf(this.allSlidingObjects()[j]);

        if (this.allSlidingObjects()[j].isCollidedWithObject(this.allObjects()[i]) && i !== skipIndex) {
          this.allSlidingObjects()[j].collideWithObject(this.allObjects()[i]);
        }
      }
    }

  }

}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_SHOOTERS = 1;
Game.NUM_WALLS = 8;

module.exports = Game;
