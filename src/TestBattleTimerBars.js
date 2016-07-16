import { createStore, applyMiddleware } from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import {timer, timerFlow}
				from './com/jessewarden/ff6rx/sagas/GameLoopSaga';
import BattleTimer2 from "./com/jessewarden/ff6rx/battle/BattleTimer2";
import _ from 'lodash';
import BattleTimerBar from "./com/jessewarden/ff6rx/components/BattleTimerBar";

const TICK = 'TICK';
const ADD_BATTLETIMER = 'ADD_BATTLETIMER';
const REMOVE_BATTLETIMER = 'REMOVE_BATTLETIMER';
const START_TIMER = 'START_TIMER';
const STOP_TIMER = 'STOP_TIMER';

var defaultState = {
	difference: performance.now(),
	running: false,
	battleTimers: [],
	battleTimerSeedID: 0
};

function battleTimerReducer(state, action)
{
	if(action.type === TICK)
	{
		var timerResult = state.generator.next(action.difference);
		if(timerResult.value === undefined)
		{
			timerResult = state.generator.next(action.difference);
		}
		return Object.assign({},
			state,
			{
				percentage: timerResult.value.percentage
			});
	}
	else
	{
		return state;
	}
}

function differenceReducer(state, action)
{
	if(action.type === TICK)
	{
		return Object.assign({},
			state,
			{
				difference: action.difference
			});
	}
	else
	{
		return state;
	}
}

function reducer(state=defaultState, action)
{
	switch(action.type)
	{
		case TICK:
			state = differenceReducer(state, action);
			state.battleTimers = _.map(state.battleTimers, (t)=>
			{
				return battleTimerReducer(t, action);
			});
			return state;
		
		case START_TIMER:
			state.running = true;
			return state;

		case STOP_TIMER:
			state.running = false;
			return state;

		case ADD_BATTLETIMER:
			state.battleTimers = [
				...state.battleTimers,
				{
					generator: BattleTimer2.battleTimer(),
					percentage: 0,
					id: state.battleTimerSeedID + 1
				}
			];
			state = Object.assign({}, state,
			{
				battleTimerSeedID: state.battleTimerSeedID + 1
			});
			return state;

		case REMOVE_BATTLETIMER:
			var index = _.findIndex(state.battleTimers, t => t.id === action.id);
			state.battleTimers = [
				...state.battleTimers.slice(0, index),
				...state.battleTimers.slice(index + 1)
			];
			return state;

		default:
			return state;
	}
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

function run()
{
	const sagaMiddleware = createSagaMiddleware();

	const store = createStore(
		reducer,
	  applyMiddleware(sagaMiddleware)
	)

	sagaMiddleware.run(timerFlow)

	store.subscribe(() =>
	{
		console.log("state:", store.getState());
		reduceBattleTimers(store.getState().battleTimers);
	});

	delayed(2000, ()=>
	{
		store.dispatch({type: ADD_BATTLETIMER});
		store.dispatch({type: ADD_BATTLETIMER});
		store.dispatch({type: ADD_BATTLETIMER});
	});

	delayed(3000, ()=>
	{
		store.dispatch({type: START_TIMER})
	});

	delayed(4000, ()=>
	{
		store.dispatch({type: STOP_TIMER})
	});

	initializeGUI();
}

var renderer;
var stage;
var startX = 20;
var startY = 20;
var battleTimerBarMap = new Map();

function initializeGUI()
{
	renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	stage.interactive = true;
	animate();
}

function createBattleTimerBar(x, y, stage)
{
	var bar = new BattleTimerBar();
	stage.addChild(bar.container);
	bar.container.x = x;
	bar.container.y = y;
	return bar;
}

function reduceBattleTimers(battleTimers)
{
	if(battleTimers && battleTimers.length > 0)
	{
		// ghetto loop, not very functional slacker, TODO

		// first, remove ID's that aren't there
		battleTimerBarMap.forEach((bar, id)=>
		{
			var index = _.find(battleTimers, o => o.id === id);
			if(index === -1)
			{
				battleTimerBarMap.delete(id);
				stage.remove(bar);
			}
		});

		// second, create new ones and update all percentages
		_.forEach(battleTimers, (t)=>
		{
			// have one already?
			var bar = battleTimerBarMap.get(t.id);
			if(bar === undefined)
			{
				bar = createBattleTimerBar(startX, startY, stage);
				console.log("bar.height:", bar.height);
				startY += BattleTimerBar.HEIGHT + 20;
				battleTimerBarMap.set(t.id, bar);
			}
			bar.percentage = t.percentage;
			bar.render();
		});


	}
}

function animate()
{
	requestAnimationFrame(()=>
	{
		animate();
	});
	renderer.render(stage);
}

run();