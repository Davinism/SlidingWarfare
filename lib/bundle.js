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

	const Game = __webpack_require__(2);
	const GameView = __webpack_require__(1);
	
	document.addEventListener("DOMContentLoaded", function() {
	  const canvasEl = document.getElementById("sliding-warfare");
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	
	  const newGame = new GameView(ctx);
	  newGame.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	
	class GameView {
	  constructor(ctx) {
	    this.game = new Game;
	    this.ctx = ctx;
	
	    this.shooterIndex = 0;
	    this.shooter = this.game.shooters[this.shooterIndex];
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
	      });
	    });
	
	    key('q', () => {
	      this.shooter.spin(Math.PI / 12);
	    });
	
	    key('e', () => {
	      this.shooter.spin(-1 * Math.PI / 12);
	    });
	
	    key('r', (shooter) => {
	      if (this.shooterIndex >= this.game.shooters.length - 1) {
	        this.shooterIndex = 0;
	      } else {
	        this.shooterIndex += 1;
	      }
	
	      this.shooter = this.game.shooters[this.shooterIndex];
	    });
	
	    key('space', () => {
	      this.shooter.fire();
	    });
	  }
	
	  animate(time) {
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Shooter = __webpack_require__(3);
	const Wall = __webpack_require__(6);
	const Bullet = __webpack_require__(8);
	
	class Game {
	  constructor() {
	    this.shooters = [];
	    this.walls = [];
	    this.bullets = [];
	
	    this.addShooters = this.addShooters.bind(this);
	
	    this.addShooters();
	    this.addWalls();
	  }
	
	  addShooters() {
	    // for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
	      this.shooters.push(new Shooter({pos: [300, 300], vel:[0, 0], game: this}));
	      this.shooters.push(new Shooter({pos: [100, 100], vel:[0, 0], game: this, color: "#00F"}));
	    // }
	  }
	
	  addWalls() {
	    for (let i = 0; i < Game.NUM_WALLS; i++) {
	      this.walls.push(
	        new Wall(
	          {pos: [(Game.DIM_X - Wall.WIDTH) * Math.random(),
	            (Game.DIM_Y - Wall.HEIGHT) * Math.random()],
	            game: this}
	        )
	        // new Wall({pos: [375, 375], game: this})
	      );
	    }
	  }
	
	  addBullet(bullet) {
	    this.bullets.push(bullet);
	  }
	
	  allObjects() {
	    return [].concat(this.shooters, this.walls, this.bullets);
	  }
	
	  allSlidingObjects() {
	    return [].concat(this.shooters, this.bullets);
	  }
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, 800, 800);
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
	
	Game.DIM_X = 800;
	Game.DIM_Y = 800;
	Game.NUM_SHOOTERS = 1;
	Game.NUM_WALLS = 8;
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const SlidingObject = __webpack_require__(4);
	const RigidObject = __webpack_require__(7);
	const Util = __webpack_require__(5);
	const Bullet = __webpack_require__(8);
	
	const NORMAL_FRAME_TIME_DELTA = 1000 / 60;
	
	class Shooter extends SlidingObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	
	    this.theta = Math.atan(this.vel[0] / this.vel[1]);
	    this.rotation = 0;
	  }
	
	  draw(ctx) {
	    ctx.fillStyle = this.color;
	
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
	
	    if (this.vel[0] === 0 && this.vel[1] === 0) {
	      return null;
	    }
	
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
	      // this.vel = [this.vel[0] * -1, this.vel[1] * -1];
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
	  vel: Util.randomVec(Shooter.VEL)
	};
	
	module.exports = Shooter;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(5);
	const RigidObject = __webpack_require__(7);
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	const FRICTIONAL_CONSTANT = 0.02;
	
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
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const RigidObject = __webpack_require__(7);
	
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const SlidingObject = __webpack_require__(4);
	const RigidObject = __webpack_require__(7);
	const Util = __webpack_require__(5);
	const Shooter = __webpack_require__(3);
	
	class Bullet extends SlidingObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	  }
	
	  collideWithRigidObject(rigidObject) {
	    this.game.remove(this);
	  }
	
	  collideWithSlidingObject(slidingObject) {
	    // if (slidingObject instanceof Shooter) {
	      this.game.remove(slidingObject);
	    // } else if (slidingObject instanceof Bullet){
	    //   this.game.remove(slidingObject);
	    //   this.game.remove(this);
	    // }
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map