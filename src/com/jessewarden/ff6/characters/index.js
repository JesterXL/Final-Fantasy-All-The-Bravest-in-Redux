export const CREATE_CHARACTER = 'CREATE_CHARACTER';
export const DESTROY_CHARACTER = 'DESTROY_CHARACTER';
export const CHARACTER_HIT_POINTS_CHANGED = 'CHARACTER_HITPOINTS_CHANGED';
import BattleState from '../enums/BattleState';

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

export const findCharacter = (state, action)=>
{
    return _.find(state, item => item.entity === action.entity);
};

export const replaceCharacter = (state, action, updatedCharacter)=>
{
    const index = findCharacterIndex(state, action);
    return [
		...state.slice(0, index),
		updatedCharacter,
		...state.slice(index + 1)
	];
};

export const destroyCharacter = (state, action)=>
{
    const index = findCharacterIndex(state, action);
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};

export const hitPointsChanged = (state, action)=>
{
    const character = findCharacter(state, action);
    let battleState = character.battleState;
    if(action.newHitPoints <= 0)
    {
        battleState = BattleState.DEAD;
    }
    else if(character.hitPoints <= 0 && action.newHitPoints > 0)
    {
        battleState = BattleState.WAITING;
    }
    const updatedCharacter = Object.assign({}, character, {
        hitPoints: action.newHitPoints,
        battleState
    });
    return replaceCharacter(state, action, updatedCharacter);
};

export const characters = (state=[], action) =>
{
	switch(action.type)
	{
		case CREATE_CHARACTER: return createCharacter(state, action);
        case DESTROY_CHARACTER: return destroyCharacter(state, action);
        case CHARACTER_HIT_POINTS_CHANGED: return hitPointsChanged(state, action);
        default: return state;
	}
}