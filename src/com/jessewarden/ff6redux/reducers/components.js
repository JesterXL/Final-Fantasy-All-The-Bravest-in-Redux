import { ADD_COMPONENT, REMOVE_COMPONENT, TICK } from '../core/actions';

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
				percentage: 1
			});
		}
		return Object.assign({}, character,
		{
			percentage: timerResult.value.percentage
		});
	});
}

export default function entities(state=[], action)
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


		default:
			return state;
	}
}