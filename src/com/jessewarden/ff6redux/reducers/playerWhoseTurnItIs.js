import { PLAYER_TURN, PLAYER_TURN_OVER } from '../core/actions';
import {noPlayer} from './startState';

import _ from "lodash";

export default function playerWhoseTurnItIs(state, action)
{
	switch(action.type)
	{
		case PLAYER_TURN:
			return action.player;

		case PLAYER_TURN_OVER:
			return noPlayer;

		default:
			if(_.isUndefined(state))
			{
				return noPlayer;
			}
			return state;
	}
}