export const HIDE_MAIN_MENU    = 'HIDE_MAIN_MENU';
export const SHOW_MAIN_MENU    = 'SHOW_MAIN_MENU';
export const SHOW_DEFENSE_MENU = 'SHOW_DEFENSE_MENU';
export const SHOW_ROW_MENU     = 'SHOW_ROW_MENU';
export const SHOW_ATTACK_MENU  = 'SHOW_ATTACK_MENU';

const getHideMainMenuState = (state, action)=>
{
    return Object.assign({}, state, {state: HIDE_MAIN_MENU});
};

const getShowMainMenuState = (state, action)=>
{
    return Object.assign({}, state, {state: SHOW_MAIN_MENU});
};

const getShowDefenseMenu = (state, action)=>
{
    return Object.assign({}, state, {state: SHOW_DEFENSE_MENU});
};

const getShowRowMenu = (state, action)=>
{
    return Object.assign({}, state, {state: SHOW_ROW_MENU});
};

const getShowAttackMenu = (state, action)=>
{
    return Object.assign({}, state, {state: SHOW_ATTACK_MENU});
};

export const menustate = (state={state: HIDE_MAIN_MENU}, action) =>
{
	switch(action.type)
	{
		case HIDE_MAIN_MENU: getHideMainMenuState(state, action);
        case SHOW_MAIN_MENU: getShowMainMenuState(state, action);
        case SHOW_DEFENSE_MENU: getShowDefenseMenu(state, action);
        case SHOW_ROW_MENU: getShowRowMenu(state, action);
        case SHOW_ATTACK_MENU: getShowAttackMenu(state, action);
        default: return state;
	}
};