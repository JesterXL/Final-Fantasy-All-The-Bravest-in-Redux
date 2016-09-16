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
} from '../core/locators';
import BattleState from '../enums/BattleState';
import {makeBattleTimer} from '../battle/Character';

export function components(state=[], action)
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
			return removeComponentAt(state, index);

		case TICK:
			return processCharacterBattleTimers(state, action);

		case CHARACTER_HITPOINTS_CHANGED:
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
			var index = getComponentIndexFromCharacter(state, action.character);
			return state
				.slice(0, index)
				.concat([updated])
				.concat(state.slice(index + 1));
			
		case PLAYER_TURN_OVER:
			// console.log("action.character:", action.character);
			var updatedCharacter = Object.assign({}, action.character, {
				battleState: BattleState.WAITING,
				generator: makeBattleTimer(action.character)
			});
			return replaceCharacter(state, action.character, updatedCharacter);

		case CHARACTER_DEAD:
			var componentsToRemove = getAllComponentsForEntity(state, action.character.entity);
			// console.log("componentsToRemove:", componentsToRemove);
			var reducedList =  _.reduce(state, (newState, component)=>
			{
				// console.log("newState:", newState);
				// console.log("components:", components);
				if(_.includes(componentsToRemove, component) === false)
				{
					newState.push(component);
					return newState;
				}
				return newState;
			}, []);
			console.log("reducedList:", reducedList);
			return reducedList;

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

export function removeComponentAt(state, index)
{
	return [...state.slice(0, index), 
			...state.slice(index + 1)];
}

export function replaceCharacter(list, character, updatedCharacter)
{
	var index = _.findIndex(list, p => p.entity === character.entity);
	return list
		.slice(0, index)
		.concat([updatedCharacter])
		.concat(list.slice(index + 1));
}

