export const NO_ITEM = {};

export const SELECT_ITEM = 'SELECT_ITEM';
export const CANCEL_SELECT_ITEM = 'CANCEL_SELECT_ITEM';

export const selectItem = (state, action)=> action.item;
export const cancelSelectedItem = (state, action) => NO_ITEM;

export const selectedItem = (state=NO_ITEM, action) =>
{
	switch(action.type)
	{
		case SELECT_ITEM: return selectItem(state, action);
        case CANCEL_SELECT_ITEM: return cancelSelectedItem(state, action);
		default: return state;
	}
}