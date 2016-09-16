const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("sliding-warfare");
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const newGame = new GameView(ctx);

  const bodyEl = document.getElementsByTagName("body")[0];
  const gameTitleEl = document.getElementById("game-title-container");
  const gameEl = document.getElementById("canvas-container");

  const keyDownEvent = (event) => {
    if (event.key === "Enter") {
      bodyEl.removeEventListener("keydown", keyDownEvent);
      gameTitleEl.remove();
      newGame.start();
    }
  };

  bodyEl.addEventListener("keydown", keyDownEvent);
});
