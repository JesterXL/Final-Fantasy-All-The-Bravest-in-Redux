import * as ff6 from 'final-fantasy-6-algorithms';
const {guid} = ff6.core;

export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

export const getItem = (entity, itemType) =>
{
    return {type: 'item', entity, itemType};
};

export const Potion = 'Potion';

export const addItem = (state, action)=> [...state, action.item];

export const removeItem = (state, action)=>
{
    const index = _.findIndex(state, item => item.entity === action.item);
    return [
        ...state.slice(0, index), 
        ...state.slice(index + 1)
    ];
};

export const items = (state=[getItem(guid(), Potion)], action) =>
{
	switch(action.type)
	{
		case ADD_ITEM: return addItem(state, action);
        case REMOVE_ITEM: return removeItem(state, action);
		default: return state;
	}
}

