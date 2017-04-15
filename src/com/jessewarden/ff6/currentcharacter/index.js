export const SET_CHARACTER_TURN = 'SET_CHARACTER_TURN';
export const NO_CHARACTER = 'no character';

export const currentCharacter = (state=NO_CHARACTER, action) =>
{
	switch(action.type)
	{
		case SET_CHARACTER_TURN: return action.character;
		default: return state;
	}
}