export const CREATE_BATTLE_TIMER  = 'CREATE_BATTLE_TIMER';
export const DESTROY_BATTLE_TIMER = 'DESTROY_BATTLE_TIMER';
export const START_BATTLE_TIMER   = 'START_BATTLE_TIMER';
export const STOP_BATTLE_TIMER    = 'STOP_BATTLE_TIMER';
export const STOP_ALL_BATTLE_TIMERS = 'STOP_ALL_BATTLE_TIMERS';
export const UPDATE_BATTLE_TIMER  = 'UPDATE_BATTLE_TIMER';
export const RESET_AND_START_BATTLE_TIMER = 'RESET_AND_START_BATTLE_TIMER';
// export const BATTLE_TIMER_DONE = 'BATTLE_TIMER_DONE';
const _ = require('lodash');

import { 
    BattleTimer,
    EFFECT_HASTE,
    EFFECT_NORMAL,
    EFFECT_SLOW,
    MODE_MONSTER,
    MODE_PLAYER
} from '../../battle/battleTimer'; 

export const createBattleTimer = (state, action)=>
{
    const battleTimer = new BattleTimer(
        action.entity,
        action.characterEntity,
        _.get(action, 'counter', 0),
        _.get(action, 'gauge', 0),
        _.get(action, 'effect', EFFECT_NORMAL),
        _.get(action, 'mode', MODE_PLAYER),
        _.get(action, 'speed', 1)
    );
    return [...state, battleTimer];
};

export const findBattleTimerIndex = (state, action) =>
{
    return _.findIndex(state, item => item.entity === action.entity);
};

export const findBattleTimer = (state, action)=>
{
    return _.find(state, item => item.entity === action.entity);
};

export const destroyBattleTimer = (state, action)=>
{
    const index = findBattleTimerIndex(state, action);
    const battleTimer = state[index];
    battleTimer.stop();
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};

export const startBattleTimer = (state, action)=>
{
    const battleTimer = findBattleTimer(state, action);
    battleTimer.startTimer(action.window, action.doneCallback, action.progressCallback);
    return state;
};

export const stopBattleTimer = (state, action)=>
{
    const battleTimer = findBattleTimer(state, action);
    battleTimer.stopTimer();
    return state;
};

export const stopAllBattleTimers = (state, action)=>
{
    _.forEach(state.battleTimers, battleTimer => battleTimer.stopTimer());
    return state;
};

export const resetAndStartBattleTimer = (state, action)=>
{
    const battleTimer = findBattleTimer(state, action);
    battleTimer.resetAndStartTimer();
    return state;
};

export const updateBattleTimer = (state, action)=>
{
    // store.dispatch({type: UPDATE_BATTLE_TIMER, entity: doneEvent.entity, event: doneEvent});
    // console.log("** updateBattleTimer **");
    const chars = _.map(state, timer => timer.characterEntity);
    // console.log("order:", chars);
    return state;
};

export const battleTimers = (state=[], action) =>
{
	switch(action.type)
	{
		case CREATE_BATTLE_TIMER: return createBattleTimer(state, action);
        case DESTROY_BATTLE_TIMER: return destroyBattleTimer(state, action);
        case START_BATTLE_TIMER: return startBattleTimer(state, action);
        case STOP_BATTLE_TIMER: return stopBattleTimer(state, action);
        case RESET_AND_START_BATTLE_TIMER: return resetAndStartBattleTimer(state, action);
        case STOP_ALL_BATTLE_TIMERS: return stopAllBattleTimers(state, action);
        case UPDATE_BATTLE_TIMER: return updateBattleTimer(state, action);
        default: return state;
	}
}