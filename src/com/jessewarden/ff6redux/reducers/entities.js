import { ADD_ENTITY } from '../core/actions';

export default function entities(state=[], action)
{
	switch(action.type)
	{
		case ADD_ENTITY:
			return [...state, action.entity];

		default:
			return state;
	}
}