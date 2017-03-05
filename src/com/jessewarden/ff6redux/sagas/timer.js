import {START_TIMER, STOP_TIMER, TICK} from '../core/actions';
import { take, put, call, fork, cancel, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
// import { performance } from '../core/perfnow';

export function *ticker(action)
{
	let lastTick = performance.now();
	yield put({type: TICK, now: lastTick, difference: 0});
	const thirtyTimesASecond = 1000 / 30;
	while(true)
	{
		yield call(delay, thirtyTimesASecond);
		let now = performance.now();
		let difference = now - lastTick;
		lastTick = now;
		yield put({type: TICK, now: now, difference: difference});
	}
}

export function *timer()
{
	while(yield take(START_TIMER))
	{
		const task = yield fork(ticker);
		yield take(STOP_TIMER);
		yield cancel(task);
	}
}
