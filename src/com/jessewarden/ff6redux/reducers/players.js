import { ADD_PLAYER, TICK } from '../core/actions';
import BattleState from '../enums/BattleState';

export default function players(state=[], action)
{
	switch(action.type)
	{
		case ADD_PLAYER:
			return [...state, action.player];
		
		case TICK:
			return _.map(state, (player)=>
			{
				var timerResult = player.generator.next(action.difference);
				if(timerResult.done)
				{
					return player;
				}

				if(timerResult.value === undefined)
				{
					timerResult = player.generator.next(action.difference);
				}
				if(timerResult.value.percentage === 1)
				{
					return Object.assign({}, player,
					{
						percentage: 1,
						battleState: BattleState.NORMAL
					});
				}
				return Object.assign({}, player,
				{
					percentage: timerResult.value.percentage
				});
			});

		default:
			return state;
	}
}