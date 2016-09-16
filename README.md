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
