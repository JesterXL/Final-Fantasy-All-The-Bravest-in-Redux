import { ADD_MONSTER, TICK, MONSTER_HITPOINTS_CHANGED } from '../core/actions';

export default function monsters(state=[], action)
{
	switch(action.type)
	{
		case ADD_MONSTER:
			return [...state, action.monster];

		case MONSTER_HITPOINTS_CHANGED:
			var updatedMonster = Object.assign({}, action.monster, {
				hitPoints: action.hitPoints
			});
			var index = _.findIndex(state, m => m.id === action.monster.id);
			return state
				.slice(0, index)
				.concat([updatedMonster])
				.concat(state.slice(index + 1));

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