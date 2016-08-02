import { TICK, START_TIMER, STOP_TIMER } from '../core/actions';
import startState from './startState';
//var defaultValue = startState.gameLoop; // this breaks webpack
var defaultValue = {
	now: performance.now(),
	running: false
};

export default function gameLoop(state=defaultValue, action)
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