import 'babel-polyfill';

import BattleTimer from "./com/jessewarden/ff6redux/battle/BattleTimer";
import BattleTimer2 from "./com/jessewarden/ff6redux/battle/BattleTimer2";
import TextDropper from './com/jessewarden/ff6redux/components/TextDropper';
import BattleTimerBar from "./com/jessewarden/ff6redux/components/BattleTimerBar";
import PIXI from 'pixi.js';
import {Subject} from 'rx';
import _ from "lodash";
import Row from "./com/jessewarden/ff6redux/enums/Row";
import Relic from "./com/jessewarden/ff6redux/items/Relic";
import Player from './com/jessewarden/ff6redux/battle/Player';
import Monster from './com/jessewarden/ff6redux/battle/Monster';

import { createStore, applyMiddleware, combineReducers} from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
// import './com/jessewarden/ff6redux/sagas/TestSagas';
// import './TestBattleTimers';
// import './TestBattleTimerBars';
// import './TestInitiative';
// import './TestMovieClip';
// import './TestCursorManager';
// import './TestMenu';

export function Application()
{
	var renderer, stage;

	const TICK = 'TICK';
	const START_TIMER = 'START_TIMER';
	const STOP_TIMER = 'STOP_TIMER';
	
	const ADD_PLAYER = 'ADD_PLAYER';
	const ADD_MONSTER = 'ADD_MONSTER';
	

	function bootstrap()
	{
		// this.canvasTag = document.getElementById('#stage');
		renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		stage.interactive = true;

		animate();

		var startState = {
			gameLoop: {
				now: performance.now(),
				running: false
			},
			players: [],
			monsters: []
		};

		function players(state=[], action)
		{
			switch(action.type)
			{
				case ADD_PLAYER:
					return [...state, action.player];
				
				case TICK:
					return _.map(state, (player)=>
					{
						var timerResult = player.generator.next(action.difference);
						if(timerResult.value === undefined)
						{
							timerResult = player.generator.next(action.difference);
						}
						return Object.assign({}, player,
						{
							percentage: timerResult.value.percentage
						});
					});

				default:
					return state;
			}
		}

		function monsters(state=[], action)
		{
			switch(action.type)
			{
				case ADD_MONSTER:
					return [...state, action.monster];

				case TICK:
					return _.map(state, (monster)=>
					{
						var timerResult = monster.generator.next(action.difference);
						if(timerResult.value === undefined)
						{
							timerResult = monster.generator.next(action.difference);
						}
						return Object.assign({}, monster,
						{
							percentage: timerResult.value.percentage
						});
					});
				default:
					return state;
			}
		}

		function gameLoop(state=startState.gameLoop, action)
		{
			switch(action.type)
			{
				case TICK:
					return Object.assign({}, state, {now: action.now});
				
				case START_TIMER:
					return Object.assign({}, state, {running: true});
					return state;

				case STOP_TIMER:
					return Object.assign({}, state, {running: false});

				default:
					return state;
			}
		}

		function *ticker(action)
		{
			var lastTick = performance.now();
			while(true)
			{
				yield call(delay, 60);
				var now = performance.now();
				var difference = now - lastTick;
				lastTick = now;
				yield put({type: TICK, now: now, difference: difference});
			}
		}

		function *timer()
		{
			while(yield take(START_TIMER))
			{
				const task = yield fork(ticker);
				yield take(STOP_TIMER);
				yield cancel(task);
			}
		}

		// function *mySaga()
		// {
		// 	console.log("mySaga");
		// 	yield* takeEvery('START_TIMER', timer);
		// }

		const sagaMiddleware = createSagaMiddleware();

		let reducers = combineReducers({
			gameLoop,
			players,
			monsters
		})
		let store = createStore(
			reducers,
			applyMiddleware(sagaMiddleware)
		);

		sagaMiddleware.run(timer);

		// store.subscribe(() =>
		// 	console.log(store.getState())
		// 	)

		store.dispatch({ type: ADD_PLAYER, player: new Player() });
		store.dispatch({ type: ADD_PLAYER, player: new Player() });
		store.dispatch({ type: ADD_PLAYER, player: new Player() });

		store.dispatch({ type: ADD_MONSTER, monster: new Monster()});

		var times = _.map(store.getState().players, p => p.percentage);
		console.log("before times:", times);
		delayed(1000, ()=>
		{
			store.dispatch({type: START_TIMER})
		});

		delayed(2000, ()=>
		{
			store.dispatch({type: STOP_TIMER})
			times = _.map(store.getState().players, p => p.percentage);
		console.log("after times:", times);
		});

		
	}
	
	
	function animate()
	{
		requestAnimationFrame(()=>
		{
			animate();
		});
		renderer.render(stage);
	}

	function delayed(milliseconds, callback)
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

	return {
		bootstrap
	}
}

var app = new Application();
app.bootstrap();