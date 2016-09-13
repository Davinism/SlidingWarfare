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
    for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
      this.shooters.push(new Shooter({pos: [300, 300], vel: [2, 2], game: this}));
    }
  }

  addWalls() {
    for (let i = 0; i < Game.NUM_WALLS; i++) {
      this.walls.push(
        // new Wall(
        //   {pos: [Game.DIM_X * Math.random(), Game.DIM_Y * Math.random()],
        //     game: this}
        // )
        new Wall({pos: [375, 375], game: this})
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
    this.shooters.forEach( shooter => shooter.move(delta) );
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
      if (this.shooters[0].isCollidedWithRigidObject(this.walls[i])) {
        this.shooters[0].collideWithRigidObject(this.walls[i]);
      }
    }

  }

}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_SHOOTERS = 1;
Game.NUM_WALLS = 1;

module.exports = Game;
