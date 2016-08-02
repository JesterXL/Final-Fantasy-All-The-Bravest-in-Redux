import { MONSTER_TURN } from '../core/actions';
import {noMonster} from './startState';
import _ from "lodash";

export default function monsterWhoseTurnItIs(state, action)
{
	switch(action.type)
	{
		case MONSTER_TURN:
			return Object.assign({}, state, action.monster);

		default:
			if(_.isUndefined(state))
			{
				return noMonster;
			}
			return state;
	}
}