import { createStore, applyMiddleware } from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import {timer, timerFlow}
				from './com/jessewarden/ff6rx/sagas/GameLoopSaga';
import BattleTimer2 from "./com/jessewarden/ff6rx/battle/BattleTimer2";

var defaultState = {
	difference: performance.now(),
	running: false,
	battleTimer: {
		generator: BattleTimer2.battleTimer(),
		percentage: 0,
	}
};

function battleTimerReducer(state, action)
{
	if(action.type === 'TICK')
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
	if(action.type === 'TICK')
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
		case 'TICK':
			state = differenceReducer(state, action);
			state.battleTimer = battleTimerReducer(state.battleTimer, action);
			return state;
		
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

// function *mySaga()
// {
// 	console.log("mySaga");
// 	yield* takeEvery('START_TIMER', timerFlow);
// }

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
		console.log("state:", store.getState())
	)

	delayed(2000, ()=>
	{
		store.dispatch({type: 'START_TIMER'})
	});

	delayed(4000, ()=>
	{
		store.dispatch({type: 'STOP_TIMER'})
	});
}

run();