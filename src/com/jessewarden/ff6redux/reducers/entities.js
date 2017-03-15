export const ADD_ENTITY    = 'ADD_ENTITY';
export const REMOVE_ENTITY = 'REMOVE_ENTITY';

export function entities(state=[], action)
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
			return removeEntityAt(state, index);

		case CHARACTER_DEAD:
			var index = _.findIndex(state, i => i === action.character.entity);
			if(index < 0)
			{
				console.error("Can't find character's entity:", character.entity);
			}
			return removeEntityAt(state, index);

		default:
			return state;
	}
}

export function removeEntityAt(state, index)
{
	return [...state.slice(0, index), 
			...state.slice(index + 1)];
}