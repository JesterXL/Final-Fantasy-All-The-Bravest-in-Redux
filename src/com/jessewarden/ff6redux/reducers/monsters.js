import { ADD_MONSTER, TICK } from '../core/actions';

export default function monsters(state=[], action)
{
	switch(action.type)
	{
		case ADD_MONSTER:
			return [...state, action.monster];

		case TICK:
			return _.map(state, (monster)=>
			{
				var timerResult = monster.generator.next(action.difference);
				if(timerResult.done)
				{
					return monster;
				}

				if(timerResult.value === undefined)
				{
					timerResult = monster.generator.next(action.difference);
				}
				return Object.assign({}, monster,
				{
					percentage: timerResult.value.percentage
				});
			});
		default:
			return state;
	}
}