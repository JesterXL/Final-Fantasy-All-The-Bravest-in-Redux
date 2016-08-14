import { ADD_COMPONENT, TICK } from '../core/actions';

function processBattleTimers(state, action)
{
	var battleTimers = _.filter(state, c => c.type === 'BattleTimerComponent');
	return _.map(battleTimers, (btc)=>
	{
		var timerResult = btc.generator.next(action.difference);
		if(timerResult.done)
		{
			return btc;
		}

		if(timerResult.value === undefined)
		{
			timerResult = btc.generator.next(action.difference);
		}
		if(timerResult.value.percentage === 1)
		{
			return Object.assign({}, btc,
			{
				percentage: 1
			});
		}
		return Object.assign({}, btc,
		{
			percentage: timerResult.value.percentage
		});
	});
}

export default function entities(state=[], action)
{
	switch(action.type)
	{
		case ADD_COMPONENT:
			return [...state, action.component];

		case TICK:
			return processBattleTimers(state, action);


		default:
			return state;
	}
}