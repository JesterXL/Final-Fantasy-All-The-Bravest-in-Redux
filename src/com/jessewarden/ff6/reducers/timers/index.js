export const CREATE_TIMER = 'CREATE_TIMER';
export const DESTROY_TIMER = 'DESTROY_TIMER';
export const START_TIMER  = 'START_TIMER';
export const STOP_TIMER   = 'STOP_TIMER';
import { Timer } from '../../battle/battleTimer'; 

export const createTimer = (state, action) =>
{
    return [...state, new Timer(action.entity)];
};
export const findTimerIndex = (state, action) =>
{
    const index = _.findIndex(state, item => _.get(item, 'entity') === action.entity);
    return state[index];
};
export const findTimer = (state, action) =>
{
    return _.find(state, item => _.get(item, 'entity') === action.entity);  
};
export const destroyTimer = (state, action) =>
{
    const index = findTimerIndex(state, action);
    const timer = state[index];
    timer.stop();
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};
export const startTimer = (state, action)=>
{
    const timer = findTimer(state, action);
    timer.startTimer(action.window, action.callback);
    return state;
};
export const stopTimer = (state, action)=>
{
    const timer = findTimer(state, action);
    timer.stopTimer();
    return state;
};
export const timers = (state=[], action) =>
{
	switch(action.type)
	{
		case CREATE_TIMER: return createTimer(state, action);
        case DESTROY_TIMER: return destroyTimer(state, action);
        case START_TIMER: return startTimer(state, action);
        case STOP_TIMER: return stopTimer(state, action);
        default: return state;
	}
}