import { ADD_PLAYER, TICK, PLAYER_HITPOINTS_CHANGED, PLAYER_TURN_OVER } from '../core/actions';
import BattleState from '../enums/BattleState';
import {makeBattleTimer} from '../battle/Character';

function replacePlayer(list, player, updatedPlayer)
{
	var index = _.findIndex(list, p => p.id === player.id);
	return list
		.slice(0, index)
		.concat([updatedPlayer])
		.concat(list.slice(index + 1));
}

export default function players(state=[], action)
{
	switch(action.type)
	{
		case ADD_PLAYER:
			return [...state, action.player];

		case PLAYER_HITPOINTS_CHANGED:
			var updatedPlayer = Object.assign({}, action.player, {
				hitPoints: action.hitPoints
			});
			return replacePlayer(state, action.player, updatedPlayer);
			
		case PLAYER_TURN_OVER:
			var updatedPlayer = Object.assign({}, action.player, {
				battleState: BattleState.WAITING,
				generator: makeBattleTimer(action.player)
			});
			return replacePlayer(state, action.player, updatedPlayer);

		
		case TICK:
			return _.map(state, (player)=>
			{
				if(_.isNil(player.generator))
				{
					console.log("player:", player);
					throw new Error("No gen");
				}
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