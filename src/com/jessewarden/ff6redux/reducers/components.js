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

export function components(state=[], action)
{
	switch(action.type)
	{
		case ADD_COMPONENT:
			return addComponent(state, action);

		case REMOVE_COMPONENT:
			var index = _.findIndex(state, i => i === action.component);
			if(index < 0)
			{
				console.log("list:", state);
				console.log("vs. component:", action.component);
				throw new Error('Failed to find component in list.');
			}
			return removeComponentAt(state, index);

		case TICK:
			return processCharacterBattleTimers(state, action);

		case CHARACTER_HITPOINTS_CHANGED:
			return characterHitPointsChanged(state, action);
			
		case PLAYER_TURN_OVER:
			// console.log("action.character:", action.character);
			var updatedCharacter = Object.assign({}, action.character, {
				battleState: BattleState.WAITING,
				generator: makeBattleTimer(action.character)
			});
			return replaceCharacter(state, action.character, updatedCharacter);

		case CHARACTER_DEAD:
			return characterDead(state, action);

		default:
			return state;
	}
}

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

export function addComponent(state, action)
{
	return [...state, action.component];
}

export function removeComponentAt(state, index)
{
	return [...state.slice(0, index), 
			...state.slice(index + 1)];
}

export function replaceCharacter(list, character, updatedCharacter)
{
	var index = _.findIndex(list, p => p.entity === character.entity);
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

export function characterHitPointsChanged(state, action)
{
	var battleState = action.character.battleState;
	if(action.hitPoints <= 1)
	{
		battleState = BattleState.DEAD;
	}
	var updated = Object.assign({}, action.character, {
		hitPoints: action.hitPoints,
		battleState: battleState
	});
	// console.log("action:", action);
	var index = _.findIndex(state, i => i === action.character);
	if(index < 0)
	{
		return state;
	}
	return [
		...state.slice(0, index),
		updated,
		...state.slice(index + 1)
	];
}

export function characterDead(state, action)
{
	var index = _.findIndex(state, i => i === action.character);
	if(index < 0)
	{
		console.log("list:", state);
		throw new Error('Failed to find component in list.');
	}
	const updatedCharacter = Object.assign({}, action.character, {
		battleState: BattleState.DEAD
	});
	return replaceCharacter(state, action.character, updatedCharacter);
}
