import { call, put } from 'redux-saga/effects'

function now()
{
	// return new Date().value();
	return performance.now();
}

function getLoop(time=0)
{
	return function*(getState)
	{
		var lastTick = 0;
		while(true)
		{
			if(getState().running)
			{
				time = now();
				var difference = time - lastTick;
				lastTick = time;
				yield put({type: 'TIMER_TICK', difference});
			}
		}
	}
}

export default {
	getLoop: getLoop
}