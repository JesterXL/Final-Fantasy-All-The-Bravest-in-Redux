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

import { createStore, applyMiddleware } from 'redux'

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
	const START_TIMER = 'START_TIMER';
	const STOP_TIMER = 'STOP_TIMER';

	function bootstrap()
	{
		// this.canvasTag = document.getElementById('#stage');
		renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
		document.body.appendChild(renderer.view);
		stage = new PIXI.Container();
		stage.interactive = true;

		animate();



		var startState = {
			now: performance.now(),
			running: false,
			players: [],
			monsters: [],
			battleTimers: new Map()
		};

		function reducer(state=startState, action)
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

				case 'ADD_PLAYER':
					return Object.assign(
						{}, 
						state, 
						{players: [...state.players, action.player]});

				default:
					return state;
			}
		}

		function *timer(action)
		{
			try
			{
				while(true)
				{
					console.log("inside while true loop");
					yield call(delay, 60);
					yield put({type: 'TICK', now: performance.now()});
				}
			}
			finally
			{
				if(yield cancelled())
				{

				}
			}
		}

		function *gameLoop()
		{
			while(yield take(START_TIMER))
			{
				const task = yield fork(timer);
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

		let store = createStore(
			reducer,
			applyMiddleware(sagaMiddleware)
		);

		sagaMiddleware.run(gameLoop);

		store.subscribe(() =>
			console.log(store.getState())
			)

		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });
		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });
		store.dispatch({ type: 'ADD_PLAYER', player: new Player() });

		delayed(1000, ()=>
		{
			store.dispatch({type: 'START_TIMER'})
		});

		delayed(2000, ()=>
		{
			store.dispatch({type: 'STOP_TIMER'})
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