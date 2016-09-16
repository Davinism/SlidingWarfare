const Shooter = require('./shooter');
const Wall = require('./wall');
const Bullet = require('./bullet');
const Base = require('./base');
const TerrainOne = require('./terrains/terrain_one');

class Game {
  constructor() {
    this.shooters = [];
    this.walls = [];
    this.bullets = [];
    this.bases = [];

    this.state = {
      currentPlayer: "firstPlayer",
      firstPlayer: {
        shooters:[],
        bases: []
      },
      secondPlayer: {
        shooters:[],
        bases: []
      }
    };

    this.addShooters();
    this.addWalls();
    this.addBases();
  }

  addShooters() {
    const shooter1 = new Shooter({pos: [100, 300], vel:[0, 0], game: this, color: "#FF00BF", rotation: 0, selected: true});
    const shooter2 = new Shooter({pos: [150, 200], vel:[0, 0], game: this, color: "#FF00BF", rotation: 0});
    const shooter3 = new Shooter({pos: [150, 400], vel:[0, 0], game: this, color: "#FF00BF", rotation: 0});
    const shooter4 = new Shooter({pos: [900, 300], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI});
    const shooter5 = new Shooter({pos: [850, 200], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI});
    const shooter6 = new Shooter({pos: [850, 400], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI});
    this.shooters.push(shooter1, shooter2, shooter3, shooter4, shooter5, shooter6);
    this.state.firstPlayer.shooters.push(shooter1, shooter2, shooter3);
    this.state.secondPlayer.shooters.push(shooter4, shooter5, shooter6);
  }

  addWalls() {
    this.walls = TerrainOne(this);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  addBases() {
    const base1 = new Base({pos: [0, 275], color: "#FF00BF", game: this});
    const base2 = new Base({pos: [950, 275], color: "#4891C0", game: this});

    this.bases.push(base1, base2);
    this.state.firstPlayer.bases.push(base1);
    this.state.secondPlayer.bases.push(base2);
  }

  allObjects() {
    return [].concat(this.shooters, this.walls, this.bullets, this.bases);
  }

  allSlidingObjects() {
    return [].concat(this.shooters, this.bullets);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
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
      if (this.state.firstPlayer.shooters.indexOf(object) > -1) {
        this.state.firstPlayer.shooters.splice(this.state.firstPlayer.shooters.indexOf(object), 1);
      }

      if (this.state.secondPlayer.shooters.indexOf(object) > -1) {
        this.state.secondPlayer.shooters.splice(this.state.secondPlayer.shooters.indexOf(object), 1);
      }
    } else if (object instanceof Base) {
      this.bases.splice(this.bases.indexOf(object), 1);
      if (this.state.firstPlayer.bases.indexOf(object) > -1) {
        this.state.firstPlayer.bases.splice(this.state.firstPlayer.bases.indexOf(object), 1);
      }

      if (this.state.secondPlayer.bases.indexOf(object) > -1) {
        this.state.secondPlayer.bases.splice(this.state.secondPlayer.bases.indexOf(object), 1);
      }
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

  rotate() {
    const currentShooters = this.state[this.state.currentPlayer].shooters;
    this.state[this.state.currentPlayer].shooters = currentShooters.slice(1).concat(currentShooters[0]);
  }

  gameOver() {
    if (this.state.firstPlayer.shooters.length === 0 ||
      this.state.firstPlayer.bases.length === 0) {
      return { status: true, winner: "Player 2", color: this.state.secondPlayer.shooters[0].color};
    } else if (this.state.secondPlayer.shooters.length === 0 ||
      this.state.secondPlayer.bases.length === 0) {
      return { status: true, winner: "Player 1", color: this.state.firstPlayer.shooters[0].color};
    } else {
      return { status: false };
    }
  }

}

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_SHOOTERS = 1;
Game.NUM_WALLS = 8;

module.exports = Game;
