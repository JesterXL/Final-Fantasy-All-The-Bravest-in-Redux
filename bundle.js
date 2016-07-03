/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Application = undefined;

	var _GameLoop = __webpack_require__(1);

	var _GameLoop2 = _interopRequireDefault(_GameLoop);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Application = exports.Application = function Application() {
		_classCallCheck(this, Application);

		// var gameLoop = new GameLoop();
		// gameLoop.start();
		console.log("GameLoop:", _GameLoop2.default);
	};

	var app = new Application();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GameLoop = function () {
		function GameLoop() {
			_classCallCheck(this, GameLoop);
		}

		_createClass(GameLoop, [{
			key: "GameLoop",
			value: function GameLoop() {
				/*
	    _streamController = new StreamController<GameLoopEvent>(onPause: _onPause,
	      onResume: _onResume);
	      stream = _streamController.stream.asBroadcastStream();
	      mock = new WindowMock();
	      mock.start();
	      */

				this.lastTick = 0;
				this.running = false;
				this.resetDirty = false;
				this.pausedTime = false;
			}
		}, {
			key: "tick",
			value: function (_tick) {
				function tick() {
					return _tick.apply(this, arguments);
				}

				tick.toString = function () {
					return _tick.toString();
				};

				return tick;
			}(function () {
				if (running) {
					if (resetDirty) {
						lastTick = time;
					}

					if (pausedTime != 0) {
						var timeElapsed = new Date().valueOf() - pausedTime;
						lastTick -= timeElapsed;
						time -= timeElapsed;
						pausedTime = 0;
					}

					var difference = time - lastTick;
					lastTick = time;
					// _streamController.add(new GameLoopEvent(GameLoopEvent.TICK, time: difference));
					console.log("difference:", difference);
					window.requestAnimationFrame(tick);
				}
			})
		}, {
			key: "pause",
			value: function pause() {
				running = false;
				pausedTime = new Date().valueOf();
			}
		}, {
			key: "reset",
			value: function reset() {
				resetDirty = true;
				// _streamController.add(new GameLoopEvent(GameLoopEvent.RESET));
			}
		}, {
			key: "start",
			value: function start() {
				if (running === false) {
					running = true;
					request();
					// _streamController.add(new GameLoopEvent(GameLoopEvent.STARTED));
				}
			}
		}, {
			key: "request",
			value: function request() {
				window.requestAnimationFrame(tick);
			}
		}]);

		return GameLoop;
	}();

	exports.default = GameLoop;

/***/ }
/******/ ]);