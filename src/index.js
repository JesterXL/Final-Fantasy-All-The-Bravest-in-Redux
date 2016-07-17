import 'babel-polyfill';

import BattleTimer from "./com/jessewarden/ff6rx/battle/BattleTimer";
import BattleTimer2 from "./com/jessewarden/ff6rx/battle/BattleTimer2";
import TextDropper from './com/jessewarden/ff6rx/components/TextDropper';
import BattleTimerBar from "./com/jessewarden/ff6rx/components/BattleTimerBar";
import PIXI from 'pixi.js';
import {Subject} from 'rx';
import _ from "lodash";
import Row from "./com/jessewarden/ff6rx/enums/Row";
import Relic from "./com/jessewarden/ff6rx/items/Relic";
import Player from './com/jessewarden/ff6rx/battle/Player';
import Monster from './com/jessewarden/ff6rx/battle/Monster';

import { createStore, applyMiddleware } from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
// import './com/jessewarden/ff6rx/sagas/TestSagas';
// import './TestBattleTimers';
// import './TestBattleTimerBars';
import './TestInitiative';

export class Application
{

	initialize()
	{
		// this.canvasTag = document.getElementById('#stage');
		this.renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(this.renderer.view);
		this.stage = new PIXI.Container();
		this.stage.interactive = true;

		var style = {
		    font : 'bold italic 36px Arial',
		    fill : '#F7EDCA',
		    stroke : '#4a1850',
		    strokeThickness : 5,
		    dropShadow : true,
		    dropShadowColor : '#000000',
		    dropShadowAngle : Math.PI / 6,
		    dropShadowDistance : 6,
		    wordWrap : true,
		    wordWrapWidth : 440
		};

		var richText = new PIXI.Text('Rowan Boo & Sydney Boo',style);
		richText.x = 30;
		richText.y = 180;
		this.stage.addChild(richText);

		this.animate();

		//this.testGameLoop();
		// this.testBattleTimer();
		// this.testTextDropper();
		// this.testBattleTimerBar();
		// this.testRow();
		// this.testRelic();
		// this.testBattleTimer2();
		// this.testBattleTimerBar2();
		// this.testGameLoop2();
		// this.testMergeStreams();
		// this.tryingInitiative();

		//this.basicRedux();
		// this.reduxPlayerList();
		// this.sagaGameLoop();
		// this.testingBattleTimer2Generator();
	}

	animate()
	{
		var me = this;
		requestAnimationFrame(()=>
		{
			me.animate();
		});
		this.renderer.render(this.stage);
	}

	delayed(milliseconds, callback)
	{
		return new Promise((success, failure)=>
		{
			setTimeout(()=>
			{
				callback();
				success();
			}, milliseconds);
		});
	}

	testGameLoop()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.changes.subscribe((event)=>
		{
			console.log("event:", event);
		});
		this.gameLoop.start();
	}

	testGameLoop2()
	{
		var source = GameLoop2.start();
		var sub;
		this.delayed(3000, ()=>
		{
			sub = source.subscribe((result)=>
			{
				console.log("result:", result);
			});
		});

		this.delayed(6000, ()=>
		{
			sub.dispose();
			sub = undefined;
		});
		
	}

	testBattleTimer()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.start();

		this.timer = new BattleTimer(this.gameLoop.changes, BattleTimer.MODE_PLAYER);
		this.timer.start();
		this.timer.changes.subscribe((event)=>
		{
			console.log("event:", event);
		});

		var me = this;
		me.delayed(300, ()=>
		{
			me.gameLoop.pause();
		});

		me.delayed(1000, ()=>
		{
			me.gameLoop.start();
		});
	}

	periodicStream(milliseconds)
	{
		return Rx.Observable.interval(milliseconds);
	}

	testTextDropper()
	{
		this.gameLoop = new GameLoop();
		this.gameLoop.start();

		var textDropper = new TextDropper(this.stage, this.gameLoop.changes);

		this.periodicStream(10).subscribe(()=>
		{
			var num = Math.round(Math.random() * 9999);
			textDropper.addTextDrop({x: Math.random() * 800, y: Math.random() * 800, width: 100, height: 72}, num);
		});

		// new Stream.periodic(new Duration(seconds: 1), (_)
		// {
		// 	print("boom");
		// 	return new Random().nextInt(9999);
		// })
		// .listen((int value)
		// {
		// 	print("chaka");
		// 	textDropper.addTextDrop(spot1, value);
		// });
	}

	testBattleTimerBar()
	{
		var gameLoop = new GameLoop();
		gameLoop.start();

		var bar = new BattleTimerBar(gameLoop.changes);
		this.stage.addChild(bar.container);
		bar.container.x = 20;
		bar.container.y = 20;

		var gameLoop = new GameLoop();
		var timer = new BattleTimer(gameLoop.changes, BattleTimer.MODE_PLAYER);
		gameLoop.start();
		timer.start();
		timer.changes
		.where(e => e.type === "progress")
		.subscribe((event)=>
		{
			bar.percentage = event.percentage;
		});
	}

	testRow()
	{
		console.log("row front:", Row.FRONT);
	}

	testRelic()
	{
		var cow = new Relic();
		console.log("cow:", cow);
		console.log(cow instanceof Relic);
		console.log(!cow instanceof Relic);
	}

	testBattleTimer2()
	{
		console.log("testBattleTimer2");
		var gameLoop = GameLoop2.create();

		var tests = [];
		this.delayed(3000, ()=>
		{
			// var sub1 = gameLoop
			// .subscribe((r)=>
			// {
			// 	console.log("r1:", r);
			// });
			var sub1 = BattleTimer2.create(0, 0, 10, BattleTimer2.EFFECT_SLOW)
			.subscribe(undefined, undefined, ()=>
			{
				console.log("Timer 1 Done.");
			});
			var sub2 = BattleTimer2.create(0, 0, 100, BattleTimer2.EFFECT_NORMAL)
			.subscribe(undefined, undefined, ()=>
			{
				console.log("Timer 2 Done.");
			});
			var sub3 = BattleTimer2.create(0, 0, 500, BattleTimer2.EFFECT_HASTE)
			.subscribe(undefined, undefined, ()=>
			{
				console.log("Timer 3 Done.");
			});
			tests.push(sub1, sub2, sub3);
		});
		
		this.delayed(4000, ()=>
		{
			console.log("stopping.");
			_.forEach(tests, sub => sub.dispose());
		});
	}

	testBattleTimerBar2()
	{
		var bar = new BattleTimerBar(gameLoop.changes);
		this.stage.addChild(bar.container);
		bar.container.x = 20;
		bar.container.y = 20;

		var gameLoop = new GameLoop();
		var timer = new BattleTimer(gameLoop.changes, BattleTimer.MODE_PLAYER);
		gameLoop.start();
		timer.start();
		timer.changes
		.where(e => e.type === "progress")
		.subscribe((event)=>
		{
			bar.percentage = event.percentage;
		});
	}

	testMergeStreams()
	{
		var source = GameLoop2.start();
		var sub;
		this.delayed(3000, ()=>
		{
			sub = source2.subscribe((result)=>
			{
				console.log("result:", result);
			});
		});

		this.delayed(6000, ()=>
		{
			sub.dispose();
			sub = undefined;
		});
	}

	tryingInitiative()
	{
		function basicTimer()
		{
			var gameLoop = GameLoop2.create();
			var battleTimer = BattleTimer2.battleTimer();
			var sub = gameLoop
			.scan((acc, current)=>
			{
				var val = battleTimer.next();
				if(_.isNil(val.value))
				{
					val = battleTimer.next(current.delta);
				}
				return val.value.percentage;
			})
			.takeWhile((percentage)=>
			{
				return percentage !== 1;
			})
			.subscribe((percentage)=>
			{
				console.log("percentage:", percentage);
			},
			undefined,
			()=>
			{
				console.log("Done!");
			});
		}

		//basicTimer();

		function testingBattleTimerGeneration()
		{
			console.log("testingBattleTimerGeneration");
			
			var players = Rx.Observable.fromArray([
				new Player(),
				new Player(),
				new Player()
			]);

			var monsters = Rx.Observable.fromArray([
				new Monster(),
				new Monster(),
				new Monster()
			]);

			var participants = Rx.Observable.concat(players, monsters);
			var battleTimers = Rx.Observable.combineLatest(participants)
			.map((value, index, observable)=>
			{
				var character = value[0];
				return {
					character: character,
					battleTimer: BattleTimer2.battleTimer(0, 0, character.speed)
				};
			})
			.subscribe((x)=>
			{
				console.log("x:", x);
			});
		}

		testingBattleTimerGeneration();
	}

	basicRedux()
	{
		function counter(state = 0, action)
		{
			switch (action.type)
			{
				case 'INCREMENT':
					return state + 1
				case 'DECREMENT':
					return state - 1
				default:
					return state
			}
		}
		let store = createStore(counter)

		store.subscribe(() =>
			console.log(store.getState())
			)

		store.dispatch({ type: 'INCREMENT' })
		// 1
		store.dispatch({ type: 'INCREMENT' })
		// 2
		store.dispatch({ type: 'DECREMENT' })
		// 1
	}

	reduxPlayerList()
	{
		var startState = {
			players: [],
			monsters: [],
			battleTimers: new Map()
		};

		function counter(state = startState, action)
		{
			switch (action.type)
			{
				case 'ADD_PLAYER':
					return Object.assign(
						{}, 
						state, 
						{players: [...state.players, action.player]});

				default:
					return state
			}
		}
		let store = createStore(counter)

		store.subscribe(() =>
			console.log(store.getState())
			)

		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });
		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });
		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });
	}

	sagaGameLoop()
	{
		var me = this;

		function basicGeneratorGameLoop()
		{
			var loop = GameLoop3.getLoop();
			var gen = loop();
			me.delayed(1000, ()=>
			{
				console.log(gen.next(0));
			});
			me.delayed(2000, ()=>
			{
				console.log(gen.next(0));
			});
			me.delayed(3000, ()=>
			{
				console.log(gen.next(0));
			});
		}

		function testingSagaGameLoop()
		{
			const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

			var defaultState = {
				now: performance.now(),
				running: false
			};

			function reducer(state=defaultState, action)
			{
				console.log("reducer action:", action);
				switch(action.type)
				{
					case 'TICK':
						return Object.assign({}, state, {now: action.now});
					
					case 'START_TIMER':
						state.running = true;
						return state;

					case 'STOP_TIMER':
						state.running = false;
						return state;

					default:
						return state;
				}
			}

			function *timer(action)
			{
				console.log("timer");
				while(yield call(timerIsRunning))
				{
					console.log("inside while true loop");
					yield call(delay, 500);
					yield put({type: 'TICK', now: performance.now()});
				}
			}

			function *mySaga()
			{
				console.log("mySaga");
				yield* takeEvery('START_TIMER', timer);
			}

			const sagaMiddleware = createSagaMiddleware();

			const store = createStore(
				reducer,
			  applyMiddleware(sagaMiddleware)
			)

			function timerIsRunning()
			{
				return store.getState().running;
			}

			sagaMiddleware.run(mySaga)
			
			store.subscribe(() =>
				console.log("state:", store.getState())
				)

			me.delayed(1000, ()=>
			{
				store.dispatch({type: 'START_TIMER'})
			});

			me.delayed(2000, ()=>
			{
				store.dispatch({type: 'STOP_TIMER'})
			});
		}
		
	}

	testingBattleTimer2Generator()
	{
		var battleTimer = BattleTimer2.battleTimer();
		
	}
}

var app = new Application();
// app.initialize();