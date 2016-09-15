const Wall = require('../wall');

const TerrainOne = (game) => {
  return ([
    new Wall({
      pos: [425, 275],
      game: game,
      width: 150,
      height: 50
    }),

    new Wall({
      pos: [475, 225],
      game: game,
      width: 50,
      height: 150
    }),

    new Wall({
      pos: [475, 0],
      game: game,
      width: 50,
      height: 50
    }),

    new Wall({
      pos: [475, 550],
      game: game,
      width: 50,
      height: 50
    }),

    new Wall({
      pos: [325, 50],
      game: game,
      width: 50,
      height: 150
    }),

    new Wall({
      pos: [325, 400],
      game: game,
      width: 50,
      height: 150
    }),

    new Wall({
      pos: [625, 50],
      game: game,
      width: 50,
      height: 150
    }),

    new Wall({
      pos: [625, 400],
      game: game,
      width: 50,
      height: 150
    }),

    new Wall({
      pos: [50, 50],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [50, 500],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [850, 50],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [850, 500],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [0, 225],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [0, 325],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [900, 225],
      game: game,
      width: 100,
      height: 50
    }),

    new Wall({
      pos: [900, 325],
      game: game,
      width: 100,
      height: 50
    })
  ]);
};

module.exports = TerrainOne;
