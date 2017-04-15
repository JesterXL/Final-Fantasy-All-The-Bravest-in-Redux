export const SET_CHARACTER_TURN = 'SET_CHARACTER_TURN';
export const CHARACTER_TURN_OVER = 'CHARACTER_TURN_OVER';
export const NO_CHARACTER = 'no character';

export const setCharacterTurn = (state, action)=>
{
	if(state === NO_CHARACTER && action.entity !== NO_CHARACTER)
	{
		return action.entity;
	}
	else
	{
		// [jwarden 4.15.2017] NOTE: This is just a warning in case
		// a character is ready, says so, but doesn't check to see if there is
		// another character already before she/he is.
		console.warn("You cannot set a character's turn without first setting no character.");
		return state;
	}
};

export const setCharacterTurnOver = (state, action)=>
{
	if(state !== action.entity)
	{
		console.warn("You are trying to set a character's turn over, but passed the wrong entity.");
		console.warn("You passed:", action.entity);
		console.warn("Current Character is:", state);
		return state;
	}
	return NO_CHARACTER;
};

export const currentCharacter = (state=NO_CHARACTER, action) =>
{
	switch(action.type)
	{
		case SET_CHARACTER_TURN: return setCharacterTurn(state, action);
		case CHARACTER_TURN_OVER: return setCharacterTurnOver(state, action);
		default: return state;
	}
}