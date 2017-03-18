export const ADD_COMPONENT    = 'ADD_COMPONENT';
export const REMOVE_COMPONENT = 'REMOVE_COMPONENT';

export const addComponent       = (state, action) => [...state, action.component];
export const findComponentIndex = (state, action) => _.findIndex(state, i => i === action.component);
export const removeComponent    = (state, action) => 
{
    const index = findComponentIndex(state, action);
    return [
        ...state.slice(0, index), 
	    ...state.slice(index + 1)
    ];
};
export const entities = (state=[], action) =>
{
	switch(action.type)
	{
		case ADD_COMPONENT:     return addComponent(state, action);
		case REMOVE_COMPONENT:  return removeEntity(state, action);
		default:			    return state;
	}
}