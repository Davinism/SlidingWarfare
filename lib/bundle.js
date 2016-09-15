/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(10);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementById("sliding-warfare");
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	
	  const newGame = new GameView(ctx);
	  window.gameView = newGame;
	  newGame.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Shooter = __webpack_require__(2);
	const Wall = __webpack_require__(7);
	const Bullet = __webpack_require__(6);
	const Base = __webpack_require__(8);
	const TerrainOne = __webpack_require__(9);
	
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
	    const shooter1 = new Shooter({pos: [100, 300], vel:[0, 0], game: this, rotation: 0, selected: true});
	    const shooter2 = new Shooter({pos: [150, 200], vel:[0, 0], game: this, rotation: 0});
	    const shooter3 = new Shooter({pos: [150, 400], vel:[0, 0], game: this, rotation: 0});
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
	
	}
	
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.NUM_SHOOTERS = 1;
	Game.NUM_WALLS = 8;
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const SlidingObject = __webpack_require__(3);
	const RigidObject = __webpack_require__(5);
	const Util = __webpack_require__(4);
	const Bullet = __webpack_require__(6);
	
	const NORMAL_FRAME_TIME_DELTA = 1000 / 60;
	
	class Shooter extends SlidingObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	
	    this.theta = Math.atan(this.vel[0] / this.vel[1]);
	    this.rotation = options.rotation;
	    this.selected = options.selected;
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.selected ? "#FEF900" : this.color;
	
	    ctx.beginPath();
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	    ctx.moveTo(this.pos[0], this.pos[1]);
	    ctx.lineTo(
	      this.pos[0] + this.radius * Math.cos(this.rotation),
	      this.pos[1] + this.radius * Math.sin(this.rotation)
	    );
	    ctx.stroke();
	
	  }
	
	  fire() {
	    const norm = [Math.cos(this.rotation), Math.sin(this.rotation)];
	
	    const bulletVel = [
	      this.vel[0] + Bullet.SPEED * Math.cos(this.rotation),
	      this.vel[1] + Bullet.SPEED * Math.sin(this.rotation)
	    ];
	
	    const bullet = new Bullet({
	      pos: this.pos,
	      vel: bulletVel,
	      game: this.game
	    });
	
	    this.game.addBullet(bullet);
	  }
	
	  power(impulse) {
	    this.vel[0] += impulse[0];
	    this.vel[1] += impulse[1];
	  }
	
	  spin(jolt) {
	    if (this.rotation + jolt > 2 * Math.PI) {
	      this.rotation = this.rotation + jolt - (2 * Math.PI);
	    } else if (this.rotation + jolt < 0) {
	      this.rotation = (2 * Math.PI) + this.rotation + jolt;
	    } else {
	      this.rotation = this.rotation + jolt;
	    }
	  }
	
	  collideWithSlidingObject(slidingObject) {
	    if (slidingObject instanceof Bullet) {
	      this.game.remove(this);
	    } else if (slidingObject instanceof Shooter) {
	      const initialVel = [slidingObject.vel[0], slidingObject.vel[1]];
	      slidingObject.vel = [
	        slidingObject.vel[0] * -1,
	        slidingObject.vel[1] * -1
	      ];
	      window.setTimeout(() => {
	        this.vel = [initialVel[0], initialVel[1]];
	      }, 10);
	    }
	  }
	
	  collideWithObject(object) {
	    if (object instanceof SlidingObject) {
	      this.collideWithSlidingObject(object);
	    } else if (object instanceof RigidObject) {
	      this.collideWithRigidObject(object);
	    }
	  }
	}
	
	Shooter.COLOR = "#FF00BF";
	Shooter.RADIUS = 15;
	Shooter.VEL = 10;
	
	const defaultOptions = {
	  color: Shooter.COLOR,
	  radius: Shooter.RADIUS,
	  vel: Util.randomVec(Shooter.VEL),
	  rotation: 0,
	  selected: false
	};
	
	module.exports = Shooter;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(4);
	const RigidObject = __webpack_require__(5);
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	const FRICTIONAL_CONSTANT = 0.015;
	
	class SlidingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.color = options.color;
	    this.game = options.game;
	    this.vel = options.vel;
	    this.radius = options.radius;
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	
	    ctx.beginPath();
	    ctx.arc(
	      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	    );
	    ctx.fill();
	
	  }
	
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
	
	  checkOutOfBounds(pos) {
	    if ((pos[0] - this.radius) <= 0 ){
	       return {coord: "X", low: true};
	
	     } else if ((pos[0] + this.radius) >= this.game.dimX()){
	       return {coord: "X", low: false};
	
	     } else if ((pos[1] - this.radius) <= 0){
	       return {coord: "Y", low: true};
	
	     } else if ((pos[1] + this.radius) >= this.game.dimY()) {
	       return {coord: "Y", low: false};
	
	     }
	  }
	
	  handleBoundaries(pos) {
	    let outOfBounds = this.checkOutOfBounds(pos);
	
	    if (outOfBounds) {
	      if (outOfBounds.coord === "X") {
	        if (outOfBounds.low) {
	          this.vel[0] = this.vel[0] < 0 ? this.vel[0] * -1 : this.vel[0];
	        } else {
	          this.vel[0] = this.vel[0] > 0 ? this.vel[0] * -1 : this.vel[0];
	        }
	      } else if (outOfBounds.coord === "Y") {
	        if (outOfBounds.low) {
	          this.vel[1] = this.vel[1] < 0 ? this.vel[1] * -1 : this.vel[1];
	        } else {
	          this.vel[1] = this.vel[1] > 0 ? this.vel[1] * -1 : this.vel[1];
	        }
	      }
	    }
	  }
	
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
	
	  collideWithRigidObject(rigidObject) {
	    let half = { x: rigidObject.width / 2, y: rigidObject.height / 2 };
	    let center = {
	      x: this.pos[0] - (rigidObject.pos[0] + half.x),
	      y: this.pos[1] - (rigidObject.pos[1] + half.y)
	    };
	
	    let side = {
	      x: Math.abs(center.x) - half.x,
	      y: Math.abs(center.y) - half.y
	    };
	
	    if (side.x < 0 || side.y < 0) {
	
	      if (Math.abs(side.x) < this.radius && side.y < 0) {
	        this.vel[0] = this.vel[0] * -1;
	        return null;
	      }
	      if (Math.abs(side.y) < this.radius && side.x < 0) {
	        this.vel[1] = this.vel[1] * -1;
	        return null;
	      }
	    }
	
	    let bounce = side.x * side.x + side.y * side.y < this.radius * this.radius;
	
	    if (bounce) {
	
	      // if (Math.abs(this.theta) < Math.PI / 4 + 0.001 && Math.abs(this.theta) > Math.PI / 4 - 0.001) {
	      //   this.vel = [this.vel[0] * -1, this.vel[1] * -1];
	      // } else {
	        // let magnitude = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));
	        // let angle = Math.PI / 2 - Math.abs(this.theta);
	        //
	        // let xSign = 0, ySign = 0;
	        //
	        // if (this.vel[0] < 0) {
	        //   xSign = -1;
	        // } else if (this.vel[0] > 0) {
	        //   xSign = 1;
	        // }
	        //
	        // if (this.vel[1] < 0) {
	        //   ySign = -1;
	        // } else if (this.vel[1] > 0) {
	        //   ySign = 1;
	        // }
	        //
	        // this.vel = [xSign * magnitude * Math.sin(angle), ySign * magnitude * Math.cos(angle)];
	        // this.theta = Math.atan(this.vel[0] / this.vel[1]);
	      // }
	      // let norm = Math.sqrt(side.x * side.x + side.y * side.y);
	      this.vel = [this.vel[0] * -1, this.vel[1] * -1];
	      return null;
	    }
	  }
	
	  isCollidedWithSlidingObject(slidingObject) {
	    const centerDist = Util.dist(this.pos, slidingObject.pos);
	    return centerDist < (this.radius + slidingObject.radius);
	  }
	
	  isCollidedWithObject(object) {
	    if (object instanceof SlidingObject) {
	      return this.isCollidedWithSlidingObject(object);
	    } else if (object instanceof RigidObject) {
	      return this.isCollidedWithRigidObject(object);
	    }
	  }
	
	}
	
	module.exports = SlidingObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Util = {
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  randomVec (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	
	  dir (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  }
	};
	
	module.exports = Util;


/***/ },
/* 5 */
/***/ function(module, exports) {

	class RigidObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.color = options.color;
	    this.game = options.game;
	    this.height = options.height;
	    this.width = options.width;
	
	    this.draw = this.draw.bind(this);
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	    ctx.fillRect(this.pos[0], this.pos[1], this.width, this.height);
	  }
	}
	
	module.exports = RigidObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const SlidingObject = __webpack_require__(3);
	const RigidObject = __webpack_require__(5);
	const Util = __webpack_require__(4);
	const Shooter = __webpack_require__(2);
	const Wall = __webpack_require__(7);
	const Base = __webpack_require__(8);
	
	class Bullet extends SlidingObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	  }
	
	  collideWithRigidObject(rigidObject) {
	    this.game.remove(this);
	    if (rigidObject instanceof Base) {
	      alert("BASE COMPROMISED!");
	    }
	  }
	
	  collideWithSlidingObject(slidingObject) {
	      this.game.remove(slidingObject);
	      this.game.remove(this);
	  }
	
	  handleBoundaries(pos) {
	    let outOfBounds = this.checkOutOfBounds(pos);
	
	    if (outOfBounds) {
	      this.game.remove(this);
	    }
	  }
	
	  collideWithObject(object) {
	    if (object instanceof SlidingObject) {
	      this.collideWithSlidingObject(object);
	    } else if (object instanceof RigidObject) {
	      this.collideWithRigidObject(object);
	    }
	  }
	}
	
	Bullet.COLOR = "#000";
	Bullet.RADIUS = 5;
	Bullet.SPEED = 20;
	
	const defaultOptions = {
	  color: Bullet.COLOR,
	  radius: Bullet.RADIUS
	};
	
	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const RigidObject = __webpack_require__(5);
	
	class Wall extends RigidObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	  }
	}
	
	Wall.COLOR = "#CCC";
	Wall.HEIGHT = 50;
	Wall.WIDTH = 50;
	
	const defaultOptions = {
	  color: Wall.COLOR,
	  height: Wall.HEIGHT,
	  width: Wall.WIDTH
	};
	
	module.exports = Wall;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const RigidObject = __webpack_require__(5);
	
	class Base extends RigidObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	  }
	}
	
	Base.HEIGHT = 50;
	Base.WIDTH = 50;
	
	const defaultOptions = {
	  height: Base.HEIGHT,
	  width: Base.WIDTH
	};
	
	module.exports = Base;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Wall = __webpack_require__(7);
	
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map