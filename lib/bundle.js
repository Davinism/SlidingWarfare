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
	  }
	
	  start() {
	    this.lastTime = 0;
	
	    requestAnimationFrame(this.animate.bind(this));
	  }
	
	  animate(time) {
	    const timeDelta = time - this.lastTime;
	
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx);
	    this.lastTime = time;
	
	    requestAnimationFrame(this.animate.bind(this));
	  }
	}
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Shooter = __webpack_require__(3);
	const Wall = __webpack_require__(6);
	
	
	class Game {
	  constructor() {
	    this.shooters = [];
	    this.walls = [];
	
	    this.addShooters = this.addShooters.bind(this);
	
	    this.addShooters();
	    this.addWalls();
	  }
	
	  addShooters() {
	    for (let i = 0; i < Game.NUM_SHOOTERS; i++) {
	      this.shooters.push(new Shooter({pos: [100, 100], game: this}));
	    }
	  }
	
	  addWalls() {
	    for (let i = 0; i < Game.NUM_WALLS; i++) {
	      this.walls.push(new Wall({pos: [375, 375], game: this}));
	    }
	  }
	
	  allObjects() {
	    return this.shooters.concat(this.walls);
	  }
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, 800, 800);
	    this.allObjects().forEach( object => object.draw(ctx) );
	  }
	
	  moveObjects(delta) {
	    this.shooters.forEach( shooter => shooter.move(delta) );
	  }
	
	  step(delta) {
	    this.moveObjects(delta);
	    this.checkCollisions();
	  }
	
	  dimX() {
	    return Game.DIM_X;
	  }
	
	  dimY() {
	    return Game.DIM_Y;
	  }
	
	  checkCollisions() {
	    for (let i = 0; i < this.walls.length; i++) {
	      if (this.shooters[0].isCollidedWithRigidObject(this.walls[i])) {
	        alert("Collision!");
	      }
	    }
	
	  }
	
	}
	
	Game.DIM_X = 800;
	Game.DIM_Y = 800;
	Game.NUM_SHOOTERS = 1;
	Game.NUM_WALLS = 1;
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const SlidingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	
	
	
	class Shooter extends SlidingObject {
	  constructor(options) {
	    super(Object.assign(defaultOptions, options));
	  }
	
	  fire() {
	
	  }
	}
	
	Shooter.COLOR = "#FF00BF";
	Shooter.RADIUS = 15;
	Shooter.VEL = 5;
	
	const defaultOptions = {
	  color: Shooter.COLOR,
	  radius: Shooter.RADIUS,
	  vel: Util.randomVec(Shooter.VEL)
	};
	
	module.exports = Shooter;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	const FRICTIONAL_CONSTANT = 0.01;
	
	class SlidingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.color = options.color;
	    this.game = options.game;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.theta = Math.atan(this.vel[0] / this.vel[1]);
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map