import { 
	ADD_COMPONENT, 
	REMOVE_COMPONENT, 
	TICK,
	CHARACTER_HITPOINTS_CHANGED,
	PLAYER_TURN_OVER
} from '../core/actions';
import {
	getComponentIndexFromCharacter
} from '../core/locators';
import BattleState from '../enums/BattleState';
import {makeBattleTimer} from '../battle/Character';

function processCharacterBattleTimers(state, action)
{
	return _.map(state, (character)=>
	{
		if(character.type !== 'Character')
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

export default function components(state=[], action)
{
	switch(action.type)
	{
		case ADD_COMPONENT:
			return [...state, action.component];

		case REMOVE_COMPONENT:
			var index = _.findIndex(state, i => i === action.component);
			if(index < 0)
			{
				console.log("list:", state);
				console.log("vs. component:", action.component);
				throw new Error('Failed to find component in list.');
			}
			return [...state.slice(0, index), 
					...state.slice(index + 1)];

		case TICK:
			return processCharacterBattleTimers(state, action);

		case CHARACTER_HITPOINTS_CHANGED:
			var updated = Object.assign({}, action.character, {
				hitPoints: action.hitPoints
			});
			// console.log("action:", action);
			var index = getComponentIndexFromCharacter(state, action.character);
			return state
				.slice(0, index)
				.concat([updated])
				.concat(state.slice(index + 1));
			
		case PLAYER_TURN_OVER:
			console.log("action.character:", action.character);
			var updatedCharacter = Object.assign({}, action.character, {
				battleState: BattleState.WAITING,
				generator: makeBattleTimer(action.character)
			});
			return replaceCharacter(state, action.character, updatedCharacter);

		default:
			return state;
	}
}

function replaceCharacter(list, character, updatedCharacter)
{
	var index = _.findIndex(list, p => p.entity === character.entity);
	return list
		.slice(0, index)
		.concat([updatedCharacter])
		.concat(list.slice(index + 1));
}

