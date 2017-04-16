export const ADD_ENTITY    = 'ADD_ENTITY';
export const REMOVE_ENTITY = 'REMOVE_ENTITY';

export const addEntity       = (state, action) => [...state, action.entity];
export const findEntityIndex = (state, action) => _.findIndex(state, i => i === action.entity);
export const removeEntity    = (state, action) => 
{
    const index = findEntityIndex(state, action);
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};
export const entities = (state=[], action) =>
{
	switch(action.type)
	{
		case ADD_ENTITY:    return addEntity(state, action);
		case REMOVE_ENTITY: return removeEntity(state, action);
		default:			return state;
	}
}