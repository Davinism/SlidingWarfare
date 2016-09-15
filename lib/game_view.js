const Game = require('./game');

class GameView {
  constructor(ctx) {
    this.game = new Game;
    this.ctx = ctx;
    this.actionCount = 0;

    this.currentPlayer = this.game.state.currentPlayer;
    this.shooter = this.game.state[this.currentPlayer].shooters[0];
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;

    requestAnimationFrame(this.animate.bind(this));
  }

  bindKeyHandlers() {

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => {
        this.shooter.power(move);
        this.actionCount += 1;
      });
    });

    key('e', () => {
      this.shooter.spin(Math.PI / 12);
    });

    key('q', () => {
      this.shooter.spin(-1 * Math.PI / 12);
    });

    key('r', (shooter) => {
      this.game.rotate();
      this.shooter.selected = false;
      this.shooter = this.game.state[this.currentPlayer].shooters[0];
      this.shooter.selected = true;
    });

    key('space', () => {
      this.shooter.fire();
      this.actionCount += 1;
      // if (this.game.state.currentPlayer === "firstPlayer") {
      //   this.game.state.currentPlayer = "secondPlayer";
      // } else if (this.game.state.currentPlayer === "secondPlayer") {
      //   this.game.state.currentPlayer = "firstPlayer";
      // }
      // this.currentPlayer = this.game.state.currentPlayer;
      // this.shooter.selected = false;
    });
  }

  animate(time) {
    if (this.actionCount >= 2) {
      if (this.game.state.currentPlayer === "firstPlayer") {
        this.game.state.currentPlayer = "secondPlayer";
      } else if (this.game.state.currentPlayer === "secondPlayer") {
        this.game.state.currentPlayer = "firstPlayer";
      }
      this.currentPlayer = this.game.state.currentPlayer;
      this.shooter.selected = false;
      this.actionCount = 0;
    }
    this.shooter = this.game.state[this.currentPlayer].shooters[0];
    this.shooter.selected = true;

    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);

    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "w": [ 0, -1],
  "a": [-1,  0],
  "s": [ 0,  1],
  "d": [ 1,  0],
  "up": [ 0, -1],
  "left": [-1,  0],
  "down": [ 0,  1],
  "right": [ 1,  0]
};

module.exports = GameView;
