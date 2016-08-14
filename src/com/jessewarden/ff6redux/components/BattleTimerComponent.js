import {battleTimer} from '../battle/BattleTimer';

export function BattleTimerComponent(entity, percentage=0)
{
	return {
		entity: entity,
		percentage,
		generator: battleTimer(),
		type: 'BattleTimerComponent'
	};
}