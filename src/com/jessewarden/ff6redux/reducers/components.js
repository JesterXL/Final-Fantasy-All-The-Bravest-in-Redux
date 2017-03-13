import { 
	ADD_COMPONENT, 
	REMOVE_COMPONENT, 
	TICK,
	CHARACTER_HITPOINTS_CHANGED,
	PLAYER_TURN_OVER,
	CHARACTER_DEAD
} from '../core/actions';
import {
	getComponentIndexFromCharacter,
	getAllComponentsForEntity
} from '../core/selectors';
import BattleState from '../enums/BattleState';
import {makeBattleTimer} from '../battle/Character';
import _ from 'lodash';

export const findCharacterIndex = (list, character) => _.findIndex(list, p => p.entity === character.entity);
export const removeComponentAt = (state, index) => [
	...state.slice(0, index), 
	...state.slice(index + 1)
];

export const replaceCharacter  = (list, character, updatedCharacter)
{
	const index = findCharacterIndex(list, character);
	if(index < 0)
	{
		return list;
	}
	return [
		...list.slice(0, index),
		updatedCharacter,
		...list.slice(index + 1)
	];
}

export const removeComponent = (state, action) =>
{
	return removeComponentAt(state, index);
};

export const addComponent = (state, action) =>
{
	return [...state, action.component];
};

export const characterHitPointsChanged = (state, action) =>
{
	let battleState = action.character.battleState;
	if(action.hitPoints <= 1)
	{
		battleState = BattleState.DEAD;
	}
	const updatedCharacter = Object.assign({}, action.character, {
		hitPoints: action.hitPoints,
		battleState: newBattleState
	});
	return replaceCharacter(state, action.character, updatedCharacter);
};

export const characterDead = (state, action) =>
{
	const index = findCharacterIndex(state, action.character);
	const updatedCharacter = Object.assign({}, action.character, {
		battleState: BattleState.DEAD
	});
	return replaceCharacter(state, action.character, updatedCharacter);
};


export function processCharacterBattleTimers(state, action)
{
	return _.map(state, (character)=>
	{
		if(_.isNil(character.type) || character.type !== 'Character')
		{
			return character;
		}

		if(character.battleState !== BattleState.WAITING && 
			character.battleState !== BattleState.RUNNING)
		{
			return character;
		}
		
		var timerResult = character.generator.next(action.difference);
		if(timerResult.done)
		{
			return character;
		}

		if(timerResult.value === undefined)
		{
			timerResult = character.generator.next(action.difference);
		}
		if(timerResult.value.percentage === 1)
		{
			return Object.assign({}, character,
			{
				percentage: 1,
				battleState: BattleState.READY
			});
		}
		return Object.assign({}, character,
		{
			percentage: timerResult.value.percentage
		});
	});
}

const battleStateNotWaitingNorRunning = character => {
	return character.battleState !== BattleState.WAITING && 
		character.battleState !== BattleState.RUNNING;
};

export components = (state=[], action) =>
{
	switch(action.type)
	{
		case ADD_COMPONENT:
			return addComponent(state, action);

		case REMOVE_COMPONENT:
			return removeComponent(state, action);
		
		case CHARACTER_HITPOINTS_CHANGED:
			return characterHitPointsChanged(state, action);
			
		case PLAYER_TURN_OVER:
			// console.log("action.character:", action.character);
			const updatedCharacter = Object.assign({}, action.character, {
				battleState: BattleState.WAITING,
				generator: makeBattleTimer(action.character)
			});
			return replaceCharacter(state, action.character, updatedCharacter);

		case CHARACTER_DEAD:
			return characterDead(state, action);

		default:
			return state;
	}
};
