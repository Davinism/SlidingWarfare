const Shooter = require('./shooter');


class Game {
  constructor() {
    this.shooters = [];

    this.addShooters = this.addShooters.bind(this);

    this.addShooters();
  }

  addShooters() {
    for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
      this.shooters.push(new Shooter({pos: [400, 400], game: this}));
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, 800, 800);
    this.shooters.forEach( shooter => shooter.draw(ctx) );
  }

  moveObjects(delta) {
    this.shooters.forEach( shooter => shooter.move(delta) );
  }

  step(delta) {
    this.moveObjects(delta);
  }

  dimX() {
    return Game.DIM_X;
  }

  dimY() {
    return Game.DIM_Y;
  }
}

Game.DIM_X = 800;
Game.DIM_Y = 800;
Game.NUM_SHOOTERS = 1;

module.exports = Game;
