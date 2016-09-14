const Shooter = require('./shooter');
const Wall = require('./wall');


class Game {
  constructor() {
    this.shooters = [];
    this.walls = [];

    this.addShooters = this.addShooters.bind(this);

    this.addShooters();
    this.addWalls();
  }

  addShooters() {
    // for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
      this.shooters.push(new Shooter({pos: [300, 300], vel:[0, 0], game: this}));
      this.shooters.push(new Shooter({pos: [100, 100], vel:[0, 0], game: this}));
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

  allObjects() {
    return this.shooters.concat(this.walls);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, 800, 800);
    this.allObjects().forEach( object => object.draw(ctx) );
  }

  moveObjects(delta) {
    this.shooters.forEach( (shooter) => {
      shooter.move(delta);
      // shooter.rotate(delta);
    });
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  dimX() {
    return Game.DIM_X;
  }

  dimY() {
    return Game.DIM_Y;
  }

  checkCollisions() {
    for (let i = 0; i < this.walls.length; i++) {
      for (let j = 0; j < this.shooters.length; j++) {
        if (this.shooters[j].isCollidedWithRigidObject(this.walls[i])) {
          this.shooters[j].collideWithRigidObject(this.walls[i]);
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
