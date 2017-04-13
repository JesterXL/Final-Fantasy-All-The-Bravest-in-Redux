export const SET_CURSOR_MANAGER_TARGETS           = 'SET_CURSOR_MANAGER_TARGETS';
export const CURSOR_MANAGER_EVENT 				  = 'CURSOR_MANAGER_EVENT';

export const CURSOR_MANAGER_EVENT_ESCAPE          = 'cursorManager:escape';
export const CURSOR_MANAGER_EVENT_PREVIOUS_TARGET = 'cursorManager:previousTarget';
export const CURSOR_MANAGER_EVENT_NEXT_TARGET     = 'cursorManager:nextTarget';
export const CURSOR_MANAGER_EVENT_SELECTED        = 'cursorManager:selected';
export const CURSOR_MANAGER_EVENT_MOVE_RIGHT      = 'cursorManager:moveRight';
export const CURSOR_MANAGER_EVENT_MOVE_LEFT       = 'cursorManager:moveLeft';

const setCursorManagerTargets = (state, action)=>
{
	let currentTargetIndex = -1;
	if(action.targets.length > 0)
	{
		currentTargetIndex = 0;
	}
	return {
		targets: [...action.targets],
		event: action.event,
		currentTargetIndex
	};
};

const getPreviousTargetIndex = (targets, currentSelectedIndex) =>
{
	if(_.isArray(targets) === false || targets.length === 0)
	{
		return -1;
	}

	if(targets.length === 1)
	{
		return 0;
	}

	if(currentSelectedIndex - 1 > -1)
	{
		return (currentSelectedIndex - 1);
	}
	else
	{
		return targets.length - 1;
	}
};

const getNextTargetIndex = (targets, currentSelectedIndex)=>
{
	if(_.isArray(targets) === false || targets.length === 0)
	{
		return -1;
	}
	if(me.targets.length === 1)
	{
		return 0;
	}

	if(currentSelectedIndex + 1 < targets.length)
	{
		return (currentSelectedIndex + 1);
	}
	else
	{
		return 0;
	}
};

const setCursorManagerEvent = (state, action)=>
{
	const targets = _.get(state, 'targets', []);
	const index = _.get(state, 'currentTargetIndex', -1);
	let newTargetIndex;
	switch(action.event)
	{
		case CURSOR_MANAGER_EVENT_MOVE_LEFT:
			newTargetIndex = getPreviousTargetIndex(targets, currentSelectedIndex);
			return Object.assign({}, state, {
				currentTargetIndex: index,
				event: action.event
			});
		case CURSOR_MANAGER_EVENT_NEXT_TARGET:
			newTargetIndex = getNextTargetIndex(targets, currentSelectedIndex);
			return Object.assign({}, state, {
				currentTargetIndex: index,
				event: action.event
			});
		default:
			return Object.assign({}, state, {
				event: action.event
			});
	}
};

const defaultEvent = {
	targets: [],
	event: undefined
};
export const cursorManagerTargets = (state=defaultEvent, action) =>
{
	switch(action.type)
	{
		case SET_CURSOR_MANAGER_TARGETS: setCursorManagerTargets(state, action);
		case CURSOR_MANAGER_EVENT: setCursorManagerEvent(state, action);
		default: return state;
	}
};