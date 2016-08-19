import { ADD_ENTITY, REMOVE_ENTITY } from '../core/actions';

export default function entities(state=[], action)
{
	switch(action.type)
	{
		case ADD_ENTITY:
			return [...state, action.entity];

		case REMOVE_ENTITY:
			var index = _.findIndex(state, i => i === action.entity);
			if(index < 0)
			{
				console.log("list:", state);
				console.log("vs. entity:", action.entity);
				throw new Error('Failed to find entity in list.');
			}
			return [...state.slice(0, index), 
					...state.slice(index + 1)];
		default:
			return state;
	}
}