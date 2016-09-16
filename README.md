# [Sliding Warfare][link]
[link]: https://davinism.github.io/SlidingWarfare/

A browser-based two-player JavaScript game inspired by Laser Tag and developed with the use of HTML5 Canvas and jQuery libraries.

![Gameplay GIF](docs/sliding_warfare.gif)

## Objective

Each player's objective is to take out all of the other player's shooters or to take out the other player's base, all while protecting his or her own base and shooters from the opponent.

## Gameplay

Players take turns controlling the field, and on each turn, a player is given 3 actions. Once all 3 actions are used up, the other player will then take their turn. On each turn, players may do any of the following:

Translational Movement: W, A, S, D, or the Arrow Keys
Fire a bullet: Space bar
Rotational Movement: E (clockwise) and Q (counter-clockwise)
Select another shooter (toggle): R

Of the above, translational movements and firing a bullet take up an action per keypress. Players may rotate and toggle between shooters as often as they wish within their turn. Note that this means that the player may potentially move multiple shooters within their turn.

## Implementation Details

#### Velocity and Positional Calculations of Moving Objects with Friction

Calculating where to place moving objects in the next animation frame was done by storing velocity and position vectors for each moving object. The velocity will simply add a value to the current position vectors, depending on how much time has passed between animation frames, which allows for a much smoother and realistic rendering of objects in motion. Furthermore, an added layer of difficulty and realism was added by incorporating a frictional component, which simply decreased the velocity vector components on each animation.

```javascript
adjustXVelocity(velComponent) {
  if (velComponent > 0 && velComponent > FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta))) {
    return velComponent - (FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta)));
  } else if (velComponent < 0 && velComponent < -1 * FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta))) {
    return velComponent + (FRICTIONAL_CONSTANT * Math.abs(Math.sin(this.theta)));
  } else {
    return 0;
  }
}

adjustYVelocity(velComponent) {
  if (velComponent > 0 && velComponent > FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta))) {
    return velComponent - (FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta)));
  } else if (velComponent < 0 && velComponent < -1 * FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta))) {
    return velComponent + (FRICTIONAL_CONSTANT * Math.abs(Math.cos(this.theta)));
  } else {
    return 0;
  }
}

move(timeDelta) {
  this.handleBoundaries(this.pos);

  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
  const offsetX = this.vel[0] * velocityScale;
  const offsetY = this.vel[1] * velocityScale;

  this.theta = Math.atan(this.vel[0] / this.vel[1]);

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
  this.vel = [this.adjustXVelocity(this.vel[0]), this.adjustYVelocity(this.vel[1])];
}
```

#### Collision Detection Implementation

Instead of using a pre-existing physics library for this project, I implemented a collision detection feature from scratch. Collision detections between two circular objects(i.e. a shooter and a bullet) where fairly straight-forward, as I simply compared the distance between the two objects' center and the sum of their radii. The more challenging part came with detecting collisions between a rectangular object and a circular one. A couple cases needed to be tested for this:

1) Is the distance between the circular object's center and the rectangular object's center greater than either the sum of the radius plus half of the width or the radius plus half of the height?

2) Is the circle's center on a line that connects the rectangle's center and one of its corners?

The following snippet was used to detect the collisions between circular and rectangular objects:

```javascript
isCollidedWithRigidObject(rigidObject) {
  let half = { x: rigidObject.width / 2, y: rigidObject.height / 2 };
  let center = {
    x: this.pos[0] - (rigidObject.pos[0] + half.x),
    y: this.pos[1] - (rigidObject.pos[1] + half.y)
  };

  let side = {
    x: Math.abs(center.x) - half.x,
    y: Math.abs(center.y) - half.y
  };

  if (side.x > this.radius || side.y > this.radius) {
    return false;
  }
  if (side.x < 0 || side.y < 0) {
    return true;
  }

  return (side.x * side.x + side.y * side.y) < (this.radius * this.radius);
}
```

#### Toggling between shooters

Players can choose which of their shooters they want to move by toggling between them. This means that the game must store information on who the current player is and which shooters they have.

```javascript
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
}
```

In order to know which shooter of the current player is selected, I simply let the first element in that player's "shooters" array be the current shooter, and whenever the player toggles the selection, I simply rotate the shooters array:

```javascript
rotate() {
  const currentShooters = this.state[this.state.currentPlayer].shooters;
  this.state[this.state.currentPlayer].shooters = currentShooters.slice(1).concat(currentShooters[0]);
}
```

## Future Plans

#### Velocity Adjustment

Currently, all shooters are only given one impulse value when moving. I'd like to include an option for the players to choose just how much impulse to give to a shooter when moving, possibly including a slider to aid with this feature.

#### Terrain Selection

I would also like to include more terrains for players to play on to keep games from becoming stale.

#### Health

As of right now, bases take just one hit to take out. I may include a health feature for bases if taking them out becomes too easy.
