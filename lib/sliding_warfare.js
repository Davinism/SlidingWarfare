const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementById("sliding-warfare");

  const ctx = canvasEl.getContext("2d");

  const newGame = new GameView(ctx);
  newGame.start();
});
