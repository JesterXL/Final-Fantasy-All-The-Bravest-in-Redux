import { createStore, applyMiddleware } from 'redux'

import { takeEvery, takeLatest, delay } from 'redux-saga'
import createSagaMiddleware from 'redux-saga'
import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import {timer, timerFlow}
				from './GameLoopSaga';

var defaultState = {
	difference: performance.now(),
	running: false
};

function reducer(state=defaultState, action)
{
	console.log("reducer action:", action);
	switch(action.type)
	{
		case 'TICK':
			return Object.assign({}, state, {difference: action.difference});
		
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

	delayed(6000, ()=>
	{
		store.dispatch({type: 'START_TIMER'})
	});

	delayed(8000, ()=>
	{
		store.dispatch({type: 'STOP_TIMER'})
	});
}


run();