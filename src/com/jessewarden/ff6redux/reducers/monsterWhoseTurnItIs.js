import { MONSTER_TURN, MONSTER_TURN_OVER } from '../core/actions';
import {noMonster} from './startState';
import _ from "lodash";

export default function monsterWhoseTurnItIs(state, action)
{
	switch(action.type)
	{
		case MONSTER_TURN:
			return Object.assign({}, state, action.monster);

		case MONSTER_TURN_OVER:
			return noMonster;

		default:
			if(_.isUndefined(state))
			{
				return noMonster;
			}
			return state;
	}
}