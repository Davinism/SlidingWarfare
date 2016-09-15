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

    this.addShooters();
    this.addWalls();
    this.addBases();
  }

  addShooters() {
      this.shooters.push(
        new Shooter({pos: [100, 300], vel:[0, 0], game: this, rotation: 0}),
        new Shooter({pos: [150, 200], vel:[0, 0], game: this, rotation: 0}),
        new Shooter({pos: [150, 400], vel:[0, 0], game: this, rotation: 0}),
        new Shooter({pos: [900, 300], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI}),
        new Shooter({pos: [850, 200], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI}),
        new Shooter({pos: [850, 400], vel:[0, 0], game: this, color: "#4891C0", rotation: Math.PI})
      );
  }

  addWalls() {
    this.walls = TerrainOne(this);
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  addBases() {
    this.bases.push(
      new Base({pos: [0, 275], color: "#FF00BF", game: this}),
      new Base({pos: [950, 275], color: "#4891C0", game: this})
    );
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

Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.NUM_SHOOTERS = 1;
Game.NUM_WALLS = 8;

module.exports = Game;
