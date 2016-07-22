import {  take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const SPEED = 60;
var unsubscribe;

export function *timer(action)
{
	// console.log("timer");
	try
	{
		var lastTick = performance.now();
		while(true)
		{
			var now = performance.now();
			// console.log("lastTick:", lastTick);
			var difference = now - lastTick;
			lastTick = now;
			// console.log("difference: " + difference + ", now: " + now);
			yield put({
				type: 'TICK', 
				difference: difference,
				now: now
			});
			yield call(delay, 60);
		}
	}
	finally
	{
		if(yield cancelled())
		{
			// console.log("timer cancelled");
		}
	}

	// if(this.pausedTime != 0)
	// {
	// 	// var now = new Date().valueOf();
	// 	var timeElapsed = this.now() - this.pausedTime;
	// 	console.log("before:", this.lastTick);
	// 	this.lastTick -= timeElapsed;
	// 	console.log("after:", this.lastTick);
	// 	time -= timeElapsed;
	// 	this.pausedTime = 0;
	// }
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