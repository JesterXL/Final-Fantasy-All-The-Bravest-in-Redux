import { PLAYER_TURN } from '../core/actions';
import {noPlayer} from './startState';

import _ from "lodash";

export default function playerWhoseTurnItIs(state, action)
{
	switch(action.type)
	{
		case PLAYER_TURN:
			return Object.assign({}, state, action.player);

		default:
			if(_.isUndefined(state))
			{
				return noPlayer;
			}
			return state;
	}
}