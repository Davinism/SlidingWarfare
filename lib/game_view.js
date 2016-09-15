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

    let $currentPlayer = $(`<h2 class="player-number" style="color:${this.shooter.color}">${playerNumber}'s Turn<h2>`);
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

  animate(time) {
    if (this.actionCount >= 3) {
      let playerNumber;
      if (this.game.state.currentPlayer === "firstPlayer") {
        this.game.state.currentPlayer = "secondPlayer";
        playerNumber = "Player 2";
      } else if (this.game.state.currentPlayer === "secondPlayer") {
        this.game.state.currentPlayer = "firstPlayer";
        playerNumber = "Player 1";
      }
      this.currentPlayer = this.game.state.currentPlayer;
      $('h2').remove();
      $('body').append(`<h2 class="player-number" style="color:${this.game.state[this.currentPlayer].shooters[0].color}">${playerNumber}'s Turn</h2>`);
      this.shooter.selected = false;
      this.actionCount = 0;
    }
    
    if (this.game.gameOver().status) {
      $('h2').remove();
      $('body').append(`<h2 class="player-number">${this.game.gameOver().winner} Wins!</h2>`);
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
