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
    let $body = $('body');

    const playerNumber = this.currentPlayer === "firstPlayer" ? "Player 1" : "Player 2";

    let $currentPlayer = $(`<h2 class="player-number" style="color:${this.shooter.color}">${playerNumber}'s Turn! ${3 - this.actionCount} Actions Left!<h2>`);
    $body.append($currentPlayer);

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
    });
  }

  unbindKeys() {
    key.unbind('w');
    key.unbind('a');
    key.unbind('s');
    key.unbind('d');
    key.unbind('up');
    key.unbind('left');
    key.unbind('down');
    key.unbind('right');
    key.unbind('e');
    key.unbind('q');
    key.unbind('r');
    key.unbind('space');
  }

  animate(time) {
    if (this.actionCount >= 3) {
      this.unbindKeys();

      window.setTimeout(() => {
        this.bindKeyHandlers();
      }, 1500);

      if (this.game.state.currentPlayer === "firstPlayer") {
        this.game.state.currentPlayer = "secondPlayer";
      } else if (this.game.state.currentPlayer === "secondPlayer") {
        this.game.state.currentPlayer = "firstPlayer";
      }
      this.currentPlayer = this.game.state.currentPlayer;
      this.shooter.selected = false;
      this.actionCount = 0;
    }


    const playerNumber = this.currentPlayer === "firstPlayer" ? "Player 1" : "Player 2";

    $('h2').remove();
    $('body').append(`<h2 class="player-number" style="color:${this.game.state[this.currentPlayer].shooters[0].color}">${playerNumber}'s Turn! ${3 - this.actionCount} Actions Left!</h2>`);
    this.shooter = this.game.state[this.currentPlayer].shooters[0];
    this.shooter.selected = true;

    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);

    this.game.draw(this.ctx);
    this.lastTime = time;
    if (this.game.gameOver().status) {
      $('h2').remove();
      $('body').append(`<h2 class="player-number" style="color:${this.game.state[this.currentPlayer].shooters[0].color}">${this.game.gameOver().winner} Wins!</h2>`);
      this.unbindKeys();
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "w": [ 0, -2],
  "a": [-2,  0],
  "s": [ 0,  2],
  "d": [ 2,  0],
  "up": [ 0, -2],
  "left": [-2,  0],
  "down": [ 0,  2],
  "right": [ 2,  0]
};

module.exports = GameView;
