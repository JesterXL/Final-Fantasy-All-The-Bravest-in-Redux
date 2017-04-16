export const WAITING              = 'WAITING';
export const CHOOSE               = 'CHOOSE';
export const ATTACK               = 'ATTACK';
export const ATTACK_CHOOSE_TARGET = 'ATTACK_CHOOSE_TARGET';
export const ATTACK_CHOOSE_TYPE   = 'ATTACK_CHOOSE_TYPE';
export const ITEMS                = 'ITEMS';
export const CHOOSE_ITEM          = 'CHOOSE_ITEM';
export const CHOOSE_ITEM_TARGET   = 'PLAYER_STATE_WAITING';
export const DEFEND               = 'DEFEND';
export const CHANGE_ROW           = 'CHANGE_ROW';
export const GAME_OVER            = 'GAME_OVER';

export const CHANGE_PLAYER_STATE = 'CHANGE_PLAYER_STATE';
export const PLAYER_READY = 'PLAYER_READY';

export const changePlayerState = (state, action)=> action.state;

export const playerReady = (state, action)=>
{
    if(state !== WAITING)
    {
        return state;
    }
    return CHOOSE;
};

export const playerState = (state=WAITING, action) =>
{
	switch(action.type)
	{
		case CHANGE_PLAYER_STATE: return changePlayerState(state, action);
        case PLAYER_READY: return playerReady(state, action);
		default: return state;
	}
}