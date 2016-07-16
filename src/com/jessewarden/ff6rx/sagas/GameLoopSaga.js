import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const SPEED = 60;
var unsubscribe;

export function *timer(action)
{
	// try
	// {
	// 	while(true)
	// 	{
	// 		yield put({type: 'TICK', now: performance.now()});
	// 		yield call(delay, 60);
	// 	}
	// }
	// finally
	// {
	// 	if(yield cancelled())
	// 	{
	// 		// console.log("timer cancelled");
	// 	}
	// }

	while(true)
	{
		yield put({type: 'TICK', now: performance.now()});
		yield call(delay, 60);
	}
}

export function *timerFlow()
{
	while(yield take('START_TIMER'))
	{
		const timerTask = yield fork(timer);
		yield take('STOP_TIMER');
		yield cancel(timerTask);
	}
}