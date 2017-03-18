export const CREATE_CHARACTER = 'CREATE_CHARACTER';
export const DESTROY_CHARACTER = 'DESTROY_CHARACTER';
import { getCharacter } from '../battle/Character'; 

export const createCharacter = (state, action)=>
{
    const character = getCharacter(action.entity);
    character.characterType = action.characterType;
    return [...state, character];
};
export const findCharacterIndex = (state, action)=>
{
    return _.findIndex(state, item => item.entity === action.entity);
};
export const destroyCharacter = (state, action)=>
{
    const index = findCharacterIndex(state, action);
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};
export const characters = (state=[], action) =>
{
	switch(action.type)
	{
		case CREATE_CHARACTER: return createCharacter(state, action);
        case DESTROY_CHARACTER: return destroyCharacter(state, action);
        default: return state;
	}
}